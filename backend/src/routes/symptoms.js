const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/symptoms - Get all symptoms
router.get('/', (req, res) => {
  const db = getDb();
  const { category, search } = req.query;

  let query = 'SELECT * FROM symptoms';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  } else if (search) {
    query += ' WHERE name LIKE ? OR name_hi LIKE ? OR category LIKE ?';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY category, name';

  const symptoms = db.prepare(query).all(...params);
  res.json(symptoms);
});

// GET /api/symptoms/categories - Get all categories
router.get('/categories', (req, res) => {
  const db = getDb();
  const categories = db.prepare('SELECT DISTINCT category FROM symptoms ORDER BY category').all();
  res.json(categories.map(c => c.category));
});

// GET /api/symptoms/:id - Get single symptom
router.get('/:id', (req, res) => {
  const db = getDb();
  const symptom = db.prepare('SELECT * FROM symptoms WHERE id = ?').get(req.params.id);
  if (!symptom) return res.status(404).json({ error: 'Symptom not found' });
  res.json(symptom);
});

module.exports = router;
