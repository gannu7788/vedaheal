const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/protocol/:symptomId - Get full healing protocol for a symptom
router.get('/:symptomId', (req, res) => {
  const db = getDb();
  const { symptomId } = req.params;

  const symptom = db.prepare('SELECT * FROM symptoms WHERE id = ?').get(symptomId);
  if (!symptom) return res.status(404).json({ error: 'Symptom not found' });

  const remedies = db.prepare('SELECT * FROM remedies WHERE symptom_id = ?').all(symptomId);
  const yogaExercises = db.prepare('SELECT * FROM yoga_exercises WHERE symptom_id = ?').all(symptomId);
  const dailyRoutine = db.prepare('SELECT * FROM daily_routines WHERE symptom_id = ?').all(symptomId);

  // Group remedies by type
  const groupedRemedies = {
    herbs: remedies.filter(r => r.type === 'herb'),
    diet: remedies.filter(r => r.type === 'diet'),
    lifestyle: remedies.filter(r => r.type === 'lifestyle'),
    home_remedies: remedies.filter(r => r.type === 'home_remedy')
  };

  // Group yoga by type
  const groupedYoga = {
    asanas: yogaExercises.filter(y => y.type === 'asana'),
    pranayama: yogaExercises.filter(y => y.type === 'pranayama'),
    mudras: yogaExercises.filter(y => y.type === 'mudra'),
    meditation: yogaExercises.filter(y => y.type === 'meditation')
  };

  res.json({
    symptom,
    remedies: groupedRemedies,
    yoga: groupedYoga,
    daily_routine: dailyRoutine,
    disclaimer: 'This information is for wellness purposes only. Please consult a qualified healthcare practitioner for medical advice.'
  });
});

module.exports = router;
