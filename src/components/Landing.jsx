import React, { useState, useEffect } from 'react';
import StripeCheckout from './StripeCheckout';

export default function Landing({ setView, setSelectedPlan }) {
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  // Intersection Observer for Reveal Animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const plans = [
    { title: "Kids Elite", price: "$2,500 MXN", features: ["De 6 a 12 años", "4 clases a la semana", "Lunes a Jueves 17:00-18:00"], featured: false },
    { title: "Clases Elite", price: "$3,800 MXN", features: ["6 clases a la semana", "Acceso a amenidades", "NO incluye Open Gym"], featured: false },
    { title: "Full Access Elite", price: "$4,000 MXN", features: ["6 clases a la semana", "Open Gym sin límite", "Todas las amenidades Elite", "Ice Bath & Sauna"], featured: true },
    { title: "Personalizado Lite", price: "$10,000 MXN", features: ["12 sesiones mensuales", "3 veces/semana (1:30hr)", "Todas las amenidades Elite"], featured: false },
    { title: "Personalizado Elite", price: "$16,000 MXN", features: ["Entrenamiento 1 a 1", "Seguimiento milimétrico", "Todas las amenidades Elite"], featured: true },
    { title: "Semana de Visitas", price: "$1,500 MXN", features: ["5 visitas", "Open Gym o Clases", "Ice Bath & Sauna"], featured: false },
    { title: "Visita Básica", price: "$400 MXN", features: ["Sin amenidades", "Open Gym + 1 Clase"], featured: false },
    { title: "Visita Full", price: "$800 MXN", features: ["Con amenidades", "Open Gym + 1 Clase", "Ice Bath & Sauna"], featured: false },
  ];

  return (
    <>
      <nav className="navbar reveal active">
        <div className="brand-logo">ELITE <span>BY SANTUARIO</span></div>
        <button onClick={() => setView('login')} style={{background: 'transparent', border: 'none', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.7rem', cursor: 'pointer'}}>Portal Privado</button>
      </nav>

      <section className="hero-editorial">
        <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000&auto=format&fit=crop" alt="Elite Gym Interior" className="hero-bg" />
        <div className="hero-gradient"></div>
        <span className="overline reveal active d-1">The Absolute Standard in Calisthenics & Performance</span>
        <h1 className="hero-title reveal active d-2">Build Your <br/><span style={{fontStyle: 'italic', color: 'var(--primary)'}}>Temple.</span></h1>
        <button className="btn-luxury reveal active d-3" onClick={() => document.getElementById('discover').scrollIntoView({behavior: 'smooth'})} style={{marginTop: '2rem'}}>Descubrir</button>
      </section>

      <section id="discover" className="section-padding">
        <div className="editorial-grid">
          <div className="reveal">
            <span className="overline">Filosofía</span>
            <h2 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem'}}>Acondicionamiento<br/>Metabólico.</h2>
            <p style={{fontFamily: 'Montserrat', fontWeight: '300', fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8'}}>
              No somos un gimnasio comercial. Somos una obra de arte funcional. Instalaciones de alto rendimiento diseñadas meticulosamente para forjar élites mediante fuerza estructural y recuperación térmica extrema. Domina tu peso corporal y construye fuerza real.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1000&auto=format&fit=crop" alt="Training" className="editorial-image reveal d-1" />
        </div>
      </section>

      <section className="section-padding" style={{background: 'var(--bg-base)'}}>
        <div className="editorial-grid reverse">
          <div className="reveal">
            <span className="overline">Recuperación Extrema</span>
            <h2 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem'}}>Terapia de<br/>Contraste.</h2>
            <div style={{marginBottom: '2rem'}}>
              <h3 style={{fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontFamily: 'Montserrat'}}>Ice Bath</h3>
              <p style={{fontFamily: 'Montserrat', fontWeight: '300', color: 'var(--text-muted)'}}>Disminuye dolor e inflamación. Activa el sistema nervioso central, incrementa el estado de alerta y acelera la tasa metabólica.</p>
            </div>
            <div>
              <h3 style={{fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontFamily: 'Montserrat'}}>Sauna</h3>
              <p style={{fontFamily: 'Montserrat', fontWeight: '300', color: 'var(--text-muted)'}}>Elimina toxinas, mejora la circulación sanguínea y cardiovascular, y alivia dolores articulares.</p>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop" alt="Recovery" className="editorial-image reveal d-1" />
        </div>
      </section>

      <section className="section-padding">
        <div className="text-center reveal">
          <span className="overline">The Routine</span>
          <h2 style={{fontSize: '3rem'}}>Programación & Horarios.</h2>
        </div>

        <div className="schedule-container reveal d-1">
          <div className="schedule-row">
            <div className="schedule-title">Programación Semanal</div>
            <div className="schedule-details">
              <p>Lunes: <span>PULL</span></p>
              <p>Martes: <span>PIERNA</span></p>
              <p>Miércoles: <span>PUSH</span></p>
              <p>Jueves: <span>PIERNA</span></p>
              <p>Viernes: <span>PULL/PUSH</span></p>
            </div>
          </div>
          <div className="schedule-row">
            <div className="schedule-title">Clases Grupales</div>
            <div className="schedule-details">
              <p>LUN - VIE (AM): <span>6:00 - 7:30 | 7:30 - 9:00 | 9:00 - 10:30</span></p>
              <p>LUN - VIE (PM): <span>16:30 - 18:00 | 18:00 - 19:30</span> <span style={{fontSize:'0.8rem', display:'block', color:'var(--primary)'}}>*Viernes no hay clases PM</span></p>
              <p>SÁBADO: <span>8:00 - 9:30 (Grupal) | 8:30 - 9:30 (Elder)</span></p>
            </div>
          </div>
          <div className="schedule-row">
            <div className="schedule-title">Open Gym (Máquinas)</div>
            <div className="schedule-details">
              <p>LUN - VIE: <span>6:00 - 21:00</span></p>
              <p>SÁBADO: <span>8:00 - 12:00</span></p>
              <p>DOMINGO: <span>Cerrado</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{background: 'var(--bg-base)'}}>
        <div className="text-center reveal">
          <span className="overline">Exclusividad</span>
          <h2 style={{fontSize: '3rem'}}>Catálogo Oficial.</h2>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`price-card reveal ${plan.featured ? 'featured' : ''}`}>
              <h3 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{plan.title}</h3>
              <p style={{fontFamily: 'Montserrat', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '300'}}>{plan.price}</p>
              <ul>
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button className="btn-luxury" style={{width: '100%', marginTop: '2rem', padding: '1rem'}} onClick={() => setCheckoutPlan(plan)}>Inscribirme</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="section-padding text-center" style={{paddingBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <div className="brand-logo reveal">ELITE <span>BY SANTUARIO</span></div>
        <p className="reveal d-1" style={{color: 'var(--text-muted)', fontFamily: 'Montserrat', fontWeight: '300', marginTop: '2rem'}}>
          Avenida Casiopea #3804<br/>San Bernardino Tlaxcalancingo, Pue.
        </p>
        <p className="reveal d-2" style={{color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
          © 2026 Santuario Elite. Todos los derechos reservados.
        </p>
      </footer>

      {checkoutPlan && (
        <StripeCheckout selectedPlan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onSuccess={() => { setSelectedPlan(checkoutPlan); setCheckoutPlan(null); setView('setup-account'); }} />
      )}
    </>
  );
}
