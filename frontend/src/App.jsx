import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import SymptomList from './pages/SymptomList.jsx';
import Protocol from './pages/Protocol.jsx';
import DoshaQuiz from './pages/DoshaQuiz.jsx';
import HerbGuide from './pages/HerbGuide.jsx';
import Features from './pages/Features.jsx';
import Pricing from './pages/Pricing.jsx';
import Shop from './pages/Shop.jsx';
import Tracker from './pages/Tracker.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Assessment from './pages/Assessment.jsx';
import About from './pages/About.jsx';

export const AppContext = createContext();

function Layout() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('vedaheal-dark') === 'true');
  const [lang, setLang] = useState(() => localStorage.getItem('vedaheal-lang') || 'en');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vedaheal-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('vedaheal-dark', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('vedaheal-lang', lang);
  }, [lang]);

  const logout = () => {
    localStorage.removeItem('vedaheal-token');
    localStorage.removeItem('vedaheal-user');
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ darkMode, lang, user, setUser, logout }}>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} user={user} logout={logout} />
        {isChat ? (
          <Chat />
        ) : (
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/symptoms" element={<SymptomList />} />
              <Route path="/protocol/:symptomId" element={<Protocol />} />
              <Route path="/assess/:symptomId" element={<Assessment />} />
              <Route path="/dosha-quiz" element={<DoshaQuiz />} />
              <Route path="/herbs" element={<HerbGuide />} />
              <Route path="/tools" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        )}
      </div>
    </AppContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
