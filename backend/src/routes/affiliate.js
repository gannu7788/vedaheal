const express = require('express');
const router = express.Router();

// Affiliate links for herb purchases
// Replace these with your actual affiliate links when you sign up
const AFFILIATE_CONFIG = {
  amazon_tag: 'vedaheal-21', // Replace with your Amazon Associates tag
  onemg_ref: 'vedaheal',    // Replace with your 1mg affiliate ref
};

// GET /api/affiliate/buy/:herbName - Get purchase links for a herb
router.get('/buy/:herbName', (req, res) => {
  const herb = req.params.herbName;
  const encodedHerb = encodeURIComponent(herb + ' ayurvedic');

  const links = [
    {
      store: 'Amazon',
      icon: '🛒',
      url: `https://www.amazon.in/s?k=${encodedHerb}&tag=${AFFILIATE_CONFIG.amazon_tag}`,
      note: 'Wide variety, fast delivery'
    },
    {
      store: '1mg',
      icon: '💊',
      url: `https://www.1mg.com/search/all?name=${encodedHerb}`,
      note: 'Verified Ayurvedic products'
    },
    {
      store: 'Jiva Ayurveda',
      icon: '🌿',
      url: `https://store.jiva.com/search?q=${encodedHerb}`,
      note: 'Authentic Ayurvedic formulations'
    },
    {
      store: 'Patanjali',
      icon: '🏪',
      url: `https://www.patanjaliayurved.net/search?q=${encodedHerb}`,
      note: 'Affordable, widely available'
    },
    {
      store: 'Baidyanath',
      icon: '🏥',
      url: `https://www.baidyanath.co.in/search?q=${encodedHerb}`,
      note: 'Classical formulations since 1917'
    }
  ];

  res.json({
    herb: herb,
    links,
    disclaimer: 'We may earn a small commission from purchases made through these links at no extra cost to you. This helps us keep VedaHeal free.',
    tips: [
      'Buy from reputed brands (Dabur, Baidyanath, Himalaya, Organic India, Patanjali)',
      'Check manufacturing date — fresher is better',
      'For raw herbs, buy from local Ayurvedic pharmacy (Vaidya)',
      'Avoid very cheap products — quality matters in Ayurveda',
      'Look for GMP certified or FSSAI approved products'
    ]
  });
});

// GET /api/affiliate/recommended - Get recommended products
router.get('/recommended', (req, res) => {
  res.json({
    categories: [
      {
        name: 'Daily Essentials',
        products: [
          { name: 'Chyawanprash', brand: 'Dabur/Baidyanath', price_range: '₹200-400', why: 'Daily immunity + energy booster' },
          { name: 'Triphala Powder', brand: 'Organic India', price_range: '₹150-250', why: 'Daily detox + digestion' },
          { name: 'Ashwagandha Capsules', brand: 'Himalaya/KSM-66', price_range: '₹200-500', why: 'Stress + energy + sleep' },
          { name: 'Pure Cow Ghee', brand: 'Amul/Local', price_range: '₹500-800/L', why: 'Brain food + cooking + Rasayana' },
          { name: 'Copper Tongue Scraper', brand: 'Any', price_range: '₹100-200', why: 'Daily Ama removal' }
        ]
      },
      {
        name: 'Starter Kit for Beginners',
        products: [
          { name: 'Trikatu Churna', brand: 'Baidyanath', price_range: '₹80-150', why: 'Digestion + metabolism' },
          { name: 'Brahmi Capsules', brand: 'Himalaya', price_range: '₹150-250', why: 'Memory + calm mind' },
          { name: 'Sesame Oil (cold-pressed)', brand: 'Local/Organic', price_range: '₹200-400', why: 'Daily Abhyanga massage' },
          { name: 'Neem Capsules', brand: 'Himalaya', price_range: '₹150-200', why: 'Blood purifier + skin' },
          { name: 'Tulsi Drops', brand: 'Organic India', price_range: '₹150-200', why: 'Daily immunity' }
        ]
      }
    ],
    affiliate_note: 'Links will be added when affiliate partnerships are established. For now, buy from any trusted source.'
  });
});

module.exports = router;
