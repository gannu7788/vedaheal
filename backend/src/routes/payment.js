const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');
const { getUserFromToken } = require('./auth');

// Pricing plans
const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Premium Monthly',
    name_hi: 'प्रीमियम मासिक',
    price: 99,
    currency: 'INR',
    duration_days: 30,
    features: [
      'Unlimited AI Chat consultations',
      'Personalized healing protocols',
      'All 798+ herbs with full details',
      'All wellness tools',
      'Priority support',
      'No ads'
    ],
    features_hi: [
      'असीमित AI चैट परामर्श',
      'व्यक्तिगत उपचार प्रोटोकॉल',
      'सभी 798+ जड़ी-बूटियों की पूरी जानकारी',
      'सभी वेलनेस उपकरण',
      'प्राथमिकता सहायता',
      'कोई विज्ञापन नहीं'
    ]
  },
  quarterly: {
    id: 'quarterly',
    name: 'Premium Quarterly',
    name_hi: 'प्रीमियम त्रैमासिक',
    price: 249,
    currency: 'INR',
    duration_days: 90,
    savings: '16% off',
    features: ['Everything in Monthly', '+ Save ₹48 vs monthly']
  },
  yearly: {
    id: 'yearly',
    name: 'Premium Yearly',
    name_hi: 'प्रीमियम वार्षिक',
    price: 799,
    currency: 'INR',
    duration_days: 365,
    savings: '33% off',
    features: ['Everything in Monthly', '+ Save ₹389 vs monthly', '+ 2 months free']
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime Access',
    name_hi: 'आजीवन एक्सेस',
    price: 1999,
    currency: 'INR',
    duration_days: 36500, // 100 years
    savings: 'Best value',
    features: ['Everything forever', 'All future updates', 'Never pay again']
  }
};

// GET /api/payment/plans - Get available plans
router.get('/plans', (req, res) => {
  res.json({
    plans: Object.values(PLANS),
    free_features: [
      'Browse 30 health problems',
      'View basic remedies (top 3 per problem)',
      'Dosha Quiz',
      '5 AI chats per day',
      'Kitchen Pharmacy',
      'Seasonal Guide'
    ],
    premium_features: [
      'Unlimited AI Chat with Ayurvedic expert',
      'Full detailed protocols (all remedies + yoga)',
      'Complete Herb Encyclopedia (798+ herbs)',
      'All Wellness Tools (Tongue, Pulse, Moon, etc.)',
      'Personalized daily schedules',
      'Herb interaction checker',
      'Food compatibility checker',
      'Panchakarma guide',
      'Ayurvedic recipes',
      'No ads, priority support'
    ]
  });
});

// POST /api/payment/create-order - Create payment order
router.post('/create-order', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Login required' });

  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  const { plan_id } = req.body;
  const plan = PLANS[plan_id];
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });

  const db = getDb();

  // Create order record
  const orderId = `order_${Date.now()}_${user.id}`;
  db.prepare('INSERT INTO payments (user_id, amount, plan, order_id, status) VALUES (?, ?, ?, ?, ?)').run(
    user.id, plan.price, plan_id, orderId, 'pending'
  );

  // In production, you'd create a Razorpay order here
  // For now, return order details for frontend
  res.json({
    order_id: orderId,
    amount: plan.price * 100, // Razorpay uses paise
    currency: plan.currency,
    plan: plan,
    razorpay_key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    notes: {
      user_id: user.id,
      plan_id: plan_id
    }
  });
});

// POST /api/payment/verify - Verify payment and activate plan
router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Login required' });

  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  const { order_id, payment_id, plan_id } = req.body;
  const plan = PLANS[plan_id];
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });

  const db = getDb();

  // In production, verify with Razorpay signature
  // For now, just activate the plan
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + plan.duration_days);

  db.prepare('UPDATE users SET plan = ?, plan_expiry = ? WHERE id = ?').run(
    plan_id === 'lifetime' ? 'lifetime' : 'premium',
    expiry.toISOString(),
    user.id
  );

  db.prepare('UPDATE payments SET payment_id = ?, status = ? WHERE order_id = ?').run(
    payment_id || 'manual_' + Date.now(),
    'completed',
    order_id
  );

  res.json({
    success: true,
    message: 'Payment successful! Premium activated.',
    plan: plan.name,
    expiry: expiry.toISOString()
  });
});

// POST /api/payment/activate-free-trial - 7-day free trial
router.post('/free-trial', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Login required' });

  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  const db = getDb();

  // Check if already used trial
  const existingPayment = db.prepare('SELECT id FROM payments WHERE user_id = ? AND plan = ?').get(user.id, 'trial');
  if (existingPayment) {
    return res.status(400).json({ error: 'Free trial already used' });
  }

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  db.prepare('UPDATE users SET plan = ?, plan_expiry = ? WHERE id = ?').run('premium', expiry.toISOString(), user.id);
  db.prepare('INSERT INTO payments (user_id, amount, plan, status) VALUES (?, ?, ?, ?)').run(user.id, 0, 'trial', 'completed');

  res.json({
    success: true,
    message: 'Free trial activated! Enjoy 7 days of Premium.',
    expiry: expiry.toISOString()
  });
});

module.exports = router;
