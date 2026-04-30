import React, { useState } from 'react';
import { Check, Calendar } from 'lucide-react';

const dayAbbrev = { Lunes:'LUN', Martes:'MAR', Miércoles:'MIÉ', Jueves:'JUE', Viernes:'VIE', Sábado:'SÁB', Domingo:'DOM' };

export default function StripeCheckout({ selectedPlan, onClose, onSuccess, user, scheduleSummary }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimeout(() => { onSuccess(); }, 1500);
    }, 2000);
  };

  // Group selected classes by day
  const groupedClasses = {};
  if (scheduleSummary && scheduleSummary.length > 0) {
    scheduleSummary.forEach(cls => {
      if (!groupedClasses[cls.day]) groupedClasses[cls.day] = [];
      groupedClasses[cls.day].push(cls);
    });
  }
  const orderedDays = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  return (
    <div className="stripe-modal-overlay">
      <div className="stripe-modal">
        {step === 1 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span className="overline" style={{margin: 0}}>Checkout Seguro</span>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            {/* Plan Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{selectedPlan.title}</h2>
              <p style={{ fontFamily: 'Montserrat', fontWeight: '200', fontSize: '1.3rem', color: 'var(--text-muted)' }}>{selectedPlan.price}</p>
            </div>

            {/* Schedule Summary */}
            {scheduleSummary && scheduleSummary.length > 0 && (
              <div className="checkout-schedule-summary">
                <div className="checkout-summary-header">
                  <Calendar size={14} color="var(--primary)" />
                  <span>Tu Horario</span>
                </div>
                <div className="checkout-summary-list">
                  {orderedDays.filter(d => groupedClasses[d]).map(day => (
                    <div key={day} className="checkout-summary-day">
                      <span className="checkout-day-label">{dayAbbrev[day]}</span>
                      <div className="checkout-day-classes">
                        {groupedClasses[day].map((cls, i) => (
                          <span key={i} className="checkout-class-chip">
                            {cls.time}–{cls.end} <span style={{opacity:0.6}}>·</span> {cls.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handlePayment}>
              {user ? (
                <input type="email" placeholder="Correo Electrónico" className="input-editorial" required value={user.email} readOnly style={{opacity: 0.5}} />
              ) : (
                <input type="email" placeholder="Correo Electrónico" className="input-editorial" required />
              )}
              <input type="text" placeholder="Número de Tarjeta" className="input-editorial" required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder="MM/AA" className="input-editorial" required />
                <input type="text" placeholder="CVC" className="input-editorial" required />
              </div>
              
              <button type="submit" className="btn-luxury" style={{width: '100%', marginTop: '1.5rem'}} disabled={loading}>
                {loading ? 'Validando con Stripe...' : 'Completar Inscripción'}
              </button>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pagos encriptados de extremo a extremo.
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{width:'60px', height:'60px', borderRadius:'50%', background:'rgba(74,222,128,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem'}}>
              <Check size={28} color="#4ade80" />
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Aprobado.</h2>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Montserrat', fontWeight: '300', fontSize:'0.9rem' }}>Iniciando sesión en tu portal Elite...</p>
          </div>
        )}
      </div>
    </div>
  );
}
