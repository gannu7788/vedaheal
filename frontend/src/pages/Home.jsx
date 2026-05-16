import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';

function Home() {
  const { lang } = useContext(AppContext);
  const hi = lang === 'hi';

  return (
    <div>
      <div className="hero">
        <h2 className="hero-title">{hi ? '🌿 आयुर्वेद और योग से प्राकृतिक उपचार' : '🌿 Heal Naturally with Ayurveda & Yoga'}</h2>
        <p className="hero-subtitle">
          {hi ? 'अपनी स्वास्थ्य समस्या बताएं — आयुर्वेदिक उपचार, आहार और योग का पूरा प्रोटोकॉल पाएं।' : 'Tell us your health problem — get a complete healing protocol combining Ayurvedic remedies, dietary guidance, and Yogic exercises.'}
        </p>
        <div className="hero-actions">
          <Link to="/chat" className="btn btn-primary btn-lg">💬 {hi ? 'स्वास्थ्य गाइड से बात करें' : 'Chat with Health Guide'}</Link>
          <Link to="/symptoms" className="btn btn-outline btn-lg">📋 {hi ? 'समस्याएं देखें' : 'Browse Problems'}</Link>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '12px' }}>
        <div className="feature-card">
          <span className="feature-icon">🌱</span>
          <h3>{hi ? 'आयुर्वेदिक उपचार' : 'Ayurvedic Remedies'}</h3>
          <p>{hi ? 'जड़ी-बूटियां, आहार, जीवनशैली सुझाव और घरेलू उपचार — आपकी समस्या के अनुसार।' : 'Herbs, diet changes, lifestyle tips, and home remedies from ancient Ayurvedic texts — personalized for your problem.'}</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🧘</span>
          <h3>{hi ? 'योगिक व्यायाम' : 'Yogic Exercises'}</h3>
          <p>{hi ? 'आसन, प्राणायाम और ध्यान जो सीधे आपकी समस्या को लक्षित करते हैं।' : 'Specific asanas, pranayama, and meditation techniques that target your health issue directly.'}</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📚</span>
          <h3>{hi ? 'जड़ी-बूटी विश्वकोश' : 'Herb Encyclopedia'}</h3>
          <p>{hi ? '798+ आयुर्वेदिक जड़ी-बूटियों की विस्तृत जानकारी — गुण, खुराक, सुरक्षा।' : 'Explore 798+ Ayurvedic herbs in detail — properties, dosage, safety, and which problems they solve.'}</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔮</span>
          <h3>{hi ? 'वेलनेस उपकरण' : 'Wellness Tools'}</h3>
          <p>{hi ? 'जीभ निदान, नाड़ी परीक्षा, चंद्र चरण, ऋतुचर्या, रसोई फार्मेसी।' : 'Tongue diagnosis, pulse reading, moon phase, seasonal guide, kitchen pharmacy & more.'}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '32px', textAlign: 'center', background: 'var(--border-light)' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--primary-dark)' }}>
          <strong>798 {hi ? 'जड़ी-बूटियां' : 'herbs'}</strong> • <strong>188 {hi ? 'उपचार' : 'remedies'}</strong> • <strong>43 {hi ? 'योग' : 'yoga'}</strong> • <strong>30 {hi ? 'समस्याएं' : 'health problems'}</strong>
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          {hi ? 'प्रामाणिक आयुर्वेदिक ग्रंथों और नैदानिक अध्ययनों से शोधित' : 'All content researched from authentic Ayurvedic texts and modern clinical studies'}
        </p>
      </div>
    </div>
  );
}

export default Home;
