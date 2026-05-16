const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// ===== SMART LOGGING — Conversational + Quick =====
// Instead of forms, user just types naturally or taps quick buttons

// POST /api/smart-log/quick — One-tap logging (takes 3 seconds)
router.post('/quick', (req, res) => {
  const db = getDb();
  const { symptom_id, severity } = req.body;
  const today = new Date().toISOString().split('T')[0];

  if (!symptom_id || !severity) {
    return res.status(400).json({ error: 'symptom_id and severity required' });
  }

  // Upsert today's log
  const existing = db.prepare('SELECT id FROM symptom_logs WHERE symptom_id = ? AND date = ?').get(symptom_id, today);
  if (existing) {
    db.prepare('UPDATE symptom_logs SET severity = ? WHERE id = ?').run(severity, existing.id);
  } else {
    db.prepare('INSERT INTO symptom_logs (symptom_id, date, severity) VALUES (?, ?, ?)').run(symptom_id, today, severity);
  }
  db.save();

  // Return motivational response + streak
  const streak = calculateStreak(db, symptom_id);
  const trend = getQuickTrend(db, symptom_id);

  res.json({
    success: true,
    streak,
    trend,
    message: getMotivationalMessage(severity, streak, trend)
  });
});

// POST /api/smart-log/natural — Parse natural language log
router.post('/natural', (req, res) => {
  const db = getDb();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  const parsed = parseNaturalLog(text);
  const today = new Date().toISOString().split('T')[0];

  if (parsed.symptom_id && parsed.severity) {
    const existing = db.prepare('SELECT id FROM symptom_logs WHERE symptom_id = ? AND date = ?').get(parsed.symptom_id, today);
    if (existing) {
      db.prepare('UPDATE symptom_logs SET severity = ?, notes = ?, mood = ? WHERE id = ?').run(parsed.severity, parsed.notes, parsed.mood, existing.id);
    } else {
      db.prepare('INSERT INTO symptom_logs (symptom_id, date, severity, notes, mood) VALUES (?, ?, ?, ?, ?)').run(parsed.symptom_id, today, parsed.severity, parsed.notes, parsed.mood);
    }
    db.save();

    return res.json({
      success: true,
      parsed,
      message: `Got it! Logged ${parsed.symptom_name} as ${parsed.severity}/10 for today.`
    });
  }

  res.json({
    success: false,
    message: 'I couldn\'t understand that. Try: "acidity is 6 today" or "back pain mild today"'
  });
});

// GET /api/smart-log/check-in — Daily check-in prompt (what to ask user)
router.get('/check-in', (req, res) => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  // What has user been tracking?
  const tracked = db.prepare('SELECT DISTINCT symptom_id FROM symptom_logs').all();
  const todayLogs = db.prepare('SELECT symptom_id FROM symptom_logs WHERE date = ?').all(today);
  const todayHabits = db.prepare('SELECT * FROM daily_habits WHERE date = ?').get(today);

  const notLoggedToday = tracked.filter(t => !todayLogs.find(l => l.symptom_id === t.symptom_id));

  // Get symptom names for unlogged
  const pending = notLoggedToday.map(t => {
    const sym = db.prepare('SELECT name, name_hi FROM symptoms WHERE id = ?').get(t.symptom_id);
    return { symptom_id: t.symptom_id, name: sym?.name, name_hi: sym?.name_hi };
  });

  // Time-based greeting
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) greeting = 'Good morning! 🌅';
  else if (hour < 17) greeting = 'Good afternoon! ☀️';
  else greeting = 'Good evening! 🌙';

  // Smart prompt based on what's missing
  let prompt;
  if (todayLogs.length === 0 && tracked.length > 0) {
    prompt = 'You haven\'t logged today yet. How are your symptoms?';
  } else if (pending.length > 0) {
    prompt = `You've logged some symptoms. Still need: ${pending.map(p => p.name).join(', ')}`;
  } else if (!todayHabits) {
    prompt = 'Symptoms logged ✓ Now check off your daily habits!';
  } else {
    prompt = 'All done for today! 🎉 Come back tomorrow.';
  }

  // Get yesterday's data for comparison
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const yesterdayLogs = db.prepare('SELECT sl.severity, s.name FROM symptom_logs sl JOIN symptoms s ON s.id = sl.symptom_id WHERE sl.date = ?').all(yesterday);

  res.json({
    greeting,
    prompt,
    pending_symptoms: pending,
    habits_logged: !!todayHabits,
    symptoms_logged: todayLogs.length,
    yesterday_summary: yesterdayLogs.length > 0
      ? `Yesterday: ${yesterdayLogs.map(l => `${l.name} ${l.severity}/10`).join(', ')}`
      : null,
    tip: getTimeTip(hour)
  });
});

// GET /api/smart-log/nudge — Smart nudge based on user behavior
router.get('/nudge', (req, res) => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  const logs = db.prepare('SELECT * FROM symptom_logs ORDER BY date DESC LIMIT 14').all();
  const habits = db.prepare('SELECT * FROM daily_habits ORDER BY date DESC LIMIT 7').all();

  // Determine what nudge to give
  let nudge;

  if (logs.length === 0) {
    nudge = { type: 'start', icon: '🌱', title: 'Start Your Healing Journey', message: 'Log your first symptom to begin tracking. It takes 10 seconds!', action: 'Log Now' };
  } else if (logs[0]?.date !== today) {
    const daysMissed = Math.floor((Date.now() - new Date(logs[0].date)) / 86400000);
    if (daysMissed === 1) {
      nudge = { type: 'missed_1', icon: '👋', title: 'Missed Yesterday', message: 'No worries! Log today to keep your data continuous. Gaps reduce insight accuracy.', action: 'Log Today' };
    } else {
      nudge = { type: 'missed_many', icon: '💪', title: `${daysMissed} Days Since Last Log`, message: 'Welcome back! Restart your tracking — even a few days of data gives useful insights.', action: 'Restart Tracking' };
    }
  } else if (logs.length >= 7) {
    // Has enough data — give insight teaser
    const recent = logs.slice(0, 7).map(l => l.severity);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (avg <= 4) {
      nudge = { type: 'doing_well', icon: '🌟', title: 'You\'re Doing Great!', message: `Average severity this week: ${avg.toFixed(1)}/10. Your protocol is working. Keep going!`, action: 'View Insights' };
    } else {
      nudge = { type: 'needs_attention', icon: '🔍', title: 'Check Your Insights', message: `Average severity: ${avg.toFixed(1)}/10. Your insights report has personalized recommendations.`, action: 'View Insights' };
    }
  } else {
    const daysLeft = 7 - logs.length;
    nudge = { type: 'building', icon: '📊', title: `${daysLeft} More Days for Full Insights`, message: `You have ${logs.length} days logged. At 7 days, you unlock pattern detection and predictions!`, action: 'Log Today' };
  }

  res.json({ nudge });
});

// ===== HELPER FUNCTIONS =====

function parseNaturalLog(text) {
  const lower = text.toLowerCase();
  const result = { severity: null, symptom_id: null, symptom_name: null, mood: null, notes: text };

  // Detect severity from words
  if (/(very bad|terrible|worst|extreme|10|9|unbearable)/.test(lower)) result.severity = 9;
  else if (/(bad|severe|high|8|7)/.test(lower)) result.severity = 7;
  else if (/(moderate|medium|okay|6|5|so-so)/.test(lower)) result.severity = 5;
  else if (/(mild|slight|little|low|3|4|better)/.test(lower)) result.severity = 3;
  else if (/(none|gone|zero|great|no pain|1|2|cured)/.test(lower)) result.severity = 1;

  // Try to extract number directly
  const numMatch = lower.match(/(\d+)\s*\/?\s*10/);
  if (numMatch) result.severity = Math.min(10, Math.max(1, parseInt(numMatch[1])));

  // Detect symptom
  const symptomKeywords = {
    1: ['acidity', 'acid', 'heartburn'], 2: ['back pain', 'back'], 3: ['sleep', 'insomnia'],
    4: ['stress', 'anxiety'], 5: ['hair'], 6: ['headache', 'migraine', 'head'],
    7: ['constipation'], 8: ['weight', 'fat'], 9: ['joint', 'knee'],
    10: ['skin', 'acne'], 11: ['cold', 'cough'], 12: ['sugar', 'diabetes'],
    13: ['period', 'pcos'], 14: ['energy', 'tired'], 15: ['eye']
  };

  for (const [id, keywords] of Object.entries(symptomKeywords)) {
    if (keywords.some(k => lower.includes(k))) {
      result.symptom_id = parseInt(id);
      result.symptom_name = keywords[0];
      break;
    }
  }

  // Detect mood
  if (/(happy|great|good|awesome)/.test(lower)) result.mood = 'great';
  else if (/(okay|fine|alright)/.test(lower)) result.mood = 'okay';
  else if (/(bad|sad|low|terrible)/.test(lower)) result.mood = 'bad';

  return result;
}

function calculateStreak(db, symptomId) {
  const logs = db.prepare('SELECT date FROM symptom_logs WHERE symptom_id = ? ORDER BY date DESC LIMIT 30').all(symptomId);
  let streak = 0;
  for (let i = 0; i < logs.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (logs[i]?.date === expected.toISOString().split('T')[0]) streak++;
    else break;
  }
  return streak;
}

function getQuickTrend(db, symptomId) {
  const logs = db.prepare('SELECT severity FROM symptom_logs WHERE symptom_id = ? ORDER BY date DESC LIMIT 7').all(symptomId);
  if (logs.length < 3) return 'building';
  const recent = logs.slice(0, 3).reduce((a, b) => a + b.severity, 0) / 3;
  const older = logs.slice(-3).reduce((a, b) => a + b.severity, 0) / 3;
  if (recent < older - 1) return 'improving';
  if (recent > older + 1) return 'worsening';
  return 'stable';
}

function getMotivationalMessage(severity, streak, trend) {
  if (streak >= 7 && trend === 'improving') return '🌟 7-day streak AND improving! You\'re crushing it!';
  if (streak >= 7) return `🔥 ${streak}-day streak! Consistency is your superpower.`;
  if (trend === 'improving') return '📉 Your symptoms are trending down. The protocol is working!';
  if (severity <= 3) return '😊 Low severity today — great job maintaining your health!';
  if (severity >= 7) return '💪 Tough day, but you logged it. That awareness itself is healing.';
  return '✅ Logged! Every data point makes your insights smarter.';
}

function getTimeTip(hour) {
  if (hour < 7) return '🌅 Early riser! This is Brahma Muhurta — best time for meditation and pranayama.';
  if (hour < 10) return '🍳 Have you had a warm breakfast? Agni is building — eat something nourishing.';
  if (hour < 13) return '☀️ Lunch should be your biggest meal — Agni peaks at noon.';
  if (hour < 16) return '🚶 A short walk after lunch aids digestion. Avoid sleeping now.';
  if (hour < 19) return '🧘 Evening is ideal for gentle yoga or a walk. Wind down.';
  if (hour < 21) return '🍽️ Keep dinner light. Eat at least 2 hours before sleep.';
  return '😴 Time to wind down. No screens, warm milk, sleep by 10:30.';
}

module.exports = router;
