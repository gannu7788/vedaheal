import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Assessment() {
  const { symptomId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [symptom, setSymptom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/assessment/questions/${symptomId}`).then(r => r.json()),
      fetch(`/api/symptoms/${symptomId}`).then(r => r.json())
    ]).then(([qData, sData]) => {
      setQuestions(qData);
      setSymptom(sData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [symptomId]);

  const handleAnswer = (category, value) => {
    const newAnswers = { ...answers, [category]: value };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Submit for analysis
      fetch('/api/assessment/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom_id: parseInt(symptomId), answers: newAnswers })
      })
        .then(r => r.json())
        .then(data => setResult(data));
    }
  };

  if (loading) return <div className="loading">Loading assessment...</div>;

  // No questions available — redirect to generic protocol
  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
          Personalized assessment not yet available for this problem.
        </p>
        <Link to={`/protocol/${symptomId}`} className="btn btn-primary">
          View General Protocol →
        </Link>
      </div>
    );
  }

  // Show personalized result
  if (result) {
    return <PersonalizedResult result={result} symptomId={symptomId} />;
  }

  // Show question
  const question = questions[currentQ];

  return (
    <div>
      <Link to="/symptoms" className="back-link">← Back</Link>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.3rem', fontWeight: 800 }}>
          Tell us more about your {symptom?.name}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {questions.length} quick questions for a personalized healing plan
        </p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
      </div>

      <div className="card" style={{ padding: '28px' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
          Question {currentQ + 1} of {questions.length}
        </p>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{question.question}</h3>
        {question.question_hi && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            {question.question_hi}
          </p>
        )}

        <div>
          {question.options.map((opt, i) => (
            <button
              key={i}
              className="quiz-option"
              onClick={() => handleAnswer(question.category, opt.value)}
            >
              <strong>{opt.label}</strong>
              {opt.label_hi && (
                <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {opt.label_hi}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonalizedResult({ result, symptomId }) {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div>
      <Link to="/symptoms" className="back-link">← Back to Problems</Link>

      {/* Summary */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', borderColor: '#bbf7d0' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>
          Your Personalized Healing Plan
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
          {result.assessment_summary}
        </p>
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.88rem' }}>
            ⏱️ <strong>Expected timeline:</strong> {result.duration_advice?.message}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'schedule', label: '⏰ Daily Schedule' },
          { key: 'remedies', label: '🌱 Remedies' },
          { key: 'yoga', label: '🧘 Yoga' },
          { key: 'diet', label: '🍽️ Diet' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily Schedule */}
      {activeTab === 'schedule' && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>Your Personalized Daily Schedule</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Follow this routine consistently for best results
          </p>
          {result.daily_schedule?.map((item, i) => (
            <div key={i} className="routine-item">
              <span className="routine-time">{item.time}</span>
              <div>
                <span className="routine-activity">{item.activity}</span>
                <span className={`tag tag-${item.category === 'remedy' ? 'herb' : item.category === 'yoga' ? 'asana' : item.category === 'diet' ? 'diet' : 'lifestyle'}`}
                  style={{ marginLeft: '8px', fontSize: '0.65rem' }}>
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remedies */}
      {activeTab === 'remedies' && (
        <div>
          <h3 className="section-title">🌱 Your Recommended Remedies</h3>
          {result.personalized_remedies?.map(r => (
            <div key={r.id} className="remedy-card">
              <div className="remedy-header">
                <div>
                  <div className="remedy-title">{r.title}</div>
                  {r.title_hi && <div className="remedy-title-hi">{r.title_hi}</div>}
                </div>
                <span className={`tag tag-${r.type}`}>{r.type.replace('_', ' ')}</span>
              </div>
              <p className="remedy-description">{r.description}</p>
              {r.how_to_use && (
                <div className="remedy-usage">
                  <strong>How to use:</strong> {r.how_to_use}
                </div>
              )}
              {r.precautions && (
                <div className="remedy-precaution">
                  <span>⚠️</span> <span>{r.precautions}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Yoga */}
      {activeTab === 'yoga' && (
        <div>
          <h3 className="section-title">🧘 Your Yoga Routine</h3>
          {result.personalized_yoga?.map(y => (
            <div key={y.id} className="yoga-card">
              <div className="yoga-header">
                <div>
                  <div className="yoga-name">{y.name}</div>
                  {y.sanskrit_name && <div className="yoga-sanskrit">{y.sanskrit_name}</div>}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className={`tag tag-${y.type}`}>{y.type}</span>
                  <span className="tag" style={{ background: '#f3f4f6', color: '#4b5563' }}>{y.difficulty}</span>
                </div>
              </div>
              {y.duration_minutes && <span className="yoga-duration">⏱️ {y.duration_minutes} min</span>}
              <div className="yoga-steps"><strong>Steps:</strong><br />{y.steps}</div>
              {y.benefits && <div className="yoga-benefits">✅ <strong>Benefits:</strong> {y.benefits}</div>}
              {y.precautions && <div className="remedy-precaution"><span>⚠️</span> <span>{y.precautions}</span></div>}
            </div>
          ))}
        </div>
      )}

      {/* Diet */}
      {activeTab === 'diet' && (
        <div>
          <h3 className="section-title">🍽️ Diet Recommendations</h3>
          {result.diet_plan?.map(d => (
            <div key={d.id} className="remedy-card">
              <div className="remedy-title">{d.title}</div>
              {d.title_hi && <div className="remedy-title-hi">{d.title_hi}</div>}
              <p className="remedy-description">{d.description}</p>
              {d.how_to_use && <div className="remedy-usage"><strong>What to do:</strong> {d.how_to_use}</div>}
              {d.precautions && <div className="remedy-precaution"><span>⚠️</span> <span>{d.precautions}</span></div>}
            </div>
          ))}
        </div>
      )}

      {/* Important Notes */}
      {result.important_notes?.length > 0 && (
        <div className="card" style={{ marginTop: '20px', borderLeft: '4px solid var(--primary-light)' }}>
          <h4 style={{ marginBottom: '10px', fontWeight: 700 }}>📌 Important Notes</h4>
          <ul style={{ paddingLeft: '18px' }}>
            {result.important_notes.map((note, i) => (
              <li key={i} style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-light)' }}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="card-warning card" style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '0.82rem' }}>⚠️ <strong>Disclaimer:</strong> {result.disclaimer}</p>
      </div>

      {/* Link to full protocol */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to={`/protocol/${symptomId}`} className="btn btn-outline">
          View Complete Protocol (all remedies) →
        </Link>
      </div>
    </div>
  );
}

export default Assessment;
