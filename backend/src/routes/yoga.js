const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/yoga?symptom_id=1 - Get yoga exercises for a symptom
router.get('/', (req, res) => {
  const db = getDb();
  const { symptom_id, type, difficulty } = req.query;

  if (!symptom_id) {
    return res.status(400).json({ error: 'symptom_id is required' });
  }

  let query = 'SELECT * FROM yoga_exercises WHERE symptom_id = ?';
  const params = [symptom_id];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  const exercises = db.prepare(query).all(...params);
  res.json(exercises);
});

// GET /api/yoga/:id - Get single exercise
router.get('/:id', (req, res) => {
  const db = getDb();
  const exercise = db.prepare('SELECT * FROM yoga_exercises WHERE id = ?').get(req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
  res.json(exercise);
});

module.exports = router;
