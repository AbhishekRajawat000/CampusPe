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
const page=await browser.newPage();
for(const width of [320,375,390,430,768,1024,1440]) {
 await page.setViewportSize({width,height:900});await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForLoadState('networkidle');
 if(width<768){
 const copy=await page.locator('.employer-section .process-copy').last().boundingBox(); assert.ok(copy.width>230);
 await page.locator('#employers').screenshot({path:`/tmp/employers-${width}.png`});
 await page.locator('footer').screenshot({path:`/tmp/footer-${width}.png`});
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
}console.log('Card width and overflow checks passed at all seven requested sizes.');
} finally {await browser.close();server.close();}
