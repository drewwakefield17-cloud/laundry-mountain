import {createServer} from 'node:http';
import {createReadStream, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// Loopback-only review server. Explicit files and byte ranges allow video seeking.
const routes = new Map([
  ['/', ['review.html', 'text/html; charset=utf-8']],
  ['/review.html', ['review.html', 'text/html; charset=utf-8']],
  ['/v3/', ['review-v3.html', 'text/html; charset=utf-8']],
  ['/out/laundry-mountain-product-story.mp4', ['out/laundry-mountain-product-story.mp4', 'video/mp4']],
  ['/VOICEOVER-PRODUCT-STORY.md', ['VOICEOVER-PRODUCT-STORY.md', 'text/plain; charset=utf-8']],
  ['/out/laundry-mountain-final-silent.mp4', ['out/laundry-mountain-final-silent.mp4', 'video/mp4']],
  ['/VOICEOVER-ELEVENLABS.txt', ['VOICEOVER-ELEVENLABS.txt', 'text/plain; charset=utf-8']],
  ['/VOICEOVER-43S-CUES.md', ['VOICEOVER-43S-CUES.md', 'text/plain; charset=utf-8']],
  ['/out/laundry-mountain-landscape-review.mp4', ['out/laundry-mountain-landscape-review.mp4', 'video/mp4']],
  ['/out/laundry-mountain-first-cut.mp4', ['out/laundry-mountain-first-cut.mp4', 'video/mp4']],
  ['/out/laundry-mountain-demo-v2.mp4', ['out/laundry-mountain-demo-v2.mp4', 'video/mp4']],
  ['/out/laundry-mountain-demo-v3.mp4', ['out/laundry-mountain-demo-v3.mp4', 'video/mp4']],
  ['/VOICEOVER-V3.md', ['VOICEOVER-V3.md', 'text/plain; charset=utf-8']],
  ['/public/laundry-room-free-attempt.mp4', ['public/laundry-room-free-attempt.mp4', 'video/mp4']],
  ['/VOICEOVER-TIMING.md', ['VOICEOVER-TIMING.md', 'text/plain; charset=utf-8']],
  ['/storyboard/', ['storyboard/index.html', 'text/html; charset=utf-8']],
  ...['home','session','bank','climb','badge','results'].map(name => [`/storyboard/assets/${name}.jpg`, [`storyboard/assets/${name}.jpg`, 'image/jpeg']]),
  ...['laundry-expedition.png','photo-counting-concept.png','reference-session-portrait.webp','coordinated-basket-cheer.webp','reference-logo.webp'].map(name => [`/public/art/${name}`, [`public/art/${name}`, name.endsWith('.png') ? 'image/png' : 'image/webp']]),
  ...['nunito-sans-900.ttf','nunito-sans-800.ttf'].map(name => [`/public/fonts/${name}`, [`public/fonts/${name}`, 'font/ttf']]),
]);
createServer((req, res) => {
  const route = routes.get(new URL(req.url, 'http://localhost').pathname);
  if (!route || !['GET', 'HEAD'].includes(req.method)) {res.writeHead(404).end(); return;}
  const path = fileURLToPath(new URL(route[0], import.meta.url));
  const {size} = statSync(path);
  const headers = {'Content-Type': route[1], 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store'};
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const start = range ? Number(range[1]) : 0;
  const end = range && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
  if (start >= size || start > end) {res.writeHead(416, {'Content-Range': `bytes */${size}`}).end(); return;}
  headers['Content-Length'] = end - start + 1;
  if (range) headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  res.writeHead(range ? 206 : 200, headers);
  if (req.method === 'HEAD') {res.end(); return;}
  createReadStream(path, {start, end}).pipe(res);
}).listen(5192, '127.0.0.1', () => console.log('Trailer review: http://127.0.0.1:5192/'));
