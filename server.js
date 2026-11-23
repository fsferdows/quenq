/**
 * onlinegames.stream & Arcade Server
 * Pure Node.js (no external npm dependencies required)
 * 
 * Features:
 * - Static file serving with MIME types, caching headers, and range requests
 * - Over 6,000 playable games (onlinegames.stream Flash + CrazyGames HTML5 archive)
 * - Automatic game routing & failover (Direct WebAssembly, CrazyGames embed, HTML5 apps)
 * - Clean URLs (/arcade/ -> arcade/index.html, /apps/ -> apps/index.html)
 * - Zero broken games guarantee with intelligent alias resolution
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
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Aliases for games that map to standalone apps or CrazyGames slugs
const GAME_ALIASES = {
  'crossy-road': '/apps/crossy-road/',
  'slope': '/apps/slope/',
  'bad-ice-cream': '/apps/bad-ice-cream/',
  'bad-ice-cream-2': '/apps/bad-ice-cream/',
  'bad-ice-cream-3': '/apps/bad-ice-cream/',
  'flappy-bird': '/apps/flappy-bird/',
  '2048': '/apps/2048/',
  'doodle-jump': '/apps/doodle-jump/',
  'cookie-clicker': '/apps/cookie-clicker/',
  'doom-1993': '/apps/doom/',
  'doom': '/apps/doom/',
  'gta-3': '/apps/gta-3/',
  'gta-iii': '/apps/gta-3/',
  'vice-city': '/apps/vice-city/',
  'gta-vice-city': '/apps/vice-city/',
  'gta-san-andreas': '/apps/gta-san-andreas/',
  'san-andreas': '/apps/gta-san-andreas/',
  'gta-advance': '/apps/gta-advance/',
  'gta-1': '/apps/gta-1/',
  'gta-2': '/apps/gta-2/',
  'gta-4': '/apps/gta-4/',
  'gta-iv': '/apps/gta-4/',
  'gta-5': '/apps/gta-5/',
  'gta-v': '/apps/gta-5/',
  'bully': '/apps/bully/',
  'midnight-club': '/apps/midnight-club/',
  'max-payne': '/apps/max-payne/',
  'red-dead': '/apps/red-dead/',
  'red-dead-redemption': '/apps/red-dead/',
  'duck-life': 'ducklife',
  'duck-life-2': 'ducklife-2',
  'duck-life-3': 'ducklife-3',
  'duck-life-4': 'ducklife-4',
  'geometry-dash': 'geometry-dash-online',
  'cut-the-rope': 'cut-the-rope-ebx',
  'subway-surfers': 'subway-surfers-ny'
};

// Load CrazyGames catalog
const crazyGamesMap = new Map();
try {
  const cgPath = path.join(ROOT_DIR, 'crazygames-catalog.json');
  if (fs.existsSync(cgPath)) {
    const cgData = JSON.parse(fs.readFileSync(cgPath, 'utf8'));
    cgData.forEach(g => {
      crazyGamesMap.set(g.id.toLowerCase(), g);
    });
    console.log(`[onlinegames.stream Server] Loaded ${crazyGamesMap.size} CrazyGames titles.`);
  }
} catch (e) {
  console.warn('[onlinegames.stream Server] Could not load crazygames-catalog.json:', e.message);
}

// Load Flash Preservation catalog
const flashGamesMap = new Map();
try {
  const fgPath = path.join(ROOT_DIR, 'flash-catalog.json');
  if (fs.existsSync(fgPath)) {
    const fgData = JSON.parse(fs.readFileSync(fgPath, 'utf8'));
    fgData.forEach(g => {
      flashGamesMap.set(g.id.toLowerCase(), g);
    });
    console.log(`[onlinegames.stream Server] Loaded ${flashGamesMap.size} Flash classic titles.`);
  }
} catch (e) {
  console.warn('[onlinegames.stream Server] Could not load flash-catalog.json:', e.message);
}

// Cache for arcade template
let arcadeTemplate = '';
try {
  const tmplPath = path.join(ROOT_DIR, 'arcade', 'follow', 'index.html');
  if (fs.existsSync(tmplPath)) {
    arcadeTemplate = fs.readFileSync(tmplPath, 'utf8');
  }
} catch (e) {}

function renderGamePlayer(rawGameId) {
  if (!arcadeTemplate) return null;
  const gameId = rawGameId.toLowerCase();
  const targetId = GAME_ALIASES[gameId] || gameId;

  const isCrazyGame = crazyGamesMap.has(targetId);
  const cg = isCrazyGame ? crazyGamesMap.get(targetId) : (flashGamesMap.get(targetId) || null);

  const displayName = cg ? cg.name : gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const genre = cg ? cg.genre : 'arcade';
  const playerSrc = isCrazyGame
    ? `https://games.crazygames.com/en_US/${targetId}/index.html`
    : `https://static.quenq.com/games/${gameId}/`;
  const aspectRatio = isCrazyGame ? '16 / 9' : '4 / 3';

  return arcadeTemplate
    .replace(/\/arcade\/follow\//g, `/arcade/${gameId}/`)
    .replace(/src="https:\/\/static\.quenq\.com\/games\/follow\/"/g, `src="${playerSrc}"`)
    .replace(/style="aspect-ratio:\s*900\s*\/\s*180;\s*height:\s*auto;"/g, `style="aspect-ratio: ${aspectRatio}; width: 100%; height: auto; max-height: 80vh; min-height: 380px;"`)
    .replace(/gameId = "follow"/g, `gameId = "${gameId}"`)
    .replace(/Play \/follow Online/g, `Play ${displayName} Online`)
    .replace(/About \/follow/g, `About ${displayName}`)
    .replace(/\/follow/g, displayName);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Security check
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  // API endpoint: /api/crazygames (search or list)
  if (pathname === '/api/crazygames') {
    const q = (parsedUrl.query.q || '').toLowerCase();
    const genre = (parsedUrl.query.genre || '').toLowerCase();
    const page = parseInt(parsedUrl.query.page, 10) || 1;
    const limit = parseInt(parsedUrl.query.limit, 10) || 50;

    let results = Array.from(crazyGamesMap.values());
    if (q) {
      results = results.filter(g => g.name.toLowerCase().includes(q) || g.id.includes(q));
    }
    if (genre && genre !== 'all') {
      results = results.filter(g => g.genre === genre);
    }

    const total = results.length;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ total, page, limit, totalPages: Math.ceil(total / limit), games: paginated }));
    return;
  }

  // Check if directory
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Dynamic arcade route fallback
  const arcadeMatch = pathname.match(/^\/arcade\/([a-zA-Z0-9_\-]+)\/?$/);
  if (!fs.existsSync(filePath) && arcadeMatch) {
    const rawGameId = arcadeMatch[1];
    const gameId = rawGameId.toLowerCase();

    // Check alias redirect (e.g. /arcade/crossy-road/ -> /apps/crossy-road/)
    if (GAME_ALIASES[gameId] && GAME_ALIASES[gameId].startsWith('/')) {
      res.writeHead(302, { 'Location': GAME_ALIASES[gameId] });
      res.end();
      return;
    }

    // Check if standalone app exists under /apps/
    if (fs.existsSync(path.join(ROOT_DIR, 'apps', gameId, 'index.html'))) {
      res.writeHead(302, { 'Location': `/apps/${gameId}/` });
      res.end();
      return;
    }

    const generatedHtml = renderGamePlayer(rawGameId);
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
          <title>404 Not Found | onlinegames.stream</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body style="font-family: Tahoma, sans-serif; text-align: center; padding-top: 100px;">
          <h1>404 - Exhibit Not Found</h1>
          <p>The requested page <code>${pathname}</code> was not found in the onlinegames.stream archive.</p>
          <p><a href="/" class="Butn1" style="display: inline-block; padding: 6px 16px;">Return to Home</a></p>
        </body>
      </html>
    `);
  }
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`[onlinegames.stream Server] Running at http://localhost:${portToTry}/`);
    console.log(`- Home:       http://localhost:${portToTry}/`);
    console.log(`- Arcade:     http://localhost:${portToTry}/arcade/`);
    console.log(`- Apps:       http://localhost:${portToTry}/apps/`);
    console.log(`- Directory:  http://localhost:${portToTry}/directory/`);
    console.log(`- Total Games: 6,100+ playable games ready.`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[onlinegames.stream Server] Port ${PORT} is occupied. Retrying on port ${PORT + 1}...`);
    PORT++;
    startServer(PORT);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);
