import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('D:/competition');
const outDir = path.resolve('./videos');
fs.mkdirSync(outDir, { recursive: true });
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.glb':'model/gltf-binary', '.mp4':'video/mp4', '.png':'image/png' };
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.resolve(path.join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(8126, '127.0.0.1', r));

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: false,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox', '--hide-scrollbars', '--mute-audio']
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outDir, size: { width: 1280, height: 720 } }
});
const page = await context.newPage();
page.on('pageerror', e => console.log('[pageerror]', e.message));

const sleep = ms => page.waitForTimeout(ms);

async function drag(id) {
  const box = await page.locator('#viewer').boundingBox();
  const cx = box.x + box.width * 0.5;
  const cy = box.y + box.height * 0.5;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 26; i++) {
    await page.mouse.move(cx + i * 3.2, cy + Math.sin(i / 3) * 2);
    await page.waitForTimeout(45);
  }
  await sleep(700);
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(cx + 83 - i * 3.0, cy);
    await page.waitForTimeout(45);
  }
  await page.mouse.up();
  await sleep(900);
}

await page.goto('http://127.0.0.1:8126/dist/index.html', { waitUntil: 'load' });
await sleep(5500);

for (const id of ['moon', 'bottle', 'box']) {
  await page.hover(`.object[data-id="${id}"]`, { force: true }).catch(() => {});
  await sleep(1600);
  await page.click(`.object[data-id="${id}"]`);
  await page.waitForSelector('#modal.open');
  await sleep(2600);
  await drag(id);
  await sleep(1200);
  const choices = await page.$$('.choice');
  await sleep(800);
  await choices[1].click();
  await sleep(2600);
  await sleep(9000); // let the ending video play
  await page.click('#close');
  await sleep(1400);
}

await sleep(4500); // memory map

const video = page.video();
await page.close();
const videoPath = await video.path();
await context.close();
await browser.close();
server.close();
console.log('VIDEO=' + videoPath);
