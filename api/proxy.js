const https = require('https');

const APP_ORIGINS = {
  'reborn-xp': 'https://xp.quenq.com',
  'gta-3': 'https://iii.quenq.com',
  'vice-city': 'https://vc.quenq.com'
};

module.exports = (req, res) => {
  const app = (req.query.app || 'reborn-xp').toLowerCase();
  const originUrl = APP_ORIGINS[app];

  if (!originUrl) {
    res.status(404).send('Unknown app');
    return;
  }

  const clientReq = https.get(originUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  }, (proxyRes) => {
    let data = '';
    proxyRes.setEncoding('utf8');

    proxyRes.on('data', chunk => {
      data += chunk;
    });

    proxyRes.on('end', () => {
      // Inject <base href="..."> right after <head> so all relative assets (js, css, audio, images)
      // load directly from the origin with proper MIME types and CORS
      const baseTag = `<base href="${originUrl}/">`;
      if (data.includes('<head>')) {
        data = data.replace('<head>', `<head>\n  ${baseTag}`);
      } else if (data.includes('<head ')) {
        data = data.replace(/<head[^>]*>/, `$& \n  ${baseTag}`);
      }

      // Neutralize window === window.top redirect check in Reborn XP
      data = data.replace(/window\s*===\s*window\.top/g, 'false');

      // Set headers that permit embedding on onlinegames.stream
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      // Explicitly allow embedding from onlinegames.stream and subdomains
      res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://onlinegames.stream https://*.onlinegames.stream https://*.vercel.app http://localhost:*");
      // Remove X-Frame-Options
      res.removeHeader('X-Frame-Options');

      res.status(200).send(data);
    });
  });

  clientReq.on('error', (err) => {
    res.status(502).send('Error fetching app from origin: ' + err.message);
  });
};
