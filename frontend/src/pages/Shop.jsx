import React, { useState, useEffect } from 'react';

function Shop() {
  const [data, setData] = useState(null);
  const [herbName, setHerbName] = useState('');
  const [buyLinks, setBuyLinks] = useState(null);

  useEffect(() => {
    fetch('/api/affiliate/recommended').then(r => r.json()).then(setData);
  }, []);

  const searchHerb = () => {
    if (!herbName.trim()) return;
    fetch(`/api/affiliate/buy/${encodeURIComponent(herbName)}`).then(r => r.json()).then(setBuyLinks);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>🛒 Buy Ayurvedic Products</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Find authentic herbs and formulations from trusted brands
      </p>

      {/* Search for specific herb */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          className="search-box"
          style={{ marginBottom: 0, flex: 1 }}
          placeholder="Search herb to buy (e.g., Ashwagandha, Triphala)"
          value={herbName}
          onChange={e => setHerbName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchHerb()}
        />
        <button className="btn btn-primary" onClick={searchHerb}>Find</button>
      </div>

      {/* Buy links result */}
      {buyLinks && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px' }}>🌿 Buy {buyLinks.herb}:</h4>
          {buyLinks.links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '8px', background: 'var(--border-light)', borderRadius: '10px', textDecoration: 'none', color: 'var(--text)' }}>
              <div>
                <strong>{link.icon} {link.store}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{link.note}</p>
              </div>
              <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>Visit →</span>
            </a>
          ))}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>{buyLinks.disclaimer}</p>

          {buyLinks.tips && (
            <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
              <strong style={{ fontSize: '0.82rem' }}>💡 Buying Tips:</strong>
              <ul style={{ paddingLeft: '16px', marginTop: '6px' }}>
                {buyLinks.tips.map((tip, i) => <li key={i} style={{ fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-light)' }}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommended products */}
      {data && data.categories.map((cat, i) => (
        <div key={i} className="card" style={{ marginBottom: '16px' }}>
          <h4 style={{ marginBottom: '12px' }}>{cat.name}</h4>
          {cat.products.map((p, j) => (
            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>{p.name}</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.brand} • {p.price_range}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{p.why}</p>
              </div>
              <a href={`https://www.amazon.in/s?k=${encodeURIComponent(p.name + ' ayurvedic')}&tag=vedaheal-21`} target="_blank" rel="noopener noreferrer"
                className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem' }}>
                Buy
              </a>
            </div>
          ))}
        </div>
      ))}

      <div className="card" style={{ background: 'var(--border-light)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>We may earn a small commission from purchases at no extra cost to you. This helps keep VedaHeal free.</p>
      </div>
    </div>
  );
}

export default Shop;
