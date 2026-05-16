const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/assessment/questions/:symptomId - Get assessment questions for a symptom
router.get('/questions/:symptomId', (req, res) => {
  const db = getDb();
  const questions = db.prepare(
    'SELECT * FROM assessment_questions WHERE symptom_id = ? ORDER BY question_order'
  ).all(req.params.symptomId);

  // Parse options JSON
  const parsed = questions.map(q => ({
    ...q,
    options: JSON.parse(q.options)
  }));

  res.json(parsed);
});

// POST /api/assessment/analyze - Analyze answers and return personalized protocol
router.post('/analyze', (req, res) => {
  const db = getDb();
  const { symptom_id, answers } = req.body;

  if (!symptom_id || !answers) {
    return res.status(400).json({ error: 'symptom_id and answers are required' });
  }

  const symptom = db.prepare('SELECT * FROM symptoms WHERE id = ?').get(symptom_id);
  if (!symptom) return res.status(404).json({ error: 'Symptom not found' });

  // Get all remedies and yoga for this symptom
  const allRemedies = db.prepare('SELECT * FROM remedies WHERE symptom_id = ?').all(symptom_id);
  const allYoga = db.prepare('SELECT * FROM yoga_exercises WHERE symptom_id = ?').all(symptom_id);

  // Personalize based on answers
  const severity = answers.severity || answers.type || 'moderate';
  const duration = answers.duration || 'months';
  const trigger = answers.trigger || answers.cause || '';

  // Build personalized protocol
  const protocol = buildPersonalizedProtocol(allRemedies, allYoga, symptom, answers, severity, duration);

  res.json({
    symptom,
    assessment_summary: buildSummary(answers, symptom),
    personalized_remedies: protocol.remedies,
    personalized_yoga: protocol.yoga,
    daily_schedule: protocol.schedule,
    diet_plan: protocol.diet,
    duration_advice: getDurationAdvice(severity, duration),
    important_notes: protocol.notes,
    disclaimer: 'This is personalized wellness guidance based on Ayurvedic principles. It is NOT a substitute for professional medical advice.'
  });
});

function buildPersonalizedProtocol(remedies, yoga, symptom, answers, severity, duration) {
  const herbs = remedies.filter(r => r.type === 'herb');
  const diet = remedies.filter(r => r.type === 'diet');
  const lifestyle = remedies.filter(r => r.type === 'lifestyle');
  const homeRemedies = remedies.filter(r => r.type === 'home_remedy');

  let selectedRemedies = [];
  let selectedYoga = [];
  let schedule = [];
  let notes = [];

  // Severity-based selection
  if (severity === 'mild' || severity === 'recent' || severity === 'onset') {
    // Mild: home remedies + basic yoga + diet changes
    selectedRemedies = [...homeRemedies.slice(0, 2), ...diet.slice(0, 2), ...herbs.slice(0, 1)];
    selectedYoga = yoga.filter(y => y.difficulty === 'beginner').slice(0, 3);
    notes.push('Your condition is mild. Focus on diet and lifestyle changes first. Herbs are optional.');
    schedule = buildMildSchedule(selectedRemedies, selectedYoga);
  } else if (severity === 'severe' || severity === 'chronic') {
    // Severe: full protocol with multiple herbs + intensive yoga
    selectedRemedies = [...herbs.slice(0, 4), ...diet.slice(0, 2), ...lifestyle.slice(0, 2), ...homeRemedies.slice(0, 2)];
    selectedYoga = yoga.slice(0, 4);
    notes.push('Your condition is chronic/severe. Follow the full protocol consistently for 4-8 weeks.');
    notes.push('Consider consulting an Ayurvedic practitioner for personalized Panchakarma therapy.');
    schedule = buildIntensiveSchedule(selectedRemedies, selectedYoga);
  } else {
    // Moderate: balanced approach
    selectedRemedies = [...herbs.slice(0, 2), ...diet.slice(0, 2), ...lifestyle.slice(0, 1), ...homeRemedies.slice(0, 2)];
    selectedYoga = yoga.filter(y => y.difficulty !== 'advanced').slice(0, 3);
    notes.push('Follow this protocol for 2-4 weeks. If no improvement, consider consulting a practitioner.');
    schedule = buildModerateSchedule(selectedRemedies, selectedYoga);
  }

  // Duration-based notes
  if (duration === 'chronic') {
    notes.push('Since this is a long-standing issue, be patient. Ayurveda works gradually but deeply. Expect 4-8 weeks for noticeable improvement.');
  }

  // Trigger-based additions
  if (answers.trigger === 'stress' || answers.cause === 'stress' || answers.manifestation === 'mental') {
    notes.push('Stress is a major factor. Prioritize pranayama and meditation in your routine.');
  }

  return {
    remedies: selectedRemedies,
    yoga: selectedYoga,
    schedule,
    diet: diet.slice(0, 2),
    notes
  };
}

function buildMildSchedule(remedies, yoga) {
  return [
    { time: '6:30 AM', activity: 'Wake up. Drink 1 glass warm water with lemon.', category: 'morning' },
    { time: '7:00 AM', activity: `Yoga: ${yoga[0]?.name || 'Gentle stretching'} (10 mins)`, category: 'yoga' },
    { time: '7:15 AM', activity: `${remedies.find(r => r.type === 'home_remedy')?.title || 'Home remedy'} as described`, category: 'remedy' },
    { time: '8:00 AM', activity: 'Breakfast — follow diet recommendations', category: 'diet' },
    { time: '1:00 PM', activity: 'Lunch — largest meal. Eat mindfully without screens.', category: 'diet' },
    { time: '7:00 PM', activity: 'Light dinner. Walk 10 mins after.', category: 'diet' },
    { time: '9:30 PM', activity: 'No screens. Relaxation or light reading.', category: 'lifestyle' },
    { time: '10:00 PM', activity: 'Sleep', category: 'lifestyle' }
  ];
}

function buildModerateSchedule(remedies, yoga) {
  const herb = remedies.find(r => r.type === 'herb');
  const homeRemedy = remedies.find(r => r.type === 'home_remedy');
  return [
    { time: '6:00 AM', activity: 'Wake up. Drink warm water. Evacuate bowels.', category: 'morning' },
    { time: '6:30 AM', activity: `Yoga: ${yoga[0]?.name || 'Asanas'} + ${yoga[1]?.name || 'Pranayama'} (20 mins)`, category: 'yoga' },
    { time: '7:00 AM', activity: `Take: ${herb?.title || 'Prescribed herb'} — ${herb?.how_to_use?.substring(0, 60) || 'as directed'}`, category: 'remedy' },
    { time: '7:30 AM', activity: `${homeRemedy?.title || 'Home remedy'} — ${homeRemedy?.how_to_use?.substring(0, 60) || 'as described'}`, category: 'remedy' },
    { time: '8:00 AM', activity: 'Breakfast — warm, fresh, light food', category: 'diet' },
    { time: '12:30 PM', activity: 'Lunch — main meal. Include recommended foods.', category: 'diet' },
    { time: '5:00 PM', activity: 'Light snack if needed. Herbal tea.', category: 'diet' },
    { time: '6:30 PM', activity: 'Evening walk 15-20 mins', category: 'lifestyle' },
    { time: '7:30 PM', activity: 'Light dinner. Avoid heavy/fried food.', category: 'diet' },
    { time: '9:00 PM', activity: `Evening remedy: ${herb?.title || 'As prescribed'} with warm milk`, category: 'remedy' },
    { time: '9:30 PM', activity: 'Wind down. No screens. Oil massage feet.', category: 'lifestyle' },
    { time: '10:00 PM', activity: 'Sleep', category: 'lifestyle' }
  ];
}

function buildIntensiveSchedule(remedies, yoga) {
  const herbs = remedies.filter(r => r.type === 'herb');
  return [
    { time: '5:30 AM', activity: 'Wake up. Oil pulling with sesame oil (5 mins). Warm water.', category: 'morning' },
    { time: '6:00 AM', activity: `Yoga: Full sequence — ${yoga.map(y => y.name).slice(0, 2).join(', ')} (30 mins)`, category: 'yoga' },
    { time: '6:30 AM', activity: `Pranayama: ${yoga.find(y => y.type === 'pranayama')?.name || 'Breathing exercises'} (10 mins)`, category: 'yoga' },
    { time: '7:00 AM', activity: `Morning herbs: ${herbs[0]?.title || 'Herb 1'} — ${herbs[0]?.how_to_use?.substring(0, 50) || 'as directed'}`, category: 'remedy' },
    { time: '7:30 AM', activity: 'Breakfast — warm, nourishing, as per diet plan', category: 'diet' },
    { time: '10:00 AM', activity: `Mid-morning: ${herbs[1]?.title || 'Herb 2'} if prescribed`, category: 'remedy' },
    { time: '12:30 PM', activity: 'Lunch — largest meal. Eat slowly. No water during meal.', category: 'diet' },
    { time: '3:00 PM', activity: 'Herbal tea or warm water with honey', category: 'diet' },
    { time: '5:30 PM', activity: 'Evening yoga or walk (20 mins)', category: 'yoga' },
    { time: '7:00 PM', activity: 'Light dinner — soup, khichdi, or steamed vegetables', category: 'diet' },
    { time: '8:30 PM', activity: `Night herbs: ${herbs[2]?.title || herbs[0]?.title || 'As prescribed'} with warm milk`, category: 'remedy' },
    { time: '9:00 PM', activity: 'Abhyanga (self-massage) or foot massage with warm oil', category: 'lifestyle' },
    { time: '9:30 PM', activity: 'Meditation or Yoga Nidra (10 mins)', category: 'lifestyle' },
    { time: '10:00 PM', activity: 'Sleep (in dark, cool room)', category: 'lifestyle' }
  ];
}

function buildSummary(answers, symptom) {
  const parts = [];
  parts.push(`Problem: ${symptom.name}`);
  if (answers.severity) parts.push(`Severity: ${answers.severity}`);
  if (answers.duration) parts.push(`Duration: ${answers.duration}`);
  if (answers.trigger) parts.push(`Trigger: ${answers.trigger}`);
  if (answers.type) parts.push(`Type: ${answers.type}`);
  if (answers.cause) parts.push(`Likely cause: ${answers.cause}`);
  return parts.join(' • ');
}

function getDurationAdvice(severity, duration) {
  if (severity === 'mild' && duration === 'recent') {
    return { weeks: '1-2 weeks', message: 'Your condition is recent and mild. You should see improvement within 1-2 weeks with consistent practice.' };
  } else if (severity === 'severe' || duration === 'chronic') {
    return { weeks: '6-8 weeks', message: 'This is a chronic condition. Follow the protocol consistently for 6-8 weeks. Improvement will be gradual but lasting.' };
  }
  return { weeks: '2-4 weeks', message: 'Follow this protocol for 2-4 weeks. You should notice improvement within the first 2 weeks.' };
}

module.exports = router;
