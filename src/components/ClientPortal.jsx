import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { QRCodeCanvas } from 'qrcode.react';

export default function ClientPortal({ setView, user }) {
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

      <div className="dashboard-grid">
        {/* Left Column: Essential/Live data */}
        <div>
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
            <div style={{display:'inline-block',padding:'2rem',background:'white',borderRadius:'20px',boxShadow:'0 20px 50px rgba(0,0,0,0.4), 0 0 40px rgba(194, 46, 40, 0.2)'}}>
              <QRCodeCanvas value={user?.id || 'invitado'} size={200} level={"H"} includeMargin={true} />
            </div>
            <p style={{marginTop:'1.5rem',color:'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.8rem',fontWeight:'300'}}>Muestra este código al lector en recepción.</p>
          </div>
        </div>

        {/* Right Column: Info & Details */}
        <div>
          {/* My Plan */}
          <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
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
      </div>
    </div>
  );
}
