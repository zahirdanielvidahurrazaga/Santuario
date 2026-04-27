import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SetupAccount({ setView, setUser, selectedPlan }) {
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
