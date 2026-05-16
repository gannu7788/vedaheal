import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SymptomList() {
  const [symptoms, setSymptoms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/symptoms')
      .then(res => res.json())
      .then(data => { setSymptoms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = symptoms.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.name_hi && s.name_hi.includes(search)) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, symptom) => {
    if (!acc[symptom.category]) acc[symptom.category] = [];
    acc[symptom.category].push(symptom);
    return acc;
  }, {});

  if (loading) return <div className="loading">Loading health problems...</div>;

  return (
    <div>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: '6px', fontSize: '1.4rem', fontWeight: 800 }}>
        What's troubling you?
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.92rem' }}>
        Select your problem to get a complete Ayurvedic + Yoga healing protocol
      </p>

      <input
        type="text"
        className="search-box"
        placeholder="Search problems... (acidity, back pain, hair fall, PCOS)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="section-title">{getCategoryIcon(category)} {category}</h3>
          <div className="grid-2">
            {items.map(symptom => (
              <div
                key={symptom.id}
                className="card card-clickable"
                onClick={() => navigate(`/assess/${symptom.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{symptom.name}</h4>
                    {symptom.name_hi && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {symptom.name_hi}
                      </span>
                    )}
                  </div>
                  <span className={`tag tag-${symptom.dosha_association?.toLowerCase()}`}>
                    {symptom.dosha_association}
                  </span>
                </div>
                <p style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
                  {symptom.description}
                </p>
                <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Get personalized solution →
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔍</p>
          <p style={{ color: 'var(--text-muted)' }}>No problems found matching "{search}"</p>
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    'Digestive': '🫄',
    'Musculoskeletal': '🦴',
    'Sleep': '😴',
    'Mental Health': '🧠',
    'Hair & Skin': '💇',
    'Neurological': '⚡',
    'Metabolic': '⚖️',
    'Respiratory': '🫁',
    'Hormonal': '🔄',
    'General': '💪'
  };
  return icons[category] || '•';
}

export default SymptomList;
