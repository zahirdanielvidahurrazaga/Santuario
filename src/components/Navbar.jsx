import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function Navbar({ setView }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setView('landing')}>SANTUARIO</div>
        <div className="navbar-links">
          <a onClick={() => { setView('landing'); setTimeout(() => document.getElementById('explore')?.scrollIntoView({behavior: 'smooth'}), 100); }}>Comunidad</a>
          <a onClick={() => { setView('landing'); setTimeout(() => document.getElementById('discover')?.scrollIntoView({behavior: 'smooth'}), 100); }}>Filosofía</a>
          <a onClick={() => { setView('landing'); setTimeout(() => document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'}), 100); }}>Horarios</a>
        </div>
        <div className="navbar-actions">
          <button className="navbar-icon-btn" onClick={() => setView('login')} title="Portal Privado">
            <User size={20} />
            <span className="navbar-icon-text">Portal</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
