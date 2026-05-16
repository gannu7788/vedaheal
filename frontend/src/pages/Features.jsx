import React, { useState, useEffect } from 'react';

function Features() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    { id: 'seasonal', icon: '🌦️', title: 'Seasonal Guide (Ritucharya)', desc: 'What to eat, avoid, and practice this season' },
    { id: 'food-check', icon: '🍽️', title: 'Food Compatibility', desc: 'Check if two foods are safe to eat together' },
    { id: 'herb-interact', icon: '💊', title: 'Herb Interaction Checker', desc: 'Check if herbs/medicines are safe to combine' },
    { id: 'yoga-guide', icon: '🧘', title: 'Yoga Visual Guide', desc: 'Step-by-step yoga poses with breathing instructions' },
    { id: 'panchakarma', icon: '🏥', title: 'Panchakarma Guide', desc: 'Complete guide to Ayurvedic detox therapy' },
    { id: 'recipes', icon: '🍲', title: 'Ayurvedic Recipes', desc: 'Healing recipes — Kadha, Golden Milk, Khichdi & more' },
    { id: 'tongue', icon: '👅', title: 'Tongue Diagnosis', desc: 'Read your tongue to detect health imbalances' },
    { id: 'pulse', icon: '💓', title: 'Pulse Reading Guide', desc: 'Basic Nadi Pariksha self-assessment' },
    { id: 'moon', icon: '🌙', title: 'Moon Phase & Health', desc: 'Align your routine with lunar cycles' },
    { id: 'kitchen', icon: '🏠', title: 'Kitchen Pharmacy', desc: 'Heal with what\'s already in your kitchen' }
  ];

  if (activeFeature) {
    return <FeatureDetail feature={activeFeature} onBack={() => setActiveFeature(null)} />;
  }

  return (
    <div>
      <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
        🔮 Wellness Tools
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.92rem' }}>
        Unique Ayurvedic tools you won't find in other apps
      </p>
      <div className="grid-2">
        {features.map(f => (
          <div key={f.id} className="card card-clickable" onClick={() => setActiveFeature(f.id)}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>{f.icon}</span>
            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>{f.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureDetail({ feature, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const endpoints = {
      'seasonal': '/api/features/seasonal',
      'recipes': '/api/features/recipes',
      'tongue': '/api/features/tongue-diagnosis',
      'pulse': '/api/features/pulse-guide',
      'moon': '/api/features/moon-phase',
      'kitchen': '/api/features/kitchen-pharmacy',
      'panchakarma': '/api/features/panchakarma',
      'yoga-guide': '/api/features/yoga-guide'
    };

    if (endpoints[feature]) {
      fetch(endpoints[feature]).then(r => r.json()).then(d => { setData(d); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [feature]);

  if (loading && !['food-check', 'herb-interact'].includes(feature)) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <button onClick={onBack} className="back-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        ← Back to Tools
      </button>

      {feature === 'seasonal' && data && <SeasonalView data={data} />}
      {feature === 'food-check' && <FoodCheckView input1={input1} setInput1={setInput1} input2={input2} setInput2={setInput2} result={result} setResult={setResult} />}
      {feature === 'herb-interact' && <HerbInteractView input1={input1} setInput1={setInput1} input2={input2} setInput2={setInput2} result={result} setResult={setResult} />}
      {feature === 'yoga-guide' && data && <YogaGuideView data={data} />}
      {feature === 'panchakarma' && data && <PanchakarmaView data={data} />}
      {feature === 'recipes' && data && <RecipesView data={data} />}
      {feature === 'tongue' && data && <TongueView data={data} />}
      {feature === 'pulse' && data && <PulseView data={data} />}
      {feature === 'moon' && data && <MoonView data={data} />}
      {feature === 'kitchen' && data && <KitchenView data={data} />}
    </div>
  );
}

function SeasonalView({ data }) {
  const s = data.current_season;
  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)' }}>🌦️ {s.name}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{s.name_hi} • {s.months}</p>
        <p style={{ marginTop: '8px' }}>{s.description}</p>
        <p style={{ marginTop: '8px', fontWeight: 600, color: 'var(--accent)' }}>Dosha: {s.dosha}</p>
      </div>
      <div className="card"><h4>✅ Foods to Favor</h4><ul style={{paddingLeft:'18px',marginTop:'8px'}}>{s.diet.favor.map((f,i)=><li key={i} style={{marginBottom:'4px'}}>{f}</li>)}</ul></div>
      <div className="card"><h4>❌ Foods to Avoid</h4><ul style={{paddingLeft:'18px',marginTop:'8px'}}>{s.diet.avoid.map((f,i)=><li key={i} style={{marginBottom:'4px'}}>{f}</li>)}</ul></div>
      <div className="card"><h4>🌿 Recommended Herbs</h4><p style={{marginTop:'8px'}}>{s.herbs.join(', ')}</p></div>
      <div className="card"><h4>🧘 Yoga & Lifestyle</h4><ul style={{paddingLeft:'18px',marginTop:'8px'}}>{s.lifestyle.map((l,i)=><li key={i} style={{marginBottom:'4px'}}>{l}</li>)}</ul></div>
      {s.warning && <div className="card" style={{borderLeft:'4px solid var(--accent)'}}><p>⚠️ {s.warning}</p></div>}
    </div>
  );
}

function FoodCheckView({ input1, setInput1, input2, setInput2, result, setResult }) {
  const check = async () => {
    const res = await fetch('/api/features/food-compatibility', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ food1: input1, food2: input2 })
    });
    setResult(await res.json());
  };
  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '16px' }}>🍽️ Food Compatibility Checker</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Check if two foods are safe to eat together (Viruddha Ahara)</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Examples: milk + banana, honey + hot water, curd + night, fruit + meal</p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input className="search-box" style={{flex:1,marginBottom:0}} placeholder="Food 1 (e.g., milk)" value={input1} onChange={e=>setInput1(e.target.value)} />
        <input className="search-box" style={{flex:1,marginBottom:0}} placeholder="Food 2 (e.g., fish)" value={input2} onChange={e=>setInput2(e.target.value)} />
        <button className="btn btn-primary" onClick={check} disabled={!input1}>Check</button>
      </div>
      {result && (
        <div className="card" style={{ borderLeft: `4px solid ${result.compatible ? '#22c55e' : '#ef4444'}` }}>
          <h4>{result.compatible ? '✅ Compatible' : '❌ Incompatible'}</h4>
          <p style={{ marginTop: '8px' }}>{result.advice}</p>
          {result.results.map((r, i) => (
            <div key={i} style={{ marginTop: '12px', padding: '10px', background: '#fff7ed', borderRadius: '8px' }}>
              <p><strong>⚠️ {r.reason}</strong></p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reference: {r.reference} | Severity: {r.severity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HerbInteractView({ input1, setInput1, input2, setInput2, result, setResult }) {
  const check = async () => {
    const res = await fetch('/api/features/herb-interaction', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ herbs: [input1, input2] })
    });
    setResult(await res.json());
  };
  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '16px' }}>💊 Herb Interaction Checker</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Check if two herbs/medicines are safe to take together</p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input className="search-box" style={{flex:1,marginBottom:0}} placeholder="Herb 1 (e.g., Ashwagandha)" value={input1} onChange={e=>setInput1(e.target.value)} />
        <input className="search-box" style={{flex:1,marginBottom:0}} placeholder="Herb 2 (e.g., Brahmi)" value={input2} onChange={e=>setInput2(e.target.value)} />
        <button className="btn btn-primary" onClick={check} disabled={!input1||!input2}>Check</button>
      </div>
      {result && (
        <div className="card" style={{ borderLeft: `4px solid ${result.safe ? '#22c55e' : '#f59e0b'}` }}>
          <h4>{result.safe ? '✅ Safe to Combine' : '⚠️ Caution Needed'}</h4>
          {result.interactions.map((r, i) => (
            <div key={i} style={{ marginTop: '12px', padding: '10px', background: r.safe ? '#f0fdf4' : '#fffbeb', borderRadius: '8px' }}>
              <p>{r.note}</p>
            </div>
          ))}
          {result.advice && <p style={{ marginTop: '12px', color: 'var(--text-light)' }}>{result.advice}</p>}
          {result.general_rules && <div style={{marginTop:'12px'}}><strong>General Rules:</strong><ul style={{paddingLeft:'18px',marginTop:'6px'}}>{result.general_rules.map((r,i)=><li key={i} style={{fontSize:'0.85rem',marginBottom:'4px'}}>{r}</li>)}</ul></div>}
        </div>
      )}
    </div>
  );
}

function RecipesView({ data }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '16px' }}>🍲 Ayurvedic Recipes</h2>
      {data.recipes.map(r => (
        <div key={r.id} className="card">
          <h4>{r.name} <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{r.name_hi}</span></h4>
          <p style={{fontSize:'0.82rem',color:'var(--primary)',marginTop:'4px'}}>⏱️ {r.time} • Serves {r.serves} • Best: {r.best_time}</p>
          <p style={{marginTop:'8px',fontSize:'0.9rem'}}>{r.benefits}</p>
          <div style={{marginTop:'10px',background:'#f8faf8',padding:'10px',borderRadius:'8px'}}>
            <strong>Ingredients:</strong>
            <ul style={{paddingLeft:'16px',marginTop:'4px'}}>{r.ingredients.map((ing,i)=><li key={i} style={{fontSize:'0.85rem'}}>{ing}</li>)}</ul>
          </div>
          <div style={{marginTop:'10px'}}>
            <strong>Steps:</strong>
            <ol style={{paddingLeft:'16px',marginTop:'4px'}}>{r.steps.map((s,i)=><li key={i} style={{fontSize:'0.85rem',marginBottom:'4px'}}>{s}</li>)}</ol>
          </div>
          {r.precaution && <p style={{marginTop:'8px',fontSize:'0.82rem',color:'var(--accent)'}}>⚠️ {r.precaution}</p>}
        </div>
      ))}
    </div>
  );
}

function TongueView({ data }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>👅 {data.title}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{data.description}</p>
      <div className="card" style={{background:'#f0fdf4'}}><strong>How to check:</strong> {data.how_to_check}</div>
      {data.indicators.map((ind, i) => (
        <div key={i} className="card">
          <h4>{ind.area}</h4>
          {ind.observations.map((obs, j) => (
            <div key={j} style={{padding:'10px 0',borderBottom:'1px solid var(--border-light)'}}>
              <p><strong>{obs.sign}</strong></p>
              <p style={{fontSize:'0.85rem',color:'var(--text-light)'}}>{obs.meaning}</p>
              <p style={{fontSize:'0.82rem',color:'var(--primary)',marginTop:'4px'}}>→ {obs.action}</p>
            </div>
          ))}
        </div>
      ))}
      <div className="card"><strong>Daily Practice:</strong> {data.daily_practice}</div>
    </div>
  );
}

function PulseView({ data }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>💓 {data.title}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{data.description}</p>
      <div className="card" style={{background:'#f0fdf4'}}>
        <h4>How to Check</h4>
        <p style={{marginTop:'6px'}}>{data.how_to_check.position}</p>
        <p>{data.how_to_check.fingers}</p>
        <p>{data.how_to_check.pressure}</p>
        <p>{data.how_to_check.time}</p>
        <div style={{marginTop:'12px'}}>
          {data.how_to_check.finger_map.map((f,i)=>(
            <div key={i} style={{padding:'8px 0',borderBottom:'1px solid var(--border-light)'}}>
              <strong>{f.finger}</strong> → {f.dosha}
              <p style={{fontSize:'0.85rem',color:'var(--text-light)'}}>Feels like: {f.feels_like}</p>
            </div>
          ))}
        </div>
      </div>
      {data.self_assessment.map((s,i)=>(
        <div key={i} className="card">
          <h4>{s.dosha}</h4>
          <p style={{fontSize:'0.85rem',marginTop:'4px'}}>Pulse: {s.pulse_type}</p>
          <p style={{fontSize:'0.85rem',color:'var(--text-light)',marginTop:'4px'}}>Signs: {s.signs}</p>
          <p style={{fontSize:'0.85rem',color:'var(--primary)',marginTop:'4px'}}>Balance: {s.balance}</p>
        </div>
      ))}
    </div>
  );
}

function MoonView({ data }) {
  return (
    <div>
      <div className="card" style={{background:'linear-gradient(135deg, #1a1a2e, #16213e)',color:'white',textAlign:'center'}}>
        <span style={{fontSize:'3rem'}}>🌙</span>
        <h2 style={{marginTop:'8px'}}>{data.current_phase}</h2>
        <p style={{opacity:0.8}}>{data.phase_hi} • Day {data.moon_age_days} of cycle</p>
      </div>
      <div className="card"><h4>Dosha Effect</h4><p style={{marginTop:'6px'}}>{data.dosha_effect}</p></div>
      <div className="card"><h4>✅ Do</h4><ul style={{paddingLeft:'18px',marginTop:'6px'}}>{data.recommendations.do.map((d,i)=><li key={i} style={{marginBottom:'4px'}}>{d}</li>)}</ul></div>
      <div className="card"><h4>❌ Avoid</h4><ul style={{paddingLeft:'18px',marginTop:'6px'}}>{data.recommendations.avoid.map((a,i)=><li key={i} style={{marginBottom:'4px'}}>{a}</li>)}</ul></div>
      <div className="card"><h4>🌿 Herbs for this phase</h4><p style={{marginTop:'6px'}}>{data.recommendations.herbs.join(', ')}</p></div>
      <div className="card"><h4>🍽️ Food</h4><p style={{marginTop:'6px'}}>{data.recommendations.food}</p></div>
      <div className="card" style={{fontSize:'0.85rem',color:'var(--text-light)'}}><p>{data.ayurvedic_principle}</p></div>
    </div>
  );
}

function KitchenView({ data }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>🏠 {data.title}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{data.description}</p>
      {data.items.map((item, i) => (
        <div key={i} className="card">
          <h4>{item.icon} {item.name}</h4>
          <ul style={{paddingLeft:'18px',marginTop:'8px'}}>
            {item.uses.map((u,j)=><li key={j} style={{fontSize:'0.88rem',marginBottom:'6px'}}>{u}</li>)}
          </ul>
        </div>
      ))}
      <div className="card" style={{borderLeft:'4px solid var(--accent)'}}>
        <h4>⚠️ Golden Rules</h4>
        <ul style={{paddingLeft:'18px',marginTop:'8px'}}>
          {data.golden_rules.map((r,i)=><li key={i} style={{fontSize:'0.88rem',marginBottom:'6px'}}>{r}</li>)}
        </ul>
      </div>
    </div>
  );
}

function YogaGuideView({ data }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const pose = data.poses.find(p => p.id === selected);
    return (
      <div>
        <button onClick={() => setSelected(null)} className="back-link" style={{border:'none',background:'none',cursor:'pointer'}}>← Back to poses</button>
        <div className="card" style={{background:'linear-gradient(135deg, #f0fdf4, #ecfdf5)'}}>
          <h3 style={{fontWeight:800,color:'var(--primary-dark)'}}>{pose.name}</h3>
          <p style={{color:'var(--text-muted)'}}>{pose.name_hi} • {pose.difficulty} • {pose.duration}</p>
          <p style={{marginTop:'8px'}}>{pose.benefits}</p>
          <p style={{marginTop:'6px',fontSize:'0.85rem'}}>Best for: {pose.best_for.join(', ')}</p>
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(pose.name + ' yoga tutorial')}`} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',marginTop:'10px',padding:'8px 16px',background:'#ff0000',color:'white',borderRadius:'8px',textDecoration:'none',fontSize:'0.85rem',fontWeight:600}}>
            ▶️ Watch Video Tutorial on YouTube
          </a>
        </div>
        <div className="card">
          <h4 style={{marginBottom:'16px'}}>Step-by-Step Instructions</h4>
          {pose.steps.map((step, i) => (
            <div key={i} style={{display:'flex',gap:'14px',padding:'14px 0',borderBottom:'1px solid var(--border-light)',alignItems:'flex-start'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'var(--primary)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,flexShrink:0,fontSize:'0.85rem'}}>{i+1}</div>
              <div style={{flex:1}}>
                <strong style={{fontSize:'0.95rem'}}>{step.position}</strong>
                <p style={{fontSize:'0.9rem',marginTop:'6px',lineHeight:'1.6'}}>{step.instruction}</p>
                <div style={{marginTop:'8px',display:'inline-flex',alignItems:'center',gap:'6px',padding:'4px 10px',background:'#e0f2fe',borderRadius:'12px',fontSize:'0.78rem',color:'#0369a1',fontWeight:600}}>
                  🌬️ Breath: {step.breath}
                </div>
              </div>
            </div>
          ))}
        </div>
        {pose.tips && <div className="card"><h4>💡 Tips for Best Results</h4><ul style={{paddingLeft:'18px',marginTop:'10px'}}>{pose.tips.map((t,i)=><li key={i} style={{fontSize:'0.9rem',marginBottom:'8px',lineHeight:'1.5'}}>{t}</li>)}</ul></div>}
        {pose.precautions && <div className="card" style={{borderLeft:'4px solid var(--accent)',background:'#fff7ed'}}><p style={{fontSize:'0.9rem'}}>⚠️ <strong>Precautions:</strong> {pose.precautions}</p></div>}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{fontSize:'1.3rem',fontWeight:800,color:'var(--primary-dark)',marginBottom:'16px'}}>🧘 Yoga Visual Guide</h2>
      <div className="grid-2">
        {data.poses.map(pose => (
          <div key={pose.id} className="card card-clickable" onClick={() => setSelected(pose.id)}>
            <h4>{pose.name}</h4>
            <p style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{pose.name_hi} • {pose.difficulty} • {pose.duration}</p>
            <p style={{fontSize:'0.85rem',marginTop:'6px',color:'var(--text-light)'}}>{pose.benefits.substring(0,80)}...</p>
            <p style={{fontSize:'0.8rem',color:'var(--primary)',marginTop:'8px',fontWeight:600}}>View steps →</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanchakarmaView({ data }) {
  return (
    <div>
      <h2 style={{fontSize:'1.3rem',fontWeight:800,color:'var(--primary-dark)',marginBottom:'8px'}}>🏥 {data.title}</h2>
      <p style={{color:'var(--text-muted)',marginBottom:'8px'}}>{data.title_hi}</p>
      <p style={{marginBottom:'16px'}}>{data.description}</p>
      <div className="card" style={{borderLeft:'4px solid #ef4444',background:'#fef2f2'}}>
        <p><strong>⚠️ Important:</strong> {data.warning}</p>
      </div>

      {data.phases.map((phase, i) => (
        <div key={i}>
          <h3 className="section-title">{phase.name} <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>({phase.duration})</span></h3>
          <p style={{marginBottom:'12px',color:'var(--text-light)'}}>{phase.description}</p>

          {phase.steps && phase.steps.map((step, j) => (
            <div key={j} className="card">
              <h4>{step.name}</h4>
              <p style={{fontSize:'0.9rem',marginTop:'4px'}}>{step.description}</p>
              <p style={{fontSize:'0.85rem',color:'var(--primary)',marginTop:'6px'}}>Purpose: {step.purpose}</p>
            </div>
          ))}

          {phase.procedures && phase.procedures.map((proc, j) => (
            <div key={j} className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                <h4>{proc.name} <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{proc.name_hi}</span></h4>
                <span className="tag tag-herb">{proc.dosha}</span>
              </div>
              <p style={{fontSize:'0.9rem',marginTop:'8px'}}>{proc.description}</p>
              <p style={{fontSize:'0.85rem',marginTop:'6px'}}><strong>For:</strong> {proc.indications}</p>
              <p style={{fontSize:'0.85rem',marginTop:'4px'}}><strong>Best season:</strong> {proc.season}</p>
              <p style={{fontSize:'0.85rem',marginTop:'4px'}}><strong>Duration:</strong> {proc.duration}</p>
              <p style={{fontSize:'0.82rem',color:'var(--accent)',marginTop:'6px'}}>🚫 Avoid: {proc.contraindications}</p>
            </div>
          ))}
        </div>
      ))}

      <h3 className="section-title">Supportive Therapies</h3>
      <div className="grid-2">
        {data.supportive_therapies.map((t, i) => (
          <div key={i} className="card">
            <h4>{t.name}</h4>
            <p style={{fontSize:'0.85rem',marginTop:'4px'}}>{t.description}</p>
            <span className="tag tag-herb" style={{marginTop:'6px'}}>{t.dosha}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h4>💰 Cost Estimate</h4>
        <p style={{marginTop:'6px'}}>{data.cost_estimate}</p>
      </div>
      <div className="card">
        <h4>🔍 How to Find a Good Center</h4>
        <p style={{marginTop:'6px'}}>{data.how_to_find}</p>
      </div>
      <div className="card">
        <h4>📅 How Often</h4>
        <p style={{marginTop:'6px'}}>{data.frequency}</p>
      </div>
    </div>
  );
}

export default Features;
