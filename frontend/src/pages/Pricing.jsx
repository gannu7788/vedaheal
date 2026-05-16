import React, { useState, useEffect } from 'react';

function Pricing() {
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payment/plans').then(r => r.json()).then(d => { setPlans(d); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Loading plans...</div>;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)' }}>Upgrade to Premium</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Unlock the full power of Ayurvedic healing</p>
      </div>

      {/* Free vs Premium comparison */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ borderTop: '4px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>🆓 Free Plan</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>₹0 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>forever</span></p>
          <ul style={{ paddingLeft: '18px', marginTop: '16px' }}>
            {plans.free_features.map((f, i) => (
              <li key={i} style={{ marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text-light)' }}>✓ {f}</li>
            ))}
          </ul>
          <p style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>Current plan</p>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--primary)', background: 'var(--border-light)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--primary-dark)' }}>⭐ Premium</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>₹99 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>/month</span></p>
          <ul style={{ paddingLeft: '18px', marginTop: '16px' }}>
            {plans.premium_features.map((f, i) => (
              <li key={i} style={{ marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text)' }}>✓ {f}</li>
            ))}
          </ul>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => alert('Payment integration coming soon! For now, enjoy all features free.')}>
            Start 7-Day Free Trial
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <h3 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>Choose your plan</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {plans.plans.map(plan => (
          <div key={plan.id} className="card" style={{ textAlign: 'center', position: 'relative' }}>
            {plan.savings && (
              <span style={{ position: 'absolute', top: '-10px', right: '10px', background: 'var(--accent)', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                {plan.savings}
              </span>
            )}
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{plan.name}</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '8px 0' }}>
              ₹{plan.price}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {plan.id === 'monthly' && 'per month'}
              {plan.id === 'quarterly' && 'for 3 months'}
              {plan.id === 'yearly' && 'per year'}
              {plan.id === 'lifetime' && 'one time'}
            </p>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '12px', fontSize: '0.82rem' }}>
              Select
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Frequently Asked Questions</h3>
        <div className="card">
          <FAQ q="Is there a free trial?" a="Yes! 7-day free trial with full Premium access. No credit card needed to start." />
          <FAQ q="Can I cancel anytime?" a="Yes, cancel anytime. You'll keep access until the end of your billing period." />
          <FAQ q="What payment methods are accepted?" a="UPI, Credit/Debit cards, Net Banking, Wallets — all via Razorpay (secure)." />
          <FAQ q="Is my data safe?" a="Yes. We don't share your health data with anyone. All data stays on your device and our secure servers." />
          <FAQ q="What if I'm not satisfied?" a="Full refund within 7 days of purchase, no questions asked." />
          <FAQ q="Do I need Premium to use the app?" a="No! Basic features are free forever. Premium unlocks unlimited AI chat, full herb details, and all tools." />
        </div>
      </div>
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border-light)', padding: '12px 0', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '0.9rem' }}>{q}</strong>
        <span>{open ? '−' : '+'}</span>
      </div>
      {open && <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-light)' }}>{a}</p>}
    </div>
  );
}

export default Pricing;
