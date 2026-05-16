const express = require('express');
const router = express.Router();

// GET /api/seasonal-diet?dosha=vata — Generate weekly meal plan based on season + dosha
router.get('/', (req, res) => {
  const { dosha } = req.query;
  const userDosha = (dosha || 'vata').toLowerCase();

  const month = new Date().getMonth();
  let season;
  if (month >= 2 && month <= 3) season = 'spring';
  else if (month >= 4 && month <= 5) season = 'summer';
  else if (month >= 6 && month <= 7) season = 'monsoon';
  else if (month >= 8 && month <= 9) season = 'autumn';
  else season = 'winter';

  const mealPlans = {
    'vata-winter': {
      breakfast: ['Warm oatmeal with ghee, dates, almonds', 'Poha with peanuts and turmeric', 'Moong dal chilla with chutney', 'Upma with vegetables and ghee', 'Besan cheela with warm milk', 'Daliya (broken wheat) porridge with jaggery', 'Idli with sambar (warm)'],
      lunch: ['Dal-rice-ghee-sabzi (warm thali)', 'Rajma chawal with salad', 'Roti + paneer sabzi + dal', 'Khichdi with ghee and pickle', 'Chole with rice and raita', 'Mixed veg curry with chapati', 'Sambar rice with papad'],
      dinner: ['Moong dal soup with bread', 'Vegetable khichdi (light)', 'Chapati with lauki sabzi', 'Tomato soup with toast', 'Daliya upma (light)', 'Steamed idli with chutney', 'Warm milk with turmeric + early sleep'],
      snacks: ['Warm milk with turmeric', 'Dates + almonds (soaked)', 'Ginger tea with jaggery', 'Til ladoo (sesame)', 'Warm soup'],
      herbs: 'Ashwagandha with milk at night. Chyawanprash morning. Trikatu before meals.'
    },
    'vata-summer': {
      breakfast: ['Fresh fruit bowl with soaked almonds', 'Sattu drink (cooling + energizing)', 'Poha with coconut', 'Curd rice (room temp)', 'Muesli with milk and fruits', 'Idli with coconut chutney', 'Bread with butter and banana'],
      lunch: ['Rice + dal + cucumber raita + sabzi', 'Curd rice with pickle', 'Chapati + bhindi/lauki + dal', 'Lemon rice with papad', 'Khichdi with buttermilk', 'Veg pulao with raita', 'Sambar rice with coconut'],
      dinner: ['Moong dal + chapati (light)', 'Vegetable soup + bread', 'Dalia with vegetables', 'Khichdi (very light)', 'Chapati + palak dal', 'Curd rice (if not too late)', 'Warm milk + sleep by 10'],
      snacks: ['Coconut water', 'Buttermilk with roasted cumin', 'Watermelon/muskmelon', 'Sattu drink', 'Mint lemonade (not too cold)'],
      herbs: 'Shatavari with milk. Amla juice morning. Avoid excess Trikatu in summer.'
    },
    'pitta-summer': {
      breakfast: ['Overnight oats with fruits', 'Poha with coconut and coriander', 'Fruit smoothie (banana, mango, milk)', 'Rice flakes with cold milk', 'Idli with coconut chutney', 'Sattu drink with mishri', 'Bread with butter and cucumber'],
      lunch: ['Rice + moong dal + cooling sabzi + raita', 'Curd rice with pomegranate', 'Chapati + lauki + mint raita', 'Coconut rice with sambar', 'Veg biryani (mild) with raita', 'Khichdi with ghee + cucumber', 'Lemon rice + buttermilk'],
      dinner: ['Moong soup + chapati', 'Lauki kheer (light)', 'Vegetable daliya', 'Chapati + turai sabzi', 'Milk + rice (light)', 'Soup + bread', 'Warm milk with mishri'],
      snacks: ['Coconut water', 'Rose sharbat', 'Cucumber + mint', 'Sweet lassi', 'Watermelon', 'Gulkand (rose petal jam)'],
      herbs: 'Shatavari + Amla daily. Sheetali pranayama. Avoid Trikatu, garlic, excess spice.'
    },
    'kapha-spring': {
      breakfast: ['Warm lemon water + light breakfast', 'Besan chilla (no oil, dry roast)', 'Sprouts salad with lemon', 'Green tea + 2 dry toast', 'Poha (dry, less oil) with peanuts', 'Upma with vegetables (less oil)', 'Skip breakfast (intermittent fast OK for Kapha)'],
      lunch: ['Chapati + bitter gourd + light dal', 'Barley roti + sabzi + buttermilk', 'Salad + soup + 1 chapati', 'Moong dal + rice (small portion)', 'Mixed veg + millet roti', 'Rajma (small portion) + salad', 'Sprouts + chapati + green chutney'],
      dinner: ['Vegetable soup only', 'Moong dal soup + 1 chapati', 'Steamed vegetables + soup', 'Light khichdi (more dal, less rice)', 'Skip dinner 1-2x/week', 'Salad + warm water', 'Warm water + early sleep'],
      snacks: ['Green tea / ginger tea (no milk/sugar)', 'Roasted chana', 'Apple/pear', 'Warm water with honey', 'Avoid snacking if possible'],
      herbs: 'Trikatu before meals. Triphala at night. Guggulu for metabolism. Honey (unheated) with warm water morning.'
    }
  };

  // Find best matching plan or default
  const key = `${userDosha}-${season}`;
  const plan = mealPlans[key] || mealPlans[`${userDosha}-winter`] || mealPlans['vata-winter'];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekPlan = days.map((day, i) => ({
    day,
    breakfast: plan.breakfast[i % plan.breakfast.length],
    lunch: plan.lunch[i % plan.lunch.length],
    dinner: plan.dinner[i % plan.dinner.length],
    snack: plan.snacks[i % plan.snacks.length]
  }));

  res.json({
    dosha: userDosha,
    season,
    week_plan: weekPlan,
    herbs_recommendation: plan.herbs,
    general_rules: [
      'Eat largest meal at lunch (12-1 PM) when Agni is strongest',
      'Dinner should be light and before 7:30 PM',
      'Drink warm/room temperature water (never ice cold)',
      'Eat only when previous meal is digested',
      'Avoid eating when stressed, angry, or distracted'
    ]
  });
});

module.exports = router;
