const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/timeline/:symptomId — Healing timeline expectations
router.get('/:symptomId', (req, res) => {
  const db = getDb();
  const { symptomId } = req.params;
  const { severity } = req.query; // mild, moderate, severe

  const symptom = db.prepare('SELECT * FROM symptoms WHERE id = ?').get(parseInt(symptomId));
  if (!symptom) return res.status(404).json({ error: 'Symptom not found' });

  const sev = severity || 'moderate';

  // General healing timelines based on Ayurvedic principles
  const timelines = {
    mild: {
      total_weeks: 2,
      phases: [
        { week: '1', title: 'Adjustment Phase', what_happens: 'Body starts responding to herbs and diet changes. You may feel slight detox symptoms (mild headache, changed bowel habits). This is normal.', expect: 'Slight improvement in symptoms. Energy may fluctuate.', do: 'Follow protocol strictly. Don\'t skip herbs. Maintain routine.', dont: 'Don\'t expect instant results. Don\'t change multiple things at once.' },
        { week: '2', title: 'Improvement Phase', what_happens: 'Symptoms noticeably reduce. Digestion improves. Sleep gets better. Energy stabilizes.', expect: '50-70% improvement in primary symptoms.', do: 'Continue protocol. Start reducing intensity if feeling good.', dont: 'Don\'t stop suddenly. Taper off gradually.' }
      ],
      after: 'Maintain healthy diet and lifestyle. Take herbs seasonally for prevention. Your condition should not return if root cause is addressed.'
    },
    moderate: {
      total_weeks: 4,
      phases: [
        { week: '1', title: 'Detox & Adjustment', what_happens: 'Body begins eliminating toxins (Ama). Digestion resets. You may feel worse before better — this is called "healing crisis" and is temporary.', expect: 'Possible: mild headache, changed stools, fatigue, skin breakouts. These are GOOD signs of detox.', do: 'Drink extra warm water. Rest more. Follow diet strictly. Trust the process.', dont: 'Don\'t panic if symptoms temporarily increase. Don\'t stop protocol.' },
        { week: '2', title: 'Stabilization', what_happens: 'Detox symptoms subside. Agni (digestive fire) strengthens. Primary symptoms start reducing.', expect: '20-30% improvement. Better digestion, sleep, and energy.', do: 'Continue herbs. Add yoga/pranayama if not already. Maintain meal timing.', dont: 'Don\'t reintroduce trigger foods yet. Don\'t skip meals.' },
        { week: '3', title: 'Healing Phase', what_happens: 'Significant improvement. Body is rebuilding and rebalancing. Dosha moving toward equilibrium.', expect: '50-60% improvement. Noticeable difference in daily life.', do: 'Maintain consistency. This is the critical phase — don\'t get complacent.', dont: 'Don\'t celebrate too early by breaking diet. Stay disciplined.' },
        { week: '4', title: 'Consolidation', what_happens: 'Healing solidifies. New habits become natural. Body remembers the balanced state.', expect: '70-80% improvement. May feel "normal" again.', do: 'Start tapering herbs (reduce dose, not stop). Maintain lifestyle changes permanently.', dont: 'Don\'t stop everything at once. Gradual transition to maintenance.' }
      ],
      after: 'Continue maintenance dose of key herbs for 1-2 more months. Seasonal Panchakarma recommended. Follow Ritucharya (seasonal routine) lifelong.'
    },
    severe: {
      total_weeks: 8,
      phases: [
        { week: '1-2', title: 'Deep Detox', what_happens: 'Accumulated toxins (Ama) begin releasing. This is a deep cleanse. Healing crisis is common and expected.', expect: 'Temporary worsening possible. Fatigue, mood swings, changed digestion. This is the body cleaning itself.', do: 'Rest more. Warm water throughout day. Light food (khichdi). Oil massage. Be patient.', dont: 'Don\'t give up. Don\'t add more herbs thinking "it\'s not working." Trust the process.' },
        { week: '3-4', title: 'Rebuilding Agni', what_happens: 'Digestive fire strengthens. Nutrient absorption improves. Energy slowly returns. Symptoms begin reducing.', expect: '20-30% improvement. Better days appearing. Still some bad days — that\'s normal.', do: 'Maintain strict protocol. Add gentle yoga. Eat warm, fresh food only.', dont: 'Don\'t compare daily — compare weekly. Progress is not linear.' },
        { week: '5-6', title: 'Tissue Repair', what_happens: 'Dhatus (body tissues) are being nourished and repaired. Deeper healing happening at cellular level.', expect: '40-60% improvement. Consistent good days. Bad days become rare.', do: 'Add Rasayana herbs (Chyawanprash, Ashwagandha). Increase activity. Nourishing diet.', dont: 'Don\'t rush back to old lifestyle. The body is still healing internally.' },
        { week: '7-8', title: 'Restoration', what_happens: 'Dosha balance restored. Ojas (vital energy) rebuilding. Immunity strengthening. Feeling significantly better.', expect: '70-85% improvement. Near-normal functioning. Confidence in healing.', do: 'Transition to maintenance. Reduce herb doses gradually. Establish permanent healthy habits.', dont: 'Don\'t declare "cured" and abandon everything. Maintenance is lifelong.' }
      ],
      after: 'Consider Panchakarma therapy for complete reset. Continue maintenance herbs for 3-6 months. Follow seasonal routine. Annual detox recommended. Consult Ayurvedic doctor for personalized long-term plan.'
    }
  };

  const timeline = timelines[sev] || timelines.moderate;

  res.json({
    symptom: symptom.name,
    symptom_hi: symptom.name_hi,
    severity: sev,
    dosha: symptom.dosha_association,
    total_weeks: timeline.total_weeks,
    phases: timeline.phases,
    after_healing: timeline.after,
    important_notes: [
      'Healing is NOT linear — expect ups and downs. Weekly trends matter, not daily.',
      'Following protocol 80%+ of the time gives best results.',
      'Ayurveda treats the ROOT CAUSE, not just symptoms. This takes time but is lasting.',
      'If no improvement after 4 weeks, consult an Ayurvedic practitioner for personalized assessment.',
      'Chronic conditions (6+ months old) take proportionally longer to heal.'
    ],
    ayurvedic_principle: 'Charaka says: "A disease that has existed for 1 year needs at least 1 season (3 months) of treatment." Be patient — deep healing takes time but is permanent.'
  });
});

module.exports = router;
