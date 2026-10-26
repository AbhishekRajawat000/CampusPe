import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const launch = { headless: true };
if (process.env.CHROMIUM_PATH) {
  launch.executablePath = process.env.CHROMIUM_PATH;
  launch.args = ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];
}
const root = process.cwd();
const output = path.resolve(process.env.AUDIT_OUTPUT || 'audit/latest');
fs.mkdirSync(output, { recursive: true });
const server = http.createServer((req, res) => {
  let file = path.resolve(root, 'out', '.' + decodeURIComponent(req.url.split('?')[0]));
  if (file !== path.resolve(root, 'out') && !file.startsWith(path.resolve(root, 'out') + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  try { res.end(fs.readFileSync(file)); } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const sections = {
  '1-797': '.site-header', '1-865': '.hero', '1-807': '.stats',
  '1-859': '.partners', '1-1113': '.discovery', '1-1312': '.resume-section',
  '1-1439': '#colleges', '1-1547': '#employers', '1-1657': '.app-section',
  '1-1695': '.support-section, .footer'
};
const spec = JSON.parse(fs.readFileSync('tests/figma-text-spec.json', 'utf8'));
const layoutSpec = JSON.parse(fs.readFileSync('tests/figma-layout-spec.json', 'utf8'));
const report = { viewport: 1440, text: [], geometry: [], layout: [], responsive: [], interactions: [], errors };
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  report.text = await page.evaluate(({ spec, sections }) => {
    const norm = value => value.replace(/●/g, '').replace(/[’‘]/g, "'").replace(/[\u200b\u00a0]/g, ' ').replace(/\s+/g, ' ').trim();
    return spec.map(item => {
      const scope = [...document.querySelectorAll(sections[item.section] || 'body')];
      const elements = scope.flatMap(el => [...el.querySelectorAll('*')]);
      const overrides = {'1:802':'.main-nav', '1:1302':'.feed-separator', '1:1279':'.feed-item:nth-child(3) .feed-title .chip', '1:1288':'.feed-item:nth-child(3) .feed-meta > span:nth-child(2)', '1:1751':'.next-actions > :nth-child(1)', '1:1755':'.next-actions > :nth-child(2)', '1:1759':'.next-actions > :nth-child(3)', '1:1763':'.next-actions > :nth-child(4)', '1:1334':'.resume-heading h2', '1:1329':'.resume-heading .eyebrow', '1:1355':'.upload-button', '1:1301':'.feed-curated', '1:1303':'.feed-updated', '1:1310':'.annotation-line:first-child', '1:1311':'.annotation-line:last-child', '1:1687':'.app-heading p', '1:1769':'.footer-brand p', '1:1813':'.footer-column:last-child > button:last-of-type'};
      const matches = elements.filter(el => norm(el.innerText ?? el.textContent) === norm(item.text));
      matches.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length);
      let el = overrides[item.id] ? document.querySelector(overrides[item.id]) : matches[0];
      if (!el) { const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let node; while ((node = walker.nextNode())) { if (norm(node.textContent) === norm(item.text) && scope.some(s => s.contains(node))) { el = node.parentElement; break; } } }
      if (['1:1844','1:1856'].includes(item.id)) return {id:item.id,section:item.section,text:item.text,status:'unpainted-design',note:'Text paint is disabled in Figma; intentionally not rendered.'};
      if (item.id === '1:1215' || item.id === '1:1074') return {id:item.id,section:item.section,text:item.text,status:'asset-text',note:'IIMB text is part of the original SVG logo; CSS text checks do not apply.'};
      if (!el) return { id: item.id, section: item.section, text: item.text, status: 'unmapped' };
      const css = getComputedStyle(el);
      const family = item.font?.split(':')[0].replaceAll('_', ' ');
      const actual = { family: css.fontFamily, size: parseFloat(css.fontSize), weight: Number(css.fontWeight), color: css.color, lineHeight: css.lineHeight };
      const failures = [];
      if (Math.abs(actual.size - item.size) > 0.1) failures.push('font-size');
      if (family && !actual.family.toLowerCase().includes(family.toLowerCase())) failures.push('font-family');
      if (item.weight && actual.weight !== item.weight) failures.push('font-weight');
      if (item.lineHeight && actual.lineHeight !== 'normal' && Math.abs(parseFloat(actual.lineHeight)-item.lineHeight)>0.5) failures.push('line-height');
      if (item.expectedLines) {
        const range=document.createRange();range.selectNodeContents(el);
        const rects=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0);
        const lines=[];for(const rect of rects){const middle=rect.y+rect.height/2;if(!lines.some(y=>Math.abs(y-middle)<3))lines.push(middle);}
        actual.lines=lines.length;
        if(actual.lines!==item.expectedLines)failures.push('line-wrapping');
      }
      if (item.color) {
        const probe = document.createElement('span'); probe.style.color = item.color; document.body.append(probe);
        const expectedColor = getComputedStyle(probe).color; probe.remove();
        if (expectedColor !== actual.color) failures.push('color');
      }
      return { id: item.id, section: item.section, text: item.text, selector: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().replace(/\s+/g, '.') : ''), expected: { family, size: item.size, weight: item.weight, color: item.color, lineHeight:item.lineHeight,lines:item.expectedLines }, actual, failures, status: failures.length ? 'fail' : 'pass' };
    });
  }, { spec, sections });
  report.layout = await page.evaluate(spec => spec.flatMap(check => {
    const elements = [...document.querySelectorAll(check.selector)];
    if (!elements.length) return [{selector:check.selector,source:check.source,status:'missing'}];
    return elements.map((el,index) => {
      const r=el.getBoundingClientRect(), css=getComputedStyle(el), actual={x:r.x,y:r.y+scrollY,width:r.width,height:r.height};
      const failures=[];
      for (const [key,value] of Object.entries(check.rect || {})) if (Math.abs(actual[key]-value)>check.tolerance) failures.push(`${key}: expected ${value}, got ${actual[key]}`);
      for (const [key,value] of Object.entries(check.style || {})) if(css[key]!==value) failures.push(`${key}: expected ${value}, got ${css[key]}`);
      return {selector:check.selector,index,source:check.source,actual,failures,status:failures.length?'fail':'pass'};
    });
  }),layoutSpec);
  for (const [section, selector] of Object.entries(sections)) {
    const locators = page.locator(selector);
    for (let i = 0; i < await locators.count(); i++) {
      const el = locators.nth(i); await el.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.activeElement?.blur());
      await el.screenshot({ path: path.join(output, `${section}-${i}.png`), animations: 'disabled' });
      report.geometry.push({ section, selector, ...(await el.evaluate(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height }; })) });
    }
  }
  report.assets = await page.locator('img').evaluateAll(images => images.map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, alt: img.getAttribute('alt'), width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height })));
  for (const width of [1280, 1024, 768, 600, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    report.responsive.push(await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth, elements: innerWidth === 600 ? [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth+1 && getComputedStyle(el).position !== 'absolute').map(el=>({tag:el.tagName,class:el.className,right:el.getBoundingClientRect().right})).slice(-20) : [], outside: [...document.querySelectorAll('header, main > section, footer')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => el.className) })));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.menu-toggle').click();
  report.interactions.push({ name: 'mobile menu opens', pass: await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'true' });
  await page.locator('.main-nav a').first().click();
  report.interactions.push({ name: 'mobile menu closes on navigation', pass: await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'false' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('.header-actions .signup').click();
  report.interactions.push({ name: 'signup dialog opens', pass: await page.locator('dialog').isVisible() });
  await page.keyboard.press('Escape');
  report.interactions.push({ name: 'dialog closes on Escape', pass: await page.locator('dialog').count() === 0 });
  await page.locator('.feed-filters button').filter({ hasText: /^Internships$/ }).click();
  report.interactions.push({ name: 'internship filter', pass: await page.locator('.feed-item').count() === 1 && await page.locator('.feed-item').innerText().then(t => t.includes('Product Intern')) });
  await page.locator('.carousel-dots button').first().click();
  report.interactions.push({ name: 'app carousel selection', pass: await page.locator('.carousel-dots button').first().getAttribute('aria-pressed') === 'true' });
  for (const [label, count] of [['All',3],['Colleges',1],['Jobs',2],['Internships',1],['Freelance',1],['Part-time',0]]) {
    await page.locator('.feed-filters button').filter({hasText:new RegExp('^'+label+'$')}).click();
    report.interactions.push({name:`opportunity filter: ${label}`,pass:await page.locator('.feed-item').count()===count});
  }
  await page.locator('.feed-filters button').filter({hasText:/^All$/}).click();
  for(let i=0;i<3;i++){
    await page.locator('.discovery-step').nth(i).click();
    report.interactions.push({name:`discovery step ${i+1}`,pass:await page.locator('.discovery-step').nth(i).getAttribute('aria-pressed')==='true'});
  }
  const fileInput=page.locator('#resume-file');
  await fileInput.setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('invalid')});
  report.interactions.push({name:'reject unsupported resume type',pass:(await page.locator('.upload-error').innerText()).includes('PDF, DOC, or DOCX')});
  await fileInput.setInputFiles({name:'too-large.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(10*1024*1024+1)});
  report.interactions.push({name:'reject resume over 10MB',pass:(await page.locator('.upload-error').innerText()).includes('smaller than 10MB')});
  await fileInput.setInputFiles({name:'test-resume.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 test')});
  report.interactions.push({name:'accept supported resume locally',pass:(await page.locator('.drop-zone').innerText()).includes('test-resume.pdf')});
  for(const [selector,title] of [['.role-card--college .role-cta','College waitlist'],['.role-card--employer .role-cta','Employer waitlist'],['#colleges .audience-copy > .button','List Your College'],['#employers .audience-copy > .button','Post a Job'],['.store-links button:first-child','Get the CampusPe app'],['.store-links button:last-child','Get the CampusPe app']]){
    await page.locator(selector).click();
    report.interactions.push({name:`CTA: ${selector}`,pass:await page.locator('#dialog-title').innerText()===title});
    await page.keyboard.press('Escape');
  }
  await page.locator('.header-actions .signup').click();
  await page.locator('dialog input[name="name"]').fill('Test Student');
  await page.locator('dialog input[name="email"]').fill('test@example.com');
  await page.locator('dialog button[type="submit"]').click();
  report.interactions.push({name:'demo form validation and success state',pass:await page.locator('.dialog-success').isVisible()});
  await page.keyboard.press('Escape');
  for(let i=0;i<5;i++){
    await page.locator('.carousel-dots button').nth(i).click();
    report.interactions.push({name:`carousel screen ${i+1}`,pass:await page.locator('.carousel-dots button').nth(i).getAttribute('aria-pressed')==='true'});
  }
  report.interactions.push({name:'support email destination',pass:await page.locator('.support-content a').first().getAttribute('href')==='mailto:contactus@campuspe.com'});
  report.interactions.push({name:'support phone destination',pass:await page.locator('.support-content a').nth(1).getAttribute('href')==='tel:+916362606464'});
  report.fragments=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>({text:a.textContent.trim(),href:a.getAttribute('href'),pass:!!document.getElementById(a.getAttribute('href').slice(1))})));
  for (const label of ['Privacy Policy','Terms & Conditions','Admissions','Post a Job']) {
    await page.locator('.footer-column button').filter({hasText:new RegExp('^'+label+'$')}).first().click();
    report.interactions.push({name:`footer destination: ${label}`,pass:await page.locator('#dialog-title').innerText()===label});
    await page.keyboard.press('Escape');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  report.interactions.push({name:'reduced motion respected',pass:await page.locator('.role-card').first().evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration)<=0.01)});
} catch (error) { report.runnerError = error.stack; }
finally {
  process.exitCode = report.runnerError || report.text.some(x=>x.status==='fail'||x.status==='unmapped') || report.layout.some(x=>x.status!=='pass') || report.assets?.some(x=>!x.loaded) || report.interactions.some(x=>!x.pass) || report.fragments?.some(x=>!x.pass) || report.responsive.some(x=>x.overflow || x.outside.length) || errors.length ? 1 : 0;
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  const counts = Object.fromEntries(['pass', 'fail', 'unmapped'].map(status => [status, report.text.filter(row => row.status === status).length]));
  console.log(JSON.stringify({ ...counts, layout: {pass:report.layout.filter(x=>x.status==='pass').length,fail:report.layout.filter(x=>x.status!=='pass').length}, assetFailures:report.assets?.filter(x=>!x.loaded).length, errors, responsive: report.responsive.map(({elements,...row})=>row), interactions: report.interactions, runnerError: report.runnerError }, null, 2));
  await browser.close(); server.close();
}
