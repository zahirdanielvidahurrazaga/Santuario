import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ setView, setUser }) {
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
      setView('dashboard'); // the router will actually read the role and update this automatically via auth listener, but we can set a fallback
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
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
            <button type="button" style={{background: 'transparent', border: 'none', color: 'var(--text-muted)', fontFamily: 'Montserrat', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem'}} onClick={() => alert('Por favor contacta al administrador en recepción para recuperar tu contraseña.')}>Olvidé mi contraseña</button>
            <button type="button" style={{background: 'transparent', border: 'none', color: 'var(--text-muted)', fontFamily: 'Montserrat', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem'}} onClick={() => setView('landing')}>Volver al sitio</button>
          </div>
          
          <div style={{marginTop: '2rem', padding: '1rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', textAlign: 'center'}}>
            <p style={{color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Acceso Rápido (Dev)</p>
            <button type="button" className="btn-luxury" style={{width: '100%', padding: '0.8rem', fontSize: '0.7rem'}} onClick={() => setView('coach')}>Entrar como Coach</button>
          </div>
        </form>
      </div>
    </div>
  );
}
