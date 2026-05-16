const express = require('express');
const router = express.Router();

// 25-question detailed Prakriti assessment
const QUESTIONS = [
  // Physical (1-8)
  { id: 1, category: 'Physical', q: 'Body frame', q_hi: 'शरीर का ढांचा', options: [
    { text: 'Thin, light, tall or short, hard to gain weight', dosha: 'V' },
    { text: 'Medium, athletic, proportionate', dosha: 'P' },
    { text: 'Large, heavy, broad, gains weight easily', dosha: 'K' }
  ]},
  { id: 2, category: 'Physical', q: 'Skin type', q_hi: 'त्वचा का प्रकार', options: [
    { text: 'Dry, rough, thin, cool, dark', dosha: 'V' },
    { text: 'Warm, oily, soft, prone to rashes/acne', dosha: 'P' },
    { text: 'Thick, smooth, cool, pale, oily', dosha: 'K' }
  ]},
  { id: 3, category: 'Physical', q: 'Hair type', q_hi: 'बालों का प्रकार', options: [
    { text: 'Dry, frizzy, thin, dark, breaks easily', dosha: 'V' },
    { text: 'Fine, straight, oily, premature gray/balding', dosha: 'P' },
    { text: 'Thick, wavy, lustrous, oily, dark', dosha: 'K' }
  ]},
  { id: 4, category: 'Physical', q: 'Eyes', q_hi: 'आंखें', options: [
    { text: 'Small, dry, dark, nervous movement', dosha: 'V' },
    { text: 'Medium, sharp, green/gray, sensitive to light', dosha: 'P' },
    { text: 'Large, calm, blue/brown, thick lashes', dosha: 'K' }
  ]},
  { id: 5, category: 'Physical', q: 'Joints', q_hi: 'जोड़', options: [
    { text: 'Prominent, crack often, prone to pain', dosha: 'V' },
    { text: 'Medium, flexible, sometimes inflamed', dosha: 'P' },
    { text: 'Large, well-padded, strong, stable', dosha: 'K' }
  ]},
  { id: 6, category: 'Physical', q: 'Body temperature', q_hi: 'शरीर का तापमान', options: [
    { text: 'Cold hands/feet, prefer warmth', dosha: 'V' },
    { text: 'Warm, sweat easily, dislike heat', dosha: 'P' },
    { text: 'Cool but adaptable, moderate sweating', dosha: 'K' }
  ]},
  { id: 7, category: 'Physical', q: 'Weight pattern', q_hi: 'वजन पैटर्न', options: [
    { text: 'Lose weight easily, hard to gain', dosha: 'V' },
    { text: 'Can gain or lose with effort', dosha: 'P' },
    { text: 'Gain easily, very hard to lose', dosha: 'K' }
  ]},
  { id: 8, category: 'Physical', q: 'Lips', q_hi: 'होंठ', options: [
    { text: 'Thin, dry, crack easily, dark', dosha: 'V' },
    { text: 'Medium, soft, reddish, inflame easily', dosha: 'P' },
    { text: 'Full, smooth, moist, pale pink', dosha: 'K' }
  ]},
  // Digestion (9-13)
  { id: 9, category: 'Digestion', q: 'Appetite', q_hi: 'भूख', options: [
    { text: 'Irregular, sometimes forget to eat', dosha: 'V' },
    { text: 'Strong, get irritable if I miss meals', dosha: 'P' },
    { text: 'Steady, can skip meals without issue', dosha: 'K' }
  ]},
  { id: 10, category: 'Digestion', q: 'Digestion speed', q_hi: 'पाचन गति', options: [
    { text: 'Irregular, bloating, gas common', dosha: 'V' },
    { text: 'Fast, prone to acidity and loose stools', dosha: 'P' },
    { text: 'Slow, feel heavy after meals', dosha: 'K' }
  ]},
  { id: 11, category: 'Digestion', q: 'Bowel habits', q_hi: 'मल त्याग', options: [
    { text: 'Irregular, constipation, hard/dry stools', dosha: 'V' },
    { text: 'Regular, 2+ times/day, sometimes loose', dosha: 'P' },
    { text: 'Regular but slow, heavy, well-formed', dosha: 'K' }
  ]},
  { id: 12, category: 'Digestion', q: 'Thirst', q_hi: 'प्यास', options: [
    { text: 'Variable, sometimes forget to drink', dosha: 'V' },
    { text: 'Excessive, always thirsty', dosha: 'P' },
    { text: 'Low, rarely feel very thirsty', dosha: 'K' }
  ]},
  { id: 13, category: 'Digestion', q: 'Food preferences', q_hi: 'भोजन पसंद', options: [
    { text: 'Crave warm, oily, sweet, salty foods', dosha: 'V' },
    { text: 'Crave cold, sweet, bitter foods', dosha: 'P' },
    { text: 'Crave spicy, light, dry foods (but eat heavy)', dosha: 'K' }
  ]},
  // Mind & Emotions (14-19)
  { id: 14, category: 'Mind', q: 'Mental activity', q_hi: 'मानसिक गतिविधि', options: [
    { text: 'Restless, many thoughts, creative, scattered', dosha: 'V' },
    { text: 'Sharp, focused, analytical, critical', dosha: 'P' },
    { text: 'Calm, steady, slow to process, retentive', dosha: 'K' }
  ]},
  { id: 15, category: 'Mind', q: 'Memory', q_hi: 'याददाश्त', options: [
    { text: 'Quick to learn, quick to forget', dosha: 'V' },
    { text: 'Sharp, clear, good recall', dosha: 'P' },
    { text: 'Slow to learn, never forget once learned', dosha: 'K' }
  ]},
  { id: 16, category: 'Mind', q: 'Under stress I become', q_hi: 'तनाव में मैं', options: [
    { text: 'Anxious, fearful, worried, restless', dosha: 'V' },
    { text: 'Angry, irritable, judgmental, aggressive', dosha: 'P' },
    { text: 'Withdrawn, depressed, clingy, avoidant', dosha: 'K' }
  ]},
  { id: 17, category: 'Mind', q: 'Dreams', q_hi: 'सपने', options: [
    { text: 'Flying, running, fearful, active, many dreams', dosha: 'V' },
    { text: 'Colorful, fiery, violent, adventurous', dosha: 'P' },
    { text: 'Calm, water, romantic, few dreams', dosha: 'K' }
  ]},
  { id: 18, category: 'Mind', q: 'Speech pattern', q_hi: 'बोलने का तरीका', options: [
    { text: 'Fast, talkative, jump topics, rambling', dosha: 'V' },
    { text: 'Clear, precise, sharp, argumentative', dosha: 'P' },
    { text: 'Slow, melodious, thoughtful, few words', dosha: 'K' }
  ]},
  { id: 19, category: 'Mind', q: 'Decision making', q_hi: 'निर्णय लेना', options: [
    { text: 'Indecisive, change mind often', dosha: 'V' },
    { text: 'Quick, decisive, confident', dosha: 'P' },
    { text: 'Slow, deliberate, need time', dosha: 'K' }
  ]},
  // Sleep & Energy (20-22)
  { id: 20, category: 'Sleep', q: 'Sleep pattern', q_hi: 'नींद पैटर्न', options: [
    { text: 'Light, interrupted, 5-6 hours, insomnia tendency', dosha: 'V' },
    { text: 'Moderate, 6-7 hours, wake if disturbed', dosha: 'P' },
    { text: 'Deep, heavy, 8+ hours, hard to wake up', dosha: 'K' }
  ]},
  { id: 21, category: 'Sleep', q: 'Energy pattern', q_hi: 'ऊर्जा पैटर्न', options: [
    { text: 'Bursts of energy, tire quickly, variable', dosha: 'V' },
    { text: 'Moderate, sustained, focused energy', dosha: 'P' },
    { text: 'Steady but slow to start, good endurance', dosha: 'K' }
  ]},
  { id: 22, category: 'Sleep', q: 'Exercise tolerance', q_hi: 'व्यायाम सहनशक्ति', options: [
    { text: 'Low stamina, prefer gentle exercise, tire fast', dosha: 'V' },
    { text: 'Moderate-high, competitive, enjoy challenge', dosha: 'P' },
    { text: 'High endurance but lazy to start, prefer slow', dosha: 'K' }
  ]},
  // Lifestyle (23-25)
  { id: 23, category: 'Lifestyle', q: 'Weather preference', q_hi: 'मौसम पसंद', options: [
    { text: 'Dislike cold and wind, love warmth', dosha: 'V' },
    { text: 'Dislike heat and sun, love cool', dosha: 'P' },
    { text: 'Dislike cold and damp, tolerate most', dosha: 'K' }
  ]},
  { id: 24, category: 'Lifestyle', q: 'Spending habits', q_hi: 'खर्च की आदत', options: [
    { text: 'Spend impulsively, hard to save', dosha: 'V' },
    { text: 'Spend on quality/luxury, moderate saving', dosha: 'P' },
    { text: 'Save well, spend cautiously, accumulate', dosha: 'K' }
  ]},
  { id: 25, category: 'Lifestyle', q: 'Social nature', q_hi: 'सामाजिक स्वभाव', options: [
    { text: 'Make friends easily, many acquaintances, few deep bonds', dosha: 'V' },
    { text: 'Selective, loyal, intense friendships', dosha: 'P' },
    { text: 'Slow to make friends, very loyal, long-lasting bonds', dosha: 'K' }
  ]}
];

// GET /api/prakriti/questions
router.get('/questions', (req, res) => {
  res.json({ questions: QUESTIONS, total: QUESTIONS.length });
});

// POST /api/prakriti/analyze
router.post('/analyze', (req, res) => {
  const { answers } = req.body; // Array of 'V', 'P', 'K'
  if (!answers || answers.length < 20) {
    return res.status(400).json({ error: 'At least 20 answers required' });
  }

  let V = 0, P = 0, K = 0;
  answers.forEach(a => { if (a === 'V') V++; else if (a === 'P') P++; else if (a === 'K') K++; });

  const total = V + P + K;
  const scores = {
    vata: Math.round((V / total) * 100),
    pitta: Math.round((P / total) * 100),
    kapha: Math.round((K / total) * 100)
  };

  // Determine primary and secondary dosha
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];
  const isDual = sorted[0][1] - sorted[1][1] < 15;

  const prakritiType = isDual ? `${capitalize(primary)}-${capitalize(secondary)}` : capitalize(primary);

  const report = generateReport(prakritiType, primary, secondary, scores, isDual);

  res.json({
    prakriti: prakritiType,
    scores,
    primary_dosha: primary,
    secondary_dosha: secondary,
    is_dual_dosha: isDual,
    report
  });
});

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function generateReport(type, primary, secondary, scores, isDual) {
  const doshaInfo = {
    vata: {
      element: 'Air + Space', qualities: 'Light, dry, cold, mobile, subtle, rough',
      strengths: ['Creative and imaginative', 'Quick learner', 'Flexible and adaptable', 'Energetic in bursts', 'Enthusiastic and lively'],
      weaknesses: ['Anxiety and worry', 'Insomnia', 'Dry skin and constipation', 'Joint pain', 'Irregular digestion'],
      diet: { favor: ['Warm, cooked, oily foods', 'Sweet, sour, salty tastes', 'Ghee, sesame oil, warm milk', 'Root vegetables, grains, nuts', 'Warm soups and stews'],
              avoid: ['Cold, raw, dry foods', 'Bitter, astringent, pungent excess', 'Salads, crackers, cold drinks', 'Fasting', 'Irregular meal times'] },
      lifestyle: ['Follow strict daily routine', 'Oil massage (Abhyanga) daily with sesame oil', 'Gentle yoga — no extreme exercise', 'Warm baths', 'Early to bed (by 10 PM)', 'Avoid travel excess', 'Meditation for grounding'],
      herbs: ['Ashwagandha (strength + calm)', 'Brahmi (mind)', 'Dashmool (pain)', 'Bala (nourishment)', 'Triphala (digestion)'],
      yoga: ['Slow, grounding poses', 'Balasana, Virasana, Paschimottanasana', 'Anulom Vilom (calming)', 'Avoid fast/vigorous practice', 'Shavasana (long hold)'],
      season_alert: 'Vata aggravates in autumn/winter and monsoon. Extra care needed in these seasons.'
    },
    pitta: {
      element: 'Fire + Water', qualities: 'Hot, sharp, light, oily, liquid, spreading',
      strengths: ['Sharp intellect', 'Strong digestion', 'Natural leader', 'Courageous', 'Good speaker'],
      weaknesses: ['Anger and irritability', 'Acidity and ulcers', 'Skin rashes and inflammation', 'Premature graying', 'Perfectionism and burnout'],
      diet: { favor: ['Cool, sweet, bitter, astringent foods', 'Coconut, cucumber, mint, coriander', 'Ghee, milk, rice', 'Sweet fruits (grapes, pomegranate, melon)', 'Salads (raw is OK for Pitta)'],
              avoid: ['Spicy, sour, salty, fermented foods', 'Alcohol, coffee, vinegar', 'Tomatoes, citrus excess, chili', 'Fried food, red meat', 'Eating when angry'] },
      lifestyle: ['Avoid excessive heat and sun', 'Moonlight walks', 'Swimming, moderate exercise', 'Cool showers', 'Avoid competition and arguments', 'Creative hobbies', 'Nature time'],
      herbs: ['Shatavari (cooling)', 'Amla (Pitta balance)', 'Brahmi (cool mind)', 'Guduchi (immunity without heat)', 'Neem (blood purifier)'],
      yoga: ['Cooling, non-competitive practice', 'Sheetali/Shitkari pranayama', 'Moon salutation', 'Forward bends', 'Avoid hot yoga, intense practice'],
      season_alert: 'Pitta aggravates in summer and autumn. Avoid sun, spicy food, and anger in these seasons.'
    },
    kapha: {
      element: 'Earth + Water', qualities: 'Heavy, slow, cool, oily, smooth, stable, dense',
      strengths: ['Calm and patient', 'Strong immunity', 'Good stamina', 'Loyal and loving', 'Strong bones and joints'],
      weaknesses: ['Weight gain and obesity', 'Lethargy and oversleeping', 'Congestion and allergies', 'Attachment and possessiveness', 'Slow metabolism'],
      diet: { favor: ['Light, warm, spicy, dry foods', 'Pungent, bitter, astringent tastes', 'Honey (unheated), ginger, pepper', 'Leafy greens, legumes, barley', 'Light meals, skip dinner occasionally'],
              avoid: ['Heavy, oily, sweet, cold foods', 'Dairy, wheat, sugar, fried food', 'Overeating', 'Cold drinks and ice cream', 'Eating when not hungry'] },
      lifestyle: ['Wake before 6 AM (crucial!)', 'Vigorous daily exercise (45+ min)', 'Dry massage (Udvartana)', 'Avoid daytime sleep', 'New activities and challenges', 'Travel and variety', 'Fasting once a week'],
      herbs: ['Trikatu (metabolism)', 'Guggulu (fat burning)', 'Punarnava (water retention)', 'Triphala (detox)', 'Tulsi (immunity + Kapha)'],
      yoga: ['Vigorous, stimulating practice', 'Surya Namaskar (12+ rounds)', 'Kapalabhati, Bhastrika', 'Backbends, inversions', 'Avoid slow/restorative only'],
      season_alert: 'Kapha aggravates in spring and late winter. Exercise more, eat lighter, avoid dairy in these seasons.'
    }
  };

  const info = doshaInfo[primary];
  return {
    type: type,
    element: info.element,
    qualities: info.qualities,
    strengths: info.strengths,
    weaknesses: info.weaknesses,
    diet: info.diet,
    lifestyle: info.lifestyle,
    herbs: info.herbs,
    yoga: info.yoga,
    season_alert: info.season_alert,
    secondary_influence: isDual ? `Your secondary ${capitalize(secondary)} dosha also influences you significantly. Consider ${capitalize(secondary)} recommendations when that dosha feels aggravated.` : null
  };
}

module.exports = router;
