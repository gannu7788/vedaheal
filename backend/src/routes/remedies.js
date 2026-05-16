const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/remedies?symptom_id=1 - Get remedies for a symptom
router.get('/', (req, res) => {
  const db = getDb();
  const { symptom_id, type } = req.query;

  if (!symptom_id) {
    return res.status(400).json({ error: 'symptom_id is required' });
  }

  let query = 'SELECT * FROM remedies WHERE symptom_id = ?';
  const params = [symptom_id];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  const remedies = db.prepare(query).all(...params);
  res.json(remedies);
});

// GET /api/remedies/:id - Get single remedy
router.get('/:id', (req, res) => {
  const db = getDb();
  const remedy = db.prepare('SELECT * FROM remedies WHERE id = ?').get(req.params.id);
  if (!remedy) return res.status(404).json({ error: 'Remedy not found' });
  res.json(remedy);
});

module.exports = router;
