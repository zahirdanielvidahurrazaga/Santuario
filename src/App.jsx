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
function Landing({ setView, setSelectedPlan }) {
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
        <StripeCheckout selectedPlan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onSuccess={() => { setSelectedPlan(checkoutPlan); setCheckoutPlan(null); setView('setup-account'); }} />
      )}
    </>
  );
}

// ============================================
// COMPLETE ACCOUNT SETUP (POST-PAYMENT)
// ============================================
function SetupAccount({ setView, setUser, selectedPlan }) {
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
      // Activar membresía con el plan que pagó
      if (data.user) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);
        await supabase.from('users').update({
          membership_plan: selectedPlan?.title || 'Plan Elite',
          membership_status: 'ACTIVE',
          membership_expiry: expiry.toISOString().split('T')[0]
        }).eq('id', data.user.id);
      }
      setUser(data.user);
      alert('¡Cuenta configurada! Bienvenido a Santuario Elite.');
      setView('client-portal');
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

// ============================================
// CLIENT PORTAL (APP MODE)
// ============================================
function ClientPortal({ setView, user }) {
  const [occupancy, setOccupancy] = useState(0);
  const [profile, setProfile] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  // Fetch profile and occupancy
  useEffect(() => {
    const fetchData = async () => {
      // Get user profile
      const { data: prof } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (prof) setProfile(prof);

      // Get current occupancy (check-ins today without check-out)
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .gte('checked_in_at', today)
        .is('checked_out_at', null);
      setOccupancy(count || 0);
    };
    fetchData();

    // Poll occupancy every 30 seconds
    const interval = setInterval(async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .gte('checked_in_at', today)
        .is('checked_out_at', null);
      setOccupancy(count || 0);
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const schedule = [
    { day: 'Lunes', type: 'PULL', am: '6:00 - 7:30', pm: '16:30 - 18:00', coach: 'Héctor Vega' },
    { day: 'Martes', type: 'PIERNA', am: '7:30 - 9:00', pm: '18:00 - 19:30', coach: 'Daniel Ramos' },
    { day: 'Miércoles', type: 'PUSH', am: '6:00 - 7:30', pm: '16:30 - 18:00', coach: 'Héctor Vega' },
    { day: 'Jueves', type: 'PIERNA', am: '7:30 - 9:00', pm: '18:00 - 19:30', coach: 'Daniel Ramos' },
    { day: 'Viernes', type: 'PULL/PUSH', am: '9:00 - 10:30', pm: '—', coach: 'Héctor Vega' },
    { day: 'Sábado', type: 'GRUPAL', am: '8:00 - 9:30', pm: '—', coach: 'Equipo Elite' },
  ];

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="brand-logo">ELITE <span>APP</span></div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {/* Occupancy */}
      <div className="occupancy-card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'0.5rem'}}>
          <span className="pulse-dot"></span>
          <span className="occupancy-label">En vivo</span>
        </div>
        <div className="occupancy-number">{occupancy}</div>
        <div className="occupancy-label">personas en Santuario ahora</div>
      </div>

      {/* QR Pass */}
      <div className="app-section" style={{textAlign:'center'}}>
        <div className="app-section-title">Pase Digital Elite</div>
        <div style={{display:'inline-block',padding:'2rem',background:'white',borderRadius:'20px',boxShadow:'0 20px 50px rgba(0,0,0,0.4)'}}>
          <QRCodeCanvas value={user?.id || 'invitado'} size={200} level={"H"} includeMargin={true} />
        </div>
        <p style={{marginTop:'1.5rem',color:'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.8rem',fontWeight:'300'}}>Muestra este código al lector en recepción.</p>
      </div>

      {/* My Plan */}
      <div className="app-section">
        <div className="app-section-title">Mi Membresía</div>
        <div className="plan-card">
          <div>
            <h3 style={{fontFamily:'Playfair Display',fontSize:'1.5rem',marginBottom:'0.3rem'}}>{profile?.membership_plan || 'Sin plan asignado'}</h3>
            <p style={{fontFamily:'Montserrat',fontWeight:'300',fontSize:'0.85rem',color:'var(--text-muted)'}}>
              {profile?.membership_expiry ? `Vence: ${new Date(profile.membership_expiry).toLocaleDateString('es-MX')}` : 'Contacta al administrador'}
            </p>
          </div>
          <span className={profile?.membership_status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>
            {profile?.membership_status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>

      {/* Schedule */}
      <div className="app-section">
        <div className="app-section-title">Horarios & Coaches</div>
        <div style={{overflowX:'auto'}}>
          <table className="schedule-table">
            <thead><tr><th>Día</th><th>Clase</th><th>AM</th><th>PM</th><th>Coach</th></tr></thead>
            <tbody>
              {schedule.map((s, i) => (
                <tr key={i}><td>{s.day}</td><td>{s.type}</td><td>{s.am}</td><td>{s.pm}</td><td>{s.coach}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open Gym Hours */}
      <div className="app-section">
        <div className="app-section-title">Open Gym (Máquinas)</div>
        <table className="schedule-table">
          <tbody>
            <tr><td>Lunes - Viernes</td><td>6:00 - 21:00</td></tr>
            <tr><td>Sábado</td><td>8:00 - 12:00</td></tr>
            <tr><td>Domingo</td><td>Cerrado</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// ADMIN DASHBOARD
// ============================================
function AdminDashboard({ setView, user }) {
  const [adminTab, setAdminTab] = useState('access'); // 'access' or 'financial'
  const [scanInput, setScanInput] = useState('');
  const [scanLog, setScanLog] = useState([]);
  const [flashAlert, setFlashAlert] = useState(null);
  const [scannedProfile, setScannedProfile] = useState(null);
  const [stats, setStats] = useState({ occupancy: 0, checkinsToday: 0, totalMembers: 0 });
  const [members, setMembers] = useState([]);
  const scanRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  useEffect(() => {
    const fetchAll = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count: occ } = await supabase.from('attendance').select('*', { count: 'exact', head: true }).gte('checked_in_at', today).is('checked_out_at', null);
      const { count: checkins } = await supabase.from('attendance').select('*', { count: 'exact', head: true }).gte('checked_in_at', today);
      const { count: total } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { data: memberList } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(50);
      const { data: todayScans } = await supabase.from('attendance').select('*, users(full_name, email, membership_status, membership_plan)').gte('checked_in_at', today).order('checked_in_at', { ascending: false }).limit(20);

      setStats({ occupancy: occ || 0, checkinsToday: checkins || 0, totalMembers: total || 0 });
      setMembers(memberList || []);
      setScanLog(todayScans || []);
    };
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus scanner when on access tab
  useEffect(() => { if (scanRef.current && adminTab === 'access') scanRef.current.focus(); }, [adminTab]);

  // Handle QR Scan
  const handleScan = async (e) => {
    if (e.key !== 'Enter' || !scanInput.trim()) return;
    const userId = scanInput.trim();
    setScanInput('');
    setScannedProfile(null);

    const { data: scannedUser, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error || !scannedUser) {
      setFlashAlert({ type: 'error', message: '⚠ Usuario no encontrado en el sistema.' });
      setScannedProfile(null);
      setTimeout(() => setFlashAlert(null), 5000);
      if (scanRef.current) scanRef.current.focus();
      return;
    }

    // Show client profile card
    setScannedProfile(scannedUser);

    // Check for duplicate (already checked in within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase.from('attendance').select('id').eq('user_id', userId).gte('checked_in_at', oneHourAgo).limit(1);

    if (recent && recent.length > 0) {
      setFlashAlert({ type: 'error', message: `⚠ ${scannedUser.full_name || scannedUser.email} — Ya registrado (hace menos de 1 hora)` });
      setTimeout(() => setFlashAlert(null), 5000);
      if (scanRef.current) scanRef.current.focus();
      return;
    }

    const isActive = scannedUser.membership_status === 'ACTIVE';

    if (isActive) {
      await supabase.from('attendance').insert({ user_id: userId, method: 'QR' });
      setFlashAlert({ type: 'success', message: `✓ ${scannedUser.full_name || scannedUser.email} — ACCESO PERMITIDO` });
      setStats(prev => ({ ...prev, occupancy: prev.occupancy + 1, checkinsToday: prev.checkinsToday + 1 }));
      setScanLog(prev => [{ users: scannedUser, checked_in_at: new Date().toISOString(), status: 'success' }, ...prev]);
    } else {
      setFlashAlert({ type: 'error', message: `⚠ ${scannedUser.full_name || scannedUser.email} — MEMBRESÍA INACTIVA` });
      setScanLog(prev => [{ users: scannedUser, checked_in_at: new Date().toISOString(), status: 'error' }, ...prev]);
    }

    setTimeout(() => setFlashAlert(null), 5000);
    if (scanRef.current) scanRef.current.focus();
  };

  // Delete an entry
  const handleDeleteEntry = async (id) => {
    if (!window.confirm('¿Eliminar este registro de entrada?')) return;
    const { error } = await supabase.from('attendance').delete().eq('id', id);
    if (!error) {
      setScanLog(prev => prev.filter(entry => entry.id !== id));
      setStats(prev => ({ ...prev, occupancy: Math.max(0, prev.occupancy - 1), checkinsToday: Math.max(0, prev.checkinsToday - 1) }));
    }
  };

  // Financial data
  const weeklyData = [
    { label: 'Sem 1', value: 35000 },
    { label: 'Sem 2', value: 42000 },
    { label: 'Sem 3', value: 38000 },
    { label: 'Sem 4', value: 27000 },
  ];
  const maxVal = Math.max(...weeklyData.map(w => w.value));
  const totalRevenue = weeklyData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="brand-logo">ELITE <span style={{color:'var(--primary)'}}>ADMIN</span></div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {/* Tab Navigation */}
      <div style={{display:'flex',gap:'0',marginBottom:'2rem',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <button onClick={() => setAdminTab('access')} style={{flex:1,padding:'1rem',background:'transparent',border:'none',color: adminTab === 'access' ? 'var(--text-main)' : 'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.15em',fontWeight: adminTab === 'access' ? '600' : '300',cursor:'pointer',borderBottom: adminTab === 'access' ? '2px solid var(--primary)' : '2px solid transparent',transition:'all 0.3s'}}>
          Control de Acceso
        </button>
        <button onClick={() => setAdminTab('financial')} style={{flex:1,padding:'1rem',background:'transparent',border:'none',color: adminTab === 'financial' ? 'var(--text-main)' : 'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.15em',fontWeight: adminTab === 'financial' ? '600' : '300',cursor:'pointer',borderBottom: adminTab === 'financial' ? '2px solid var(--primary)' : '2px solid transparent',transition:'all 0.3s'}}>
          Financiero
        </button>
      </div>

      {/* ===== TAB: CONTROL DE ACCESO ===== */}
      {adminTab === 'access' && (
        <>
          {flashAlert && <div className={`flash-alert ${flashAlert.type}`}>{flashAlert.message}</div>}

          {/* Stat Cards */}
          <div className="stat-grid">
            <div className="stat-card highlight">
              <div className="stat-label"><span className="pulse-dot"></span> En el Gym</div>
              <div className="stat-value">{stats.occupancy}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Check-ins Hoy</div>
              <div className="stat-value">{stats.checkinsToday}</div>
            </div>
          </div>

          {/* QR Scanner */}
          <div className="app-section">
            <div className="app-section-title">Lector de Acceso QR</div>
            <input
              ref={scanRef}
              className="scanner-input"
              placeholder="Esperando escaneo del lector..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={handleScan}
              autoFocus
            />
          </div>

          {/* Scanned Client Profile Card */}
          {scannedProfile && (
            <div className="app-section" style={{borderTop:'none',paddingTop:0}}>
              <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                  <div>
                    <h3 style={{fontFamily:'Playfair Display',fontSize:'1.5rem',marginBottom:'0.3rem'}}>{scannedProfile.full_name || 'Sin nombre'}</h3>
                    <p style={{fontFamily:'Montserrat',fontWeight:'300',fontSize:'0.8rem',color:'var(--text-muted)'}}>{scannedProfile.email}</p>
                  </div>
                  <span className={scannedProfile.membership_status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>
                    {scannedProfile.membership_status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <p style={{fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--text-muted)',fontFamily:'Montserrat',fontWeight:'600',marginBottom:'0.3rem'}}>Plan</p>
                    <p style={{fontFamily:'Montserrat',fontSize:'0.9rem',color:'var(--text-main)'}}>{scannedProfile.membership_plan || '—'}</p>
                  </div>
                  <div>
                    <p style={{fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--text-muted)',fontFamily:'Montserrat',fontWeight:'600',marginBottom:'0.3rem'}}>Vencimiento</p>
                    <p style={{fontFamily:'Montserrat',fontSize:'0.9rem',color:'var(--text-main)'}}>{scannedProfile.membership_expiry ? new Date(scannedProfile.membership_expiry).toLocaleDateString('es-MX') : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scan Log */}
          <div className="app-section">
            <div className="app-section-title">Entradas de Hoy</div>
            {scanLog.length === 0 && <p style={{color:'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.85rem'}}>Sin registros aún.</p>}
            {scanLog.slice(0, 15).map((entry, i) => (
              <div key={i} className={`scan-entry ${entry.status || (entry.users?.membership_status === 'ACTIVE' ? 'success' : 'error')}`} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <span className="scan-name">{entry.users?.full_name || entry.users?.email || 'Desconocido'}</span>
                  <span className="scan-time">{new Date(entry.checked_in_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {entry.id && (
                  <button 
                    onClick={() => handleDeleteEntry(entry.id)}
                    style={{background:'transparent', border:'none', color:'var(--primary)', cursor:'pointer', fontSize:'0.7rem', opacity:0.6}}
                  >
                    ELIMINAR
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== TAB: FINANCIERO ===== */}
      {adminTab === 'financial' && (
        <>
          <div className="stat-grid">
            <div className="stat-card highlight">
              <div className="stat-label">Ingresos del Mes</div>
              <div className="stat-value" style={{fontSize:'1.8rem'}}>${totalRevenue.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Socios Totales</div>
              <div className="stat-value">{stats.totalMembers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Activos</div>
              <div className="stat-value">{members.filter(m => m.membership_status === 'ACTIVE').length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Inactivos</div>
              <div className="stat-value">{members.filter(m => m.membership_status !== 'ACTIVE').length}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="app-section">
            <div className="app-section-title">Ingresos Semanales</div>
            <div className="chart-bars">
              {weeklyData.map((w, i) => (
                <div key={i} className="chart-bar" style={{ height: `${(w.value / maxVal) * 100}%` }}></div>
              ))}
            </div>
            <div className="chart-labels">
              {weeklyData.map((w, i) => <span key={i}>{w.label}<br/>${(w.value/1000).toFixed(0)}k</span>)}
            </div>
          </div>

          {/* Members Table */}
          <div className="app-section">
            <div className="app-section-title">Socios Registrados</div>
            <div style={{overflowX:'auto'}}>
              <table className="socios-table">
                <thead><tr><th>Nombre</th><th>Plan</th><th>Vencimiento</th><th>Status</th></tr></thead>
                <tbody>
                  {members.map((m, i) => (
                    <tr key={i}>
                      <td>{m.full_name || m.email}</td>
                      <td>{m.membership_plan || '—'}</td>
                      <td>{m.membership_expiry ? new Date(m.membership_expiry).toLocaleDateString('es-MX') : '—'}</td>
                      <td><span className={m.membership_status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>{m.membership_status === 'ACTIVE' ? 'Activa' : 'Inactiva'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// MAIN ROUTER
// ============================================
export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    const { data } = await supabase.from('users').select('role').eq('id', userId).single();
    const userRole = data?.role || 'CLIENT';
    setRole(userRole);
    setView(userRole === 'ADMIN' ? 'admin' : 'client-portal');
  };

  switch (view) {
    case 'landing': return <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
    case 'login': return <Login setView={setView} setUser={setUser} />;
    case 'setup-account': return <SetupAccount setView={setView} setUser={setUser} selectedPlan={selectedPlan} />;
    case 'client-portal': return user ? <ClientPortal setView={setView} user={user} /> : <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
    case 'admin': return user ? <AdminDashboard setView={setView} user={user} /> : <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
    default: return <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
  }
}
