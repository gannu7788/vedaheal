import React from 'react';
import { Link } from 'react-router-dom';

function Header({ darkMode, setDarkMode, lang, setLang, user, logout }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1><Link to="/" style={{color: 'white', textDecoration: 'none'}}>🌿 VedaHeal</Link></h1>
        <nav style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <ul className="nav-links">
            <li><Link to="/chat">💬 {lang === 'hi' ? 'पूछें' : 'Ask'}</Link></li>
            <li><Link to="/symptoms">{lang === 'hi' ? 'समस्या' : 'Problems'}</Link></li>
            <li><Link to="/herbs">{lang === 'hi' ? 'जड़ी-बूटी' : 'Herbs'}</Link></li>
            <li><Link to="/tracker">📊 {lang === 'hi' ? 'ट्रैकर' : 'Track'}</Link></li>
            <li><Link to="/tools">{lang === 'hi' ? 'उपकरण' : 'Tools'}</Link></li>
          </ul>
          <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{background:'rgba(255,255,255,0.2)',border:'1px solid rgba(255,255,255,0.3)',color:'white',padding:'4px 10px',borderRadius:'6px',fontSize:'0.75rem',cursor:'pointer',fontWeight:700}}>
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} style={{background:'rgba(255,255,255,0.2)',border:'1px solid rgba(255,255,255,0.3)',color:'white',padding:'4px 8px',borderRadius:'6px',fontSize:'0.8rem',cursor:'pointer'}}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            {user ? (
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{color:'rgba(255,255,255,0.85)',fontSize:'0.78rem',fontWeight:600}}>
                  {user.name?.split(' ')[0]}
                </span>
                {user.plan !== 'free' && (
                  <span style={{background:'#fbbf24',color:'#78350f',padding:'2px 6px',borderRadius:'4px',fontSize:'0.65rem',fontWeight:700}}>PRO</span>
                )}
                <button onClick={logout} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'rgba(255,255,255,0.7)',padding:'4px 8px',borderRadius:'4px',fontSize:'0.72rem',cursor:'pointer'}}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" style={{background:'rgba(255,255,255,0.2)',border:'1px solid rgba(255,255,255,0.4)',color:'white',padding:'5px 12px',borderRadius:'6px',fontSize:'0.78rem',textDecoration:'none',fontWeight:600}}>
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
