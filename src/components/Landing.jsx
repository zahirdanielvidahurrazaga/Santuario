import React, { useState, useEffect } from 'react';
import StripeCheckout from './StripeCheckout';
import { CheckCircle2, Dumbbell, CalendarRange, Zap, MapPin } from 'lucide-react';

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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setView('login')} style={{background: 'transparent', border: 'none', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.7rem', cursor: 'pointer'}}>Portal Privado</button>
          <button onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})} style={{background: 'var(--primary)', border: 'none', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '600', display: 'none'}} className="desktop-cta">Únete a Nosotros</button>
        </div>
      </nav>

      {/* FAB Mobile CTA */}
      <button className="fab-mobile" onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})}>
        Únete a Nosotros
      </button>

      <section className="hero-editorial">
        <img src="/hero.png" alt="Elite Gym Interior" className="hero-bg" />
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
          <img src="/training.png" alt="Training" className="editorial-image reveal d-1" />
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
          <img src="/recovery.png" alt="Recovery" className="editorial-image reveal d-1" />
        </div>
      </section>

      <section className="section-padding">
        <div className="text-center reveal">
          <span className="overline">The Routine</span>
          <h2 style={{fontSize: '3rem'}}>Programación & Horarios.</h2>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.5rem', marginTop:'4rem'}} className="reveal d-1">
          {/* Card 1: Programación Semanal */}
          <div style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'2rem', textAlign:'center', transition:'all 0.4s'}}
            onMouseOver={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='translateY(-4px)';}}
            onMouseOut={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)';}}
          >
            <Dumbbell size={28} style={{color:'var(--primary)', marginBottom:'1.2rem'}} />
            <h3 style={{fontSize:'1.3rem', marginBottom:'1.5rem'}}>Programación Semanal</h3>
            <div style={{fontFamily:'Montserrat', fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:'2.2'}}>
              <p>Lunes: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PULL</span></p>
              <p>Martes: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PIERNA</span></p>
              <p>Miércoles: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PUSH</span></p>
              <p>Jueves: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PIERNA</span></p>
              <p>Viernes: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PULL/PUSH</span></p>
            </div>
          </div>

          {/* Card 2: Clases Grupales */}
          <div style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'2rem', textAlign:'center', transition:'all 0.4s'}}
            onMouseOver={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='translateY(-4px)';}}
            onMouseOut={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)';}}
          >
            <CalendarRange size={28} style={{color:'var(--primary)', marginBottom:'1.2rem'}} />
            <h3 style={{fontSize:'1.3rem', marginBottom:'1.5rem'}}>Clases Grupales</h3>
            <div style={{fontFamily:'Montserrat', fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:'2.2'}}>
              <p><span style={{color:'var(--text-main)', fontWeight:'400'}}>LUN - VIE (AM)</span></p>
              <p>6:00 · 7:30 · 9:00</p>
              <p><span style={{color:'var(--text-main)', fontWeight:'400'}}>LUN - VIE (PM)</span></p>
              <p>16:30 · 18:00</p>
              <p><span style={{color:'var(--text-main)', fontWeight:'400'}}>SÁBADO</span></p>
              <p>8:00 (Grupal) · 8:30 (Elder)</p>
              <p style={{fontSize:'0.75rem', color:'var(--primary)', marginTop:'0.5rem'}}>*Viernes no hay clases PM</p>
            </div>
          </div>

          {/* Card 3: Open Gym */}
          <div style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'2rem', textAlign:'center', transition:'all 0.4s'}}
            onMouseOver={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='translateY(-4px)';}}
            onMouseOut={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)';}}
          >
            <Zap size={28} style={{color:'var(--primary)', marginBottom:'1.2rem'}} />
            <h3 style={{fontSize:'1.3rem', marginBottom:'1.5rem'}}>Open Gym (Máquinas)</h3>
            <div style={{fontFamily:'Montserrat', fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:'2.2'}}>
              <p>Lunes - Viernes</p>
              <p style={{color:'var(--text-main)', fontWeight:'400', fontSize:'1.5rem', fontFamily:'Playfair Display'}}>6:00 — 21:00</p>
              <p style={{marginTop:'0.5rem'}}>Sábado</p>
              <p style={{color:'var(--text-main)', fontWeight:'400', fontSize:'1.5rem', fontFamily:'Playfair Display'}}>8:00 — 12:00</p>
              <p style={{marginTop:'0.5rem'}}>Domingo</p>
              <p style={{color:'var(--primary)', fontWeight:'600', fontSize:'1rem'}}>Cerrado</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{background: 'var(--bg-base)'}} id="pricing">
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
                {plan.features.map((f, j) => (
                  <li key={j} style={{display:'flex', alignItems:'center'}}>
                    <CheckCircle2 size={16} className="lucide-icon" style={{minWidth: '16px'}} /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-luxury" style={{width: '100%', marginTop: '2rem', padding: '1rem'}} onClick={() => setCheckoutPlan(plan)}>Inscribirme</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="section-padding text-center" style={{paddingBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <div className="brand-logo reveal">ELITE <span>BY SANTUARIO</span></div>
        <p className="reveal d-1" style={{color: 'var(--text-muted)', fontFamily: 'Montserrat', fontWeight: '300', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}>
          <MapPin size={18} className="lucide-icon" style={{margin: 0}} />
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
