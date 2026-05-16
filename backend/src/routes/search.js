const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/search?q=ashwagandha — Search across herbs, symptoms, remedies
router.get('/', (req, res) => {
  const db = getDb();
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ results: [] });

  const term = `%${q.toLowerCase()}%`;

  // Search herbs
  const herbs = db.prepare(`
    SELECT id, name, name_hi, category, description, 'herb' as type
    FROM herbs WHERE name LIKE ? OR name_hi LIKE ? OR description LIKE ? OR botanical_name LIKE ?
    LIMIT 10
  `).all(term, term, term, term);

  // Search symptoms
  const symptoms = db.prepare(`
    SELECT id, name, name_hi, category, description, 'symptom' as type
    FROM symptoms WHERE name LIKE ? OR name_hi LIKE ? OR description LIKE ?
    LIMIT 10
  `).all(term, term, term);

  // Search remedies
  const remedies = db.prepare(`
    SELECT r.id, r.title as name, r.title_hi as name_hi, r.type as category, r.description, 'remedy' as type, s.name as symptom_name
    FROM remedies r JOIN symptoms s ON s.id = r.symptom_id
    WHERE r.title LIKE ? OR r.description LIKE ? OR r.how_to_use LIKE ?
    LIMIT 10
  `).all(term, term, term);

  res.json({
    query: q,
    results: [...symptoms, ...herbs.slice(0, 8), ...remedies.slice(0, 5)],
    counts: { herbs: herbs.length, symptoms: symptoms.length, remedies: remedies.length }
  });
});

module.exports = router;
