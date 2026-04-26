import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { QRCodeCanvas } from 'qrcode.react';
import './index.css';

// ============================================
// STRIPE CHECKOUT MODAL (SIMULATION)
// ============================================
function StripeCheckout({ selectedPlan, onClose, onSuccess }) {
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
              <div style={{ display: 'flex', gap: '2rem' }}>
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

// ============================================
// MAIN EDITORIAL LANDING PAGE
// ============================================
function Landing({ setView }) {
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
        <span className="overline reveal active d-1">The Absolute Standard</span>
        <h1 className="hero-title reveal active d-2">Build Your <br/><span style={{fontStyle: 'italic', color: 'var(--primary)'}}>Temple.</span></h1>
        <button className="btn-luxury reveal active d-3" onClick={() => document.getElementById('discover').scrollIntoView({behavior: 'smooth'})} style={{marginTop: '2rem'}}>Descubrir</button>
      </section>

      <section id="discover" className="section-padding">
        <div className="editorial-grid">
          <div className="reveal">
            <span className="overline">Filosofía</span>
            <h2 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem'}}>Acondicionamiento<br/>Metabólico.</h2>
            <p style={{fontFamily: 'Montserrat', fontWeight: '300', fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8'}}>
              No somos un gimnasio comercial. Somos una obra de arte funcional. Instalaciones de alto rendimiento diseñadas meticulosamente para forjar élites mediante fuerza estructural y recuperación térmica extrema.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1000&auto=format&fit=crop" alt="Training" className="editorial-image reveal d-1" />
        </div>
      </section>

      <section className="section-padding" style={{background: '#040507'}}>
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

      <section className="section-padding" style={{background: '#040507'}}>
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
        <StripeCheckout selectedPlan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onSuccess={() => { setCheckoutPlan(null); setView('setup-account'); }} />
      )}
    </>
  );
}

// ============================================
// COMPLETE ACCOUNT SETUP (POST-PAYMENT)
// ============================================
function SetupAccount({ setView, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setUser(data.user);
      alert("¡Cuenta configurada! Bienvenida a Santuario Elite.");
      setView('dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{width: '100%', maxWidth: '500px'}} className="reveal active">
        <span className="overline text-center">Paso Final</span>
        <h2 className="text-center" style={{fontSize: '3rem', marginBottom: '2rem'}}>Activa tu<br/><span style={{fontStyle: 'italic', color: 'var(--primary)'}}>Perfil.</span></h2>
        
        {error && <p style={{color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.8rem'}}>{error}</p>}

        <form onSubmit={handleSetup}>
          <input type="text" placeholder="Nombre Completo" className="input-editorial" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Correo Electrónico" className="input-editorial" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Crear Contraseña" className="input-editorial" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn-luxury" style={{width: '100%', marginTop: '2rem'}} disabled={loading}>{loading ? 'Configurando...' : 'Acceder al Portal'}</button>
        </form>
      </div>
    </div>
  );
}

function Login({ setView, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setUser(data.user);
      setView('dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{width: '100%', maxWidth: '400px'}} className="reveal active">
        <span className="overline text-center">Acceso Restringido</span>
        <h2 className="text-center" style={{fontSize: '3rem', marginBottom: '3rem'}}>Portal.</h2>
        
        {error && <p style={{color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.8rem'}}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo Electrónico" className="input-editorial" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" className="input-editorial" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn-luxury" style={{width: '100%', marginTop: '2rem'}} disabled={loading}>{loading ? 'Validando...' : 'Ingresar'}</button>
          <button type="button" style={{width: '100%', marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontFamily: 'Montserrat', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem'}} onClick={() => setView('landing')}>Volver al sitio</button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ setView, user }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }} className="reveal active">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem'}}>
        <div className="brand-logo">ELITE <span>APP</span></div>
        <button onClick={handleLogout} style={{background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Montserrat', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em'}}>Cerrar Sesión</button>
      </div>
      
      <span className="overline">Bienvenido</span>
      <h2 style={{fontSize: '4rem', marginBottom: '4rem'}}>Membresía <span style={{fontStyle: 'italic', color: 'var(--primary)'}}>Activa.</span></h2>
      
      <div className="editorial-grid" style={{marginBottom: '4rem'}}>
        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', padding: '2rem 0'}}>
          <span className="overline">Protocolo de Hoy</span>
          <h3 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Hypertrophy</h3>
          <p style={{fontFamily: 'Montserrat', fontWeight: '300', color: 'var(--text-muted)'}}>Coach: Héctor Vega</p>
        </div>
        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', padding: '2rem 0'}}>
          <span className="overline">Próxima Reserva</span>
          <h3 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Ice Bath</h3>
          <p style={{fontFamily: 'Montserrat', fontWeight: '300', color: 'var(--text-muted)'}}>Hoy, 19:00 HRS</p>
        </div>
      </div>

      {/* Sección de Pase Personal (QR) */}
      <div style={{ marginTop: '6rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6rem' }}>
        <span className="overline">Pase Digital Elite</span>
        <h2 style={{fontSize: '2rem', marginBottom: '3rem'}}>Tu Acceso <span style={{fontStyle: 'italic'}}>Personal.</span></h2>
        
        <div style={{ 
          display: 'inline-block', 
          padding: '2.5rem', 
          background: 'white', 
          borderRadius: '24px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
        }}>
          <QRCodeCanvas 
            value={user?.id || 'invitado'} 
            size={220}
            level={"H"}
            includeMargin={true}
          />
        </div>
        <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontFamily: 'Montserrat', fontSize: '0.9rem', fontWeight: '300' }}>
          Muestra este código al lector oficial en recepción.
        </p>
      </div>
    </div>
  );
}

// ============================================
// MAIN ROUTER
// ============================================
export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Escuchar cambios de sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) setView('dashboard');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) setView('dashboard');
    });

    return () => subscription.unsubscribe();
  }, []);

  switch (view) {
    case 'landing': return <Landing setView={setView} />;
    case 'login': return <Login setView={setView} setUser={setUser} />;
    case 'setup-account': return <SetupAccount setView={setView} setUser={setUser} />;
    case 'dashboard': return <Dashboard setView={setView} user={user} />;
    default: return <Landing setView={setView} />;
  }
}
