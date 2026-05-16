import React, { useState, useEffect } from 'react';

function DoshaQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dosha/questions')
      .then(res => res.json())
      .then(data => { setQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAnswer = (dosha) => {
    const newAnswers = [...answers, dosha];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      fetch('/api/dosha/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: newAnswers })
      })
        .then(res => res.json())
        .then(data => setResult(data));
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  if (loading) return <div className="loading">Loading quiz...</div>;

  if (result) {
    return (
      <div>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '1.4rem' }}>Your Dosha Profile</h2>

        <div className="card" style={{ textAlign: 'center', padding: '32px', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
            {result.primary_dosha === 'Vata' && '💨'}
            {result.primary_dosha === 'Pitta' && '🔥'}
            {result.primary_dosha === 'Kapha' && '🌊'}
          </div>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>
            {result.primary_dosha}
          </h3>
          <p style={{ color: 'var(--text-light)', maxWidth: '500px', margin: '0 auto', fontSize: '0.92rem' }}>
            {result.description}
          </p>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '16px', fontWeight: 700 }}>Dosha Breakdown</h4>
          <DoshaBar label="💨 Vata (Air + Space)" percentage={result.scores.vata} color="#60a5fa" />
          <DoshaBar label="🔥 Pitta (Fire + Water)" percentage={result.scores.pitta} color="#f87171" />
          <DoshaBar label="🌊 Kapha (Earth + Water)" percentage={result.scores.kapha} color="#4ade80" />
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '14px', fontWeight: 700 }}>Recommendations for {result.primary_dosha}</h4>
          <ul style={{ paddingLeft: '20px' }}>
            {result.recommendations.map((rec, i) => (
              <li key={i} style={{ marginBottom: '10px', fontSize: '0.92rem', lineHeight: '1.6' }}>{rec}</li>
            ))}
          </ul>
        </div>

        <button className="btn btn-primary" onClick={resetQuiz} style={{ marginTop: '8px' }}>
          ↺ Retake Quiz
        </button>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: '6px', fontSize: '1.4rem' }}>Dosha Quiz</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.92rem' }}>
        Answer {questions.length} questions to discover your body constitution
      </p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
      </div>

      <div className="card" style={{ padding: '28px' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
          Question {currentQ + 1} of {questions.length} — {question.category}
        </p>
        <h3 style={{ marginBottom: '8px', fontSize: '1.15rem' }}>{question.question}</h3>
        {question.question_hi && (
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.88rem' }}>
            {question.question_hi}
          </p>
        )}

        <button className="quiz-option quiz-option-vata" onClick={() => handleAnswer('vata')}>
          💨 {question.option_vata}
        </button>
        <button className="quiz-option quiz-option-pitta" onClick={() => handleAnswer('pitta')}>
          🔥 {question.option_pitta}
        </button>
        <button className="quiz-option quiz-option-kapha" onClick={() => handleAnswer('kapha')}>
          🌊 {question.option_kapha}
        </button>
      </div>
    </div>
  );
}

function DoshaBar({ label, percentage, color }) {
  return (
    <div className="dosha-bar-container">
      <div className="dosha-bar-label">
        <span>{label}</span>
        <span style={{ fontWeight: 700 }}>{percentage}%</span>
      </div>
      <div className="dosha-bar-track">
        <div className="dosha-bar-fill" style={{ background: color, width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default DoshaQuiz;
