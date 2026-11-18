import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const id = process.argv[2] || 'bottle';
const root = path.resolve('D:/competition');
const outDir = path.resolve('./videos');
fs.mkdirSync(outDir, { recursive: true });

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.glb': 'model/gltf-binary',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.resolve(path.join(root, urlPath));
  if (!file.startsWith(root)) {
    res.writeHead(403); res.end('forbidden'); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
});
await new Promise(r => server.listen(8123, '127.0.0.1', r));

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: false,
  args: [
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--no-sandbox',
    '--hide-scrollbars',
    '--mute-audio'
  ]
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outDir, size: { width: 1280, height: 720 } }
});

const page = await context.newPage();
page.on('console', m => console.log('[browser]', m.type(), m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));

await page.goto(`http://127.0.0.1:8123/render/ending.html?id=${id}`, { waitUntil: 'load' });
await page.waitForFunction('window.__endingLoaded === true', null, { timeout: 90000 });
await page.waitForTimeout(8300);

const video = page.video();
await page.close();
const videoPath = await video.path();
await context.close();
await browser.close();
server.close();

console.log('VIDEO=' + videoPath);
