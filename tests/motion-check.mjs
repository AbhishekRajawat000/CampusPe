import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('out');
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'};
const server = http.createServer((request,response) => {
  const file = path.resolve(root, '.' + decodeURIComponent(request.url.split('?')[0]));
  if (file !== root && !file.startsWith(root + path.sep)) return response.writeHead(403).end();
  const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file,'index.html') : file;
  try { response.setHeader('Content-Type',mime[path.extname(target)] || 'application/octet-stream'); response.end(fs.readFileSync(target)); }
  catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']} : {})});
try {
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForLoadState('networkidle');
  const heroLayers = await page.locator('.hero').evaluate(el => ['::before','::after'].map(pseudo => {
    const style = getComputedStyle(el,pseudo);
    return {width:style.width,height:style.height,left:style.left,top:style.top,background:style.backgroundImage,filter:style.filter};
  }));
  assert.deepEqual(heroLayers.map(layer=>[layer.width,layer.height,layer.left,layer.top]),[
    ['800px','613px','60px','223px'], ['860px','452px','532px','332px']
  ]);
  assert.match(heroLayers[0].background,/165, 243, 252/);
  assert.match(heroLayers[1].background,/196, 181, 253/);
  const overlays = await page.locator('.college-overlays span').evaluateAll(items=>items.map(el=>{
    const style = getComputedStyle(el); return [style.width,style.height,style.backgroundColor,style.filter];
  }));
  assert.deepEqual(overlays,[['384px','384px','rgba(199, 210, 254, 0.14)','blur(32px)'],['696px','512px','rgba(233, 213, 255, 0.2)','blur(32px)'],['412px','313px','rgba(186, 230, 253, 0.2)','blur(32px)']]);
  const college = await page.locator('#colleges .audience-grid').boundingBox();
  assert.equal(college.width,1213); assert.equal(college.height,765);
  await page.locator('.matching-stages').scrollIntoViewIfNeeded();
  await page.locator('.matching-stages.is-running').waitFor();
  const stageMotion=await page.locator('.matching-stage').evaluateAll(cards=>cards.map(el=>({name:getComputedStyle(el).animationName,opacity:getComputedStyle(el).opacity,delay:getComputedStyle(el).animationDelay})));
  assert.ok(stageMotion.every(card=>card.name==='stage-lift' && card.opacity==='1'));
  assert.deepEqual(stageMotion.map(card=>card.delay),['0s','1.1s','2.2s','3.3s']);
  const discovery = page.locator('.discovery-grid');
  await discovery.scrollIntoViewIfNeeded();
  await page.locator('.discovery.has-entered').waitFor();
  assert.equal(await discovery.evaluate(el=>getComputedStyle(el).opacity),'1');
  const stepFrames = await page.locator('.discovery-step').first().evaluate(el=>{
    const animation=el.getAnimations()[0];
    return animation ? animation.effect.getKeyframes().map(frame=>frame.opacity ?? '1') : ['1'];
  });
  assert.ok(stepFrames.every(value=>Number(value)===1), 'Step motion must not hide content');
  await page.waitForTimeout(1100);
  await page.locator('.feed-filters button').filter({hasText:/^Freelance$/}).click();
  assert.equal(await page.locator('.feed-item').count(),1);
  assert.equal(await page.locator('.feed-item').first().evaluate(el=>getComputedStyle(el).opacity),'1');
  await page.locator('.feed-filters button').filter({hasText:/^All$/}).click();
  await page.mouse.move(0, 0);
  const result = page.locator('.feed-item').first();
  await result.scrollIntoViewIfNeeded();
  await page.locator('.discovery.motion-visible').waitFor();
  assert.equal(await result.evaluate(el=>getComputedStyle(el).animationName),'feed-match-lift');
  const transforms = await result.evaluate(async el=>{
    const animation = el.getAnimations()[0];
    animation.pause(); animation.currentTime = 1400;
    await new Promise(requestAnimationFrame);
    return {transform:getComputedStyle(el).transform,opacity:getComputedStyle(el).opacity};
  });
  assert.ok(transforms.transform.includes('-5'), 'Match card should visibly lift');
  assert.equal(transforms.opacity,'1');
  await result.hover();
  assert.equal(await result.evaluate(el=>getComputedStyle(el,'::after').animationPlayState),'paused');
  await page.screenshot({path:'/tmp/campuspe-feed-motion.png'});
  const employerCard = page.locator('.employer-section .process-card').first();
  await employerCard.hover();
  await page.waitForTimeout(400);
  assert.equal(await employerCard.evaluate(el=>getComputedStyle(el).transform),'matrix(1, 0, 0, 1, 0, -5)');
  await page.screenshot({path:'/tmp/campuspe-employer-hover.png'});
  const marquee = page.locator('.partner-marquee');
  const before = await marquee.evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(350);
  const after = await marquee.evaluate(el => getComputedStyle(el).transform);
  assert.ok(Number(after.split(',')[4]) > Number(before.split(',')[4]), 'Partner logos should move continuously to the right');
  assert.equal(await page.locator('.partner-track[aria-hidden="true"]').count(),1);
  assert.equal(await page.locator('.match-tag').evaluate(el=>getComputedStyle(el).animationName),'badge-float');
  assert.equal(await page.locator('.ats-tag').evaluate(el=>getComputedStyle(el).animationName),'badge-float');
  const phone = page.locator('.phone--1');
  const src = await phone.locator('img').getAttribute('src');
  await phone.scrollIntoViewIfNeeded();
  await phone.hover();
  await page.waitForTimeout(800);
  assert.equal(await page.locator('.phone--2 img').getAttribute('src'),src,'Hovered screen should move to the center');
  await page.waitForTimeout(1000);
  assert.equal(await page.locator('.phone--2 img').getAttribute('src'),src,'Centered phone should stay stable after the animation');
  for (const width of [1440,1280,1200,1024,768,390,320]) {
    await page.setViewportSize({width,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false,`Horizontal overflow at ${width}`);
    await page.locator('.carousel-dots button').nth(4).click();
    await page.waitForTimeout(900);
    const centered = await page.locator('.phone--2').boundingBox();
    const stage = await page.locator('.phone-row').boundingBox();
    assert.ok(Math.abs(centered.x + centered.width / 2 - stage.x - stage.width / 2) < 3, `Phone stays centered at ${width}`);
    assert.equal(await page.locator('.phone--2 img').getAttribute('alt'), await page.locator('.carousel-dots button').nth(4).getAttribute('aria-label').then(label=>label.replace('Show ','')));

    if (width>=1200) {
      const banner = await page.locator('.next-banner').boundingBox();
      const title = await page.locator('.next-banner h2').boundingBox();
      const actions = await page.locator('.next-actions').boundingBox();
      assert.ok(title.height<45,`Footer title wraps at ${width}`);
      assert.ok(actions.x + actions.width <= banner.x + banner.width + 1, `Footer actions overflow at ${width}`);
    }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await marquee.evaluate(el => getComputedStyle(el).animationName),'none');
  assert.equal(await page.locator('.match-tag').evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await discovery.evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await page.locator('.matching-stage').first().evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await result.evaluate(el=>getComputedStyle(el).animationName),'none');
  console.log('Passed: screenshot gradient properties, college container, continuous logos, duplicate accessibility, badge animation, phone hover, footer layout, seven widths, and reduced motion.');
} finally { await browser.close(); server.close(); }
