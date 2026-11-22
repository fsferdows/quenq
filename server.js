/**
 * Quenq Local Development & Production Server
 * Pure Node.js (no external npm dependencies required)
 * 
 * Features:
 * - Static file serving with MIME types, caching headers, and range requests
 * - Clean URL resolution (/arcade/ -> arcade/index.html, /apps/ -> apps/index.html)
 * - Dynamic arcade game player generation for any of the 1,300+ Flash games
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Cache for arcade template
let arcadeTemplate = '';
try {
  if (fs.existsSync(path.join(ROOT_DIR, 'arcade', 'follow', 'index.html'))) {
    arcadeTemplate = fs.readFileSync(path.join(ROOT_DIR, 'arcade', 'follow', 'index.html'), 'utf8');
  }
} catch (e) {}

function renderGamePlayer(gameId) {
  if (!arcadeTemplate) return null;
  const displayName = gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return arcadeTemplate
    .replace(/\/arcade\/follow\//g, `/arcade/${gameId}/`)
    .replace(/src="https:\/\/static\.quenq\.com\/games\/follow\/"/g, `src="https://static.quenq.com/games/${gameId}/"`)
    .replace(/gameId = "follow"/g, `gameId = "${gameId}"`)
    .replace(/Play \/follow Online/g, `Play ${displayName} Online`)
    .replace(/About \/follow/g, `About ${displayName}`)
    .replace(/\/follow/g, displayName);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Security check
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  // Check if directory
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Dynamic arcade route fallback
  const arcadeMatch = pathname.match(/^\/arcade\/([a-zA-Z0-9_\-]+)\/?$/);
  if (!fs.existsSync(filePath) && arcadeMatch) {
    const gameId = arcadeMatch[1];
    const generatedHtml = renderGamePlayer(gameId);
    if (generatedHtml) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generatedHtml);
      return;
    }
  }

  // Fallback to .html
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>404 Not Found | Quenq</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body style="font-family: Tahoma, sans-serif; text-align: center; padding-top: 100px;">
          <h1>404 - Exhibit Not Found</h1>
          <p>The requested page <code>${pathname}</code> was not found in the Quenq archive.</p>
          <p><a href="/" class="Butn1" style="display: inline-block; padding: 6px 16px;">Return to Home</a></p>
        </body>
      </html>
    `);
  }
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`[Quenq Museum Server] Running at http://localhost:${portToTry}/`);
    console.log(`- Home:      http://localhost:${portToTry}/`);
    console.log(`- Arcade:    http://localhost:${portToTry}/arcade/`);
    console.log(`- Apps:      http://localhost:${portToTry}/apps/`);
    console.log(`- Directory: http://localhost:${portToTry}/directory/`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Quenq Museum Server] Port ${PORT} is occupied. Retrying on port ${PORT + 1}...`);
    PORT++;
    startServer(PORT);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);
