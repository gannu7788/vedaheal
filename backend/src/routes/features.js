const express = require('express');
const router = express.Router();

// ===== #4 SEASONAL RECOMMENDATIONS (RITUCHARYA) =====
router.get('/seasonal', (req, res) => {
  const month = new Date().getMonth(); // 0-11

  // Ayurvedic seasons based on Indian calendar
  let season;
  if (month >= 2 && month <= 3) season = 'vasanta'; // Spring (Mar-Apr)
  else if (month >= 4 && month <= 5) season = 'grishma'; // Summer (May-Jun)
  else if (month >= 6 && month <= 7) season = 'varsha'; // Monsoon (Jul-Aug)
  else if (month >= 8 && month <= 9) season = 'sharad'; // Autumn (Sep-Oct)
  else if (month >= 10 && month <= 11) season = 'hemanta'; // Early Winter (Nov-Dec)
  else season = 'shishira'; // Late Winter (Jan-Feb)

  const seasons = {
    vasanta: {
      name: 'Vasanta Ritu (Spring)',
      name_hi: 'वसंत ऋतु',
      months: 'March - April',
      dosha: 'Kapha accumulates and aggravates',
      description: 'Kapha melts in spring warmth causing allergies, cold, congestion, lethargy. Time to lighten up and detox.',
      diet: {
        favor: ['Barley', 'Honey (old)', 'Ginger tea', 'Light warm foods', 'Bitter vegetables (karela, methi)', 'Mung dal', 'Warm water with honey'],
        avoid: ['Heavy foods', 'Dairy', 'Cold drinks', 'Sweets', 'Fried food', 'Daytime sleep', 'New rice'],
        spices: ['Ginger', 'Black pepper', 'Turmeric', 'Cinnamon', 'Trikatu']
      },
      lifestyle: ['Wake before 6 AM', 'Dry massage (Udvartana) with chickpea flour', 'Vigorous exercise', 'Kapalabhati pranayama', 'Avoid daytime sleep', 'Light dinner'],
      herbs: ['Trikatu', 'Sitopaladi', 'Tulsi', 'Triphala', 'Haridra (Turmeric)'],
      yoga: ['Surya Namaskar (12 rounds)', 'Kapalabhati', 'Bhastrika', 'Twisting poses'],
      warning: 'Spring is the best time for Panchakarma (Vamana — therapeutic vomiting for Kapha).'
    },
    grishma: {
      name: 'Grishma Ritu (Summer)',
      name_hi: 'ग्रीष्म ऋतु',
      months: 'May - June',
      dosha: 'Pitta starts accumulating. Vata may increase due to dryness.',
      description: 'Sun is strongest. Body loses water and energy. Agni (digestive fire) is naturally weak. Eat light, stay cool.',
      diet: {
        favor: ['Sweet, cold, liquid foods', 'Coconut water', 'Buttermilk', 'Watermelon', 'Cucumber', 'Mint', 'Rice', 'Milk', 'Ghee', 'Sattu drink'],
        avoid: ['Spicy food', 'Sour food', 'Salty excess', 'Alcohol', 'Heavy exercise in sun', 'Fasting'],
        spices: ['Fennel', 'Coriander', 'Cardamom', 'Mint', 'Rose']
      },
      lifestyle: ['Stay in cool places', 'Apply sandalwood paste', 'Wear light cotton', 'Moonlight walks', 'Afternoon rest allowed', 'Swimming'],
      herbs: ['Shatavari', 'Amla', 'Sariva', 'Chandana (Sandalwood)', 'Ushira (Vetiver)'],
      yoga: ['Sheetali pranayama', 'Chandrabhedana', 'Gentle yoga only', 'Avoid intense practice in heat'],
      warning: 'Do NOT fast in summer. Agni is weak — eat light but regularly. Stay hydrated.'
    },
    varsha: {
      name: 'Varsha Ritu (Monsoon)',
      name_hi: 'वर्षा ऋतु',
      months: 'July - August',
      dosha: 'Vata aggravates strongly. Agni becomes very weak. Ama (toxins) accumulate.',
      description: 'Humidity weakens digestion. Water-borne diseases increase. Joints ache. Immunity drops. Most important season for Ayurvedic care.',
      diet: {
        favor: ['Warm, light, freshly cooked food', 'Ginger', 'Lemon', 'Honey', 'Old grains (aged rice/wheat)', 'Soups', 'Moong dal khichdi', 'Medicated water (boiled with ginger)'],
        avoid: ['Raw salads', 'Cold food/drinks', 'Leafy greens (contamination)', 'Street food', 'Curd at night', 'Heavy food', 'Excess water'],
        spices: ['Ginger', 'Garlic', 'Hing', 'Ajwain', 'Black pepper', 'Turmeric']
      },
      lifestyle: ['Boil drinking water', 'Avoid getting wet in rain', 'Oil massage (Abhyanga) with sesame oil', 'Fumigate home with neem/guggulu', 'Avoid daytime sleep', 'Keep feet dry'],
      herbs: ['Ashwagandha', 'Guduchi (Giloy)', 'Haritaki', 'Pippali', 'Dashmool'],
      yoga: ['Gentle yoga', 'Pranayama indoors', 'Meditation', 'Avoid strenuous exercise'],
      warning: 'Monsoon is when most people fall sick. Boil all water. Avoid raw food. This is the best season for Basti (medicated enema) Panchakarma.'
    },
    sharad: {
      name: 'Sharad Ritu (Autumn)',
      name_hi: 'शरद ऋतु',
      months: 'September - October',
      dosha: 'Pitta aggravates strongly (accumulated summer heat releases). Called "Pitta Prakopa Kala".',
      description: 'Pitta peaks causing acidity, skin rashes, fever, anger. Sun is still warm but nights cool. Time to pacify Pitta.',
      diet: {
        favor: ['Sweet, bitter, astringent foods', 'Ghee', 'Milk', 'Rice', 'Amla', 'Coconut', 'Grapes', 'Pomegranate', 'Sugar candy (Mishri)'],
        avoid: ['Spicy food', 'Sour food', 'Fermented food', 'Curd', 'Mustard oil', 'Alcohol', 'Direct sun exposure'],
        spices: ['Fennel', 'Coriander', 'Cardamom', 'Saffron', 'Turmeric (moderate)']
      },
      lifestyle: ['Moonlight exposure (believed to be healing)', 'Apply sandalwood/camphor', 'Wear pearls/white clothes', 'Moderate exercise', 'Virechana (purgation) recommended'],
      herbs: ['Amla', 'Shatavari', 'Guduchi', 'Sariva', 'Chandana'],
      yoga: ['Sheetali', 'Shitkari', 'Moon salutation', 'Cooling poses', 'Meditation'],
      warning: 'Autumn is the best time for Virechana (purgation therapy). Pitta-type diseases peak now — take preventive measures.'
    },
    hemanta: {
      name: 'Hemanta Ritu (Early Winter)',
      name_hi: 'हेमंत ऋतु',
      months: 'November - December',
      dosha: 'Agni (digestive fire) is STRONGEST. Body needs heavy nourishment. Best season for Rasayana (rejuvenation).',
      description: 'Cold drives heat inward — digestion is at its peak. Eat heavy, nourishing foods. Best time for strength-building and rejuvenation.',
      diet: {
        favor: ['Heavy, oily, sweet, sour, salty foods', 'Ghee liberally', 'Milk', 'Meat soups (non-veg)', 'Sesame', 'Jaggery', 'New rice', 'Warm foods', 'Nuts', 'Dates'],
        avoid: ['Light/dry food', 'Cold food/drinks', 'Fasting', 'Skipping meals', 'Vata-aggravating foods'],
        spices: ['Ginger', 'Cinnamon', 'Clove', 'Nutmeg', 'Black pepper', 'All warming spices']
      },
      lifestyle: ['Oil massage daily (Abhyanga)', 'Exercise vigorously', 'Warm clothing', 'Sunbathing', 'Sexual activity allowed more', 'Start Rasayana herbs'],
      herbs: ['Ashwagandha', 'Chyawanprash', 'Shilajit', 'Safed Musli', 'Bala', 'Shatavari'],
      yoga: ['Surya Namaskar', 'Vigorous asanas', 'Bhastrika', 'Strength-building poses'],
      warning: 'This is THE best season to start Rasayana (rejuvenation) therapy. Take Chyawanprash daily. Build strength now for the year ahead.'
    },
    shishira: {
      name: 'Shishira Ritu (Late Winter)',
      name_hi: 'शिशिर ऋतु',
      months: 'January - February',
      dosha: 'Similar to Hemanta but drier. Vata may start increasing. Kapha begins accumulating.',
      description: 'Cold and dry. Continue heavy nourishing diet. Agni still strong. Prepare body for upcoming spring.',
      diet: {
        favor: ['Same as Hemanta — heavy, warm, oily', 'Add more sour foods (Amla, lemon)', 'Fermented foods OK', 'Warm soups', 'Til (sesame) ladoo', 'Gur (jaggery)'],
        avoid: ['Cold foods', 'Light/dry foods', 'Excess bitter/astringent', 'Skipping meals'],
        spices: ['Same as Hemanta', 'Add mustard', 'Ajwain', 'Methi']
      },
      lifestyle: ['Continue Abhyanga', 'Sunbathing', 'Warm water bath', 'Exercise', 'Avoid cold wind exposure'],
      herbs: ['Ashwagandha', 'Chyawanprash', 'Trikatu', 'Pippali', 'Guggulu'],
      yoga: ['Vigorous practice', 'Surya Namaskar', 'Kapalabhati', 'Warrior poses'],
      warning: 'Transition to spring is coming. Start reducing heavy foods gradually by end of February. Prepare for spring detox.'
    }
  };

  res.json({
    current_season: seasons[season],
    all_seasons: Object.keys(seasons).map(k => ({ key: k, name: seasons[k].name, months: seasons[k].months }))
  });
});

// ===== #5 FOOD COMPATIBILITY CHECKER (VIRUDDHA AHARA) =====
router.post('/food-compatibility', (req, res) => {
  const { food1, food2 } = req.body;
  if (!food1) return res.status(400).json({ error: 'food1 is required' });

  const f1 = food1.toLowerCase().trim().replace(/s$/, ''); // remove trailing 's' for plurals
  const f2 = (food2 || '').toLowerCase().trim().replace(/s$/, '');

  // Incompatible food combinations from Charaka Samhita
  const incompatible = [
    { foods: ['milk', 'fish'], reason: 'Milk + Fish creates toxins (Ama). Causes skin diseases like vitiligo and psoriasis.', severity: 'high', reference: 'Charaka Samhita Sutrasthana 26' },
    { foods: ['milk', 'banana'], reason: 'Milk + Banana is heavy, creates Ama, causes congestion and cold. Despite being popular, Ayurveda considers this incompatible.', severity: 'medium', reference: 'Ashtanga Hridaya' },
    { foods: ['milk', 'melon'], reason: 'Milk + Melon/Watermelon — milk curdles with melon acid, causes digestive issues.', severity: 'high', reference: 'Charaka Samhita' },
    { foods: ['milk', 'sour', 'lemon', 'orange', 'pineapple', 'citrus'], reason: 'Milk + Any sour fruit (orange, lemon, pineapple) — milk curdles, creates toxins.', severity: 'high', reference: 'Charaka Samhita Sutrasthana 26' },
    { foods: ['milk', 'salt'], reason: 'Milk + Salt is antagonistic. Causes skin diseases.', severity: 'medium', reference: 'Charaka Samhita' },
    { foods: ['milk', 'radish'], reason: 'Milk + Radish (mooli) — incompatible, causes skin problems.', severity: 'medium', reference: 'Ashtanga Hridaya' },
    { foods: ['honey', 'ghee'], reason: 'Honey + Ghee in EQUAL quantities is toxic. Unequal amounts are fine (e.g., 2:1 ratio).', severity: 'high', reference: 'Charaka Samhita Sutrasthana 26' },
    { foods: ['honey', 'hot'], reason: 'Honey + Hot water/cooking — heated honey becomes toxic (produces Ama). NEVER cook honey or add to boiling liquids.', severity: 'high', reference: 'Charaka Samhita, Ashtanga Hridaya' },
    { foods: ['curd', 'night'], reason: 'Curd at night — increases Kapha, causes congestion, sinusitis, and obesity. Eat curd only at lunch.', severity: 'medium', reference: 'Ashtanga Hridaya' },
    { foods: ['curd', 'heat'], reason: 'Heated curd/yogurt — becomes very sour, aggravates Pitta and blood disorders.', severity: 'medium', reference: 'Charaka Samhita' },
    { foods: ['curd', 'milk'], reason: 'Curd + Milk together — channel-blocking (Srotorodha), causes congestion.', severity: 'medium', reference: 'Ashtanga Hridaya' },
    { foods: ['fruit', 'meal'], reason: 'Fruits + Meals together — fruits digest faster, when trapped with heavy food they ferment causing gas and bloating. Eat fruits 30 min before or 2 hrs after meals.', severity: 'medium', reference: 'Ayurvedic principle' },
    { foods: ['cold', 'oil'], reason: 'Cold drinks + Oily food — solidifies fats, slows digestion dramatically.', severity: 'medium', reference: 'Ayurvedic principle' },
    { foods: ['egg', 'milk'], reason: 'Eggs + Milk — both are heavy proteins, overloads digestion.', severity: 'low', reference: 'Ayurvedic dietary principle' },
    { foods: ['tea', 'meal'], reason: 'Tea/Coffee with meals — tannins block iron absorption by 60-70%. Drink 1 hour before or after meals.', severity: 'medium', reference: 'Modern + Ayurvedic' },
    { foods: ['jackfruit', 'milk'], reason: 'Jackfruit + Milk — causes skin diseases according to Ayurveda.', severity: 'medium', reference: 'Bhavaprakash' },
    { foods: ['ghee', 'cold'], reason: 'Ghee + Cold food — ghee solidifies, becomes hard to digest, blocks channels.', severity: 'low', reference: 'Ayurvedic principle' },
    { foods: ['water', 'meal'], reason: 'Excess water during meals — dilutes digestive fire (Agni). Sip warm water only. Drink 30 min before or 1 hr after.', severity: 'low', reference: 'Ashtanga Hridaya' },
    { foods: ['sprouts', 'milk'], reason: 'Sprouts + Milk — incompatible, causes bloating and skin issues.', severity: 'low', reference: 'Ayurvedic dietary principle' },
    { foods: ['lemon', 'citrus', 'milk', 'nimbu'], reason: 'Lemon/Citrus + Milk — curdles milk, creates Ama, causes skin problems.', severity: 'high', reference: 'Charaka Samhita' }
  ];

  // Check if the foods match any incompatible combination
  const results = [];
  for (const combo of incompatible) {
    let matchScore = 0;

    for (const keyword of combo.foods) {
      // Check if either food input contains this keyword OR keyword contains the food input
      if (f1.includes(keyword) || keyword.includes(f1) ||
          (f2 && (f2.includes(keyword) || keyword.includes(f2)))) {
        matchScore++;
      }
    }

    // Need at least 1 match from food1 AND (1 match from food2 OR no food2 given)
    const f1Matches = combo.foods.some(k => f1.includes(k) || k.includes(f1));
    const f2Matches = f2 ? combo.foods.some(k => f2.includes(k) || k.includes(f2)) : false;

    if (f1Matches && (f2Matches || !f2)) {
      results.push(combo);
    } else if (f2 && f2Matches && combo.foods.some(k => f1.includes(k) || k.includes(f1))) {
      results.push(combo);
    }
  }

  if (results.length > 0) {
    res.json({
      compatible: false,
      results: results,
      advice: 'These foods are considered incompatible (Viruddha Ahara) in Ayurveda. Avoid combining them regularly.'
    });
  } else {
    res.json({
      compatible: true,
      results: [],
      advice: f2
        ? `No known incompatibility between "${food1}" and "${food2}" in Ayurvedic texts. Generally safe to combine.`
        : `No specific warnings found for "${food1}". Check with a specific combination (e.g., "milk" + "banana").`
    });
  }
});

// ===== #7 HERB INTERACTION CHECKER =====
router.post('/herb-interaction', (req, res) => {
  const { herbs } = req.body;
  if (!herbs || !Array.isArray(herbs) || herbs.length < 2) {
    return res.status(400).json({ error: 'Provide array of 2+ herb names' });
  }

  // Known interactions and safe combinations
  const interactions = [
    { herbs: ['ashwagandha', 'shatavari'], safe: true, note: 'Excellent combination. Ashwagandha (male tonic) + Shatavari (female tonic) balance each other. Safe for both genders.' },
    { herbs: ['ashwagandha', 'brahmi'], safe: true, note: 'Classic brain + body combination. Brahmi calms while Ashwagandha strengthens. Synergistic.' },
    { herbs: ['ashwagandha', 'shilajit'], safe: true, note: 'Powerful energy combination. Both are Rasayanas. Take together with warm milk.' },
    { herbs: ['triphala', 'guggulu'], safe: true, note: 'Classical combination (Triphala Guggulu). Used for obesity, cholesterol, and joint pain.' },
    { herbs: ['brahmi', 'shankhpushpi'], safe: true, note: 'Best brain tonic combination. Both are Medhya Rasayanas. Safe long-term.' },
    { herbs: ['tulsi', 'giloy'], safe: true, note: 'Immunity powerhouse. Both boost immunity through different mechanisms. Safe together.' },
    { herbs: ['turmeric', 'pepper'], safe: true, note: 'ESSENTIAL combination. Black pepper increases turmeric absorption by 2000%. Always take together.' },
    { herbs: ['ashwagandha', 'thyroid medication'], safe: false, note: '⚠️ CAUTION: Ashwagandha stimulates thyroid. If on thyroid medication, consult doctor — dose may need adjustment.' },
    { herbs: ['guggulu', 'thyroid medication'], safe: false, note: '⚠️ CAUTION: Guggulu affects thyroid function. Inform your doctor if taking thyroid medication.' },
    { herbs: ['sarpagandha', 'bp medication'], safe: false, note: '🚫 AVOID: Both lower BP. Combining can cause dangerous hypotension. Never combine without doctor supervision.' },
    { herbs: ['garlic', 'blood thinner'], safe: false, note: '⚠️ CAUTION: Garlic thins blood. If on Warfarin/Aspirin, excess garlic can increase bleeding risk.' },
    { herbs: ['turmeric', 'blood thinner'], safe: false, note: '⚠️ CAUTION: High-dose curcumin has mild blood-thinning effect. Inform doctor if on anticoagulants.' },
    { herbs: ['ashwagandha', 'sedative'], safe: false, note: '⚠️ CAUTION: Ashwagandha has mild sedative effect. Combining with sleeping pills may cause excessive drowsiness.' },
    { herbs: ['trikatu', 'antacid'], safe: false, note: '⚠️ CONTRADICTORY: Trikatu increases digestive fire (heat). Antacids reduce it. They work against each other.' },
    { herbs: ['neem', 'diabetes medication'], safe: false, note: '⚠️ MONITOR: Neem lowers blood sugar. If on diabetes medication, monitor sugar closely — may need dose adjustment.' },
    { herbs: ['triphala', 'isabgol'], safe: true, note: 'Safe combination for stubborn constipation. Triphala tones colon, Isabgol adds bulk.' },
    { herbs: ['amla', 'iron'], safe: true, note: 'Excellent combination. Vitamin C in Amla dramatically increases iron absorption. Take together.' }
  ];

  const herbsLower = herbs.map(h => h.toLowerCase().trim());
  const foundInteractions = [];

  for (const interaction of interactions) {
    const matchCount = interaction.herbs.filter(ih =>
      herbsLower.some(h => h.includes(ih) || ih.includes(h))
    ).length;

    if (matchCount >= 2) {
      foundInteractions.push(interaction);
    }
  }

  // General safety rules
  const generalRules = [
    'Most Ayurvedic herbs are safe to combine with each other.',
    'Always inform your doctor about Ayurvedic herbs if you take allopathic medication.',
    'Start one herb at a time — add new ones after 1 week to identify any reactions.',
    'Herbs that balance the same dosha generally work well together.',
    'Heating herbs (Ushna Virya) + Cooling herbs (Sheeta Virya) may reduce each other\'s effect.'
  ];

  res.json({
    herbs_checked: herbs,
    interactions: foundInteractions,
    general_rules: generalRules,
    safe: foundInteractions.every(i => i.safe),
    advice: foundInteractions.length === 0
      ? 'No specific interactions found in our database. Generally safe to combine, but start with lower doses when combining multiple herbs.'
      : undefined
  });
});

// ===== #8 AYURVEDIC RECIPES =====
router.get('/recipes', (req, res) => {
  const { category } = req.query;

  const recipes = [
    {
      id: 1, name: 'Golden Milk (Haldi Doodh)', name_hi: 'हल्दी दूध', category: 'immunity',
      time: '5 min', serves: '1 cup',
      benefits: 'Anti-inflammatory, immunity booster, promotes sleep, joint pain relief',
      ingredients: ['1 cup milk', '1 tsp turmeric powder', 'Pinch of black pepper (ESSENTIAL)', 'Pinch of cinnamon', '1/2 tsp ghee', 'Honey to taste (add after cooling below 40°C)'],
      steps: ['Warm milk on low flame', 'Add turmeric, pepper, cinnamon', 'Stir well for 2-3 minutes', 'Add ghee', 'Pour in cup, let cool slightly', 'Add honey (NEVER to hot liquid)'],
      best_time: 'Bedtime', dosha: 'Tridoshic (good for all)', precaution: 'Never boil honey. Add only after milk cools to drinkable temperature.'
    },
    {
      id: 2, name: 'Kadha (Immunity Decoction)', name_hi: 'काढ़ा', category: 'immunity',
      time: '15 min', serves: '2 cups',
      benefits: 'Fights cold, cough, fever. Boosts immunity. Clears congestion.',
      ingredients: ['2 cups water', '1 inch ginger (crushed)', '5-6 tulsi leaves', '4-5 black peppercorns', '2 cloves', '1 small cinnamon stick', '1/2 tsp turmeric', 'Honey/jaggery to taste'],
      steps: ['Boil water with all spices', 'Simmer on low for 10 minutes', 'Reduce to 1 cup', 'Strain', 'Add honey after cooling slightly', 'Drink warm'],
      best_time: 'Morning or when feeling cold/sick', dosha: 'Reduces Kapha and Vata', precaution: 'Avoid in high Pitta/acidity. Reduce spices for children.'
    },
    {
      id: 3, name: 'Khichdi (Healing Porridge)', name_hi: 'खिचड़ी', category: 'digestive',
      time: '30 min', serves: '2-3 servings',
      benefits: 'Easiest to digest. Resets Agni. Used during illness, fasting, and Panchakarma.',
      ingredients: ['1/2 cup rice', '1/4 cup moong dal (split yellow)', '1 tsp ghee', '1/2 tsp turmeric', '1/2 tsp cumin seeds', 'Pinch of hing', 'Salt to taste', '3 cups water', 'Optional: soft vegetables'],
      steps: ['Wash rice and dal together', 'Heat ghee, add cumin and hing', 'Add rice, dal, turmeric, salt', 'Add water, bring to boil', 'Cook on low until soft and porridge-like (20-25 min)', 'Serve with ghee on top'],
      best_time: 'Lunch or dinner (especially when sick)', dosha: 'Tridoshic — balances all doshas', precaution: 'Use only moong dal (lightest). Other dals are heavier.'
    },
    {
      id: 4, name: 'CCF Tea (Cumin-Coriander-Fennel)', name_hi: 'जीरा-धनिया-सौंफ चाय', category: 'digestive',
      time: '10 min', serves: '2 cups',
      benefits: 'Improves digestion, reduces bloating, detoxifies, balances all doshas.',
      ingredients: ['1 tsp cumin seeds', '1 tsp coriander seeds', '1 tsp fennel seeds', '2 cups water'],
      steps: ['Lightly crush seeds (or use whole)', 'Boil water', 'Add seeds, simmer 5 minutes', 'Strain and drink warm', 'Can make large batch and sip throughout day'],
      best_time: 'After meals or throughout the day', dosha: 'Tridoshic — safe for everyone', precaution: 'None. One of the safest Ayurvedic teas.'
    },
    {
      id: 5, name: 'Chyawanprash Milk', name_hi: 'च्यवनप्राश दूध', category: 'rejuvenation',
      time: '3 min', serves: '1 cup',
      benefits: 'Supreme Rasayana. Boosts immunity, energy, brain function, and longevity.',
      ingredients: ['1 cup warm milk', '1-2 tsp Chyawanprash'],
      steps: ['Warm milk (not boiling)', 'Add Chyawanprash', 'Stir well until dissolved', 'Drink warm'],
      best_time: 'Morning empty stomach or bedtime', dosha: 'Tridoshic', precaution: 'Diabetics use sugar-free version. Avoid in diarrhea.'
    },
    {
      id: 6, name: 'Triphala Water', name_hi: 'त्रिफला पानी', category: 'detox',
      time: '8 hours (soak overnight)', serves: '1 glass',
      benefits: 'Gentle detox, improves digestion, clears skin, supports weight loss.',
      ingredients: ['1 tsp Triphala powder', '1 glass warm water'],
      steps: ['Add Triphala to warm water at night', 'Let it soak overnight (8 hours)', 'Strain in morning (or drink with sediment)', 'Drink on empty stomach'],
      best_time: 'Morning empty stomach (soaked overnight) OR bedtime with warm water', dosha: 'Tridoshic', precaution: 'May cause loose stools initially. Reduce dose if so.'
    },
    {
      id: 7, name: 'Ashwagandha Moon Milk', name_hi: 'अश्वगंधा मून मिल्क', category: 'sleep',
      time: '5 min', serves: '1 cup',
      benefits: 'Reduces stress, promotes deep sleep, builds strength, balances hormones.',
      ingredients: ['1 cup milk (or almond milk)', '1/2 tsp Ashwagandha powder', 'Pinch of nutmeg', 'Pinch of cardamom', '1/2 tsp ghee', 'Honey or jaggery to taste'],
      steps: ['Warm milk on low flame', 'Add Ashwagandha, nutmeg, cardamom', 'Stir for 2 minutes', 'Add ghee', 'Cool slightly, add sweetener', 'Drink 30 min before bed'],
      best_time: 'Bedtime', dosha: 'Balances Vata and Kapha', precaution: 'Avoid in hyperthyroidism. Nutmeg: only a tiny pinch (never more than 1/4 tsp).'
    },
    {
      id: 8, name: 'Jeera Water (Cumin Water)', name_hi: 'जीरा पानी', category: 'weight_loss',
      time: '8 hours (soak) or 5 min (boil)', serves: '1 glass',
      benefits: 'Boosts metabolism, aids weight loss, improves digestion, reduces bloating.',
      ingredients: ['1 tsp cumin seeds', '1 glass water'],
      steps: ['Option 1: Soak cumin in water overnight, drink morning', 'Option 2: Boil cumin in water 5 min, strain, drink warm', 'Can add lemon and honey for taste'],
      best_time: 'Morning empty stomach', dosha: 'Tridoshic', precaution: 'Very safe. No known side effects.'
    }
  ];

  const filtered = category ? recipes.filter(r => r.category === category) : recipes;
  const categories = [...new Set(recipes.map(r => r.category))];

  res.json({ recipes: filtered, categories });
});

// ===== #11 TONGUE DIAGNOSIS GUIDE =====
router.get('/tongue-diagnosis', (req, res) => {
  res.json({
    title: 'Jihva Pariksha (Tongue Diagnosis)',
    description: 'In Ayurveda, the tongue is a mirror of your internal health. By observing your tongue daily, you can detect imbalances early.',
    how_to_check: 'Look at your tongue first thing in the morning, before brushing, in natural light.',
    indicators: [
      { area: 'Coating (Ama)', observations: [
        { sign: 'Thick white coating', meaning: 'Kapha imbalance, Ama (toxins) in stomach', action: 'Take Trikatu, eat light, avoid dairy/sweets' },
        { sign: 'Yellow coating', meaning: 'Pitta imbalance, excess heat/acidity in liver/stomach', action: 'Take Triphala, avoid spicy/fried, drink cooling herbs' },
        { sign: 'Brown/dark coating', meaning: 'Vata imbalance, chronic Ama, poor digestion', action: 'Warm foods, Triphala, Ashwagandha, oil massage' },
        { sign: 'No coating (clean pink)', meaning: 'Healthy! Good Agni, no Ama', action: 'Maintain current diet and lifestyle' }
      ]},
      { area: 'Color', observations: [
        { sign: 'Pale tongue', meaning: 'Anemia, low Agni, Kapha excess, malnutrition', action: 'Iron-rich foods, Punarnava Mandur, warming spices' },
        { sign: 'Red tongue', meaning: 'Pitta excess, inflammation, heat in blood', action: 'Cooling foods, Shatavari, Amla, avoid spicy' },
        { sign: 'Bluish/purple tongue', meaning: 'Poor circulation, Vata excess, possible heart issue', action: 'Consult doctor. Arjuna, warm foods, exercise' },
        { sign: 'Healthy pink', meaning: 'Balanced doshas, good circulation', action: 'Maintain balance' }
      ]},
      { area: 'Shape & Texture', observations: [
        { sign: 'Teeth marks on edges', meaning: 'Malabsorption, weak digestion, nutrient deficiency', action: 'Strengthen Agni with ginger, eat warm cooked food' },
        { sign: 'Cracks on surface', meaning: 'Chronic Vata imbalance, dehydration, stress', action: 'Oil massage, ghee internally, hydrate, reduce stress' },
        { sign: 'Swollen/puffy tongue', meaning: 'Kapha excess, water retention, hypothyroid possible', action: 'Reduce salt, exercise, Punarnava, Kanchanar Guggulu' },
        { sign: 'Thin/dry tongue', meaning: 'Vata excess, dehydration, tissue depletion', action: 'Nourishing foods, ghee, Shatavari, oil massage' }
      ]},
      { area: 'Zones (Organ Map)', observations: [
        { sign: 'Tip of tongue — red/sore', meaning: 'Heart/lung heat (Pitta in Prana Vaha Srotas)', action: 'Arjuna, cooling pranayama, reduce stress' },
        { sign: 'Sides of tongue — red/swollen', meaning: 'Liver/gallbladder imbalance', action: 'Kutki, Bhumyamalaki, avoid alcohol/fried food' },
        { sign: 'Center of tongue — coated', meaning: 'Stomach/spleen weakness, poor digestion', action: 'Trikatu, ginger before meals, eat warm' },
        { sign: 'Back of tongue — coated', meaning: 'Colon/kidney toxins, constipation', action: 'Triphala, hydrate, fiber, Punarnava' }
      ]}
    ],
    daily_practice: 'Scrape your tongue every morning with a copper/steel tongue scraper. This removes overnight Ama and stimulates digestion.',
    disclaimer: 'Tongue diagnosis is a supportive tool, not a definitive diagnosis. Consult a practitioner for serious concerns.'
  });
});

// ===== #12 PULSE READING GUIDE (NADI PARIKSHA) =====
router.get('/pulse-guide', (req, res) => {
  res.json({
    title: 'Nadi Pariksha (Pulse Diagnosis) — Self-Assessment Guide',
    description: 'Nadi Pariksha is the most sophisticated diagnostic tool in Ayurveda. While full pulse reading requires years of training, you can learn basic self-assessment.',
    disclaimer: 'This is a simplified self-assessment guide. Professional Nadi Pariksha by a trained Vaidya is far more detailed and accurate.',
    how_to_check: {
      position: 'Use your right hand to check left wrist (women) or left hand for right wrist (men).',
      fingers: 'Place index, middle, and ring fingers on the radial artery (thumb side of wrist).',
      pressure: 'Apply gentle pressure. Each finger reads a different dosha.',
      time: 'Best checked early morning, empty stomach, after toilet, in calm state.',
      finger_map: [
        { finger: 'Index finger (closest to thumb)', dosha: 'Vata', feels_like: 'Snake-like movement — thin, fast, irregular, slithering' },
        { finger: 'Middle finger', dosha: 'Pitta', feels_like: 'Frog-like movement — jumping, strong, regular, bounding' },
        { finger: 'Ring finger', dosha: 'Kapha', feels_like: 'Swan-like movement — slow, steady, broad, gliding' }
      ]
    },
    self_assessment: [
      { pulse_type: 'Fast, thin, irregular (like a snake)', dosha: 'Vata dominant/aggravated', signs: 'Anxiety, insomnia, dry skin, constipation, cold hands', balance: 'Warm foods, oil massage, routine, Ashwagandha' },
      { pulse_type: 'Strong, bounding, regular (like a frog)', dosha: 'Pitta dominant/aggravated', signs: 'Acidity, inflammation, anger, skin rashes, excess heat', balance: 'Cooling foods, Shatavari, Amla, avoid spicy/sun' },
      { pulse_type: 'Slow, steady, broad (like a swan)', dosha: 'Kapha dominant/aggravated', signs: 'Heaviness, congestion, weight gain, lethargy, excess sleep', balance: 'Light food, exercise, Trikatu, wake early, avoid dairy' },
      { pulse_type: 'Moderate, balanced, rhythmic', dosha: 'Balanced (Sama)', signs: 'Good health, energy, clear mind, regular digestion', balance: 'Maintain current lifestyle. Seasonal adjustments only.' }
    ],
    advanced_notes: 'A trained Vaidya can detect pregnancy, specific organ disorders, emotional states, and even past diseases through pulse. This requires 5-10 years of practice.',
    tips: [
      'Check pulse at the same time daily for consistency',
      'Do not check after eating, exercise, or bathing',
      'Emotional state affects pulse — check when calm',
      'Pulse changes with seasons — Vata rises in monsoon/winter, Pitta in summer/autumn, Kapha in spring',
      'Practice daily — you will start noticing patterns over weeks'
    ]
  });
});

// ===== #13 MOON PHASE & DOSHA =====
router.get('/moon-phase', (req, res) => {
  // Calculate approximate moon phase
  const now = new Date();
  const lunarCycle = 29.53; // days
  const knownNewMoon = new Date('2024-01-11'); // known new moon date
  const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const moonAge = daysSince % lunarCycle;

  let phase, phaseHindi, doshaEffect, recommendations;

  if (moonAge < 1.85) {
    phase = 'New Moon (Amavasya)';
    phaseHindi = 'अमावस्या';
    doshaEffect = 'Vata increases. Mind is restless. Energy is lowest.';
    recommendations = {
      do: ['Light fasting or eat light', 'Meditation and introspection', 'Oil massage (Abhyanga)', 'Rest more', 'Chant/pray'],
      avoid: ['Heavy food', 'Starting new projects', 'Strenuous exercise', 'Travel if possible'],
      herbs: ['Ashwagandha (calming)', 'Brahmi (mind)', 'Jatamansi (grounding)'],
      food: 'Light, warm, easily digestible. Khichdi, soups, warm milk.'
    };
  } else if (moonAge < 7.38) {
    phase = 'Waxing Crescent (Shukla Pratipada to Panchami)';
    phaseHindi = 'शुक्ल पक्ष (बढ़ता चंद्रमा)';
    doshaEffect = 'Energy building. Kapha increases slightly. Good time to nourish.';
    recommendations = {
      do: ['Start new health routines', 'Take Rasayana herbs', 'Build strength', 'Eat nourishing foods', 'Start new projects'],
      avoid: ['Fasting', 'Depleting activities', 'Skipping meals'],
      herbs: ['Chyawanprash', 'Shatavari', 'Ashwagandha', 'Amla'],
      food: 'Nourishing, building foods. Milk, ghee, almonds, dates.'
    };
  } else if (moonAge < 14.76) {
    phase = 'Waxing (Shukla Ashtami to Chaturdashi)';
    phaseHindi = 'शुक्ल पक्ष (पूर्णिमा की ओर)';
    doshaEffect = 'Pitta and Kapha increase. Body fluids increase. Emotions intensify.';
    recommendations = {
      do: ['Moderate exercise', 'Creative activities', 'Social connections', 'Balanced diet'],
      avoid: ['Excess spicy food', 'Overexertion', 'Emotional conflicts'],
      herbs: ['Brahmi (emotional balance)', 'Shatavari (cooling)', 'Triphala (balance)'],
      food: 'Balanced Sattvic diet. Fresh fruits, vegetables, whole grains.'
    };
  } else if (moonAge < 16.61) {
    phase = 'Full Moon (Purnima)';
    phaseHindi = 'पूर्णिमा';
    doshaEffect = 'Kapha and Pitta peak. Emotions strongest. Body fluids highest. Mind most active.';
    recommendations = {
      do: ['Fasting (Ekadashi/Purnima fast)', 'Meditation (most powerful on full moon)', 'Moonlight exposure', 'Gratitude practice', 'Charity'],
      avoid: ['Heavy food', 'Alcohol', 'Arguments', 'Surgery if possible', 'Emotional decisions'],
      herbs: ['Brahmi (mind clarity)', 'Shankhpushpi (emotional calm)', 'Chandana (cooling)'],
      food: 'Light fasting or fruits only. If eating, keep it Sattvic and light.'
    };
  } else if (moonAge < 22.14) {
    phase = 'Waning (Krishna Paksha)';
    phaseHindi = 'कृष्ण पक्ष (घटता चंद्रमा)';
    doshaEffect = 'Vata starts increasing. Good time for detox and letting go.';
    recommendations = {
      do: ['Detox practices', 'Triphala/cleansing herbs', 'Release old habits', 'Declutter', 'Lighter eating'],
      avoid: ['Starting new things', 'Heavy nourishing foods', 'Overcommitting'],
      herbs: ['Triphala (detox)', 'Guduchi (cleansing)', 'Kutki (liver cleanse)'],
      food: 'Lighter meals. Soups, steamed vegetables, mung dal. Reduce portions.'
    };
  } else {
    phase = 'Waning Crescent (approaching Amavasya)';
    phaseHindi = 'कृष्ण पक्ष (अमावस्या की ओर)';
    doshaEffect = 'Vata highest. Energy depleting. Time for rest and reflection.';
    recommendations = {
      do: ['Rest', 'Gentle yoga only', 'Oil massage', 'Early sleep', 'Reflection/journaling', 'Prepare for new cycle'],
      avoid: ['Strenuous activity', 'Late nights', 'Cold/dry foods', 'Major decisions'],
      herbs: ['Ashwagandha (grounding)', 'Bala (strengthening)', 'Sesame oil massage'],
      food: 'Warm, oily, grounding. Ghee, soups, root vegetables, warm milk.'
    };
  }

  res.json({
    current_phase: phase,
    phase_hi: phaseHindi,
    moon_age_days: Math.round(moonAge * 10) / 10,
    dosha_effect: doshaEffect,
    recommendations,
    ayurvedic_principle: 'Ayurveda recognizes that the moon affects body fluids (Kapha), emotions (Manas), and energy cycles. Aligning activities with lunar phases optimizes health.',
    fasting_days: 'Ekadashi (11th day of each lunar fortnight) and Purnima/Amavasya are traditional fasting days in Ayurveda.'
  });
});

// ===== #14 KITCHEN PHARMACY =====
router.get('/kitchen-pharmacy', (req, res) => {
  res.json({
    title: 'Kitchen Pharmacy (Grihini Vaidya)',
    description: 'Your kitchen already has powerful medicines. Here are common kitchen items and their healing uses.',
    items: [
      { name: 'Ginger (Adrak)', icon: '🫚', uses: ['Nausea: chew raw slice', 'Cold: ginger tea with honey', 'Digestion: slice before meals with salt+lemon', 'Joint pain: ginger paste poultice', 'Headache: ginger paste on forehead'] },
      { name: 'Turmeric (Haldi)', icon: '✨', uses: ['Wound: paste on cuts (antiseptic)', 'Cold: turmeric milk at night', 'Skin glow: turmeric+gram flour face pack', 'Joint pain: golden milk daily', 'Sore throat: gargle with turmeric water'] },
      { name: 'Honey (Shahad)', icon: '🍯', uses: ['Cough: 1 tsp raw honey (never heated)', 'Weight loss: warm water + honey + lemon morning', 'Wound healing: apply directly on burns/cuts', 'Sore throat: honey + ginger juice', 'Energy: honey + warm water'] },
      { name: 'Cumin (Jeera)', icon: '🫘', uses: ['Bloating: roasted cumin + buttermilk', 'Acidity: jeera water morning', 'Diarrhea: roasted cumin powder + curd', 'Lactation: jeera water boosts milk', 'Anemia: soaked jeera water (iron-rich)'] },
      { name: 'Fennel (Saunf)', icon: '🌱', uses: ['Acidity: chew after meals', 'Baby colic: fennel water', 'Bad breath: chew seeds', 'Eye cooling: fennel water eye wash', 'Menstrual cramps: fennel tea'] },
      { name: 'Ajwain (Carom)', icon: '🫘', uses: ['Gas/bloating: chew with salt', 'Cold in babies: potli (cloth bag) on chest', 'Stomach ache: ajwain + black salt + warm water', 'Ear pain: ajwain oil drops', 'Tooth pain: clove + ajwain paste'] },
      { name: 'Clove (Laung)', icon: '🌺', uses: ['Toothache: bite on clove near pain', 'Nausea: chew 1 clove', 'Cough: clove + honey', 'Bad breath: chew after meals', 'Headache: clove paste on temples'] },
      { name: 'Cinnamon (Dalchini)', icon: '🪵', uses: ['Diabetes: cinnamon water morning', 'Period pain: cinnamon tea', 'Cold: cinnamon + honey', 'Weight loss: cinnamon water before meals', 'Bad breath: chew small piece'] },
      { name: 'Black Pepper (Kali Mirch)', icon: '⚫', uses: ['Cold/cough: pepper + honey', 'Turmeric booster: always add to haldi', 'Sinusitis: pepper steam inhalation', 'Weight loss: pepper + lemon water', 'Toothache: pepper + salt paste'] },
      { name: 'Ghee', icon: '🧈', uses: ['Constipation: 1 tsp in warm milk at night', 'Dry skin: apply on lips/skin', 'Burns: apply cool ghee on minor burns', 'Brain food: 1 tsp daily with meals', 'Nose dryness: 2 drops in each nostril (Nasya)'] },
      { name: 'Lemon (Nimbu)', icon: '🍋', uses: ['Morning detox: warm lemon water', 'Nausea: lemon + salt + sugar (ORS)', 'Dandruff: lemon juice on scalp', 'Kidney stones: daily lemon water (citrate)', 'Skin lightening: lemon + honey mask'] },
      { name: 'Rock Salt (Sendha Namak)', icon: '🧂', uses: ['Gargle: salt water for sore throat', 'Digestion: pinch with meals', 'Muscle cramps: salt water soak', 'Nasal wash: salt water neti', 'Tooth pain: salt water rinse'] },
      { name: 'Coconut Oil (Nariyal Tel)', icon: '🥥', uses: ['Hair: warm oil massage weekly', 'Oil pulling: 1 tbsp swish 10 min morning', 'Skin: natural moisturizer', 'Cooking: best oil for Pitta types', 'Diaper rash: apply on baby skin'] },
      { name: 'Jaggery (Gur)', icon: '🟤', uses: ['Anemia: daily with sesame seeds', 'Constipation: warm water + gur after meals', 'Cold: gur + ginger + pepper', 'Detox: cleanses liver and blood', 'Energy: natural energy booster (replace sugar)'] },
      { name: 'Curd/Yogurt (Dahi)', icon: '🥛', uses: ['Diarrhea: plain curd + rice', 'Sunburn: apply on skin', 'Hair mask: curd + lemon for dandruff', 'Digestion: buttermilk (chaas) with lunch', 'Immunity: daily probiotic'] }
    ],
    golden_rules: [
      'Never heat honey above 40°C — it becomes toxic',
      'Always add black pepper with turmeric — increases absorption 2000%',
      'Ghee + honey in equal quantities is poison (unequal is fine)',
      'Curd should not be eaten at night',
      'Warm water is medicine, cold water is poison (for digestion)',
      'Eat fruits alone, not with meals (they ferment)'
    ]
  });
});

module.exports = router;

// ===== #9 PANCHAKARMA GUIDE =====
router.get('/panchakarma', (req, res) => {
  res.json({
    title: 'Panchakarma — The Ultimate Ayurvedic Detox',
    title_hi: 'पंचकर्म — आयुर्वेदिक शुद्धिकरण',
    description: 'Panchakarma means "five actions" — a systematic detoxification and rejuvenation therapy described in Charaka Samhita. It removes deep-rooted toxins (Ama) that diet and lifestyle alone cannot eliminate.',
    warning: 'Panchakarma MUST be done under qualified Ayurvedic practitioner supervision. It is NOT a home remedy. Improper Panchakarma can be harmful.',
    phases: [
      {
        name: 'Purva Karma (Preparation)',
        name_hi: 'पूर्व कर्म (तैयारी)',
        duration: '3-7 days',
        description: 'Body is prepared to release toxins through two processes:',
        steps: [
          { name: 'Snehana (Oleation)', description: 'Internal: Drinking medicated ghee in increasing doses for 3-7 days. External: Full body oil massage (Abhyanga) daily.', purpose: 'Loosens toxins from tissues and moves them to the gut for elimination.' },
          { name: 'Swedana (Sudation/Steam)', description: 'Steam therapy after oil massage. Herbal steam box or Nadi Swedana (localized steam).', purpose: 'Opens channels (Srotas), liquefies toxins, moves them toward GI tract.' }
        ]
      },
      {
        name: 'Pradhana Karma (Main Procedures)',
        name_hi: 'प्रधान कर्म (मुख्य प्रक्रियाएं)',
        duration: '1-7 days per procedure',
        description: 'The five main cleansing procedures (not all are done for every person — practitioner selects based on dosha and condition):',
        procedures: [
          {
            name: 'Vamana (Therapeutic Emesis)',
            name_hi: 'वमन',
            dosha: 'Kapha disorders',
            description: 'Controlled therapeutic vomiting to expel excess Kapha from stomach and lungs.',
            indications: 'Asthma, chronic cold/cough, allergies, skin diseases (psoriasis), obesity, diabetes',
            season: 'Best in Vasanta (Spring) when Kapha naturally liquefies',
            contraindications: 'Heart disease, pregnancy, children, elderly, emaciation, bleeding disorders',
            duration: '1 day procedure + 7 days recovery diet'
          },
          {
            name: 'Virechana (Therapeutic Purgation)',
            name_hi: 'विरेचन',
            dosha: 'Pitta disorders',
            description: 'Controlled purgation using herbal laxatives to expel excess Pitta from liver and small intestine.',
            indications: 'Skin diseases, acidity, liver disorders, jaundice, gout, rheumatoid arthritis, migraine',
            season: 'Best in Sharad (Autumn) when Pitta naturally aggravates',
            contraindications: 'Rectal prolapse, diarrhea, dehydration, pregnancy, children under 10',
            duration: '1 day procedure + 7 days recovery diet (Samsarjana Krama)'
          },
          {
            name: 'Basti (Medicated Enema)',
            name_hi: 'बस्ती',
            dosha: 'Vata disorders (most important of all 5)',
            description: 'Medicated oil or decoction administered rectally. Two types: Anuvasana (oil) and Niruha (decoction). Charaka calls it "half of all treatment."',
            indications: 'All Vata disorders — back pain, sciatica, arthritis, constipation, neurological disorders, infertility',
            season: 'Best in Varsha (Monsoon) when Vata naturally aggravates',
            contraindications: 'Diarrhea, rectal bleeding, diabetes (oil basti), severe weakness',
            duration: '8-30 days (alternating oil and decoction bastis)'
          },
          {
            name: 'Nasya (Nasal Therapy)',
            name_hi: 'नस्य',
            dosha: 'Head and neck disorders',
            description: 'Medicated oil or powder administered through nostrils. "Nasa hi shiraso dwaram" — nose is the gateway to the head.',
            indications: 'Sinusitis, migraine, hair fall, premature graying, facial palsy, frozen shoulder, memory loss',
            season: 'Can be done year-round (avoid in rain/extreme cold)',
            contraindications: 'After meals, during menstruation, pregnancy, acute cold/fever, children under 7',
            duration: '7-14 days typically'
          },
          {
            name: 'Raktamokshana (Bloodletting)',
            name_hi: 'रक्तमोक्षण',
            dosha: 'Blood (Rakta) disorders',
            description: 'Removal of small amount of impure blood. Done via leech therapy (Jalaukavacharana) or venipuncture. Least commonly performed today.',
            indications: 'Skin diseases (eczema, psoriasis), gout, varicose veins, non-healing ulcers, abscess',
            season: 'Sharad (Autumn)',
            contraindications: 'Anemia, pregnancy, children, elderly, bleeding disorders, edema',
            duration: '1-3 sessions'
          }
        ]
      },
      {
        name: 'Paschat Karma (Post-Procedure)',
        name_hi: 'पश्चात कर्म (बाद की देखभाल)',
        duration: '7-14 days',
        description: 'Gradual return to normal diet and lifestyle. Critical phase — improper post-care can negate all benefits.',
        steps: [
          { name: 'Samsarjana Krama (Graduated Diet)', description: 'Day 1-2: Rice water (Peya). Day 3-4: Thin rice soup (Vilepi). Day 5-6: Khichdi. Day 7+: Normal light diet. Gradually increase complexity.', purpose: 'Agni is very weak after cleansing. Heavy food can cause serious harm.' },
          { name: 'Rasayana (Rejuvenation)', description: 'After digestion normalizes, take Rasayana herbs — Chyawanprash, Ashwagandha, Brahmi. This is when rejuvenation is most effective.', purpose: 'Clean body absorbs Rasayana herbs 10x better. Maximum benefit.' },
          { name: 'Lifestyle Rules', description: 'Avoid: heavy exercise, sex, travel, cold food, stress, late nights for 7-14 days after procedure.', purpose: 'Body is in delicate state. Needs gentle care to rebuild.' }
        ]
      }
    ],
    supportive_therapies: [
      { name: 'Shirodhara', description: 'Warm oil poured in continuous stream on forehead for 30-45 min. For insomnia, anxiety, headache, hair fall.', dosha: 'Vata and Pitta' },
      { name: 'Abhyanga', description: 'Full body warm oil massage (45-60 min). Nourishes tissues, calms Vata, improves circulation.', dosha: 'All doshas (oil varies)' },
      { name: 'Kati Basti', description: 'Warm oil pooled on lower back using dough ring. For back pain, sciatica, disc problems.', dosha: 'Vata' },
      { name: 'Janu Basti', description: 'Warm oil pooled on knee joint. For knee osteoarthritis, stiffness.', dosha: 'Vata' },
      { name: 'Netra Tarpana', description: 'Medicated ghee pooled over eyes using dough ring. For eye strain, dry eyes, vision problems.', dosha: 'Pitta' },
      { name: 'Pizhichil', description: 'Warm oil poured over entire body continuously while massaging. Royal treatment for rejuvenation.', dosha: 'Vata' },
      { name: 'Udvartana', description: 'Dry herbal powder massage (upward strokes). For obesity, cellulite, Kapha conditions.', dosha: 'Kapha' }
    ],
    cost_estimate: 'In India: ₹15,000-50,000 for 7-14 day program. In Kerala (best centers): ₹25,000-1,00,000. Abroad: $2000-5000.',
    how_to_find: 'Look for: NABH-accredited Ayurvedic hospitals, Kerala Panchakarma centers, or practitioners with BAMS/MD(Ayu) degree. Avoid spas offering "Panchakarma" without qualified doctors.',
    frequency: 'Ideally once a year (seasonal junction). Minimum: once in lifetime for deep cleansing. Healthy people: once a year. Chronic disease: 2-3 times/year initially.'
  });
});

// ===== #1 YOGA VISUAL GUIDE =====
router.get('/yoga-guide', (req, res) => {
  const { category } = req.query;

  const poses = [
    {
      id: 1, name: 'Surya Namaskar (Sun Salutation)', name_hi: 'सूर्य नमस्कार', category: 'full_body',
      difficulty: 'intermediate', duration: '15-20 min', rounds: '6-12',
      benefits: 'Complete body workout. Burns calories, improves flexibility, boosts metabolism, energizes.',
      best_for: ['Obesity', 'Low Energy', 'Stress', 'General fitness'],
      steps: [
        { position: 'Pranamasana', instruction: 'Stand straight, feet together. Palms joined at chest. Breathe normally.', breath: 'Normal', visual: '🧍' },
        { position: 'Hasta Uttanasana', instruction: 'Inhale, raise arms overhead. Arch back slightly. Look up.', breath: 'Inhale', visual: '🙆' },
        { position: 'Padahastasana', instruction: 'Exhale, bend forward from hips. Touch toes/floor. Nose toward knees.', breath: 'Exhale', visual: '🙇' },
        { position: 'Ashwa Sanchalanasana', instruction: 'Inhale, step right leg back. Left knee bent. Look up. Chest open.', breath: 'Inhale', visual: '🏃' },
        { position: 'Dandasana (Plank)', instruction: 'Hold breath, step left leg back. Body straight like a plank. Arms straight.', breath: 'Hold', visual: '💪' },
        { position: 'Ashtanga Namaskar', instruction: 'Exhale, lower knees-chest-chin to floor. Hips up. 8 points touch ground.', breath: 'Exhale', visual: '🐛' },
        { position: 'Bhujangasana', instruction: 'Inhale, slide forward, lift chest. Cobra pose. Elbows slightly bent.', breath: 'Inhale', visual: '🐍' },
        { position: 'Adho Mukha Svanasana', instruction: 'Exhale, lift hips up and back. Inverted V shape. Heels toward floor.', breath: 'Exhale', visual: '⛰️' },
        { position: 'Ashwa Sanchalanasana', instruction: 'Inhale, step right foot forward between hands. Left knee down. Look up.', breath: 'Inhale', visual: '🏃' },
        { position: 'Padahastasana', instruction: 'Exhale, step left foot forward. Forward bend. Nose toward knees.', breath: 'Exhale', visual: '🙇' },
        { position: 'Hasta Uttanasana', instruction: 'Inhale, rise up with arms overhead. Slight back arch.', breath: 'Inhale', visual: '🙆' },
        { position: 'Pranamasana', instruction: 'Exhale, return to prayer position. This completes one half-round.', breath: 'Exhale', visual: '🧍' }
      ],
      precautions: 'Avoid in: pregnancy (after 1st trimester), severe back pain, hernia, high BP (modify), during menstruation (optional).',
      tips: ['Do facing the sun (east) in morning', 'Empty stomach only', 'Start with 4 rounds, build to 12', 'Each round = both sides (24 poses total)', 'Coordinate breath with movement']
    },
    {
      id: 2, name: 'Anulom Vilom (Alternate Nostril Breathing)', name_hi: 'अनुलोम विलोम', category: 'pranayama',
      difficulty: 'beginner', duration: '10-15 min', rounds: '10-20 cycles',
      benefits: 'Balances nervous system, reduces anxiety, improves focus, balances doshas, purifies nadis.',
      best_for: ['Stress', 'Insomnia', 'High BP', 'Anxiety', 'Focus'],
      steps: [
        { position: 'Sitting', instruction: 'Sit comfortably in Sukhasana or Padmasana. Spine straight. Eyes closed.', breath: 'Normal', visual: '🧘' },
        { position: 'Hand Position', instruction: 'Right hand: fold index+middle fingers. Thumb for right nostril, ring finger for left.', breath: 'Normal', visual: '🤚' },
        { position: 'Close Right', instruction: 'Close right nostril with thumb. Inhale slowly through LEFT nostril. Count to 4.', breath: 'Inhale Left (4 counts)', visual: '👃←' },
        { position: 'Hold', instruction: 'Close BOTH nostrils. Hold breath gently. Count to 4 (beginners can skip hold).', breath: 'Hold (4 counts)', visual: '🔒' },
        { position: 'Close Left', instruction: 'Release right nostril. Exhale slowly through RIGHT nostril. Count to 8.', breath: 'Exhale Right (8 counts)', visual: '👃→' },
        { position: 'Inhale Right', instruction: 'Keep left closed. Inhale through RIGHT nostril. Count to 4.', breath: 'Inhale Right (4 counts)', visual: '👃→' },
        { position: 'Hold', instruction: 'Close both. Hold. Count to 4.', breath: 'Hold (4 counts)', visual: '🔒' },
        { position: 'Exhale Left', instruction: 'Release left. Exhale through LEFT nostril. Count to 8. This = 1 cycle.', breath: 'Exhale Left (8 counts)', visual: '👃←' }
      ],
      precautions: 'Do NOT hold breath if you have heart problems or high BP. Just inhale-exhale without retention.',
      tips: ['Ratio: 4:4:8 (inhale:hold:exhale) for beginners', 'Advanced: 4:16:8', 'Do on empty stomach', 'Best time: early morning or before bed', 'Minimum 10 cycles for effect']
    },
    {
      id: 3, name: 'Kapalabhati (Skull-Shining Breath)', name_hi: 'कपालभाति', category: 'pranayama',
      difficulty: 'intermediate', duration: '5-10 min', rounds: '3 rounds of 30-120 strokes',
      benefits: 'Burns belly fat, detoxifies lungs, energizes brain, improves digestion, clears sinuses.',
      best_for: ['Obesity', 'Low Energy', 'Constipation', 'Sinusitis', 'Brain fog'],
      steps: [
        { position: 'Sitting', instruction: 'Sit in Sukhasana. Spine erect. Hands on knees in Gyan Mudra.', breath: 'Normal', visual: '🧘' },
        { position: 'Prepare', instruction: 'Take 2-3 deep breaths to prepare. Relax shoulders.', breath: 'Deep breaths', visual: '🌬️' },
        { position: 'Active Exhale', instruction: 'FORCEFULLY exhale through nose by pulling navel IN sharply. Abdomen contracts.', breath: 'Forceful Exhale', visual: '💨' },
        { position: 'Passive Inhale', instruction: 'Let inhalation happen AUTOMATICALLY as abdomen relaxes. Do NOT force inhale.', breath: 'Passive Inhale', visual: '🫁' },
        { position: 'Rhythm', instruction: 'Continue: forceful exhale → passive inhale. 1 stroke per second. Start with 30 strokes.', breath: 'Rhythmic', visual: '🔄' },
        { position: 'Rest', instruction: 'After 30 strokes, take deep breath in, hold briefly, exhale slowly. Rest 30 seconds.', breath: 'Rest', visual: '😌' },
        { position: 'Repeat', instruction: 'Do 3 rounds. Increase to 60, then 120 strokes per round over weeks.', breath: 'Build up', visual: '📈' }
      ],
      precautions: 'AVOID in: high BP, heart disease, hernia, pregnancy, menstruation, epilepsy, recent abdominal surgery, acid reflux.',
      tips: ['Only the EXHALE is active. Inhale is passive.', 'Keep chest still — only abdomen moves', 'Start slow (1/second), increase speed gradually', 'Do on completely empty stomach', 'Stop if dizzy — you are doing too fast']
    },
    {
      id: 4, name: 'Bhramari (Bee Breath)', name_hi: 'भ्रामरी प्राणायाम', category: 'pranayama',
      difficulty: 'beginner', duration: '5 min', rounds: '7-11 rounds',
      benefits: 'Instantly calms mind, reduces anxiety, promotes sleep, lowers BP, relieves headache.',
      best_for: ['Insomnia', 'Anxiety', 'Headache', 'High BP', 'Anger'],
      steps: [
        { position: 'Sitting', instruction: 'Sit comfortably. Spine straight. Eyes closed. Relax face and jaw.', breath: 'Normal', visual: '🧘' },
        { position: 'Hand Position', instruction: 'Raise hands. Place index fingers on ear cartilage (tragus). Do NOT insert in ear canal.', breath: 'Normal', visual: '🙉' },
        { position: 'Inhale', instruction: 'Take a deep breath in through nose. Fill lungs completely.', breath: 'Deep Inhale', visual: '🫁' },
        { position: 'Hum', instruction: 'Exhale making a steady humming sound like a bee (mmmmm). Keep mouth closed. Feel vibration in head.', breath: 'Exhale with humming', visual: '🐝' },
        { position: 'Feel', instruction: 'Press ear cartilage gently while humming to amplify the internal sound. Feel vibration in skull.', breath: 'Continue humming', visual: '✨' },
        { position: 'Repeat', instruction: 'Release ears. Breathe normally once. Then repeat. Do 7-11 rounds.', breath: 'Rest between rounds', visual: '🔄' }
      ],
      precautions: 'Do NOT press ear too hard. Avoid if you have ear infection. Safe for almost everyone including pregnant women.',
      tips: ['The longer the humming, the more calming effect', 'Try different pitches — find what resonates in your head', 'Best done before sleep for insomnia', 'Can be done anywhere — even at work desk', 'Children love this one — teach them!']
    },
    {
      id: 5, name: 'Shavasana (Corpse Pose)', name_hi: 'शवासन', category: 'relaxation',
      difficulty: 'beginner', duration: '10-20 min', rounds: '1 (hold)',
      benefits: 'Deep relaxation, reduces stress hormones, lowers BP, promotes healing, improves sleep quality.',
      best_for: ['Stress', 'Insomnia', 'High BP', 'Anxiety', 'Post-exercise recovery'],
      steps: [
        { position: 'Lie Down', instruction: 'Lie flat on back on a mat. Legs slightly apart. Arms away from body, palms facing up.', breath: 'Normal', visual: '🛌' },
        { position: 'Adjust', instruction: 'Close eyes. Adjust body so you are completely comfortable. Use thin pillow if needed.', breath: 'Normal', visual: '😌' },
        { position: 'Relax Feet', instruction: 'Bring attention to toes and feet. Consciously relax them. Let them fall outward.', breath: 'Slow, deep', visual: '🦶' },
        { position: 'Relax Legs', instruction: 'Move attention up — calves, knees, thighs. Release all tension. Legs become heavy.', breath: 'Slow, deep', visual: '🦵' },
        { position: 'Relax Torso', instruction: 'Relax abdomen, chest, back. Let the floor support you completely. Surrender weight.', breath: 'Natural', visual: '🫁' },
        { position: 'Relax Arms', instruction: 'Relax fingers, hands, arms, shoulders. Let them melt into the floor.', breath: 'Natural', visual: '💪' },
        { position: 'Relax Face', instruction: 'Relax jaw (slightly open mouth), tongue, cheeks, eyes, forehead, scalp. Smooth all wrinkles.', breath: 'Natural', visual: '😶' },
        { position: 'Witness', instruction: 'Simply observe your breath without controlling it. If mind wanders, gently return to breath. Stay 10-20 min.', breath: 'Natural, effortless', visual: '🧠' },
        { position: 'Return', instruction: 'Slowly deepen breath. Wiggle fingers and toes. Stretch gently. Roll to right side. Slowly sit up.', breath: 'Deepening', visual: '🌅' }
      ],
      precautions: 'None. Safe for everyone. If you fall asleep, that is fine — your body needed it.',
      tips: ['Do NOT skip this after yoga practice — it integrates the benefits', 'Cover yourself with a light blanket (body cools down)', 'Use eye pillow or cloth over eyes for deeper relaxation', 'Play soft music or nature sounds if helpful', 'This is the hardest pose — doing nothing is the challenge']
    }
  ];

  const filtered = category ? poses.filter(p => p.category === category) : poses;
  const categories = [...new Set(poses.map(p => p.category))];

  res.json({ poses: filtered, categories });
});
