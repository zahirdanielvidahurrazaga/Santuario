import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { QRCodeCanvas } from 'qrcode.react';
import { Flame, QrCode, CreditCard, CalendarDays, Dumbbell, X } from 'lucide-react';

export default function ClientPortal({ setView, user }) {
  const [occupancy, setOccupancy] = useState(0);
  const [profile, setProfile] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const handleCoachClick = (coachName) => {
    if (coachName === 'Equipo Elite' || coachName === '—') return;
    setSelectedCoach({
      name: coachName,
      role: coachName === 'Héctor Vega' ? 'Head Coach de Fuerza & Anillas' : 'Especialista en Acondicionamiento Metabólico',
      bio: 'Atleta de élite con años de experiencia en biomecánica y tensión estática. Su metodología te llevará al máximo de tus capacidades reales, forjando un cuerpo funcional, resistente y de estética superior.',
      image: '/coach.png'
    });
  };

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

    // Fetch today's workout
    const fetchWorkout = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: workout } = await supabase
        .from('workouts')
        .select('*')
        .eq('athlete_id', user.id)
        .eq('workout_date', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (workout) {
        setTodayWorkout(workout);
        setWorkoutCompleted(workout.completed || false);
      }
    };
    fetchWorkout();

    // Realtime subscription for instant occupancy updates
    const channel = supabase
      .channel('attendance-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, async () => {
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
          .from('attendance')
          .select('*', { count: 'exact', head: true })
          .gte('checked_in_at', today)
          .is('checked_out_at', null);
        setOccupancy(count || 0);
      })
      .subscribe();

    // Polling fallback every 30 seconds
    const interval = setInterval(async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .gte('checked_in_at', today)
        .is('checked_out_at', null);
      setOccupancy(count || 0);
    }, 30000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
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
              <Flame size={18} style={{color:'#4ade80'}} />
              <span className="occupancy-label" style={{margin:0}}>En vivo</span>
            </div>
            <div className="occupancy-number">{occupancy}</div>
            <div className="occupancy-label">personas en Santuario ahora</div>
          </div>

          {/* QR Pass */}
          <div className="app-section" style={{textAlign:'center'}}>
            <div className="app-section-title"><QrCode size={16} className="lucide-icon"/> Pase Digital Elite</div>
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
            <div className="app-section-title"><CreditCard size={16} className="lucide-icon"/> Mi Membresía</div>
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

          {/* Workout of the Day (VIP/Personalizado) */}
          <div className="app-section">
            <div className="app-section-title"><Dumbbell size={16} className="lucide-icon"/> Mi Entrenamiento Hoy</div>
            {todayWorkout ? (
              <div style={{background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(194, 46, 40, 0.3)', position: 'relative', overflow: 'hidden'}}>
                <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: workoutCompleted ? '#4ade80' : 'var(--primary)'}}></div>
                <h3 style={{fontFamily:'Playfair Display',fontSize:'1.5rem',marginBottom:'1rem'}}>{todayWorkout.title}</h3>
                <div style={{fontFamily: 'Montserrat', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.8', whiteSpace: 'pre-wrap'}}>
                  {todayWorkout.content}
                </div>
                <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  {workoutCompleted ? (
                    <div style={{flex:1, padding:'0.8rem', textAlign:'center', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:'12px'}}>
                      <p style={{color:'#4ade80', fontFamily:'Montserrat', fontSize:'0.8rem', fontWeight:'600'}}>✓ Entrenamiento Completado</p>
                    </div>
                  ) : (
                    <button className="btn-luxury" style={{flex: 1, padding: '0.8rem', fontSize: '0.7rem', minWidth: '140px'}} onClick={async () => {
                      await supabase.from('workouts').update({ completed: true }).eq('id', todayWorkout.id);
                      setWorkoutCompleted(true);
                    }}>Marcar Completado ✓</button>
                  )}
                  <button className="btn-luxury" style={{flex: 1, padding: '0.8rem', fontSize: '0.7rem', minWidth: '140px', borderColor: 'rgba(255,255,255,0.2)'}} onClick={() => alert('Función de subida de video próximamente. Por ahora, envía tu video a tu coach por WhatsApp.')}>Subir Video (Form Check)</button>
                </div>
              </div>
            ) : (
              <div style={{background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center'}}>
                <p style={{fontFamily:'Montserrat', fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:'1.8'}}>No tienes un entrenamiento asignado para hoy.</p>
                <p style={{fontFamily:'Montserrat', fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.5rem'}}>Si tienes el plan personalizado, tu coach publicará tu rutina aquí.</p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="app-section">
            <div className="app-section-title"><CalendarDays size={16} className="lucide-icon"/> Horarios & Coaches</div>
            <div style={{overflowX:'auto'}}>
              <table className="schedule-table">
                <thead><tr><th>Día</th><th>Clase</th><th>AM</th><th>PM</th><th>Coach</th></tr></thead>
                <tbody>
                  {schedule.map((s, i) => (
                    <tr key={i}>
                      <td>{s.day}</td>
                      <td>{s.type}</td>
                      <td>{s.am}</td>
                      <td>{s.pm}</td>
                      <td>
                        {s.coach !== 'Equipo Elite' && s.coach !== '—' ? (
                          <span className="clickable-name" onClick={() => handleCoachClick(s.coach)}>{s.coach}</span>
                        ) : (
                          s.coach
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Open Gym Hours */}
          <div className="app-section">
            <div className="app-section-title"><Dumbbell size={16} className="lucide-icon"/> Open Gym (Máquinas)</div>
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

      {/* COACH MODAL */}
      {selectedCoach && (
        <div className="stripe-modal-overlay" onClick={() => setSelectedCoach(null)}>
          <div className="stripe-modal" onClick={e => e.stopPropagation()} style={{textAlign: 'center', padding: '0', overflow: 'hidden'}}>
            <div style={{position: 'relative'}}>
              <img src={selectedCoach.image} alt={selectedCoach.name} style={{width: '100%', height: '300px', objectFit: 'cover', display: 'block'}} />
              <button onClick={() => setSelectedCoach(null)} style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex'}}>
                <X size={20} />
              </button>
            </div>
            <div style={{padding: '2rem'}}>
              <h2 style={{fontSize: '2rem', marginBottom: '0.2rem'}}>{selectedCoach.name}</h2>
              <p style={{color: 'var(--primary)', fontFamily: 'Montserrat', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem'}}>{selectedCoach.role}</p>
              <p style={{color: 'var(--text-muted)', fontFamily: 'Montserrat', fontSize: '0.95rem', lineHeight: '1.6'}}>{selectedCoach.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
