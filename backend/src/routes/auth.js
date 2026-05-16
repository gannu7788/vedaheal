const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getDb } = require('../database/init');

// Create users table if not exists
function initAuthTables() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'premium', 'lifetime')),
      plan_expiry TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT,
      chat_count_today INTEGER DEFAULT 0,
      chat_date TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'INR',
      plan TEXT NOT NULL,
      payment_id TEXT,
      order_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Seed default admin user
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@vedaheal.com');
  if (!existing) {
    const hash = hashPassword('admin');
    db.prepare('INSERT INTO users (name, email, password_hash, plan) VALUES (?, ?, ?, ?)').run('Admin', 'admin@vedaheal.com', hash, 'lifetime');
    console.log('  👤 Default admin created: admin@vedaheal.com / admin');
  }
}

// Simple password hashing (use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'vedaheal_salt_2024').digest('hex');
}

// Generate simple token (use JWT in production)
function generateToken(userId) {
  const payload = `${userId}:${Date.now()}:vedaheal`;
  return Buffer.from(payload).toString('base64');
}

function getUserFromToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const userId = decoded.split(':')[0];
    const db = getDb();
    return db.prepare('SELECT id, name, email, plan, plan_expiry, chat_count_today, chat_date FROM users WHERE id = ?').get(userId);
  } catch { return null; }
}

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const db = getDb();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Email already registered. Please login.' });
  }

  const hash = hashPassword(password);
  const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email.toLowerCase(), hash);

  const token = generateToken(result.lastInsertRowid);
  res.json({
    success: true,
    token,
    user: { id: result.lastInsertRowid, name, email: email.toLowerCase(), plan: 'free' }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const db = getDb();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
  const token = generateToken(user.id);

  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan, plan_expiry: user.plan_expiry }
  });
});

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  // Check if premium expired
  if (user.plan === 'premium' && user.plan_expiry) {
    if (new Date(user.plan_expiry) < new Date()) {
      const db = getDb();
      db.prepare('UPDATE users SET plan = "free" WHERE id = ?').run(user.id);
      user.plan = 'free';
    }
  }

  res.json({ user });
});

// Middleware to check premium access
function requirePremium(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Login required', upgrade: true });

  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token', upgrade: true });

  if (user.plan === 'free') {
    return res.status(403).json({ error: 'Premium feature', upgrade: true, message: 'Upgrade to Premium for unlimited access' });
  }

  req.user = user;
  next();
}

// Check free tier limits (e.g., 5 AI chats per day for free users)
function checkFreeLimits(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    // Allow without login but with limits
    req.isGuest = true;
    return next();
  }

  const user = getUserFromToken(token);
  if (!user) { req.isGuest = true; return next(); }

  req.user = user;

  // Premium users have no limits
  if (user.plan !== 'free') return next();

  // Free users: 5 AI chats per day
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  if (user.chat_date !== today) {
    db.prepare('UPDATE users SET chat_count_today = 0, chat_date = ? WHERE id = ?').run(today, user.id);
    user.chat_count_today = 0;
  }

  if (user.chat_count_today >= 5) {
    return res.status(429).json({
      error: 'Daily limit reached',
      upgrade: true,
      message: 'Free plan allows 5 AI chats per day. Upgrade to Premium for unlimited.',
      limit: 5,
      used: user.chat_count_today
    });
  }

  // Increment count
  db.prepare('UPDATE users SET chat_count_today = chat_count_today + 1 WHERE id = ?').run(user.id);
  next();
}

module.exports = { router, initAuthTables, requirePremium, checkFreeLimits, getUserFromToken };
