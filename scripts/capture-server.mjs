// Local authoring helper only. Never deployed by Astro or GitHub Pages.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const port = 4323,
  origin = `http://127.0.0.1:${port}`,
  root = path.resolve('dist'),
  out = path.resolve('artifacts/captures');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};
fs.mkdirSync(out, { recursive: true });
http
  .createServer((req, res) => {
    if (req.headers.host !== `127.0.0.1:${port}`) {
      res.writeHead(403).end();
      return;
    }
    const url = new URL(req.url, origin);
    if (req.method === 'POST' && url.pathname.startsWith('/__capture/')) {
      const name = url.pathname.slice('/__capture/'.length);
      if (
        req.headers.origin !== origin ||
        req.headers['x-openengineering-capture'] !== 'local' ||
        !/^openengineering-[a-z0-9-]+\.(png|webm|mp4)$/.test(name)
      ) {
        res.writeHead(403).end();
        return;
      }
      let size = 0;
      const chunks = [];
      req.on('data', (chunk) => {
        size += chunk.length;
        if (size > 80 * 1024 * 1024) {
          res.writeHead(413).end();
          req.destroy();
        } else chunks.push(chunk);
      });
      req.on('end', () => {
        fs.writeFileSync(path.join(out, name), Buffer.concat(chunks));
        res
          .writeHead(201, { 'content-type': 'application/json' })
          .end(JSON.stringify({ saved: name }));
      });
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end();
      return;
    }
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, {
      'content-type': types[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(file).pipe(res);
  })
  .listen(port, '127.0.0.1', () =>
    console.log(`Local capture studio: ${origin}/studio/ — files save to ${out}`),
  );
