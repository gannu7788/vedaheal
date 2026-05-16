const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/dosha/questions - Get all dosha quiz questions
router.get('/questions', (req, res) => {
  const db = getDb();
  const questions = db.prepare('SELECT * FROM dosha_questions ORDER BY id').all();
  res.json(questions);
});

// POST /api/dosha/analyze - Analyze dosha based on answers
router.post('/analyze', (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers array is required' });
  }

  // Count dosha scores
  let vata = 0, pitta = 0, kapha = 0;

  for (const answer of answers) {
    if (answer === 'vata') vata++;
    else if (answer === 'pitta') pitta++;
    else if (answer === 'kapha') kapha++;
  }

  const total = vata + pitta + kapha;
  const result = {
    scores: {
      vata: Math.round((vata / total) * 100),
      pitta: Math.round((pitta / total) * 100),
      kapha: Math.round((kapha / total) * 100)
    },
    primary_dosha: vata >= pitta && vata >= kapha ? 'Vata' : pitta >= kapha ? 'Pitta' : 'Kapha',
    description: '',
    recommendations: []
  };

  // Add dosha-specific info
  if (result.primary_dosha === 'Vata') {
    result.description = 'Vata types are creative, energetic, and quick-thinking. When imbalanced, they experience anxiety, dry skin, insomnia, and irregular digestion.';
    result.recommendations = [
      'Follow a warm, nourishing diet',
      'Maintain regular daily routine',
      'Practice grounding yoga poses',
      'Oil massage (Abhyanga) with sesame oil',
      'Avoid cold, dry, and raw foods'
    ];
  } else if (result.primary_dosha === 'Pitta') {
    result.description = 'Pitta types are focused, ambitious, and strong-willed. When imbalanced, they experience acidity, skin rashes, anger, and inflammation.';
    result.recommendations = [
      'Favor cooling foods — cucumber, coconut, mint',
      'Avoid spicy, fried, and fermented foods',
      'Practice calming pranayama (Sheetali)',
      'Moonlight walks and nature time',
      'Avoid excessive heat and competition'
    ];
  } else {
    result.description = 'Kapha types are calm, steady, and nurturing. When imbalanced, they experience weight gain, lethargy, congestion, and attachment.';
    result.recommendations = [
      'Favor light, warm, and spicy foods',
      'Exercise vigorously every day',
      'Wake up early (before 6 AM)',
      'Avoid heavy, oily, and sweet foods',
      'Practice energizing yoga and Kapalabhati pranayama'
    ];
  }

  res.json(result);
});

module.exports = router;
