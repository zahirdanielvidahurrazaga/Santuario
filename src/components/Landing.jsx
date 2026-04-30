import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import StripeCheckout from './StripeCheckout';
import ScheduleCalendar from './ScheduleCalendar';
import { CheckCircle2, Dumbbell, CalendarRange, Zap, MapPin } from 'lucide-react';

export default function Landing({ setView, setSelectedPlan, user }) {
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleSummary, setScheduleSummary] = useState(null);

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
    { title: "Full Access Elite", price: "$4,000 MXN", features: ["6 clases a la semana", "Acceso a la zona de gimnasio", "Todas las amenidades de elite"], featured: true },
    { title: "Clases Elite", price: "$3,800 MXN", features: ["6 clases a la semana", "NO incluye Open Gym", "Todas las amenidades de elite"], featured: true },
    { title: "Plan Personalizado Elite", price: "$16,000 MXN", features: ["Vigencia mensual", "Acceso a todas las amenidades"], featured: false },
    { title: "Plan Personalizado Lite", price: "$10,000 MXN", features: ["12 sesiones / 3x por semana de 1:30 hr", "Vigencia mensual", "Acceso a todas las amenidades"], featured: false },
    { title: "Kids Elite", price: "$2,500 MXN", features: ["De 6 a 12 años", "4 clases a la semana", "Lunes a Jueves 17:00-18:00"], featured: false },
    { title: "Programación Online", price: "$2,000 MXN", features: ["Adicional a tu plan actual", "Vigencia mensual", "Sin acceso al gimnasio"], featured: false },
    { title: "Semana de Visitas", price: "$1,500 MXN", features: ["5 visitas con amenidades", "Open Gym o Clases", "Sauna, Tinas, Regaderas"], featured: false },
    { title: "Visita Full", price: "$800 MXN", features: ["Visita con amenidades", "Open Gym + 1 Clase", "Sauna, Tinas, Regaderas"], featured: false },
    { title: "Visita Básica", price: "$400 MXN", features: ["Visita sin amenidades", "Open Gym", "1 Clase"], featured: false },
  ];

  return (
    <>
      {/* FAB Mobile CTA */}
      <button className="fab-mobile" onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})}>
        Únete a Nosotros
      </button>

      <section className="hero-editorial">
        <img src="/hero.png" alt="Elite Gym Interior" className="hero-bg" />
        <div className="hero-gradient"></div>
        <span className="overline reveal active d-1">The Absolute Standard in Calisthenics & Performance</span>
        <h1 className="hero-title reveal active d-2">Build Your <br/><span style={{fontStyle: 'italic', color: 'var(--primary)'}}>Temple.</span></h1>
        <button className="btn-luxury reveal active d-3" onClick={() => document.getElementById('explore').scrollIntoView({behavior: 'smooth'})} style={{marginTop: '2rem'}}>Descubrir</button>
      </section>

      {/* QUICK INTERACTIVE NAVIGATION (KOLLECTIVE STYLE) */}
      <section id="explore" className="section-padding" style={{paddingTop: '4rem', paddingBottom: '4rem'}}>
        <div className="nav-cards-grid">
          <div className="nav-card reveal" onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})}>
            <img src="/community.png" alt="Comunidad Elite" className="nav-card-img" />
            <div className="nav-card-overlay">
              <h3 className="nav-card-title">Únete a la Comunidad</h3>
              <p className="nav-card-desc">Exclusividad y rendimiento</p>
            </div>
          </div>
          
          <div className="nav-card reveal d-1" onClick={() => setView('register')}>
            <img src="/app_mockup.png" alt="Santuario Digital" className="nav-card-img" />
            <div className="nav-card-overlay">
              <h3 className="nav-card-title">Santuario Digital</h3>
              <p className="nav-card-desc">Tu progreso 24/7 en el bolsillo</p>
            </div>
          </div>

          <div className="nav-card reveal d-2" onClick={() => document.getElementById('discover').scrollIntoView({behavior: 'smooth'})}>
            <img src="/coaching.png" alt="Metodología" className="nav-card-img" />
            <div className="nav-card-overlay">
              <h3 className="nav-card-title">Metodología Élite</h3>
              <p className="nav-card-desc">Sistemas de entrenamiento probados</p>
            </div>
          </div>
        </div>
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
          <div className="nav-card reveal d-1" style={{height: '70vh', minHeight: 'unset'}} onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})}>
            <img src="/calisthenics_workout.png" alt="Fuerza Estructural" className="nav-card-img" />
            <div className="nav-card-overlay">
               <h3 className="nav-card-title" style={{fontSize: '2rem'}}>Fuerza Estructural</h3>
               <p className="nav-card-desc">Biomecánica avanzada</p>
            </div>
          </div>
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
          <div className="nav-card reveal d-1" style={{height: '70vh', minHeight: 'unset'}} onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})}>
            <img src="/ice_bath.png" alt="Recuperación Extrema" className="nav-card-img" />
            <div className="nav-card-overlay">
               <h3 className="nav-card-title" style={{fontSize: '2rem'}}>Recuperación Extrema</h3>
               <p className="nav-card-desc">Domina la regeneración celular</p>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="section-padding">
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
            <div style={{fontFamily:'Montserrat', fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:'2.2', flex: 1}}>
              <p>Lunes: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PULL</span></p>
              <p>Martes: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PIERNA</span></p>
              <p>Miércoles: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PUSH</span></p>
              <p>Jueves: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PIERNA</span></p>
              <p>Viernes: <span style={{color:'var(--text-main)', fontWeight:'400'}}>PULL/PUSH</span></p>
            </div>
            <button className="btn-luxury" style={{width: '100%', padding: '0.8rem', marginTop: '1.5rem'}} onClick={() => setShowSchedule(true)}>Ver Horarios</button>
          </div>

          {/* Card 2: Clases Grupales */}
          <div style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'2rem', textAlign:'center', transition:'all 0.4s', display: 'flex', flexDirection: 'column'}}
            onMouseOver={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='translateY(-4px)';}}
            onMouseOut={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)';}}
          >
            <CalendarRange size={28} style={{color:'var(--primary)', marginBottom:'1.2rem', margin: '0 auto'}} />
            <h3 style={{fontSize:'1.3rem', marginBottom:'1.5rem'}}>Clases Grupales</h3>
            <div style={{fontFamily:'Montserrat', fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:'2.2', flex: 1}}>
              <p><span style={{color:'var(--text-main)', fontWeight:'400'}}>LUN - VIE (AM)</span></p>
              <p>6:00 · 7:30 · 9:00</p>
              <p><span style={{color:'var(--text-main)', fontWeight:'400'}}>LUN - VIE (PM)</span></p>
              <p>16:30 · 18:00</p>
              <p><span style={{color:'var(--text-main)', fontWeight:'400'}}>SÁBADO</span></p>
              <p>8:00 (Grupal) · 8:30 (Elder)</p>
              <p style={{fontSize:'0.75rem', color:'var(--primary)', marginTop:'0.5rem'}}>*Viernes no hay clases PM</p>
            </div>
            <button className="btn-luxury" style={{width: '100%', padding: '0.8rem', marginTop: '1.5rem'}} onClick={() => setShowSchedule(true)}>Agendar Clase</button>
          </div>

          {/* Card 3: Open Gym */}
          <div style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'2rem', textAlign:'center', transition:'all 0.4s', display: 'flex', flexDirection: 'column'}}
            onMouseOver={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='translateY(-4px)';}}
            onMouseOut={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)';}}
          >
            <Zap size={28} style={{color:'var(--primary)', marginBottom:'1.2rem', margin: '0 auto'}} />
            <h3 style={{fontSize:'1.3rem', marginBottom:'1.5rem'}}>Open Gym (Máquinas)</h3>
            <div style={{fontFamily:'Montserrat', fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:'2.2', flex: 1}}>
              <p>Lunes - Viernes</p>
              <p style={{color:'var(--text-main)', fontWeight:'400', fontSize:'1.5rem', fontFamily:'Playfair Display'}}>6:00 — 21:00</p>
              <p style={{marginTop:'0.5rem'}}>Sábado</p>
              <p style={{color:'var(--text-main)', fontWeight:'400', fontSize:'1.5rem', fontFamily:'Playfair Display'}}>8:00 — 12:00</p>
              <p style={{marginTop:'0.5rem'}}>Domingo</p>
              <p style={{color:'var(--primary)', fontWeight:'600', fontSize:'1rem'}}>Cerrado</p>
            </div>
            <button className="btn-luxury" style={{width: '100%', padding: '0.8rem', marginTop: '1.5rem'}} onClick={() => setCheckoutPlan(plans.find(p => p.title === 'Full Access Elite'))}>Reservar Acceso</button>
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

      {checkoutPlan && <StripeCheckout selectedPlan={checkoutPlan} user={user} scheduleSummary={scheduleSummary} onClose={() => { setCheckoutPlan(null); setScheduleSummary(null); }} onSuccess={async () => {
        if (user) {
          const expiry = new Date();
          expiry.setMonth(expiry.getMonth() + 1);
          await supabase.from('users').update({
            membership_plan: checkoutPlan.title,
            membership_status: 'ACTIVE',
            membership_expiry: expiry.toISOString().split('T')[0]
          }).eq('id', user.id);
          setCheckoutPlan(null);
          setScheduleSummary(null);
          setView('client-portal');
        } else {
          setSelectedPlan(checkoutPlan);
          setCheckoutPlan(null);
          setScheduleSummary(null);
          setView('register');
        }
      }} />}
      {showSchedule && <ScheduleCalendar onClose={() => setShowSchedule(false)} onSelectClass={(data) => {
        setShowSchedule(false);
        const planKey = data.planKey || 'Clases Elite';
        const plan = plans.find(p => p.title === planKey);
        if (plan) {
          setScheduleSummary(data.selectedClasses || []);
          setCheckoutPlan(plan);
        }
      }} />}
    </>
  );
}
