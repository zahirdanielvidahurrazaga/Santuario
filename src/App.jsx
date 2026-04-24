import React, { useState, useEffect } from 'react';
import './index.css';

// ============================================
// COMPONENTE: SELECTOR PRINCIPAL (SPLASH UNIVERSAL)
// ============================================
function SplashSelector({ setView, setMode, setLocation }) {
  const [showPueblaMenu, setShowPueblaMenu] = useState(false);

  const selectCity = (city) => {
    setLocation(city);
    if (city === 'puebla') {
      setShowPueblaMenu(true);
    } else {
      setMode('classic');
      setView('landing');
    }
  };

  const selectExperience = (exp) => {
    setMode(exp);
    setView('landing');
  };

  return (
    <div className="splash-container">
      {/* PANEL PUEBLA */}
      <div 
        className="splash-pane" 
        style={{ background: '#050505' }}
        onClick={() => !showPueblaMenu && selectCity('puebla')}
      >
        <img src="/hero_bg_red.png" className="splash-bg" alt="Puebla HQ" />
        <div className="splash-content fade-in">
          <div className="logo-massive">PUEBLA</div>
          <div className="logo-sub">CIUDAD MATRIZ</div>
          
          {showPueblaMenu ? (
            <div className="experience-overlay">
              <button className="btn" style={{ width: '100%', fontSize:'0.9rem' }} onClick={(e) => { e.stopPropagation(); selectExperience('classic'); }}>
                ENTRAR A CLASSIC
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', fontSize:'0.9rem', borderColor:'white' }} onClick={(e) => { e.stopPropagation(); selectExperience('elite'); }}>
                ENTRAR A ELITE
              </button>
            </div>
          ) : (
            <div style={{marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em'}}>CLICK PARA EXPLORAR</div>
          )}
        </div>
      </div>
      
      {/* PANEL CANCUN */}
      <div 
        className="splash-pane"
        style={{ background: '#0a0a0a' }}
        onClick={() => selectCity('cancun')}
      >
        <img src="/hero_bg_red.png" className="splash-bg" alt="Cancun MOD" />
        <div className="splash-content fade-in delay-1">
          <div className="logo-massive" style={{color: 'white'}}>CANCÚN</div>
          <div className="logo-sub" style={{color: '#c51a1b'}}>MOD FORMAT</div>
          <div style={{marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em'}}>FORMATO CLÁSICO MMA & HYROX</div>
        </div>
      </div>

      {/* PANEL HERMOSILLO */}
      <div 
        className="splash-pane"
        style={{ background: '#070707' }}
        onClick={() => selectCity('hermosillo')}
      >
        <img src="/wellness_bg_red.png" className="splash-bg" alt="Hermosillo" />
        <div className="splash-content fade-in delay-2">
          <div className="logo-massive" style={{color: 'white'}}>HERMOSILLO</div>
          <div className="logo-sub" style={{color: '#c51a1b'}}>SANTUARIO SONORA</div>
          <div style={{marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em'}}>FORMATO CLÁSICO FUNCIONAL</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: LANDING PÚBLICA (UNIVERSAL)
// ============================================
function Landing({ setView, mode, location }) {
  const isElite = mode === 'elite';
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isElite) document.body.classList.add('theme-elite');
    else document.body.classList.remove('theme-elite');
    return () => document.body.classList.remove('theme-elite');
  }, [isElite]);

  const heroImage = isElite ? "/elite_bg.png" : "/hero_bg_red.png";
  const heroHeader = isElite ? "LUXURY WELLNESS" : "BUILD YOUR";
  const heroGradient = isElite ? "PRACTICE" : "OWN TEMPLE";

  // Identificador visual de locación en topbar
  const locationTitles = {
    puebla: isElite ? 'ELITE PUEBLA' : 'CLASSIC PUEBLA',
    cancun: 'MOD CANCÚN',
    hermosillo: 'HERMOSILLO'
  };
  
  return (
    <>
      <nav className="navbar fade-in">
        <div className="wrapper nav-container">
          <div className="nav-logo" onClick={() => scrollTo('hero')}>
            {isElite ? <span style={{color: 'white'}}>ELITE</span> : "SANTUARIO"}
            <span style={{fontSize: '1rem', color: '#c51a1b', marginLeft: '0.5rem'}}>{locationTitles[location]}</span>
          </div>
          
          {/* Botón táctico móvil */}
          <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕ CERRAR' : '≡ MENÚ'}
          </div>

          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <button className="btn btn-secondary mobile-btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.65rem', borderWidth: '1px' }} onClick={() => setView('splash')}>
              ⟵ CAMBIAR CIUDAD
            </button>
            <a onClick={() => scrollTo('disciplinas')} className="nav-link">Sistemas</a>
            <a onClick={() => scrollTo('wellness')} className="nav-link">{isElite ? 'Thermal Complex' : 'Facilidades'}</a>
            <a onClick={() => scrollTo('promos')} className="nav-link">Precios</a>
            <button className="btn mobile-btn-heavy" style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem' }} onClick={() => setView('login')}>PORTAL SANCTUM</button>
          </div>
        </div>
      </nav>

      <header id="hero" className="hero">
        <div className="hero-bg fade-in">
          <img src={heroImage} alt="Santuario Facility" />
        </div>
        <div className="hero-overlay fade-in delay-1"></div>
        <div className="wrapper">
          <div className="hero-content">
            <span className="label fade-in">{locationTitles[location]} DIVISION</span>
            <h1 className="fade-in delay-1">{heroHeader}<br /><span className="primary-gradient">{heroGradient}</span></h1>
            <p className="fade-in delay-2" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
              {isElite 
                ? "Un santuario superior. Complejo con sauna, vapor, inmersión en hielo y entrenamiento especializado."
                : `El dominio de tu cuerpo a través del movimiento de élite en ${location.toUpperCase()}. Únete a una comunidad forjada en disciplina.`}
            </p>
            <div className="btn-group fade-in delay-3">
              <button className="btn" onClick={() => scrollTo('promos')}>Inscribirme Hoy</button>
              <button className="btn btn-secondary" onClick={() => scrollTo('disciplinas')}>Ver Sistema</button>
            </div>
          </div>
        </div>
      </header>

      <section id="disciplinas" className="section-padding">
        <div className="wrapper">
          <span className="label fade-in">Pilares Oficiales de Sede</span>
          <h2 className="fade-in delay-1">METODOLOGÍA {location.toUpperCase()}</h2>
          <div className="disciplines-grid fade-in delay-2">
            
            {/* Lógica condicional de disciplinas por Franquicia Táctica */}
            {location === 'cancun' ? (
              <>
                <div className="discipline-card"><div className="discipline-number">01</div><h3 className="discipline-title">MMA & K1</h3><p>Striking y derribos. Preparación para combate de la vida real con Coachs Pro.</p></div>
                <div className="discipline-card"><div className="discipline-number">02</div><h3 className="discipline-title">Jiu Jitsu</h3><p>Arte suave. Sometimientos, control de piso y defensa personal élite.</p></div>
                <div className="discipline-card"><div className="discipline-number">03</div><h3 className="discipline-title">HYROX / Calistenia</h3><p>Resistencia híbrida. Fuerza masiva y cardio sin precedentes.</p></div>
              </>
            ) : location === 'hermosillo' ? (
              <>
                <div className="discipline-card"><div className="discipline-number">01</div><h3 className="discipline-title">Calistenia</h3><p>Domina tu peso. Progresiones mecánicas directas al objetivo.</p></div>
                <div className="discipline-card"><div className="discipline-number">02</div><h3 className="discipline-title">Funcional</h3><p>Acondicionamiento físico de altísima intensidad sin ataduras.</p></div>
                <div className="discipline-card"><div className="discipline-number">03</div><h3 className="discipline-title">Open Gym</h3><p>Tu propio ritmo. Zona de alta destreza libre.</p></div>
              </>
            ) : isElite ? (
              <>
                <div className="discipline-card"><div className="discipline-number">01</div><h3 className="discipline-title">Calistenia Pura</h3><p>Progresiones mecánicas avanzadas.</p></div>
                <div className="discipline-card"><div className="discipline-number">02</div><h3 className="discipline-title">Personalizados</h3><p>Clases 1 a 1 para atletas ('T').</p></div>
                <div className="discipline-card"><div className="discipline-number">03</div><h3 className="discipline-title">Kids (Niños)</h3><p>Desarrollo psicomotriz para el futuro.</p></div>
              </>
            ) : (
              <>
                <div className="discipline-card"><div className="discipline-number">01</div><h3 className="discipline-title">Calistenia Fundamental</h3><p>Domina tu peso y desarrolla fuerza base infalible.</p></div>
                <div className="discipline-card"><div className="discipline-number">02</div><h3 className="discipline-title">Body Cond.</h3><p>Acondicionamiento físico explosivo general.</p></div>
                <div className="discipline-card"><div className="discipline-number">03</div><h3 className="discipline-title">Stretching</h3><p>Flexibilidad, prevención y core dinámico.</p></div>
              </>
            )}
            
          </div>
        </div>
      </section>

      <section id="wellness" className="wellness-section section-padding">
        <div className="wellness-bg"><img src={isElite ? "/elite_bg.png" : "/wellness_bg_red.png"} alt="Wellness" /></div>
        <div className="wrapper">
          <div className="wellness-content fade-in">
            <span className="label">{isElite ? 'Thermal Complex' : 'Facility Ops'}</span>
            <h2>{isElite ? 'RECOVERY ELITE' : 'INFRAESTRUCTURA'}</h2>
            <ul className="feature-list">
              {isElite ? (
                <><li className="feature-item"><span className="feature-check">+</span> Cold Plunge & Sauna</li><li className="feature-item"><span className="feature-check">+</span> Vapor & Nutrición Clínica</li></>
              ) : (
                <><li className="feature-item"><span className="feature-check">+</span> Zonas de Hidratación</li><li className="feature-item"><span className="feature-check">+</span> Regaderas y Lockers Seguros</li></>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section id="promos" className="section-padding" style={{backgroundColor: 'var(--bg-base)'}}>
        <div className="wrapper">
          <div className="text-center fade-in"><h2>OFERTAS NACIONALES DEL MES</h2></div>
          <div className="promos-banner fade-in delay-1">
            <div className="promo-tier"><div className="promo-price">$800</div><p>Individual</p></div>
            <div className="promo-tier"><div className="promo-price">$1,000</div><p>Paquete 2 PX</p></div>
            <div className="promo-tier"><div className="promo-price">GRATIS</div><p>Paquete 3 PX Instalación Completa</p></div>
          </div>
        </div>
      </section>

      <footer id="contacto" className="footer fade-in">
        <div className="wrapper">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="nav-logo" style={{ marginBottom: '1.5rem', display: 'block' }}>
                SANTUARIO {location.toUpperCase()}
              </div>
              <p style={{ color: 'var(--text-muted)' }}>BUILD YOUR OWN TEMPLE.</p>
            </div>

            <div className="footer-col">
              <h4>Ubicación GPS</h4>
              {/* Direcciones Variables Dinámicas */}
              {location === 'cancun' ? (
                <>
                  <p>Plaza Momoto</p>
                  <p>Cancún, Quintana Roo</p>
                  <p>Format: MOD / HYROX / MMA</p>
                </>
              ) : location === 'hermosillo' ? (
                <>
                  <p>Central de Entrenamientos</p>
                  <p>Hermosillo, Sonora</p>
                  <p>Build Your Own Temple N.W.</p>
                </>
              ) : isElite ? (
                <>
                  <p>Cúmulo de Virgo #28-1, Local ELITE</p>
                  <p>Prolongación 11 Sur y Acuario</p>
                  <p>Col. Concepción Las Lajas, Puebla.</p>
                </>
              ) : (
                <>
                  <p>Cúmulo de Virgo #28, Local 1</p>
                  <p>Reserva Territorial Atlixcáyotl</p>
                  <p>Puebla, Pue.</p>
                </>
              )}
            </div>

            <div className="footer-col">
              <h4>Comunicaciones</h4>
              <p>Membresías: Contactar en Recepción</p>
              {location === 'cancun' ? (
                <p>IG: @santuario.cancun | @md_cancun_</p>
              ) : location === 'hermosillo' ? (
                <p>IG: @santuariohermosillo</p>
              ) : (
                <p>IG: @santuariopuebla | @elite_by_santuario</p>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// ============================================
// COMPONENTE OMITIDOS/RESUMIDOS DE AUTH DASHBOARD 
// (MISMO FUNCIONAMIENTO PREVIO SIN ALTERACIÓN DE LOGICA UI, ACORTADO PARA LIMPIEZA)
// ============================================
function Login({ setView, mode }) { /* Mismo código ultra-premium previo... */
  const [roleSelection, setRoleSelection] = useState('atleta');
  useEffect(() => { if (mode === 'elite') document.body.classList.add('theme-elite'); else document.body.classList.remove('theme-elite'); }, [mode]);
  const handleLogin = (e) => { e.preventDefault(); setView(`dashboard_${roleSelection}`); };
  return (
    <div className="auth-container">
      <div className="auth-box fade-in delay-1">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}><div className="nav-logo" style={{ display: 'block', fontSize: '3rem', textShadow: '0 0 20px var(--glow-color)' }}>{mode === 'elite' ? 'ELITE' : 'SANCTUM'}</div><div className="logo-sub">TACTICAL ACCESS</div></div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '2rem' }}><select className="input-field" value={roleSelection} onChange={(e) => setRoleSelection(e.target.value)}><option value="atleta">Nivel 1: Atleta (WOD)</option><option value="coach">Nivel 2: Coach (Upload)</option><option value="admin">Nivel 3: Administrador (Métricas)</option></select></div>
          <div style={{ marginBottom: '1.5rem' }}><input type="email" placeholder="sys@santuario.com" className="input-field" required /></div>
          <div style={{ marginBottom: '3rem' }}><input type="password" placeholder="••••••••" className="input-field" required /></div>
          <div className="btn-group" style={{ flexDirection: 'column', gap: '1rem', marginTop: 0 }}>
            <button type="submit" className="btn" style={{ width: '100%', fontSize: '1.2rem' }}>INICIAR SECUENCIA</button>
            <button type="button" className="btn btn-secondary" style={{ width: '100%', border: 'none', color: 'var(--text-muted)' }} onClick={() => setView('landing')}>ABORTAR (VOLVER)</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardSidebar({ setView, mode, activeRole, location }) { /* Omitido por brevedad igual que el anterior */
  const isElite = mode === 'elite';
  return (
    <div className="sidebar">
      <div className="nav-logo" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{isElite ? <span style={{color: 'white'}}>ELITE</span> : "SANTUARIO"}</div>
      <div className="logo-sub" style={{ marginBottom: '4rem', fontSize: '0.7rem' }}>SEDE {location.toUpperCase()}</div>
      <div style={{fontWeight: '700', marginBottom: '3rem', fontSize: '1.2rem', textTransform: 'uppercase', color: 'var(--border-glow)'}}>{activeRole}</div>
      <button className="btn btn-secondary" style={{ marginTop: 'auto', padding: '0.8rem', fontSize: '0.7rem' }} onClick={() => setView('splash')}>⏏ CERRAR SESIÓN</button>
    </div>
  );
}

function DashboardAtleta({ setView, mode, location }) {
  const [selectedCoach, setSelectedCoach] = useState(null);

  const coaches = [
    { id: 1, name: 'HÉCTOR VEGA', block: 'MATUTINO', hours: '6:00 AM - 10:00 AM', spec: 'HIIT & Fuerza Estructural', bio: 'Comando especialista en levantamientos pesados y resistencia anaeróbica. Su objetivo es llevarte al fallo muscular.' },
    { id: 2, name: 'SOFÍA REYES', block: 'MEDIO DÍA', hours: '12:00 PM - 2:00 PM', spec: 'Calistenia Funcional', bio: 'Dominio absoluto del peso corporal. Enfocada en técnica pura, equilibrio y movilidad articular avanzada.' },
    { id: 3, name: 'CARLOS T.', block: 'VESPERTINO', hours: '5:00 PM - 9:00 PM', spec: 'HYROX & Conditioning', bio: 'Resistencia cardiovascular brutal. Su metodología cruza el umbral del dolor para el máximo desempeño.' }
  ];

  return (
    <div className="dashboard-layout fade-in">
      <DashboardSidebar setView={setView} mode={mode} activeRole="Atleta" location={location} />
      <div className="main-content">
        <h2 className="fade-in delay-1" style={{ fontSize: '2.5rem', marginBottom: '2rem', textShadow: '0 0 20px var(--glow-color)' }}>
          PERFIL DE ATLETA
        </h2>
        
        {/* Roster de Coaches y Horarios */}
        <div className="dashboard-card fade-in delay-2" style={{ padding: '2rem', margin: '0 0 2rem 0' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ROSTER DE OPERACIÓN TÁCTICA</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {coaches.map((coach) => (
              <div 
                key={coach.id}
                className="coach-card" 
                onClick={() => setSelectedCoach(coach)}
              >
                <div style={{color: 'var(--border-glow)', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{coach.block} ({coach.hours})</div>
                <div style={{fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem'}}>{coach.name}</div>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{coach.spec}</div>
              </div>
            ))}
          </div>

          {/* Ficha Táctica Modal Interno */}
          {selectedCoach && (
            <div className="fade-in" style={{ marginTop: '2rem', padding: '2rem', background: '#000', border: '1px solid var(--border-glow)', position: 'relative', boxShadow: '0 0 30px var(--glow-color)' }}>
              <button 
                onClick={() => setSelectedCoach(null)} 
                style={{position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem'}}
              >✕</button>
              <h4 style={{fontSize: '1.5rem', color: 'white', textTransform: 'uppercase', marginBottom: '0.5rem'}}>{selectedCoach.name}</h4>
              <p style={{color: 'var(--border-glow)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase'}}>{selectedCoach.spec}</p>
              <p style={{color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem'}}>{selectedCoach.bio}</p>
            </div>
          )}
        </div>

        {/* WOD Terminal */}
        <div className="dashboard-card fade-in delay-3" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>MASTER PROGRAM: W.O.D. (HOY)</h3>
          <div className="pizarron-wod">
            <div className="pizarron-fod">
              <span style={{color: '#00bbff'}}>A) WARM UP (10 MIN)</span>{'\n'}
              - 3 Rounds Acondicionamiento Base{'\n'}
              - 15x Push-ups{'\n'}
              - 20x Air Squats{'\n\n'}
              <span style={{color: 'var(--border-glow)'}}>B) MAIN PROTOCOL: THE GRIND</span>{'\n'}
              - EMOM 15 Minutos:{'\n'}
              - Min 1: 15 Pull-ups Mecánicos{'\n'}
              - Min 2: 20 Wall Balls{'\n'}
              - Min 3: Max Calorie Row
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCoach({ setView, mode, location }) {
  return (
    <div className="dashboard-layout fade-in">
      <DashboardSidebar setView={setView} mode={mode} activeRole="Coach" location={location} />
      <div className="main-content">
        <h2 className="fade-in delay-1" style={{ fontSize: '2.5rem', marginBottom: '2rem', textShadow: '0 0 20px var(--glow-color)' }}>
          PANEL DE TRANSMISIÓN
        </h2>
        
        <div className="dashboard-card fade-in delay-2" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>INYECCIÓN DE PROTOCOLO (W.O.D.)</h3>
            <div className="status-badge" style={{ borderColor: 'var(--text-muted)', color: 'var(--text-muted)', boxShadow: 'none' }}>NO PUBLICADO</div>
          </div>
          <p style={{fontSize:'0.8rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
            El protocolo que escribas aquí se sincronizará inmediatamente en las pantallas de todos los atletas de la sede {location.toUpperCase()}.
          </p>
          <textarea 
            className="input-field" 
            rows="10" 
            placeholder="A) WARM UP...&#10;B) STRENGTH...&#10;C) WOD..."
            style={{ fontFamily: 'Courier New', resize: 'vertical' }}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn" style={{ fontSize: '1rem', padding: '1.2rem 2rem' }}>PUBLICAR W.O.D. A TODOS</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardAdmin({ setView, mode, location }) {
  return (
    <div className="dashboard-layout fade-in">
      <DashboardSidebar setView={setView} mode={mode} activeRole="Administrador" location={location} />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="fade-in delay-1" style={{ fontSize: '2.5rem', margin: 0, textShadow: '0 0 20px var(--glow-color)' }}>
            CENTRO DE COMANDO <span style={{color: 'var(--border-glow)'}}>({location.toUpperCase()})</span>
          </h2>
          <div className="status-badge fade-in delay-2" style={{ animation: 'pulse 2s infinite' }}>● EN LÍNEA</div>
        </div>
        
        {/* Métricas Principales */}
        <div className="admin-metrics-grid fade-in delay-2">
          <div className="dashboard-card" style={{ marginBottom: 0, padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>FLUJO NETO (HOY)</h3>
            <div className="metric-value metric-primary">$12,450<span style={{fontSize:'1.5rem', color: 'var(--text-muted)'}}>.00</span></div>
            <div style={{color: '#00bbff', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold'}}>▲ +14% VIS A VIS AYER</div>
          </div>
          <div className="dashboard-card" style={{ marginBottom: 0, padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>MRR STRIPE (MENSUAL)</h3>
            <div className="metric-value">$142k</div>
            <div style={{color: '#00bbff', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold'}}>▲ DOMICILIACIÓN ACTIVA</div>
          </div>
          <div className="dashboard-card" style={{ marginBottom: 0, padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>MIEMBROS ACTIVOS</h3>
            <div className="metric-value">312 <span style={{fontSize:'1.5rem',color:'var(--text-muted)'}}>PX</span></div>
            <div style={{color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold'}}>CHURN RISK: BAJO (2%)</div>
          </div>
        </div>

        {/* Capacidad y Gráfico Crítico */}
        <div className="dashboard-card fade-in delay-3" style={{ padding: '2rem', marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>CAPACIDAD OPERATIVA DE INSTALACIÓN</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-main)'}}>82% OCUPACIÓN ACTUAL</span>
            <span style={{color: 'var(--border-glow)', fontWeight: 'bold'}}>ZONA ÓPTIMA</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{width: '82%'}}></div>
          </div>
        </div>

        {/* Feed de Operaciones en Vivo */}
        <div className="dashboard-card fade-in delay-4" style={{ padding: '2rem', margin: '2rem 0' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>REGISTRO TÁCTICO (LIVE TERMINAL)</h3>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Operativo (Atleta)</th>
                  <th>Transacción</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hace 2 min</td>
                  <td>Sofía Méndez</td>
                  <td>Pago Domiciliado (Stripe)</td>
                  <td style={{color: '#00bbff'}}>Completado</td>
                  <td>$1,000.00</td>
                </tr>
                <tr>
                  <td>Hace 15 min</td>
                  <td>Carlos R.</td>
                  <td>Check-In QR (Recepción)</td>
                  <td style={{color: '#00bbff'}}>Ingreso</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Hace 42 min</td>
                  <td>Héctor Vargas</td>
                  <td>Suscripción (Efectivo)</td>
                  <td style={{color: '#00bbff'}}>Completado</td>
                  <td>$800.00</td>
                </tr>
                <tr style={{ opacity: 0.6 }}>
                  <td>Hace 1 hr</td>
                  <td>Diego C.</td>
                  <td>Cobro Fallido (Fondos insuficientes)</td>
                  <td style={{color: 'var(--primary)'}}>Denegado</td>
                  <td>$1,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP ROUTER CORE
// ============================================
function App() {
  const [view, setView] = useState('splash');
  const [mode, setMode] = useState('classic'); 
  const [location, setLocation] = useState('puebla'); // 'puebla', 'cancun', 'hermosillo'

  switch (view) {
    case 'splash': return <SplashSelector setView={setView} setMode={setMode} setLocation={setLocation} />;
    case 'landing': return <Landing setView={setView} mode={mode} location={location} />;
    case 'login': return <Login setView={setView} mode={mode} location={location} />;
    case 'dashboard_atleta': return <DashboardAtleta setView={setView} mode={mode} location={location} />;
    case 'dashboard_coach': return <DashboardCoach setView={setView} mode={mode} location={location} />;
    case 'dashboard_admin': return <DashboardAdmin setView={setView} mode={mode} location={location} />;
    default: return <SplashSelector setView={setView} setMode={setMode} setLocation={setLocation} />;
  }
}

export default App;
