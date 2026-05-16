const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');

// GET /api/insights/report — Generate personalized health intelligence report
router.get('/report', (req, res) => {
  const db = getDb();

  // Get all symptom logs
  const logs = db.prepare('SELECT * FROM symptom_logs ORDER BY date DESC LIMIT 90').all();
  const habits = db.prepare('SELECT * FROM daily_habits ORDER BY date DESC LIMIT 90').all();

  if (logs.length < 5) {
    return res.json({
      ready: false,
      message: 'Need at least 5 days of tracking data to generate insights. Keep logging daily!',
      days_logged: logs.length,
      days_needed: 5
    });
  }

  // Run all analysis engines
  const trendAnalysis = analyzeTrend(logs);
  const correlations = findCorrelations(logs, habits);
  const patterns = detectPatterns(logs, habits);
  const predictions = generatePredictions(logs, habits);
  const weeklyScore = calculateWeeklyScore(logs, habits);
  const recommendations = generateSmartRecommendations(logs, habits, correlations, patterns);

  res.json({
    ready: true,
    generated_at: new Date().toISOString(),
    days_analyzed: logs.length,
    weekly_score: weeklyScore,
    trend: trendAnalysis,
    correlations: correlations,
    patterns: patterns,
    predictions: predictions,
    recommendations: recommendations,
    next_report: 'Log daily for more accurate insights. Report updates with every new entry.'
  });
});

// GET /api/insights/correlations — Detailed correlation analysis
router.get('/correlations', (req, res) => {
  const db = getDb();
  const logs = db.prepare('SELECT * FROM symptom_logs ORDER BY date DESC LIMIT 60').all();
  const habits = db.prepare('SELECT * FROM daily_habits ORDER BY date DESC LIMIT 60').all();

  if (logs.length < 7) {
    return res.json({ ready: false, message: 'Need 7+ days of data' });
  }

  const correlations = findDetailedCorrelations(logs, habits);
  res.json({ ready: true, correlations });
});

// GET /api/insights/predict — Predict tomorrow's severity
router.get('/predict', (req, res) => {
  const db = getDb();
  const logs = db.prepare('SELECT * FROM symptom_logs ORDER BY date DESC LIMIT 14').all();
  const habits = db.prepare('SELECT * FROM daily_habits ORDER BY date DESC LIMIT 14').all();

  if (logs.length < 7) {
    return res.json({ ready: false, message: 'Need 7+ days for predictions' });
  }

  const prediction = predictTomorrow(logs, habits);
  res.json({ ready: true, prediction });
});

// ============ ANALYSIS ENGINES ============

function analyzeTrend(logs) {
  if (logs.length < 3) return { direction: 'insufficient_data' };

  const recent7 = logs.slice(0, 7);
  const older7 = logs.slice(7, 14);

  const recentAvg = average(recent7.map(l => l.severity));
  const olderAvg = older7.length >= 3 ? average(older7.map(l => l.severity)) : recentAvg;

  const change = recentAvg - olderAvg;
  const changePercent = olderAvg > 0 ? Math.round((change / olderAvg) * 100) : 0;

  let direction, message;
  if (change < -1) {
    direction = 'improving';
    message = `Your symptoms have improved by ${Math.abs(changePercent)}% in the last week. Your protocol is working!`;
  } else if (change > 1) {
    direction = 'worsening';
    message = `Your symptoms increased by ${changePercent}% recently. Let's identify what changed.`;
  } else {
    direction = 'stable';
    message = 'Your symptoms are stable. Consistency will bring gradual improvement.';
  }

  return {
    direction,
    message,
    recent_avg: recentAvg.toFixed(1),
    previous_avg: olderAvg.toFixed(1),
    change_percent: changePercent,
    best_day: { severity: Math.min(...logs.map(l => l.severity)), date: logs.find(l => l.severity === Math.min(...logs.map(x => x.severity)))?.date },
    worst_day: { severity: Math.max(...logs.map(l => l.severity)), date: logs.find(l => l.severity === Math.max(...logs.map(x => x.severity)))?.date }
  };
}

function findCorrelations(logs, habits) {
  const correlations = [];

  if (habits.length < 5 || logs.length < 5) return correlations;

  // Create date-indexed maps
  const logMap = {};
  logs.forEach(l => { logMap[l.date] = l; });
  const habitMap = {};
  habits.forEach(h => { habitMap[h.date] = h; });

  // Find dates where both exist
  const commonDates = Object.keys(logMap).filter(d => habitMap[d]);
  if (commonDates.length < 5) return correlations;

  // Analyze each habit's correlation with severity
  const habitKeys = ['woke_early', 'exercised', 'meditated', 'ate_healthy', 'took_herbs', 'drank_water', 'slept_on_time', 'no_junk_food'];
  const habitLabels = {
    woke_early: 'Waking early',
    exercised: 'Exercise/Yoga',
    meditated: 'Meditation/Pranayama',
    ate_healthy: 'Eating healthy',
    took_herbs: 'Taking herbs',
    drank_water: 'Drinking enough water',
    slept_on_time: 'Sleeping on time',
    no_junk_food: 'Avoiding junk food'
  };

  for (const habit of habitKeys) {
    const withHabit = commonDates.filter(d => habitMap[d][habit]).map(d => logMap[d].severity);
    const withoutHabit = commonDates.filter(d => !habitMap[d][habit]).map(d => logMap[d].severity);

    if (withHabit.length >= 2 && withoutHabit.length >= 2) {
      const avgWith = average(withHabit);
      const avgWithout = average(withoutHabit);
      const impact = avgWithout - avgWith; // positive = habit helps

      if (Math.abs(impact) > 0.5) {
        correlations.push({
          habit: habitLabels[habit],
          habit_key: habit,
          impact: impact.toFixed(1),
          direction: impact > 0 ? 'helps' : 'hurts',
          confidence: Math.min(commonDates.length * 10, 95) + '%',
          insight: impact > 0
            ? `When you ${habitLabels[habit].toLowerCase()}, your symptoms are ${impact.toFixed(1)} points lower on average.`
            : `${habitLabels[habit]} seems to correlate with higher symptoms. This is unusual — may need investigation.`,
          avg_with: avgWith.toFixed(1),
          avg_without: avgWithout.toFixed(1),
          sample_size: commonDates.length
        });
      }
    }
  }

  // Sort by impact (most helpful first)
  correlations.sort((a, b) => parseFloat(b.impact) - parseFloat(a.impact));

  // Protocol adherence correlation
  const followedDays = commonDates.filter(d => logMap[d].followed_protocol).map(d => logMap[d].severity);
  const notFollowedDays = commonDates.filter(d => !logMap[d].followed_protocol).map(d => logMap[d].severity);

  if (followedDays.length >= 2 && notFollowedDays.length >= 2) {
    const protocolImpact = average(notFollowedDays) - average(followedDays);
    if (protocolImpact > 0) {
      correlations.unshift({
        habit: '📋 Following your healing protocol',
        habit_key: 'protocol',
        impact: protocolImpact.toFixed(1),
        direction: 'helps',
        confidence: Math.min(commonDates.length * 10, 95) + '%',
        insight: `Following your protocol reduces symptoms by ${protocolImpact.toFixed(1)} points on average. This is your strongest lever!`,
        avg_with: average(followedDays).toFixed(1),
        avg_without: average(notFollowedDays).toFixed(1),
        sample_size: commonDates.length
      });
    }
  }

  return correlations;
}

function detectPatterns(logs, habits) {
  const patterns = [];

  if (logs.length < 7) return patterns;

  // Day-of-week pattern
  const dayMap = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  const byDay = {};
  logs.forEach(l => {
    const day = new Date(l.date).getDay();
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(l.severity);
  });

  let worstDay = null, bestDay = null, worstAvg = 0, bestAvg = 10;
  for (const [day, severities] of Object.entries(byDay)) {
    if (severities.length >= 2) {
      const avg = average(severities);
      if (avg > worstAvg) { worstAvg = avg; worstDay = dayMap[day]; }
      if (avg < bestAvg) { bestAvg = avg; bestDay = dayMap[day]; }
    }
  }

  if (worstDay && bestDay && worstAvg - bestAvg > 1) {
    patterns.push({
      type: 'day_of_week',
      icon: '📅',
      title: 'Weekly Pattern Detected',
      insight: `Your symptoms are worst on ${worstDay}s (avg ${worstAvg.toFixed(1)}/10) and best on ${bestDay}s (avg ${bestAvg.toFixed(1)}/10).`,
      suggestion: `Investigate what's different about ${worstDay}s — work stress? Diet change? Less sleep the night before?`
    });
  }

  // Mood-severity correlation
  const moodSeverity = {};
  logs.forEach(l => {
    if (l.mood) {
      if (!moodSeverity[l.mood]) moodSeverity[l.mood] = [];
      moodSeverity[l.mood].push(l.severity);
    }
  });

  const moodAvgs = Object.entries(moodSeverity).map(([mood, sevs]) => ({ mood, avg: average(sevs) })).sort((a, b) => a.avg - b.avg);
  if (moodAvgs.length >= 2) {
    const best = moodAvgs[0];
    const worst = moodAvgs[moodAvgs.length - 1];
    if (worst.avg - best.avg > 1.5) {
      patterns.push({
        type: 'mood_correlation',
        icon: '😊',
        title: 'Mood-Symptom Connection',
        insight: `When your mood is "${best.mood}", symptoms average ${best.avg.toFixed(1)}/10. When "${worst.mood}", they jump to ${worst.avg.toFixed(1)}/10.`,
        suggestion: 'Your emotional state directly affects physical symptoms. Prioritize stress management and pranayama.'
      });
    }
  }

  // Sleep correlation
  const withSleep = logs.filter(l => l.sleep_hours);
  if (withSleep.length >= 5) {
    const goodSleep = withSleep.filter(l => l.sleep_hours >= 7).map(l => l.severity);
    const poorSleep = withSleep.filter(l => l.sleep_hours < 6).map(l => l.severity);

    if (goodSleep.length >= 2 && poorSleep.length >= 2) {
      const diff = average(poorSleep) - average(goodSleep);
      if (diff > 1) {
        patterns.push({
          type: 'sleep_impact',
          icon: '😴',
          title: 'Sleep Strongly Affects You',
          insight: `Poor sleep (<6hrs) makes your symptoms ${diff.toFixed(1)} points worse than good sleep (7+hrs).`,
          suggestion: 'Sleep is your #1 healing tool. Prioritize 7-8 hours. Take Ashwagandha + warm milk at bedtime.'
        });
      }
    }
  }

  // Streak impact
  const consecutiveGood = findConsecutiveGoodDays(logs);
  if (consecutiveGood >= 3) {
    patterns.push({
      type: 'consistency',
      icon: '🔥',
      title: 'Consistency Pays Off',
      insight: `Your longest streak of improvement was ${consecutiveGood} consecutive days. Consistency is your superpower.`,
      suggestion: 'Ayurveda rewards consistency above all. Even small daily actions compound over weeks.'
    });
  }

  return patterns;
}

function generatePredictions(logs, habits) {
  if (logs.length < 7) return null;

  const recent3 = logs.slice(0, 3).map(l => l.severity);
  const trend = recent3[0] - recent3[2]; // negative = improving
  const recentAvg = average(recent3);

  // Simple prediction based on trend + habits
  let predicted = recentAvg + (trend * 0.3); // momentum
  predicted = Math.max(1, Math.min(10, predicted));

  // Adjust based on today's habits
  const todayHabit = habits[0];
  if (todayHabit) {
    const habitScore = todayHabit.woke_early + todayHabit.exercised + todayHabit.meditated +
      todayHabit.ate_healthy + todayHabit.took_herbs + todayHabit.drank_water +
      todayHabit.slept_on_time + todayHabit.no_junk_food;
    if (habitScore >= 6) predicted -= 0.5; // good habits = better tomorrow
    if (habitScore <= 3) predicted += 0.5; // poor habits = worse tomorrow
  }

  predicted = Math.max(1, Math.min(10, Math.round(predicted * 10) / 10));

  return {
    tomorrow_predicted: predicted,
    confidence: Math.min(logs.length * 5, 80) + '%',
    based_on: `${logs.length} days of your personal data`,
    message: predicted <= 4
      ? `Looking good! Predicted severity: ${predicted}/10. Keep following your protocol.`
      : predicted <= 6
        ? `Moderate day expected (${predicted}/10). Focus on your top habits today.`
        : `Higher severity predicted (${predicted}/10). Extra self-care recommended today.`,
    improve_by: 'Following your protocol, sleeping 7+ hours, and avoiding triggers can improve tomorrow by 1-2 points.'
  };
}

function calculateWeeklyScore(logs, habits) {
  const thisWeek = logs.filter(l => {
    const d = new Date(l.date);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 7;
  });

  const thisWeekHabits = habits.filter(h => {
    const d = new Date(h.date);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 7;
  });

  if (thisWeek.length === 0) return { score: 0, message: 'No data this week' };

  // Score = inverse of severity (lower severity = higher score) + habit adherence
  const avgSeverity = average(thisWeek.map(l => l.severity));
  const symptomScore = Math.round((10 - avgSeverity) * 10); // 0-100

  let habitScore = 0;
  if (thisWeekHabits.length > 0) {
    const totalPossible = thisWeekHabits.length * 8;
    const totalDone = thisWeekHabits.reduce((sum, h) =>
      sum + h.woke_early + h.exercised + h.meditated + h.ate_healthy + h.took_herbs + h.drank_water + h.slept_on_time + h.no_junk_food, 0);
    habitScore = Math.round((totalDone / totalPossible) * 100);
  }

  const overallScore = Math.round((symptomScore * 0.6) + (habitScore * 0.4));

  return {
    score: overallScore,
    symptom_score: symptomScore,
    habit_score: habitScore,
    days_logged: thisWeek.length,
    message: overallScore >= 80 ? '🌟 Excellent week! You\'re healing beautifully.'
      : overallScore >= 60 ? '👍 Good week. Keep the momentum going.'
        : overallScore >= 40 ? '📈 Room for improvement. Focus on consistency.'
          : '💪 Tough week. Don\'t give up — healing takes time.',
    grade: overallScore >= 80 ? 'A' : overallScore >= 60 ? 'B' : overallScore >= 40 ? 'C' : 'D'
  };
}

function generateSmartRecommendations(logs, habits, correlations, patterns) {
  const recs = [];

  // Based on correlations — recommend top 3 habits
  const helpfulHabits = correlations.filter(c => c.direction === 'helps').slice(0, 3);
  if (helpfulHabits.length > 0) {
    recs.push({
      priority: 'high',
      icon: '🎯',
      title: 'Your Top Healing Habits',
      message: `Based on YOUR data, these habits help you most:`,
      items: helpfulHabits.map(h => `${h.habit} (reduces symptoms by ${h.impact} points)`)
    });
  }

  // Based on trend
  const recentSeverity = logs.length > 0 ? logs[0].severity : 5;
  if (recentSeverity >= 7) {
    recs.push({
      priority: 'high',
      icon: '🚨',
      title: 'Severity is High',
      message: 'Your symptoms are elevated. Consider:',
      items: ['Strict protocol adherence today', 'Extra rest and warm food', 'Pranayama (Anulom Vilom 15 min)', 'Avoid all triggers', 'Consider consulting a practitioner if this persists']
    });
  }

  // Based on patterns
  const sleepPattern = patterns.find(p => p.type === 'sleep_impact');
  if (sleepPattern) {
    recs.push({
      priority: 'medium',
      icon: '😴',
      title: 'Sleep is Key for You',
      message: sleepPattern.insight,
      items: ['Ashwagandha + warm milk at 9:30 PM', 'No screens after 9 PM', 'Foot massage with sesame oil', 'Target 7-8 hours minimum']
    });
  }

  // Protocol adherence check
  const recentLogs = logs.slice(0, 7);
  const adherence = recentLogs.filter(l => l.followed_protocol).length / recentLogs.length;
  if (adherence < 0.5) {
    recs.push({
      priority: 'high',
      icon: '📋',
      title: 'Protocol Adherence is Low',
      message: `You followed your protocol only ${Math.round(adherence * 100)}% of the last 7 days. This is the #1 reason for slow progress.`,
      items: ['Set daily reminders for herbs', 'Simplify: focus on just 2-3 key actions', 'Consistency > perfection — even partial adherence helps']
    });
  }

  // General wellness
  if (recs.length < 3) {
    recs.push({
      priority: 'low',
      icon: '💡',
      title: 'Daily Wellness Tip',
      message: getRandomTip(),
      items: []
    });
  }

  return recs;
}

function predictTomorrow(logs, habits) {
  return generatePredictions(logs, habits);
}

function findDetailedCorrelations(logs, habits) {
  return findCorrelations(logs, habits);
}

function findConsecutiveGoodDays(logs) {
  let streak = 0, maxStreak = 0;
  for (let i = 1; i < logs.length; i++) {
    if (logs[i - 1].severity <= logs[i].severity) { // same or better than previous
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  }
  return maxStreak;
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function getRandomTip() {
  const tips = [
    'Drink warm water first thing in the morning — it ignites Agni and flushes toxins.',
    'Eat your largest meal at lunch (12-1 PM) when digestive fire is strongest.',
    'Never eat when stressed or angry — emotions directly affect digestion.',
    'Oil massage (Abhyanga) 2-3 times/week calms Vata and nourishes all tissues.',
    'Chew each bite 32 times — digestion begins in the mouth.',
    'Walk 100 steps after each meal — ancient Ayurvedic rule for digestion.',
    'Sleep by 10 PM — the body repairs between 10 PM and 2 AM (Pitta time).',
    'Scrape your tongue every morning — removes overnight toxins (Ama).'
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

module.exports = router;
