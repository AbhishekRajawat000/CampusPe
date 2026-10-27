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
// Run against `npm run build`; screenshots are saved outside the source tree.
const widths = process.env.TEST_WIDTHS ? process.env.TEST_WIDTHS.split(',').map(Number) : [320,375,390,430,768,1024,1200,1280,1366,1440,1920];
const screenshots = process.env.SCREENSHOT_DIR || '/tmp/campuspe-spacing';
fs.mkdirSync(screenshots, { recursive: true });
try {
 const page = await browser.newPage();
 const check = async (label) => {
  const result = await page.evaluate(() => ({
   viewport: innerWidth, scroll: document.documentElement.scrollWidth,
   masked: ['hidden','clip'].includes(getComputedStyle(document.body).overflowX),
   containers: [...document.querySelectorAll('.container')].map(e => {
    const r=e.getBoundingClientRect(); return {name:e.className,left:r.left,right:innerWidth-r.right,width:r.width};
   })
  }));
  assert.equal(result.masked,false,`${label}: global overflow mask`);
  assert.ok(result.scroll <= result.viewport+1,`${label}: page overflow ${result.scroll}`);
  for(const c of result.containers) {
   assert.ok(Math.abs(c.left-c.right)<1,`${label}: uneven gutters ${c.name}`);
   assert.ok(c.width<=1241,`${label}: container exceeds desktop max width`);
   if(result.viewport===1440 && !c.name.includes('audience-grid')) assert.equal(c.left,100);
  }
 };
 for(const width of widths) {
  await page.setViewportSize({width,height:900});
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForLoadState('networkidle');
  const sections=page.locator('header, main > section, footer');
  for(let i=0;i<await sections.count();i++) {
   const section=sections.nth(i);
   await section.scrollIntoViewIfNeeded();
   await page.waitForTimeout(250);
   await check(`${width} section ${i}`);
   await section.screenshot({path:path.join(screenshots,`${width}-${i}.png`)});
  }
  const footer = await page.locator('footer').boundingBox();
  const bottom = await page.locator('.footer-bottom').boundingBox();
  assert.ok(bottom.y+bottom.height<=footer.y+footer.height+1,`${width}: footer bottom clipped`);
  const menu=page.locator('.menu-toggle');
  if(await menu.isVisible()) {
   await menu.click();await page.waitForTimeout(300);
   assert.equal(await menu.getAttribute('aria-expanded'),'true');
   await check(`${width} menu open`);
   await page.locator('header').screenshot({path:path.join(screenshots,`${width}-menu.png`)});
   await menu.click();
  }
  const dots=page.locator('.carousel-dots button');
  for(let i=0;i<await dots.count();i++) {
   await dots.nth(i).click();
   for(let frame=0;frame<3;frame++){await page.waitForTimeout(300);await check(`${width} phone ${i} frame ${frame}`);}
   assert.equal(await dots.nth(i).getAttribute('aria-pressed'),'true');
   const r=await page.locator('.phone--2').boundingBox();
   assert.ok(r.x>=-1 && r.x+r.width<=width+1,`${width}: selected phone clipped`);
  }
  await page.locator('.app-gallery').screenshot({path:path.join(screenshots,`${width}-gallery.png`)});
  console.log(`PASS ${width}: sections, equal gutters, menu, five phone selections, animation samples`);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await check('reduced motion');
} finally {await browser.close();server.close();}
