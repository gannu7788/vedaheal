const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/herbs - Get all herbs (with optional search/filter)
router.get('/', (req, res) => {
  const db = getDb();
  const { search, category } = req.query;

  let query = 'SELECT * FROM herbs';
  const params = [];

  if (search) {
    query += ' WHERE name LIKE ? OR name_hi LIKE ? OR botanical_name LIKE ? OR main_uses LIKE ? OR sanskrit_name LIKE ?';
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  } else if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY name';

  const herbs = db.prepare(query).all(...params);
  res.json(herbs);
});

// GET /api/herbs/categories - Get all herb categories
router.get('/categories', (req, res) => {
  const db = getDb();
  const categories = db.prepare('SELECT DISTINCT category FROM herbs ORDER BY category').all();
  res.json(categories.map(c => c.category));
});

// GET /api/herbs/:id - Get single herb with full details
router.get('/:id', (req, res) => {
  const db = getDb();
  const herb = db.prepare('SELECT * FROM herbs WHERE id = ?').get(req.params.id);
  if (!herb) return res.status(404).json({ error: 'Herb not found' });

  // Get related symptoms
  const relatedSymptoms = db.prepare(`
    SELECT s.*, hsm.effectiveness, hsm.notes 
    FROM herb_symptom_map hsm 
    JOIN symptoms s ON s.id = hsm.symptom_id 
    WHERE hsm.herb_id = ?
    ORDER BY CASE hsm.effectiveness WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END
  `).all(req.params.id);

  res.json({ ...herb, related_symptoms: relatedSymptoms });
});

// GET /api/herbs/for-symptom/:symptomId - Get herbs effective for a symptom
router.get('/for-symptom/:symptomId', (req, res) => {
  const db = getDb();
  const herbs = db.prepare(`
    SELECT h.*, hsm.effectiveness, hsm.notes 
    FROM herb_symptom_map hsm 
    JOIN herbs h ON h.id = hsm.herb_id 
    WHERE hsm.symptom_id = ?
    ORDER BY CASE hsm.effectiveness WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END
  `).all(req.params.symptomId);

  res.json(herbs);
});

module.exports = router;
