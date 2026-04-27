import React, { useState } from 'react';

export default function StripeCheckout({ selectedPlan, onClose, onSuccess }) {
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

  return (
    <div className="stripe-modal-overlay">
      <div className="stripe-modal">
        {step === 1 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <span className="overline" style={{margin: 0}}>Checkout Seguro</span>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedPlan.title}</h2>
              <p style={{ fontFamily: 'Montserrat', fontWeight: '200', fontSize: '1.5rem', color: 'var(--text-muted)' }}>{selectedPlan.price}</p>
            </div>

            <form onSubmit={handlePayment}>
              <input type="email" placeholder="Correo Electrónico" className="input-editorial" required />
              <input type="text" placeholder="Número de Tarjeta" className="input-editorial" required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder="MM/AA" className="input-editorial" required />
                <input type="text" placeholder="CVC" className="input-editorial" required />
              </div>
              
              <button type="submit" className="btn-luxury" style={{width: '100%', marginTop: '2rem'}} disabled={loading}>
                {loading ? 'Validando con Stripe...' : 'Completar Inscripción'}
              </button>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1.5rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pagos encriptados de extremo a extremo.
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Aprobado.</h2>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Montserrat', fontWeight: '300' }}>Iniciando sesión en tu portal Elite...</p>
          </div>
        )}
      </div>
    </div>
  );
}
