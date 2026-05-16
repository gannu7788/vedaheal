import React, { useState, useRef, useEffect } from 'react';

const CHAT_STYLES = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    maxWidth: '700px',
    margin: '0 auto',
    background: 'var(--bg)',
    borderRadius: '0',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    color: 'white'
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    background: 'var(--bg-card)',
    borderTop: '1px solid var(--border)'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: '24px',
    fontSize: '0.9rem',
    outline: 'none',
    background: 'var(--bg)',
    color: 'var(--text)'
  },
  sendBtn: {
    width: '42px',
    height: '42px',
    border: 'none',
    borderRadius: '50%',
    background: '#2d6a4f',
    color: 'white',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  botBubble: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    background: 'var(--bg-card)',
    color: 'var(--text)',
    padding: '12px 16px',
    borderRadius: '0 16px 16px 16px',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    boxShadow: 'var(--shadow-sm)',
    whiteSpace: 'pre-wrap',
    border: '1px solid var(--border-light)'
  },
  userBubble: {
    maxWidth: '75%',
    alignSelf: 'flex-end',
    background: '#2d6a4f',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '16px 0 16px 16px',
    fontSize: '0.9rem',
    lineHeight: '1.5'
  },
  suggestions: {
    display: 'flex',
    gap: '6px',
    padding: '8px 16px',
    overflowX: 'auto',
    background: 'var(--bg-card)',
    borderTop: '1px solid var(--border-light)'
  },
  chip: {
    padding: '7px 14px',
    border: '1.5px solid var(--primary)',
    borderRadius: '18px',
    background: 'var(--bg-card)',
    color: 'var(--primary)',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  }
};

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState({ stage: 'greeting', history: [], answers: {} });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      callBot('hi', true);
    }
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const callBot = async (text, isInit) => {
    if (!isInit) setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context })
      });
      const data = await res.json();

      // Convert structured messages to simple text
      if (data.messages) {
        const botTexts = data.messages.map(m => extractText(m)).filter(Boolean);
        for (const t of botTexts) {
          setMessages(prev => [...prev, { role: 'bot', text: t }]);
        }
      }
      setContext(data.context || context);
      setSuggestions(data.suggestions || []);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const send = (text) => {
    const msg = text || input.trim();
    if (msg) callBot(msg, false);
  };

  return (
    <div style={CHAT_STYLES.container}>
      {/* Header */}
      <div style={CHAT_STYLES.header}>
        <div style={CHAT_STYLES.avatar}>🌿</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>VedaHeal Guide</div>
          <div style={{ fontSize: '0.72rem', color: '#22c55e' }}>● Online</div>
        </div>
      </div>

      {/* Messages */}
      <div style={CHAT_STYLES.messagesArea}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === 'user' ? CHAT_STYLES.userBubble : CHAT_STYLES.botBubble}>
            {formatBotText(m.text)}
          </div>
        ))}
        {loading && (
          <div style={{ ...CHAT_STYLES.botBubble, color: 'var(--text-muted)' }}>typing...</div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !loading && (
        <div style={CHAT_STYLES.suggestions}>
          {suggestions.map((s, i) => (
            <button key={i} style={CHAT_STYLES.chip} onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={CHAT_STYLES.inputArea}>
        <input
          ref={inputRef}
          style={CHAT_STYLES.input}
          placeholder="Type your health concern..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={loading}
        />
        <button style={{ ...CHAT_STYLES.sendBtn, opacity: (!input.trim() || loading) ? 0.5 : 1 }} onClick={() => send()} disabled={!input.trim() || loading}>
          ➤
        </button>
      </div>
    </div>
  );
}

// Convert structured message types to plain text
function extractText(msg) {
  switch (msg.type) {
    case 'text': return msg.content;
    case 'encouragement': return `💚 ${msg.content}`;
    case 'symptom_card':
      return `🔍 ${msg.content.message}`;
    case 'protocol_summary':
      return `📋 Your Healing Plan: ${msg.content.symptom} (${msg.content.dosha} dosha)\n⏱️ Intensity: ${msg.content.intensity} | Follow for ${msg.content.weeks} weeks`;
    case 'remedy_section':
      let t = msg.content.title ? `${msg.content.title}\n\n` : '';
      msg.content.items.forEach(item => {
        t += `• ${item.title}${item.title_hi ? ` (${item.title_hi})` : ''}\n`;
        t += `  ${item.description}\n`;
        if (item.how_to_use) t += `  💡 ${item.how_to_use}\n`;
        if (item.precautions) t += `  ⚠️ ${item.precautions}\n`;
        t += '\n';
      });
      return t.trim();
    case 'yoga_section':
      let y = msg.content.title ? `${msg.content.title}\n\n` : '';
      msg.content.items.forEach(item => {
        y += `• ${item.name} (${item.type}, ${item.duration_minutes} min)\n`;
        y += `  ${item.benefits || ''}\n`;
        y += `  Steps: ${item.steps}\n\n`;
      });
      return y.trim();
    case 'schedule':
      let s = `${msg.content.title}\n\n`;
      msg.content.items.forEach(item => {
        s += `${item.icon} ${item.time} — ${item.activity}\n`;
      });
      return s.trim();
    case 'herb_card':
      let h = `🌿 ${msg.content.name} (${msg.content.name_hi || ''})\n`;
      h += `${msg.content.botanical_name}\n\n`;
      h += `${msg.content.description}\n\n`;
      if (msg.content.how_to_use) h += `💡 How to use: ${msg.content.how_to_use}\n`;
      if (msg.content.dosage) h += `📏 Dosage: ${msg.content.dosage}\n`;
      if (msg.content.contraindications) h += `🚫 Avoid if: ${msg.content.contraindications}\n`;
      return h.trim();
    case 'herb_chips':
      let c = `${msg.content.title}\n`;
      msg.content.herbs.forEach(herb => { c += `  🌿 ${herb.name} (${herb.effectiveness})\n`; });
      return c.trim();
    case 'herb_list':
      let l = '';
      msg.content.herbs.forEach(herb => { l += `🌿 ${herb.name} — ${herb.effectiveness} effectiveness${herb.notes ? ` (${herb.notes})` : ''}\n`; });
      return l.trim();
    case 'quick_help':
      let q = `${msg.content.title}\n`;
      msg.content.items.forEach(item => { q += `${item.icon} ${item.text}\n`; });
      return q.trim();
    case 'help_options':
      let o = 'I can help you with:\n';
      msg.content.options.forEach(opt => { o += `${opt.icon} ${opt.text}\n`; });
      return o.trim();
    case 'precaution_list':
      let p = '⚠️ Precautions:\n';
      msg.content.items.forEach(item => { p += `• ${item.title}: ${item.precautions}\n`; });
      return p.trim();
    case 'shop_list':
      let sh = '🏪 Where to buy:\n';
      msg.content.stores.forEach(store => { sh += `• ${store.name} — ${store.note}\n`; });
      return sh.trim();
    case 'symptom_grid':
      return 'Pick one from: ' + msg.content.symptoms.map(s => s.name).join(', ');
    default:
      return msg.content ? JSON.stringify(msg.content) : '';
  }
}

// Simple bold formatting
function formatBotText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold **text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formatted = parts.map((p, j) =>
      p.startsWith('**') ? <strong key={j}>{p.replace(/\*\*/g, '')}</strong> : p
    );
    return <div key={i} style={{ minHeight: line === '' ? '8px' : 'auto' }}>{formatted}</div>;
  });
}

export default Chat;
