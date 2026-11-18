import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('D:/competition/repo');
const mime = { '.html':'text/html; charset=utf-8', '.png':'image/png', '.mp4':'video/mp4', '.js':'text/javascript', '.css':'text/css' };
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
await new Promise(r => server.listen(8129, '127.0.0.1', r));

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});
const page = await browser.newPage();
await page.goto('http://127.0.0.1:8129/report/report.html', { waitUntil: 'networkidle' });
await page.pdf({
  path: 'D:/competition/repo/report/report.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' }
});
await browser.close();
server.close();
console.log('PDF written');
