const https = require('https');
const http = require('http');
const { URL } = require('url');

const APP_MAP = {
  'reborn-xp': {
    target: 'https://xp.quenq.com',
    base: 'https://xp.quenq.com/'
  },
  'gta-3': {
    target: 'https://iii.quenq.com',
    base: 'https://iii.quenq.com/'
  },
  'gta-iii': {
    target: 'https://iii.quenq.com',
    base: 'https://iii.quenq.com/'
  },
  'vice-city': {
    target: 'https://vc.quenq.com',
    base: 'https://vc.quenq.com/'
  },
  'gta-vice-city': {
    target: 'https://vc.quenq.com',
    base: 'https://vc.quenq.com/'
  },
  'diamond-rush': {
    target: 'https://static.quenq.com/apps/diamond-rush/app',
    base: 'https://static.quenq.com/apps/diamond-rush/'
  },
  'dr-driving': {
    target: 'https://static.quenq.com/apps/dr-driving/app',
    base: 'https://static.quenq.com/apps/dr-driving/'
  },
  'project-igi': {
    target: 'https://static.quenq.com/apps/project-igi/app',
    base: 'https://static.quenq.com/apps/project-igi/'
  },
  'hill-climb-racing': {
    target: 'https://static.quenq.com/apps/hill-climb-racing/app',
    base: 'https://static.quenq.com/apps/hill-climb-racing/'
  },
  'minecraft': {
    target: 'https://static.quenq.com/apps/minecraft/app.html',
    base: 'https://static.quenq.com/apps/minecraft/'
  },
  'minecraft-js': {
    target: 'https://static.quenq.com/apps/minecraft/app-js.html',
    base: 'https://static.quenq.com/apps/minecraft/'
  },
  '3d-pinball-space-cadet': {
    target: 'https://static.quenq.com/apps/3d-pinball-space-cadet/app.html',
    base: 'https://static.quenq.com/apps/3d-pinball-space-cadet/'
  },
  'pinball': {
    target: 'https://static.quenq.com/apps/3d-pinball-space-cadet/app.html',
    base: 'https://static.quenq.com/apps/3d-pinball-space-cadet/'
  },
  'angry-birds-chrome': {
    target: 'https://static.quenq.com/apps/angry-birds-chrome/app.html',
    base: 'https://static.quenq.com/apps/angry-birds-chrome/'
  },
  'angry-birds': {
    target: 'https://static.quenq.com/apps/angry-birds-chrome/app.html',
    base: 'https://static.quenq.com/apps/angry-birds-chrome/'
  },
  'minivmac': {
    target: 'https://static.quenq.com/apps/minivmac/MinivMac.htm',
    base: 'https://static.quenq.com/apps/minivmac/'
  }
};

function fetchWithRedirect(targetUrl, headers, maxRedirects = 3) {
  return new Promise((resolve, reject) => {
    if (maxRedirects < 0) {
      return reject(new Error('Too many redirects'));
    }

    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(targetUrl, { headers }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        const nextUrl = new URL(res.headers.location, targetUrl).href;
        return resolve(fetchWithRedirect(nextUrl, headers, maxRedirects - 1));
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, data, finalUrl: targetUrl });
      });
    });

    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  const query = req.query || {};
  let targetUrl = '';
  let baseUrl = '';
  let isCrazyGames = false;
  let isRebornXP = false;

  const appKey = (query.app || '').toLowerCase();
  const gameKey = (query.game || query.flash || '').toLowerCase();
  const cgKey = (query.cg || query.crazygames || '').toLowerCase();
  const customUrl = query.url || '';

  if (appKey && APP_MAP[appKey]) {
    targetUrl = APP_MAP[appKey].target;
    baseUrl = APP_MAP[appKey].base;
    if (appKey === 'reborn-xp') isRebornXP = true;
  } else if (gameKey) {
    targetUrl = `https://static.quenq.com/games/${gameKey}/`;
    baseUrl = `https://static.quenq.com/games/${gameKey}/`;
  } else if (cgKey) {
    targetUrl = `https://games.crazygames.com/en_US/${cgKey}/index.html`;
    baseUrl = `https://games.crazygames.com/en_US/${cgKey}/`;
    isCrazyGames = true;
  } else if (customUrl) {
    try {
      const u = new URL(customUrl);
      if (
        u.hostname.endsWith('quenq.com') ||
        u.hostname === 'games.crazygames.com' ||
        u.hostname.endsWith('crazygames.com')
      ) {
        targetUrl = customUrl;
        baseUrl = customUrl.substring(0, customUrl.lastIndexOf('/') + 1);
        if (customUrl.includes('crazygames.com')) isCrazyGames = true;
        if (customUrl.includes('xp.quenq.com')) isRebornXP = true;
      }
    } catch (_) {}
  }

  // Fallback default
  if (!targetUrl) {
    targetUrl = 'https://xp.quenq.com';
    baseUrl = 'https://xp.quenq.com/';
    isRebornXP = true;
  }

  const reqHeaders = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  };

  if (isCrazyGames) {
    reqHeaders['Referer'] = 'https://games.crazygames.com/';
  }

  try {
    const result = await fetchWithRedirect(targetUrl, reqHeaders);
    let html = result.data;

    // Inject base href tag so relative assets resolve properly
    const baseTag = `\n  <base href="${baseUrl}">\n  <meta name="referrer" content="origin">\n`;
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}`);
    } else if (html.includes('<head ')) {
      html = html.replace(/<head[^>]*>/, `$&${baseTag}`);
    }

    // Bypass CrazyGames embedding restrictions
    if (isCrazyGames) {
      html = html.replace(/"disableEmbedding":\s*true/g, '"disableEmbedding":false');
      html = html.replace(/"forceEmbeddedExternally":\s*true/g, '"forceEmbeddedExternally":false');
      html = html.replace(
        'var options = {',
        'var options = {"forceEmbeddedExternally":false,'
      );
      const cgOverride = `
      <script>
        (function() {
          if (window.czyVariables) {
            window.czyVariables.forceEmbeddedExternally = false;
          }
          window.addEventListener('DOMContentLoaded', function() {
            if (window.options) {
              window.options.disableEmbedding = false;
              window.options.forceEmbeddedExternally = false;
            }
          });
        })();
      </script>`;
      html = html.replace('</body>', `${cgOverride}</body>`);
    }

    // Reborn XP window === window.top redirect neutralization
    if (isRebornXP) {
      html = html.replace(/window\s*===\s*window\.top/g, 'false');
    }

    // GTA Vice City & GTA 3 origin checks
    html = html.replace(/window\s*===\s*window\.top/g, 'false');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.setHeader(
      'Content-Security-Policy',
      "frame-ancestors 'self' https://onlinegames.stream https://*.onlinegames.stream https://*.vercel.app http://localhost:*"
    );
    res.removeHeader('X-Frame-Options');

    return res.status(200).send(html);
  } catch (err) {
    return res.status(502).send('Error proxying game: ' + err.message);
  }
};
