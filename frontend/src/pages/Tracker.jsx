import React, { useState, useEffect } from 'react';

function Tracker() {
  const [tab, setTab] = useState('log');
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [followed, setFollowed] = useState(false);
  const [history, setHistory] = useState(null);
  const [habits, setHabits] = useState({});
  const [habitHistory, setHabitHistory] = useState(null);
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState(null);
  const [checkin, setCheckin] = useState(null);

  useEffect(() => {
    fetch('/api/symptoms').then(r => r.json()).then(setSymptoms);
    fetch('/api/tracker/habits/history').then(r => r.json()).then(setHabitHistory);
    fetch('/api/insights/report').then(r => r.json()).then(setInsights);
    fetch('/api/smart-log/check-in').then(r => r.json()).then(setCheckin);
  }, []);

  const logSymptom = async () => {
    if (!selectedSymptom) { setMessage('Please select a condition'); return; }
    const res = await fetch('/api/tracker/log', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ symptom_id: parseInt(selectedSymptom), severity, mood, notes, followed_protocol: followed })
    });
    const data = await res.json();
    setMessage(data.success ? '✅ Logged! Keep tracking daily for best results.' : data.error);
    // Load history
    loadHistory(selectedSymptom);
  };

  const loadHistory = (symId) => {
    if (!symId) return;
    fetch(`/api/tracker/history/${symId}`).then(r => r.json()).then(setHistory);
  };

  const logHabits = async () => {
    const res = await fetch('/api/tracker/habits', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(habits)
    });
    const data = await res.json();
    setMessage(`✅ Habits logged! Streak: ${data.streak} days 🔥`);
    fetch('/api/tracker/habits/history').then(r => r.json()).then(setHabitHistory);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '6px' }}>📊 Health Tracker</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Track your symptoms daily — see your healing progress over time</p>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'log' ? 'active' : ''}`} onClick={() => setTab('log')}>📝 Log</button>
        <button className={`tab ${tab === 'habits' ? 'active' : ''}`} onClick={() => setTab('habits')}>✅ Habits</button>
        <button className={`tab ${tab === 'insights' ? 'active' : ''}`} onClick={() => setTab('insights')}>🧠 Insights</button>
        <button className={`tab ${tab === 'progress' ? 'active' : ''}`} onClick={() => setTab('progress')}>📈 Progress</button>
      </div>

      {/* Daily Check-in Banner */}
      {checkin && tab === 'log' && (
        <div className="card" style={{ background: 'var(--border-light)', borderColor: 'var(--border)', marginBottom: '16px' }}>
          <p style={{ fontWeight: 700 }}>{checkin.greeting}</p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginTop: '4px' }}>{checkin.prompt}</p>
          {checkin.yesterday_summary && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>📊 {checkin.yesterday_summary}</p>}
          <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px' }}>💡 {checkin.tip}</p>
        </div>
      )}

      {message && (
        <div className="card" style={{ background: 'var(--border-light)', borderColor: 'var(--border)', marginBottom: '16px', padding: '12px 16px' }}>
          <p style={{ fontSize: '0.9rem' }}>{message}</p>
        </div>
      )}

      {/* LOG TAB */}
      {tab === 'log' && (
        <div className="card">
          <h4 style={{ marginBottom: '16px' }}>How are you feeling today?</h4>

          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Condition you're tracking:</label>
          <select value={selectedSymptom} onChange={e => { setSelectedSymptom(e.target.value); loadHistory(e.target.value); }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid var(--border)', marginBottom: '16px', fontSize: '0.9rem', background: 'var(--bg)', color: 'var(--text)' }}>
            <option value="">Select your condition...</option>
            {symptoms.map(s => <option key={s.id} value={s.id}>{s.name} ({s.name_hi})</option>)}
          </select>

          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Severity today: <span style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{severity}/10</span>
            <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {severity <= 3 ? '(Mild)' : severity <= 6 ? '(Moderate)' : '(Severe)'}
            </span>
          </label>
          <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: '16px', accentColor: 'var(--primary)' }} />

          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Mood:</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[{v:'great',e:'😊'},{v:'good',e:'🙂'},{v:'okay',e:'😐'},{v:'bad',e:'😟'},{v:'terrible',e:'😫'}].map(m => (
              <button key={m.v} onClick={() => setMood(m.v)}
                style={{ padding: '8px 14px', borderRadius: '20px', border: mood === m.v ? '2px solid var(--primary)' : '1.5px solid var(--border)', background: mood === m.v ? 'var(--border-light)' : 'var(--bg-card)', cursor: 'pointer', fontSize: '0.85rem' }}>
                {m.e} {m.v}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' }}>
            <input type="checkbox" checked={followed} onChange={e => setFollowed(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem' }}>I followed my healing protocol today</span>
          </label>

          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Notes (optional):</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you eat? Any triggers? How was your day?"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid var(--border)', minHeight: '60px', fontSize: '0.88rem', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)' }} />

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={logSymptom}>
            📝 Log Today's Entry
          </button>
        </div>
      )}

      {/* HABITS TAB */}
      {tab === 'habits' && (
        <div>
          <div className="card">
            <h4 style={{ marginBottom: '14px' }}>Daily Ayurvedic Habits Checklist</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Check what you did today. Aim for 6/8 daily!</p>

            {[
              { key: 'woke_early', label: '🌅 Woke up before 6:30 AM' },
              { key: 'exercised', label: '🏃 Exercised / Yoga (20+ min)' },
              { key: 'meditated', label: '🧘 Meditated / Pranayama (5+ min)' },
              { key: 'ate_healthy', label: '🥗 Ate fresh, home-cooked food' },
              { key: 'took_herbs', label: '🌿 Took prescribed herbs' },
              { key: 'drank_water', label: '💧 Drank 8+ glasses water' },
              { key: 'slept_on_time', label: '😴 Slept before 10:30 PM' },
              { key: 'no_junk_food', label: '🚫 No junk food / sugar / processed' }
            ].map(h => (
              <label key={h.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                <input type="checkbox" checked={habits[h.key] || false} onChange={e => setHabits({...habits, [h.key]: e.target.checked})}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: '0.9rem' }}>{h.label}</span>
              </label>
            ))}

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={logHabits}>
              ✅ Save Today's Habits
            </button>
          </div>

          {habitHistory && (
            <div className="card" style={{ marginTop: '16px' }}>
              <h4>Your Stats</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '12px' }}>
                <StatBox label="Streak" value={`${habitHistory.stats.streak} 🔥`} />
                <StatBox label="Days Tracked" value={habitHistory.stats.total_days} />
                <StatBox label="Avg Score" value={habitHistory.stats.avg_score} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* INSIGHTS TAB */}
      {tab === 'insights' && (
        <div>
          {!insights || !insights.ready ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🧠</p>
              <h4>Health Intelligence Report</h4>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                {insights?.message || 'Start logging daily symptoms and habits to unlock personalized insights.'}
              </p>
              {insights?.days_logged !== undefined && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ background: 'var(--border-light)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--primary)', height: '100%', width: `${(insights.days_logged / insights.days_needed) * 100}%`, borderRadius: '8px' }} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>{insights.days_logged}/{insights.days_needed} days logged</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Weekly Score */}
              <div className="card" style={{ textAlign: 'center', background: 'var(--border-light)' }}>
                <p style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{insights.weekly_score.score}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>Weekly Health Score ({insights.weekly_score.grade})</p>
                <p style={{ color: 'var(--text-light)', marginTop: '4px', fontSize: '0.88rem' }}>{insights.weekly_score.message}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                  <MiniStat label="Symptoms" value={insights.weekly_score.symptom_score + '%'} />
                  <MiniStat label="Habits" value={insights.weekly_score.habit_score + '%'} />
                  <MiniStat label="Days" value={insights.weekly_score.days_logged} />
                </div>
              </div>

              {/* Trend */}
              <div className="card">
                <h4>{insights.trend.direction === 'improving' ? '📉' : insights.trend.direction === 'worsening' ? '📈' : '➡️'} Trend</h4>
                <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>{insights.trend.message}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <MiniStat label="This week avg" value={insights.trend.recent_avg + '/10'} />
                  <MiniStat label="Last week avg" value={insights.trend.previous_avg + '/10'} />
                  <MiniStat label="Change" value={insights.trend.change_percent + '%'} />
                </div>
              </div>

              {/* Predictions */}
              {insights.predictions && (
                <div className="card" style={{ borderLeft: '4px solid var(--primary-light)' }}>
                  <h4>🔮 Tomorrow's Prediction</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '6px' }}>{insights.predictions.tomorrow_predicted}/10</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginTop: '4px' }}>{insights.predictions.message}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>Confidence: {insights.predictions.confidence} • Based on {insights.predictions.based_on}</p>
                </div>
              )}

              {/* Correlations */}
              {insights.correlations?.length > 0 && (
                <div className="card">
                  <h4>🔗 What Affects YOUR Symptoms</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Based on YOUR personal data — not generic advice</p>
                  {insights.correlations.map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.88rem' }}>{c.habit}</strong>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{c.insight}</p>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '60px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: c.direction === 'helps' ? '#16a34a' : '#dc2626' }}>
                          {c.direction === 'helps' ? '↓' : '↑'}{c.impact}
                        </span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.confidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Patterns */}
              {insights.patterns?.length > 0 && (
                <div className="card">
                  <h4>🔍 Patterns Detected</h4>
                  {insights.patterns.map((p, i) => (
                    <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.icon} {p.title}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>{p.insight}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--primary)', marginTop: '4px' }}>💡 {p.suggestion}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {insights.recommendations?.length > 0 && (
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                  <h4>🎯 Personalized Recommendations</h4>
                  {insights.recommendations.map((r, i) => (
                    <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.icon} {r.title}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>{r.message}</p>
                      {r.items?.length > 0 && (
                        <ul style={{ paddingLeft: '16px', marginTop: '6px' }}>
                          {r.items.map((item, j) => <li key={j} style={{ fontSize: '0.82rem', marginBottom: '4px' }}>{item}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                Report based on {insights.days_analyzed} days of YOUR data. Accuracy improves with more logging.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PROGRESS TAB */}
      {tab === 'progress' && (
        <div>
          {!history ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Select a condition in the "Log Today" tab and start tracking to see progress here.</p>
            </div>
          ) : (
            <div>
              <div className="card">
                <h4>Progress Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                  <StatBox label="Avg Severity" value={`${history.stats.avg_severity}/10`} />
                  <StatBox label="Trend" value={history.stats.trend === 'improving' ? '📉 Improving!' : history.stats.trend === 'worsening' ? '📈 Worsening' : '➡️ Stable'} />
                  <StatBox label="Best Day" value={`${history.stats.best_day}/10`} />
                  <StatBox label="Protocol Adherence" value={`${history.stats.protocol_adherence}%`} />
                </div>
              </div>

              <div className="card" style={{ marginTop: '16px' }}>
                <h4 style={{ marginBottom: '12px' }}>Daily Log ({history.logs.length} entries)</h4>
                {history.logs.map((log, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{log.date}</span>
                      {log.mood && <span style={{ marginLeft: '8px' }}>{log.mood === 'great' ? '😊' : log.mood === 'good' ? '🙂' : log.mood === 'okay' ? '😐' : log.mood === 'bad' ? '😟' : '😫'}</span>}
                      {log.followed_protocol ? <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary-dark)' }}>✓ protocol</span> : null}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '60px', height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${log.severity * 10}%`, height: '100%', background: log.severity <= 3 ? '#22c55e' : log.severity <= 6 ? '#f59e0b' : '#ef4444', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '30px' }}>{log.severity}/10</span>
                    </div>
                  </div>
                ))}
              </div>

              {history.stats.trend === 'improving' && (
                <div className="card" style={{ marginTop: '16px', background: 'var(--border-light)', borderColor: 'var(--border)', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem' }}>🎉</p>
                  <p style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>You're improving!</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', marginTop: '4px' }}>Keep following your protocol. Consistency is key in Ayurveda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px', background: 'var(--border-light)', borderRadius: '10px' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

export default Tracker;
