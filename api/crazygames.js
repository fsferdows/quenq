const fs = require('fs');
const path = require('path');

let catalog = null;

function loadCatalog() {
  if (catalog) return catalog;
  try {
    const filePath = path.join(process.cwd(), 'crazygames-catalog.json');
    if (fs.existsSync(filePath)) {
      catalog = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      catalog = [];
    }
  } catch (err) {
    catalog = [];
  }
  return catalog;
}

module.exports = (req, res) => {
  const games = loadCatalog();
  const q = (req.query.q || '').toLowerCase();
  const genre = (req.query.genre || '').toLowerCase();
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);

  let results = games;
  if (q) {
    results = results.filter(g => (g.name && g.name.toLowerCase().includes(q)) || (g.id && g.id.includes(q)));
  }
  if (genre && genre !== 'all') {
    results = results.filter(g => g.genre && g.genre.includes(genre));
  }

  const total = results.length;
  const startIndex = (page - 1) * limit;
  const paginated = results.slice(startIndex, startIndex + limit);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  
  return res.status(200).json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    games: paginated
  });
};
