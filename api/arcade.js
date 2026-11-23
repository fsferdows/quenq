const fs = require('fs');
const path = require('path');

let arcadeHtml = null;

module.exports = (req, res) => {
  try {
    if (!arcadeHtml) {
      const htmlPath = path.join(process.cwd(), 'arcade', 'index.html');
      if (fs.existsSync(htmlPath)) {
        arcadeHtml = fs.readFileSync(htmlPath, 'utf8');
      } else {
        arcadeHtml = '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/arcade/"></head><body></body></html>';
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return res.status(200).send(arcadeHtml);
  } catch (err) {
    return res.status(500).send('Error loading arcade: ' + err.message);
  }
};
