import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC = join(__dirname, 'public');

const MIMES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
};

const server = createServer((req, res) => {
  let path = req.url === '/' ? '/index.html' : req.url;
  path = path.split('?')[0];
  const file = join(PUBLIC, path);

  if (!existsSync(file)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  try {
    const data = readFileSync(file);
    const ext = extname(file);
    const mime = MIMES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('Server error');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`QR Generator running at http://localhost:${PORT}`);
});
