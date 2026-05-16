const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// Create tracker tables
function initTrackerTables() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS symptom_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      symptom_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      severity INTEGER NOT NULL CHECK(severity BETWEEN 1 AND 10),
      notes TEXT,
      mood TEXT,
      sleep_hours REAL,
      followed_protocol INTEGER DEFAULT 0,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS daily_habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT NOT NULL,
      woke_early INTEGER DEFAULT 0,
      exercised INTEGER DEFAULT 0,
      meditated INTEGER DEFAULT 0,
      ate_healthy INTEGER DEFAULT 0,
      took_herbs INTEGER DEFAULT 0,
      drank_water INTEGER DEFAULT 0,
      slept_on_time INTEGER DEFAULT 0,
      no_junk_food INTEGER DEFAULT 0
    );
  `);
  db.save();
}

// POST /api/tracker/log — Log daily symptom
router.post('/log', (req, res) => {
  const db = getDb();
  const { symptom_id, severity, notes, mood, sleep_hours, followed_protocol } = req.body;

  if (!symptom_id || !severity) {
    return res.status(400).json({ error: 'symptom_id and severity (1-10) are required' });
  }

  const today = new Date().toISOString().split('T')[0];

  // Check if already logged today for this symptom
  const existing = db.prepare(
    'SELECT id FROM symptom_logs WHERE symptom_id = ? AND date = ?'
  ).get(symptom_id, today);

  if (existing) {
    // Update existing
    db.prepare(
      'UPDATE symptom_logs SET severity = ?, notes = ?, mood = ?, sleep_hours = ?, followed_protocol = ? WHERE id = ?'
    ).run(severity, notes || null, mood || null, sleep_hours || null, followed_protocol ? 1 : 0, existing.id);
  } else {
    // Insert new
    db.prepare(
      'INSERT INTO symptom_logs (symptom_id, date, severity, notes, mood, sleep_hours, followed_protocol) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(symptom_id, today, severity, notes || null, mood || null, sleep_hours || null, followed_protocol ? 1 : 0);
  }

  db.save();
  res.json({ success: true, message: 'Logged successfully', date: today });
});

// GET /api/tracker/history/:symptomId — Get history for a symptom
router.get('/history/:symptomId', (req, res) => {
  const db = getDb();
  const { symptomId } = req.params;
  const { days } = req.query;
  const limit = parseInt(days) || 30;

  const logs = db.prepare(
    'SELECT * FROM symptom_logs WHERE symptom_id = ? ORDER BY date DESC LIMIT ?'
  ).all(symptomId, limit);

  // Calculate stats
  const severities = logs.map(l => l.severity);
  const stats = {
    total_logs: logs.length,
    avg_severity: severities.length ? (severities.reduce((a, b) => a + b, 0) / severities.length).toFixed(1) : 0,
    best_day: severities.length ? Math.min(...severities) : 0,
    worst_day: severities.length ? Math.max(...severities) : 0,
    trend: calculateTrend(severities),
    protocol_adherence: logs.length ? Math.round((logs.filter(l => l.followed_protocol).length / logs.length) * 100) : 0
  };

  res.json({ logs: logs.reverse(), stats });
});

// GET /api/tracker/summary — Overall tracking summary
router.get('/summary', (req, res) => {
  const db = getDb();

  const tracked = db.prepare(
    'SELECT DISTINCT symptom_id FROM symptom_logs'
  ).all();

  const summaries = tracked.map(t => {
    const symptom = db.prepare('SELECT name, name_hi FROM symptoms WHERE id = ?').get(t.symptom_id);
    const logs = db.prepare(
      'SELECT severity, date, followed_protocol FROM symptom_logs WHERE symptom_id = ? ORDER BY date DESC LIMIT 30'
    ).all(t.symptom_id);

    const severities = logs.map(l => l.severity);
    return {
      symptom_id: t.symptom_id,
      symptom_name: symptom?.name || 'Unknown',
      symptom_name_hi: symptom?.name_hi,
      total_logs: logs.length,
      current_severity: severities[0] || 0,
      avg_severity: (severities.reduce((a, b) => a + b, 0) / severities.length).toFixed(1),
      trend: calculateTrend(severities),
      last_logged: logs[0]?.date
    };
  });

  res.json({ tracked_conditions: summaries });
});

// POST /api/tracker/habits — Log daily habits
router.post('/habits', (req, res) => {
  const db = getDb();
  const { woke_early, exercised, meditated, ate_healthy, took_herbs, drank_water, slept_on_time, no_junk_food } = req.body;
  const today = new Date().toISOString().split('T')[0];

  const existing = db.prepare('SELECT id FROM daily_habits WHERE date = ?').get(today);

  if (existing) {
    db.prepare(
      'UPDATE daily_habits SET woke_early=?, exercised=?, meditated=?, ate_healthy=?, took_herbs=?, drank_water=?, slept_on_time=?, no_junk_food=? WHERE id=?'
    ).run(woke_early?1:0, exercised?1:0, meditated?1:0, ate_healthy?1:0, took_herbs?1:0, drank_water?1:0, slept_on_time?1:0, no_junk_food?1:0, existing.id);
  } else {
    db.prepare(
      'INSERT INTO daily_habits (date, woke_early, exercised, meditated, ate_healthy, took_herbs, drank_water, slept_on_time, no_junk_food) VALUES (?,?,?,?,?,?,?,?,?)'
    ).run(today, woke_early?1:0, exercised?1:0, meditated?1:0, ate_healthy?1:0, took_herbs?1:0, drank_water?1:0, slept_on_time?1:0, no_junk_food?1:0);
  }

  db.save();

  // Calculate streak
  const habits = db.prepare('SELECT * FROM daily_habits ORDER BY date DESC LIMIT 30').all();
  const streak = calculateStreak(habits);

  res.json({ success: true, date: today, streak });
});

// GET /api/tracker/habits/history — Get habit history
router.get('/habits/history', (req, res) => {
  const db = getDb();
  const habits = db.prepare('SELECT * FROM daily_habits ORDER BY date DESC LIMIT 30').all();

  const streak = calculateStreak(habits);
  const totalDays = habits.length;
  const avgScore = totalDays ? (habits.reduce((sum, h) => {
    return sum + h.woke_early + h.exercised + h.meditated + h.ate_healthy + h.took_herbs + h.drank_water + h.slept_on_time + h.no_junk_food;
  }, 0) / (totalDays * 8) * 100).toFixed(0) : 0;

  res.json({
    habits: habits.reverse(),
    stats: { streak, total_days: totalDays, avg_score: avgScore + '%' }
  });
});

function calculateTrend(severities) {
  if (severities.length < 3) return 'not_enough_data';
  const recent = severities.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const older = severities.slice(-3).reduce((a, b) => a + b, 0) / 3;
  if (recent < older - 1) return 'improving';
  if (recent > older + 1) return 'worsening';
  return 'stable';
}

function calculateStreak(habits) {
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];

  for (let i = 0; i < habits.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedDate = expected.toISOString().split('T')[0];

    if (habits[i]?.date === expectedDate) {
      const score = habits[i].woke_early + habits[i].exercised + habits[i].meditated +
        habits[i].ate_healthy + habits[i].took_herbs + habits[i].drank_water +
        habits[i].slept_on_time + habits[i].no_junk_food;
      if (score >= 4) streak++; // At least 4/8 habits = counts as a day
      else break;
    } else {
      break;
    }
  }
  return streak;
}

module.exports = { router, initTrackerTables };
