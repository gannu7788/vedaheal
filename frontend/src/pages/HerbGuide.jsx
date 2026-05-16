import React, { useState, useEffect } from 'react';

function HerbGuide() {
  const [herbs, setHerbs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/herbs').then(r => r.json()),
      fetch('/api/herbs/categories').then(r => r.json())
    ]).then(([herbsData, catsData]) => {
      setHerbs(herbsData);
      setCategories(catsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    else if (selectedCategory) params.set('category', selectedCategory);
    fetch(`/api/herbs?${params.toString()}`).then(r => r.json()).then(setHerbs);
  }, [search, selectedCategory]);

  const openHerbDetail = (herbId) => {
    fetch(`/api/herbs/${herbId}`).then(r => r.json()).then(setSelectedHerb);
  };

  if (loading) return <div className="loading">Loading Herb Encyclopedia...</div>;
  if (selectedHerb) return <HerbDetail herb={selectedHerb} onBack={() => setSelectedHerb(null)} />;

  return (
    <div>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: '6px', fontSize: '1.4rem', fontWeight: 800 }}>
        🌿 Herb Encyclopedia
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.92rem' }}>
        Explore {herbs.length} Ayurvedic herbs — properties, uses, dosage, and safety information
      </p>

      <input
        type="text"
        className="search-box"
        placeholder="Search by name, use, or botanical name..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setSelectedCategory(''); }}
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${!selectedCategory ? 'btn-ghost active' : 'btn-ghost'}`}
          onClick={() => { setSelectedCategory(''); setSearch(''); }}
        >
          All ({herbs.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-ghost active' : 'btn-ghost'}`}
            onClick={() => { setSelectedCategory(cat); setSearch(''); }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {herbs.map(herb => (
          <div key={herb.id} className="card card-clickable" onClick={() => openHerbDetail(herb.id)} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              height: '120px',
              background: getHerbGradient(herb.category),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              {getHerbEmoji(herb.category)}
            </div>
            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <h4 style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{herb.name}</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {herb.name_hi} • {herb.sanskrit_name}
                  </span>
                </div>
                <span className="tag tag-herb">{herb.category}</span>
              </div>
              {herb.botanical_name && (
                <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {herb.botanical_name}
                </p>
              )}
              <p style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
                {herb.description?.substring(0, 110)}...
              </p>
              <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                View full details →
              </p>
            </div>
          </div>
        ))}
      </div>

      {herbs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No herbs found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}

function HerbDetail({ herb, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="back-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        ← Back to Encyclopedia
      </button>

      <div className="herb-header" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '16px',
          background: getHerbGradient(herb.category),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          flexShrink: 0,
          boxShadow: 'var(--shadow)'
        }}>
          {getHerbEmoji(herb.category)}
        </div>
        <div>
          <h2 className="herb-name">{herb.name}</h2>
          <p className="herb-names-secondary">{herb.name_hi} • {herb.sanskrit_name}</p>
          <p className="herb-botanical">{herb.botanical_name} ({herb.family})</p>
          <span className="tag tag-herb" style={{ marginTop: '8px' }}>{herb.category}</span>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>📖 About</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: '1.7', color: 'var(--text-light)' }}>{herb.description}</p>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '14px' }}>🔬 Ayurvedic Properties</h3>
        <div className="prop-grid">
          {herb.taste && <PropItem label="Taste (Rasa)" value={herb.taste} />}
          {herb.potency && <PropItem label="Potency (Virya)" value={herb.potency} />}
          {herb.dosha_effect && <PropItem label="Dosha Effect" value={herb.dosha_effect} />}
          {herb.parts_used && <PropItem label="Parts Used" value={herb.parts_used} />}
        </div>
        {herb.properties && (
          <div className="prop-item" style={{ marginTop: '12px' }}>
            <div className="prop-label">Properties (Karma)</div>
            <div className="prop-value">{herb.properties}</div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>💊 Main Uses</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: '1.7' }}>{herb.main_uses}</p>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>📋 How to Use</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: '1.7' }}>{herb.how_to_use}</p>
        {herb.dosage && (
          <div className="remedy-usage" style={{ marginTop: '14px' }}>
            <strong>Dosage:</strong> {herb.dosage}
          </div>
        )}
      </div>

      {herb.available_forms && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>🏪 Available Forms</h3>
          <p style={{ fontSize: '0.92rem' }}>{herb.available_forms}</p>
          {herb.season && (
            <p style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              🌱 <strong>Season:</strong> {herb.season}
            </p>
          )}
        </div>
      )}

      <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>⚠️ Safety Information</h3>
        {herb.side_effects && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>Side Effects:</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{herb.side_effects}</p>
          </div>
        )}
        {herb.contraindications && (
          <div className="remedy-precaution">
            <span>🚫</span>
            <span><strong>Do NOT use if:</strong> {herb.contraindications}</span>
          </div>
        )}
      </div>

      {herb.related_symptoms?.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '14px' }}>🎯 Effective For</h3>
          {herb.related_symptoms.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <strong style={{ fontSize: '0.92rem' }}>{s.name}</strong>
                {s.notes && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '8px' }}>— {s.notes}</span>}
              </div>
              <span className={`tag tag-${s.effectiveness}`}>{s.effectiveness}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PropItem({ label, value }) {
  return (
    <div className="prop-item">
      <div className="prop-label">{label}</div>
      <div className="prop-value">{value}</div>
    </div>
  );
}

function getHerbEmoji(category) {
  const emojis = {
    'Adaptogen': '🌿',
    'Immunity': '🛡️',
    'Brain Tonic': '🧠',
    'Anti-inflammatory': '✨',
    'Blood Purifier': '🩸',
    'Rejuvenative': '🫒',
    'Respiratory': '🌬️',
    'Energy & Vitality': '⚡',
    'Hair Health': '💇',
    'Nervine': '😴',
    'Digestive': '🍃',
    'Digestive & Rejuvenative': '👑',
    'Metabolic': '🔥',
    'Urinary & Hormonal': '💪',
    'Kidney & Liver': '💧',
    'Womens Health': '🌺',
    'Brain & Speech': '🗣️',
    'Immunity & Fever': '🛡️',
    'Nervine & Sleep': '🌙'
  };
  return emojis[category] || '🌿';
}

function getHerbGradient(category) {
  const gradients = {
    'Adaptogen': 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    'Immunity': 'linear-gradient(135deg, #ccfbf1, #99f6e4)',
    'Brain Tonic': 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    'Anti-inflammatory': 'linear-gradient(135deg, #fef9c3, #fde68a)',
    'Blood Purifier': 'linear-gradient(135deg, #fee2e2, #fecaca)',
    'Rejuvenative': 'linear-gradient(135deg, #d1fae5, #bbf7d0)',
    'Respiratory': 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    'Energy & Vitality': 'linear-gradient(135deg, #fef3c7, #fde68a)',
    'Hair Health': 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    'Nervine': 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    'Digestive': 'linear-gradient(135deg, #fef3c7, #fde68a)',
    'Digestive & Rejuvenative': 'linear-gradient(135deg, #fef3c7, #fed7aa)',
    'Metabolic': 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    'Urinary & Hormonal': 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    'Kidney & Liver': 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    'Womens Health': 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    'Brain & Speech': 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
    'Immunity & Fever': 'linear-gradient(135deg, #ccfbf1, #99f6e4)',
    'Nervine & Sleep': 'linear-gradient(135deg, #ede9fe, #ddd6fe)'
  };
  return gradients[category] || 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
}

export default HerbGuide;
