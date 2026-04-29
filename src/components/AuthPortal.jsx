import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ChevronLeft } from 'lucide-react';

export default function AuthPortal({ setView, setUser, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    setName('');
    setPhone('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (activeTab === 'register') {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, phone }
        }
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
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
        setView('dashboard');
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
            <h2 style={{fontSize: '3rem'}}>Cuenta Creada.</h2>
          </div>
        </div>
        <div className="split-form-container">
          <div className="form-wrapper auth-success">
            <span className="overline">Registro Exitoso</span>
            <h2>Bienvenido.</h2>
            <p>
              Tu acceso digital al Santuario ha sido configurado. 
              Ahora puedes agendar clases, suscribirte a un plan y monitorear tu progreso.
            </p>
            <button className="btn-luxury" onClick={() => setView('landing')} style={{width: '100%'}}>
              Explorar Santuario
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

          {/* Title */}
          <h3 className="auth-title">
            {activeTab === 'login' ? 'Ingresa a tu cuenta.' : 'Únete a la élite.'}
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
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="input-editorial" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
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
