const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/achievements — Get user's achievements
router.get('/', (req, res) => {
  const db = getDb();

  // Calculate achievements based on activity
  const totalLogs = db.prepare('SELECT COUNT(*) as c FROM symptom_logs').get()?.c || 0;
  const totalHabits = db.prepare('SELECT COUNT(*) as c FROM daily_habits').get()?.c || 0;
  const herbsViewed = 10; // placeholder — track in future

  const achievements = [
    { id: 'first_log', icon: '📝', title: 'First Step', desc: 'Logged your first symptom', unlocked: totalLogs >= 1 },
    { id: 'week_streak', icon: '🔥', title: '7-Day Warrior', desc: 'Tracked symptoms for 7 consecutive days', unlocked: totalLogs >= 7 },
    { id: 'month_streak', icon: '💪', title: '30-Day Champion', desc: 'Tracked for 30 days', unlocked: totalLogs >= 30 },
    { id: 'habit_starter', icon: '✅', title: 'Habit Builder', desc: 'Logged daily habits for the first time', unlocked: totalHabits >= 1 },
    { id: 'habit_week', icon: '⭐', title: 'Consistent Soul', desc: '7 days of habit tracking', unlocked: totalHabits >= 7 },
    { id: 'herb_explorer', icon: '🌿', title: 'Herb Explorer', desc: 'Explored 10+ herbs in encyclopedia', unlocked: herbsViewed >= 10 },
    { id: 'dosha_known', icon: '🧘', title: 'Know Thyself', desc: 'Completed the Dosha Quiz', unlocked: true }, // assume done
    { id: 'protocol_follower', icon: '📋', title: 'Discipline Master', desc: 'Followed protocol 7 days in a row', unlocked: totalLogs >= 7 },
    { id: 'kitchen_healer', icon: '🏠', title: 'Kitchen Healer', desc: 'Used Kitchen Pharmacy feature', unlocked: true },
    { id: 'improving', icon: '📉', title: 'Getting Better!', desc: 'Symptom severity decreased over 2 weeks', unlocked: checkImprovement(db) },
    { id: 'share_first', icon: '📤', title: 'Spread Wellness', desc: 'Shared a remedy with someone', unlocked: false },
    { id: 'premium_member', icon: '👑', title: 'Premium Healer', desc: 'Upgraded to Premium', unlocked: false }
  ];

  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;

  res.json({
    achievements,
    stats: { unlocked, total, percentage: Math.round((unlocked / total) * 100) }
  });
});

function checkImprovement(db) {
  try {
    const logs = db.prepare('SELECT severity FROM symptom_logs ORDER BY date DESC LIMIT 14').all();
    if (logs.length < 7) return false;
    const recent = logs.slice(0, 3).reduce((a, b) => a + b.severity, 0) / 3;
    const older = logs.slice(-3).reduce((a, b) => a + b.severity, 0) / 3;
    return recent < older - 1;
  } catch { return false; }
}

module.exports = router;
