import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar({ setView, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
  };

  return (
    <>
      <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => setView('landing')}>SANTUARIO</div>
          <div className="navbar-links">
            <a onClick={() => { setView('landing'); setTimeout(() => document.getElementById('explore')?.scrollIntoView({behavior: 'smooth'}), 100); }}>Comunidad</a>
            <a onClick={() => { setView('landing'); setTimeout(() => document.getElementById('discover')?.scrollIntoView({behavior: 'smooth'}), 100); }}>Filosofía</a>
            <a onClick={() => { setView('landing'); setTimeout(() => document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'}), 100); }}>Horarios</a>
          </div>
          <div className="navbar-actions">
            {user ? (
              <div className="navbar-profile-wrapper">
                <button className="navbar-profile-btn" onClick={() => setShowMenu(!showMenu)}>
                  <div className="navbar-avatar">{userName.charAt(0).toUpperCase()}</div>
                  <ChevronDown size={14} style={{color:'var(--text-muted)', transition:'transform 0.3s', transform: showMenu ? 'rotate(180deg)' : 'none'}} />
                </button>
                {showMenu && (
                  <>
                    <div className="navbar-dropdown-backdrop" onClick={() => setShowMenu(false)} />
                    <div className="navbar-dropdown">
                      <div className="navbar-dropdown-header">
                        <span className="navbar-dropdown-name">{userName}</span>
                        <span className="navbar-dropdown-email">{user.email}</span>
                        <span className="navbar-dropdown-badge">Sin membresía</span>
                      </div>
                      <div className="navbar-dropdown-divider" />
                      <button className="navbar-dropdown-item" onClick={() => { setShowMenu(false); document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'}); }}>
                        Activar Membresía
                      </button>
                      <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                        <LogOut size={14} /> Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button className="navbar-icon-btn" onClick={() => setView('login')} title="Portal Privado">
                <User size={20} />
                <span className="navbar-icon-text">Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Welcome banner inside navbar — hides on scroll */}
        {user && !scrolled && (
          <div className="member-status-banner">
            <span>Hola, <strong>{userName}</strong> · Aún no tienes membresía activa</span>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})}>Ver Planes</button>
          </div>
        )}
      </nav>
    </>
  );
}
