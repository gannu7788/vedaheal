import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Protocol() {
  const { symptomId } = useParams();
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('remedies');

  useEffect(() => {
    fetch(`/api/protocol/${symptomId}`)
      .then(res => res.json())
      .then(data => { setProtocol(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [symptomId]);

  if (loading) return <div className="loading">Loading your healing protocol...</div>;
  if (!protocol) return <div className="loading">Protocol not found.</div>;

  const { symptom, remedies, yoga } = protocol;

  return (
    <div>
      <Link to="/symptoms" className="back-link">← Back to Problems</Link>

      {/* Symptom Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', borderColor: '#bbf7d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{symptom.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{symptom.name_hi}</p>
          </div>
          <span className={`tag tag-${symptom.dosha_association?.toLowerCase()}`}>
            {symptom.dosha_association} Dosha
          </span>
        </div>
        <p style={{ color: 'var(--text-light)', marginTop: '10px', fontSize: '0.92rem' }}>{symptom.description}</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'remedies', label: '🌱 Remedies' },
          { key: 'yoga', label: '🧘 Yoga' },
          { key: 'routine', label: '📋 Daily Routine' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Remedies Tab */}
      {activeTab === 'remedies' && (
        <div>
          {remedies.herbs?.length > 0 && (
            <>
              <h3 className="section-title">🌿 Herbs & Medicines <span className="section-subtitle">({remedies.herbs.length})</span></h3>
              {remedies.herbs.map(r => <RemedyCard key={r.id} remedy={r} />)}
            </>
          )}
          {remedies.diet?.length > 0 && (
            <>
              <h3 className="section-title">🍽️ Diet Recommendations <span className="section-subtitle">({remedies.diet.length})</span></h3>
              {remedies.diet.map(r => <RemedyCard key={r.id} remedy={r} />)}
            </>
          )}
          {remedies.lifestyle?.length > 0 && (
            <>
              <h3 className="section-title">🏡 Lifestyle Changes <span className="section-subtitle">({remedies.lifestyle.length})</span></h3>
              {remedies.lifestyle.map(r => <RemedyCard key={r.id} remedy={r} />)}
            </>
          )}
          {remedies.home_remedies?.length > 0 && (
            <>
              <h3 className="section-title">🏠 Home Remedies <span className="section-subtitle">({remedies.home_remedies.length})</span></h3>
              {remedies.home_remedies.map(r => <RemedyCard key={r.id} remedy={r} />)}
            </>
          )}
        </div>
      )}

      {/* Yoga Tab */}
      {activeTab === 'yoga' && (
        <div>
          {yoga.asanas?.length > 0 && (
            <>
              <h3 className="section-title">🧘 Asanas (Poses) <span className="section-subtitle">({yoga.asanas.length})</span></h3>
              {yoga.asanas.map(y => <YogaCard key={y.id} exercise={y} />)}
            </>
          )}
          {yoga.pranayama?.length > 0 && (
            <>
              <h3 className="section-title">🌬️ Pranayama (Breathing) <span className="section-subtitle">({yoga.pranayama.length})</span></h3>
              {yoga.pranayama.map(y => <YogaCard key={y.id} exercise={y} />)}
            </>
          )}
          {yoga.meditation?.length > 0 && (
            <>
              <h3 className="section-title">🧠 Meditation <span className="section-subtitle">({yoga.meditation.length})</span></h3>
              {yoga.meditation.map(y => <YogaCard key={y.id} exercise={y} />)}
            </>
          )}
        </div>
      )}

      {/* Daily Routine Tab */}
      {activeTab === 'routine' && (
        <div className="card">
          <h3 style={{ marginBottom: '6px' }}>🌅 Suggested Daily Routine</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Follow consistently for 2-4 weeks to see results
          </p>
          <div>
            <RoutineItem time="6:00 AM" activity="Wake up, drink warm water with lemon" />
            <RoutineItem time="6:30 AM" activity={`Yoga: ${yoga.asanas?.[0]?.name || 'Morning stretches'}`} />
            <RoutineItem time="7:00 AM" activity={`Pranayama: ${yoga.pranayama?.[0]?.name || 'Deep breathing'} (5 mins)`} />
            <RoutineItem time="7:30 AM" activity={`Remedy: ${remedies.herbs?.[0]?.title || 'As prescribed'}`} />
            <RoutineItem time="8:00 AM" activity="Breakfast (follow diet recommendations)" />
            <RoutineItem time="12:30 PM" activity="Lunch — largest meal of the day" />
            <RoutineItem time="6:30 PM" activity="Evening walk (15-20 mins)" />
            <RoutineItem time="7:30 PM" activity="Light dinner" />
            <RoutineItem time="9:00 PM" activity="Relaxation / meditation" />
            <RoutineItem time="10:00 PM" activity="Sleep" />
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="card-warning card" style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '0.84rem' }}>
          ⚠️ <strong>Disclaimer:</strong> {protocol.disclaimer}
        </p>
      </div>
    </div>
  );
}

function RemedyCard({ remedy }) {
  return (
    <div className="remedy-card">
      <div className="remedy-header">
        <div>
          <div className="remedy-title">{remedy.title}</div>
          {remedy.title_hi && <div className="remedy-title-hi">{remedy.title_hi}</div>}
        </div>
        <span className={`tag tag-${remedy.type}`}>{remedy.type.replace('_', ' ')}</span>
      </div>
      <p className="remedy-description">{remedy.description}</p>
      {remedy.how_to_use && (
        <div className="remedy-usage">
          <strong>How to use:</strong> {remedy.how_to_use}
        </div>
      )}
      {remedy.precautions && (
        <div className="remedy-precaution">
          <span>⚠️</span> <span>{remedy.precautions}</span>
        </div>
      )}
    </div>
  );
}

function YogaCard({ exercise }) {
  return (
    <div className="yoga-card">
      <div className="yoga-header">
        <div>
          <div className="yoga-name">{exercise.name}</div>
          {exercise.sanskrit_name && <div className="yoga-sanskrit">{exercise.sanskrit_name}</div>}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className={`tag tag-${exercise.type}`}>{exercise.type}</span>
          <span className="tag" style={{ background: '#f3f4f6', color: '#4b5563' }}>{exercise.difficulty}</span>
        </div>
      </div>
      <div className="yoga-meta">
        {exercise.duration_minutes && (
          <span className="yoga-duration">⏱️ {exercise.duration_minutes} min</span>
        )}
      </div>
      <div className="yoga-steps">
        <strong>Steps:</strong><br />
        {exercise.steps}
      </div>
      {exercise.benefits && (
        <div className="yoga-benefits">
          ✅ <strong>Benefits:</strong> {exercise.benefits}
        </div>
      )}
      {exercise.precautions && (
        <div className="remedy-precaution">
          <span>⚠️</span> <span>{exercise.precautions}</span>
        </div>
      )}
    </div>
  );
}

function RoutineItem({ time, activity }) {
  return (
    <div className="routine-item">
      <span className="routine-time">{time}</span>
      <span className="routine-activity">{activity}</span>
    </div>
  );
}

export default Protocol;
