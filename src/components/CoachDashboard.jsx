import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Dumbbell, Users, Target, CalendarDays, PlusCircle, X, MessageSquare, TrendingUp, ClipboardList, CheckCircle2, Clock, Send, ChevronRight } from 'lucide-react';

export default function CoachDashboard({ setView, user }) {
  const [coachTab, setCoachTab] = useState('dashboard');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [designAthlete, setDesignAthlete] = useState('');
  const [showMessage, setShowMessage] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [workoutText, setWorkoutText] = useState('');
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [publishStatus, setPublishStatus] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  // Fetch assigned athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('assigned_coach', user.id)
        .order('full_name');
      
      if (!error && data) {
        // Enrich with workout compliance data
        const enriched = await Promise.all(data.map(async (a) => {
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
          const { count: totalWorkouts } = await supabase
            .from('workouts')
            .select('*', { count: 'exact', head: true })
            .eq('athlete_id', a.id)
            .gte('workout_date', thirtyDaysAgo.split('T')[0]);
          const { count: completedWorkouts } = await supabase
            .from('workouts')
            .select('*', { count: 'exact', head: true })
            .eq('athlete_id', a.id)
            .eq('completed', true)
            .gte('workout_date', thirtyDaysAgo.split('T')[0]);
          
          const compliance = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
          return { ...a, compliance };
        }));
        setAthletes(enriched);
      }

      // If no athletes found in DB, show demo data
      if (!data || data.length === 0) {
        setAthletes([
          { id: 'demo-1', full_name: 'Zahir Castillo', email: 'zahir@demo.com', membership_plan: 'Plan Dios Griego', membership_status: 'ACTIVE', compliance: 92 },
          { id: 'demo-2', full_name: 'Alejandro García', email: 'alex@demo.com', membership_plan: 'Pro', membership_status: 'ACTIVE', compliance: 78 },
          { id: 'demo-3', full_name: 'Mariana Ríos', email: 'mariana@demo.com', membership_plan: 'Plan Dios Griego', membership_status: 'ACTIVE', compliance: 95 },
        ]);
      }
    };
    fetchAthletes();
  }, [user]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!showMessage || !user) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${showMessage.id}),and(sender_id.eq.${showMessage.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
        .limit(50);
      if (data) setMessages(data);
    };
    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel('messages-coach')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        if ((msg.sender_id === user.id && msg.receiver_id === showMessage.id) || 
            (msg.sender_id === showMessage.id && msg.receiver_id === user.id)) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [showMessage, user]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !showMessage || !user) return;
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: showMessage.id,
      content: newMessage.trim()
    });
    setNewMessage('');
  };

  // Publish workout
  const handlePublishWorkout = async () => {
    const targetAthlete = athletes.find(a => a.full_name === designAthlete);
    if (!targetAthlete || !workoutText.trim() || !user) {
      alert(designAthlete ? 'Escribe el contenido de la rutina.' : 'Selecciona un atleta primero.');
      return;
    }
    
    const { error } = await supabase.from('workouts').insert({
      coach_id: user.id,
      athlete_id: targetAthlete.id,
      workout_date: workoutDate,
      title: workoutTitle || 'Entrenamiento del día',
      content: workoutText.trim()
    });

    if (error) {
      alert('Error al publicar: ' + error.message);
    } else {
      setPublishStatus('success');
      setWorkoutText('');
      setWorkoutTitle('');
      setTimeout(() => setPublishStatus(null), 3000);
    }
  };

  const tabStyle = (active) => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '1rem', background: 'transparent', border: 'none',
    color: active ? 'var(--text-main)' : 'var(--text-muted)',
    fontFamily: 'Montserrat', fontSize: '0.7rem', textTransform: 'uppercase',
    letterSpacing: '0.15em', fontWeight: active ? '600' : '300', cursor: 'pointer',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    transition: 'all 0.3s'
  });

  return (
    <div className="app-shell" style={{maxWidth: '1100px'}}>
      <div className="app-header">
        <div className="brand-logo">ELITE <span style={{color:'var(--primary)'}}>COACH</span></div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {/* Tab Navigation */}
      <div style={{display:'flex', gap:'0', marginBottom:'2rem', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <button onClick={() => setCoachTab('dashboard')} style={tabStyle(coachTab === 'dashboard')}>
          <ClipboardList size={16} /> Dashboard
        </button>
        <button onClick={() => setCoachTab('design')} style={tabStyle(coachTab === 'design')}>
          <Target size={16} /> Diseñar Programa
        </button>
        <button onClick={() => setCoachTab('messages')} style={tabStyle(coachTab === 'messages')}>
          <MessageSquare size={16} /> Mensajes
        </button>
      </div>

      {/* ===== TAB: DASHBOARD ===== */}
      {coachTab === 'dashboard' && (
        <>
          <div className="stat-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem'}}>
            <div className="stat-card highlight">
              <div className="stat-label">Roster Activo</div>
              <div className="stat-value">{athletes.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Compliance Prom.</div>
              <div className="stat-value">{athletes.length > 0 ? Math.round(athletes.reduce((a,b) => a + (b.compliance || 0), 0) / athletes.length) : 0}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Atletas VIP</div>
              <div className="stat-value">{athletes.filter(a => a.membership_status === 'ACTIVE').length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Inactivos</div>
              <div className="stat-value">{athletes.filter(a => a.membership_status !== 'ACTIVE').length}</div>
            </div>
          </div>

          {/* Athlete Cards */}
          <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
            <div className="app-section-title"><Users size={16} className="lucide-icon"/> Tus Atletas</div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'}}>
              {athletes.map((a) => (
                <div key={a.id} onClick={() => setSelectedAthlete(a)} style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px', padding: '1.5rem', cursor: 'pointer',
                  transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem'}}>
                    <div>
                      <h3 style={{fontFamily:'Playfair Display', fontSize:'1.3rem', marginBottom:'0.2rem'}}>{a.full_name || a.email}</h3>
                      <p style={{fontFamily:'Montserrat', fontSize:'0.75rem', color:'var(--primary)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.1em'}}>{a.membership_plan || 'Sin plan'}</p>
                    </div>
                    <span className={a.membership_status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>{a.membership_status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</span>
                  </div>

                  {/* Compliance */}
                  <div style={{marginBottom:'1rem'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.4rem'}}>
                      <span style={{fontFamily:'Montserrat', fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em'}}>Compliance (30 días)</span>
                      <span style={{fontFamily:'Montserrat', fontSize:'0.65rem', color:'var(--text-muted)'}}>{a.compliance || 0}%</span>
                    </div>
                    <div style={{width:'100%', height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'2px'}}>
                      <div style={{width: `${a.compliance || 0}%`, height:'100%', background: (a.compliance || 0) >= 90 ? '#4ade80' : (a.compliance || 0) >= 70 ? '#fbbf24' : '#ef4444', borderRadius:'2px', transition:'width 0.5s'}}></div>
                    </div>
                  </div>

                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <p style={{fontFamily:'Montserrat', fontSize:'0.7rem', color:'var(--text-muted)'}}>{a.email}</p>
                    <ChevronRight size={18} style={{color:'var(--text-muted)'}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== TAB: DESIGN ===== */}
      {coachTab === 'design' && (
        <>
          <div className="app-section" style={{borderTop:'none', paddingTop:0}}>
            <div className="app-section-title"><Target size={16} className="lucide-icon"/> Diseñador de Programas</div>
            <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap'}}>
              {athletes.map(a => (
                <button key={a.id} onClick={() => setDesignAthlete(a.full_name || a.email)}
                  style={{
                    padding:'0.8rem 1.5rem', borderRadius:'12px', cursor:'pointer',
                    fontFamily:'Montserrat', fontSize:'0.75rem', fontWeight: designAthlete === (a.full_name || a.email) ? '600' : '300',
                    textTransform:'uppercase', letterSpacing:'0.1em', transition:'all 0.3s',
                    background: designAthlete === (a.full_name || a.email) ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: designAthlete === (a.full_name || a.email) ? 'white' : 'var(--text-muted)',
                    border: designAthlete === (a.full_name || a.email) ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)'
                  }}>{a.full_name || a.email}</button>
              ))}
            </div>
          </div>

          <div className="app-section">
            <div className="app-section-title"><Dumbbell size={16} className="lucide-icon"/> Editor de Rutina</div>
            <div style={{background:'rgba(255,255,255,0.01)', borderRadius:'16px', padding:'2rem', border:'1px solid rgba(255,255,255,0.03)'}}>
              <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap'}}>
                <select className="scanner-input" style={{flex:1, minWidth:'200px'}} value={designAthlete} onChange={e => setDesignAthlete(e.target.value)}>
                  <option value="" disabled>Selecciona Atleta...</option>
                  {athletes.map(a => <option key={a.id} value={a.full_name || a.email}>{a.full_name || a.email}</option>)}
                </select>
                <input type="date" className="scanner-input" style={{flex:1, minWidth:'200px'}} value={workoutDate} onChange={e => setWorkoutDate(e.target.value)} />
              </div>

              <input 
                type="text" className="scanner-input" style={{marginBottom:'1rem'}} 
                placeholder="Título (ej: Tensión Estática — Avanzados)"
                value={workoutTitle} onChange={e => setWorkoutTitle(e.target.value)}
              />

              <textarea
                className="scanner-input"
                style={{minHeight:'220px', marginBottom:'1.5rem', resize:'vertical', lineHeight:'1.8'}}
                placeholder={"Escribe el programa detallado aquí.\n\nEj:\nA1. Front Lever Holds (4 × 10s) — RPE 8\nA2. Muscle Ups Estrictos (4 × 5) — Tempo 3-1-1-0\nDescanso: 90s entre superseries\n\nB1. Handstand Push Ups (3 × 8)\nB2. Planche Leans (3 × 20s)"}
                value={workoutText} onChange={e => setWorkoutText(e.target.value)}
              ></textarea>

              {publishStatus === 'success' && (
                <div style={{background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:'12px', padding:'1rem', marginBottom:'1rem', textAlign:'center'}}>
                  <p style={{color:'#4ade80', fontFamily:'Montserrat', fontSize:'0.85rem'}}>✓ Programa publicado exitosamente. El atleta lo verá en su portal.</p>
                </div>
              )}

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}>
                <p style={{fontFamily:'Montserrat', fontSize:'0.75rem', color:'var(--text-muted)'}}>El atleta verá esto en su sección "Mi Entrenamiento Hoy".</p>
                <button className="btn-luxury" style={{display:'flex', alignItems:'center', gap:'8px', padding:'1rem 2rem'}} onClick={handlePublishWorkout}>
                  <PlusCircle size={18} /> Publicar Programa
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== TAB: MESSAGES ===== */}
      {coachTab === 'messages' && (
        <div className="dashboard-grid" style={{gridTemplateColumns: '300px 1fr'}}>
          <div>
            <div className="app-section" style={{borderTop:'none', paddingTop:0}}>
              <div className="app-section-title"><MessageSquare size={16} className="lucide-icon"/> Conversaciones</div>
              {athletes.map(a => (
                <div key={a.id} onClick={() => setShowMessage(a)}
                  style={{
                    padding:'1rem', borderRadius:'12px', marginBottom:'0.5rem', cursor:'pointer',
                    background: showMessage?.id === a.id ? 'rgba(194,46,40,0.1)' : 'rgba(255,255,255,0.02)',
                    border: showMessage?.id === a.id ? '1px solid rgba(194,46,40,0.3)' : '1px solid rgba(255,255,255,0.04)',
                    transition:'all 0.3s'
                  }}>
                  <h4 style={{fontFamily:'Montserrat', fontSize:'0.85rem', fontWeight:'400', color:'var(--text-main)'}}>{a.full_name || a.email}</h4>
                  <p style={{fontFamily:'Montserrat', fontSize:'0.7rem', color:'var(--primary)', marginTop:'0.2rem'}}>{a.membership_plan || ''}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {showMessage ? (
              <div style={{background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'16px', padding:'1.5rem', minHeight:'400px', display:'flex', flexDirection:'column'}}>
                <div style={{borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:'1rem', marginBottom:'1rem'}}>
                  <h3 style={{fontFamily:'Playfair Display', fontSize:'1.3rem'}}>{showMessage.full_name || showMessage.email}</h3>
                  <p style={{fontFamily:'Montserrat', fontSize:'0.7rem', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.1em'}}>{showMessage.membership_plan || ''}</p>
                </div>

                <div style={{flex:1, marginBottom:'1rem', overflowY:'auto', maxHeight:'350px'}}>
                  <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {messages.length === 0 && (
                      <p style={{color:'var(--text-muted)', fontFamily:'Montserrat', fontSize:'0.85rem', textAlign:'center', padding:'2rem'}}>No hay mensajes aún. ¡Inicia la conversación!</p>
                    )}
                    {messages.map((msg, i) => (
                      <div key={i} style={{
                        alignSelf: msg.sender_id === user?.id ? 'flex-end' : 'flex-start',
                        maxWidth:'70%',
                        background: msg.sender_id === user?.id ? 'rgba(194,46,40,0.15)' : 'rgba(255,255,255,0.04)',
                        padding:'1rem',
                        borderRadius: msg.sender_id === user?.id ? '12px 12px 4px 12px' : '12px 12px 12px 4px'
                      }}>
                        <p style={{fontFamily:'Montserrat', fontSize:'0.85rem', color:'var(--text-main)', lineHeight:'1.5'}}>{msg.content}</p>
                        <p style={{fontFamily:'Montserrat', fontSize:'0.6rem', color:'var(--text-muted)', marginTop:'0.5rem'}}>{new Date(msg.created_at).toLocaleTimeString('es-MX', {hour:'2-digit', minute:'2-digit'})}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{display:'flex', gap:'0.5rem'}}>
                  <input className="scanner-input" placeholder="Escribe un mensaje..." style={{flex:1}} value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                  <button className="btn-luxury" style={{padding:'0 1.5rem', display:'flex', alignItems:'center'}} onClick={handleSendMessage}><Send size={18}/></button>
                </div>
              </div>
            ) : (
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px', color:'var(--text-muted)', fontFamily:'Montserrat', fontSize:'0.85rem'}}>
                Selecciona una conversación para comenzar.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ATHLETE DETAIL MODAL */}
      {selectedAthlete && (
        <div className="stripe-modal-overlay" onClick={() => setSelectedAthlete(null)}>
          <div className="stripe-modal" onClick={e => e.stopPropagation()} style={{maxWidth:'500px'}}>
            <button onClick={() => setSelectedAthlete(null)} style={{position:'absolute', top:'15px', right:'15px', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer', display:'flex'}}>
              <X size={20} />
            </button>

            <div style={{textAlign:'center', marginBottom:'2rem'}}>
              <h2 style={{fontSize:'2rem', marginBottom:'0.3rem'}}>{selectedAthlete.full_name || selectedAthlete.email}</h2>
              <p style={{color:'var(--primary)', fontFamily:'Montserrat', fontSize:'0.8rem', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.1em'}}>{selectedAthlete.membership_plan || 'Sin plan'}</p>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'2rem'}}>
              <div style={{background:'rgba(255,255,255,0.03)', padding:'1rem', borderRadius:'12px', textAlign:'center'}}>
                <p style={{fontSize:'0.55rem', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-muted)', fontFamily:'Montserrat', fontWeight:'600', marginBottom:'0.4rem'}}>Compliance</p>
                <p style={{fontFamily:'Montserrat', fontSize:'1rem', color: (selectedAthlete.compliance || 0) >= 90 ? '#4ade80' : '#fbbf24', fontWeight:'600'}}>{selectedAthlete.compliance || 0}%</p>
              </div>
              <div style={{background:'rgba(255,255,255,0.03)', padding:'1rem', borderRadius:'12px', textAlign:'center'}}>
                <p style={{fontSize:'0.55rem', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-muted)', fontFamily:'Montserrat', fontWeight:'600', marginBottom:'0.4rem'}}>Estado</p>
                <p style={{fontFamily:'Montserrat', fontSize:'1rem', color: selectedAthlete.membership_status === 'ACTIVE' ? '#4ade80' : '#ef4444', fontWeight:'600'}}>{selectedAthlete.membership_status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
              <button className="btn-luxury" style={{width:'100%', padding:'1rem'}} onClick={() => {setDesignAthlete(selectedAthlete.full_name || selectedAthlete.email); setCoachTab('design'); setSelectedAthlete(null);}}>Diseñar Programa</button>
              <button className="btn-luxury" style={{width:'100%', padding:'1rem', borderColor:'rgba(255,255,255,0.1)'}} onClick={() => {setShowMessage(selectedAthlete); setCoachTab('messages'); setSelectedAthlete(null);}}>Enviar Mensaje</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
