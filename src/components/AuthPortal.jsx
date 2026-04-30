import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function AuthPortal({ setView, setUser, initialTab = 'login', selectedPlan, setSelectedPlan }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setError(null);
  }, [initialTab]);

  // Reset fields when switching tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (activeTab === 'register') {
      // Validate password confirmation
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, phone, receive_notifications: receiveNotifications }
        }
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
        // If user came from checkout with a selectedPlan, activate membership
        if (selectedPlan && data?.user?.id) {
          const expiry = new Date();
          expiry.setMonth(expiry.getMonth() + 1);
          await supabase.from('users').update({
            membership_plan: selectedPlan.title,
            membership_status: 'ACTIVE',
            membership_expiry: expiry.toISOString().split('T')[0]
          }).eq('id', data.user.id);
          if (setSelectedPlan) setSelectedPlan(null);
        }
        setSuccess(true);
        setLoading(false);
      }
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
        setUser(data.user);
        // No setView here — onAuthStateChange in App.jsx handles redirection based on role
        setLoading(false);
      }
    }
  };

  // Success screen after registration
  if (success) {
    return (
      <div className="split-screen-layout">
        <div className="split-image" style={{backgroundImage: 'url(/app_mockup.png)'}}>
          <button className="auth-back-btn" onClick={() => setView('landing')}>
            <ChevronLeft size={16} /> Volver
          </button>
          <div className="split-image-overlay">
            <span className="overline">Bienvenido a la Élite</span>
            <h2 style={{fontSize: '3rem'}}>{selectedPlan ? 'Membresía Activada.' : 'Cuenta Creada.'}</h2>
          </div>
        </div>
        <div className="split-form-container">
          <div className="form-wrapper auth-success">
            <span className="overline">Registro Exitoso</span>
            <h2>Bienvenido.</h2>
            {selectedPlan && (
              <div style={{background:'rgba(194,46,40,0.1)', border:'1px solid rgba(194,46,40,0.2)', borderRadius:'12px', padding:'0.8rem 1rem', marginBottom:'1rem'}}>
                <p style={{fontFamily:'Montserrat', fontSize:'0.75rem', color:'var(--primary)', fontWeight:'600', margin:0}}>{selectedPlan.title}</p>
                <p style={{fontFamily:'Montserrat', fontSize:'0.65rem', color:'var(--text-muted)', margin:'0.2rem 0 0'}}>{selectedPlan.price} · Activa por 30 días</p>
              </div>
            )}
            <p>
              {selectedPlan 
                ? 'Tu membresía ha sido activada. Inicia sesión para acceder a tu portal exclusivo.'
                : 'Tu acceso digital al Santuario ha sido configurado. Ahora puedes agendar clases y monitorear tu progreso.'}
            </p>
            <button className="btn-luxury" onClick={() => setView('landing')} style={{width: '100%'}}>
              {selectedPlan ? 'Ir a Iniciar Sesión' : 'Explorar Santuario'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="split-screen-layout">
      {/* LEFT: Image with overlay text */}
      <div className="split-image" style={{backgroundImage: activeTab === 'register' ? 'url(/app_mockup.png)' : 'url(/hero.png)'}}>
        <button className="auth-back-btn" onClick={() => setView('landing')}>
          <ChevronLeft size={16} /> Volver
        </button>
        <div className="split-image-overlay">
          <span className="overline">
            {activeTab === 'register' ? 'Santuario Digital' : 'Acceso Restringido'}
          </span>
          <h2 className="split-heading">
            {activeTab === 'register' ? 'Tu Progreso. Tu Control.' : 'Portal Privado.'}
          </h2>
          <p className="split-description">
            {activeTab === 'register' 
              ? 'Únete a la plataforma para reservar clases, gestionar tu membresía y llevar tu entrenamiento al máximo nivel.'
              : 'Ingresa para gestionar tus reservas, revisar tu historial y acceder a herramientas exclusivas para miembros.'}
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="split-form-container">
        <div className="form-wrapper reveal active">
          
          {/* Tabs */}
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Plan badge if coming from checkout */}
          {activeTab === 'register' && selectedPlan && (
            <div style={{background:'rgba(194,46,40,0.08)', border:'1px solid rgba(194,46,40,0.15)', borderRadius:'10px', padding:'0.6rem 1rem', marginBottom:'0.5rem', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span style={{fontFamily:'Montserrat', fontSize:'0.7rem', color:'var(--text-main)', fontWeight:'500'}}>Plan: <strong style={{color:'var(--primary)'}}>{selectedPlan.title}</strong></span>
              <span style={{fontFamily:'Montserrat', fontSize:'0.65rem', color:'var(--text-muted)'}}>{selectedPlan.price}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="auth-title">
            {activeTab === 'login' ? 'Ingresa a tu cuenta.' : (selectedPlan ? 'Crea tu cuenta para activar.' : 'Únete a la élite.')}
          </h3>

          {/* Error */}
          {error && <p className="auth-error">{error}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {activeTab === 'register' && (
              <>
                <input 
                  type="text" 
                  placeholder="Nombre Completo" 
                  className="input-editorial" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
                <input 
                  type="tel" 
                  placeholder="Teléfono" 
                  className="input-editorial" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </>
            )}
            
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              className="input-editorial" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />

            {/* Password with eye toggle */}
            <div className="password-field">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Contraseña" 
                className="input-editorial" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{marginBottom: activeTab === 'register' ? '0' : undefined}}
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm password (register only) */}
            {activeTab === 'register' && (
              <>
                <div className="password-field">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="Confirmar Contraseña" 
                    className="input-editorial" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    style={{marginBottom: '0'}}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Notifications checkbox */}
                <label className="auth-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={receiveNotifications} 
                    onChange={(e) => setReceiveNotifications(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span className="auth-checkbox-custom"></span>
                  <span className="auth-checkbox-text">Recibir notificaciones y actualizaciones</span>
                </label>
              </>
            )}
            
            <button 
              type="submit" 
              className="btn-luxury" 
              style={{marginTop: '1rem'}} 
              disabled={loading}
            >
              {loading ? 'Procesando...' : (activeTab === 'login' ? 'Ingresar' : 'Crear mi cuenta')}
            </button>

            {activeTab === 'login' && (
              <div style={{marginTop: '1rem', textAlign: 'center'}}>
                <button 
                  type="button" 
                  className="auth-footer-link"
                  onClick={() => alert('Por favor contacta al administrador en recepción para recuperar tu contraseña.')}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
