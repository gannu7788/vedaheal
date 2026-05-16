import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)' }}>🌿 About VedaHeal</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '500px', margin: '8px auto 0' }}>
          India's most comprehensive Ayurvedic wellness app — combining ancient wisdom with modern technology.
        </p>
      </div>

      <div className="card">
        <h3>🎯 Our Mission</h3>
        <p style={{ marginTop: '8px', lineHeight: '1.7' }}>
          To make authentic Ayurvedic knowledge accessible to everyone. For every health problem, 
          nature has a solution — VedaHeal helps you find it with personalized remedies, yoga, 
          diet plans, and daily routines based on classical Ayurvedic texts.
        </p>
      </div>

      <div className="card">
        <h3>📊 What We Offer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
          <Stat number="798+" label="Ayurvedic Herbs" />
          <Stat number="45" label="Health Problems" />
          <Stat number="210+" label="Remedies" />
          <Stat number="43" label="Yoga Exercises" />
          <Stat number="10" label="Wellness Tools" />
          <Stat number="8" label="Healing Recipes" />
        </div>
      </div>

      <div className="card">
        <h3>📖 Our Sources</h3>
        <p style={{ marginTop: '8px', fontSize: '0.9rem', lineHeight: '1.7' }}>
          All content is researched from authentic Ayurvedic texts and modern clinical studies:
        </p>
        <ul style={{ paddingLeft: '18px', marginTop: '8px' }}>
          <li style={{ marginBottom: '6px' }}>Charaka Samhita (चरक संहिता)</li>
          <li style={{ marginBottom: '6px' }}>Sushruta Samhita (सुश्रुत संहिता)</li>
          <li style={{ marginBottom: '6px' }}>Ashtanga Hridaya (अष्टांग हृदय)</li>
          <li style={{ marginBottom: '6px' }}>Bhavaprakash Nighantu (भावप्रकाश निघंटु)</li>
          <li style={{ marginBottom: '6px' }}>Sharangdhara Samhita (शारंगधर संहिता)</li>
          <li style={{ marginBottom: '6px' }}>Modern PubMed clinical studies</li>
        </ul>
        <p style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Herb database includes data from Amidha Ayurveda (CC BY 4.0).
        </p>
      </div>

      <div className="card">
        <h3>⚠️ Important Disclaimer</h3>
        <p style={{ marginTop: '8px', lineHeight: '1.7' }}>
          VedaHeal provides general wellness information based on traditional Ayurvedic knowledge. 
          This is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment. 
          Always consult a qualified healthcare practitioner before starting any new health regimen, 
          especially if you have existing medical conditions or are taking medications.
        </p>
      </div>

      <div className="card">
        <h3>🔗 Quick Links</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          <Link to="/chat" className="btn btn-primary btn-sm">💬 Chat with Guide</Link>
          <Link to="/symptoms" className="btn btn-outline btn-sm">🤒 Health Problems</Link>
          <Link to="/herbs" className="btn btn-outline btn-sm">🌿 Herb Encyclopedia</Link>
          <Link to="/tools" className="btn btn-outline btn-sm">🔮 Wellness Tools</Link>
          <Link to="/shop" className="btn btn-outline btn-sm">🛒 Buy Herbs</Link>
          <Link to="/pricing" className="btn btn-outline btn-sm">⭐ Premium</Link>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h3>📬 Contact & Feedback</h3>
        <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
          Have suggestions, found an error, or want to contribute?
        </p>
        <p style={{ marginTop: '6px', fontWeight: 600, color: 'var(--primary)' }}>vedaheal.app@gmail.com</p>
        <p style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Made with 🌿 in India | © 2025 VedaHeal
        </p>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px', background: 'var(--border-light)', borderRadius: '10px' }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{number}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

export default About;
