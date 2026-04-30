import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldCheck, LineChart, ScanLine, Clock, TrendingUp, Users, Flame, X, Wallet, UserPlus, Shield, Search, Eye, Trash2 } from 'lucide-react';

export default function AdminDashboard({ setView, user }) {
  const [adminTab, setAdminTab] = useState('access');
  const [scanInput, setScanInput] = useState('');
  const [scanLog, setScanLog] = useState([]);
  const [flashAlert, setFlashAlert] = useState(null);
  const [scannedProfile, setScannedProfile] = useState(null);
  const [stats, setStats] = useState({ occupancy: 0, checkinsToday: 0, totalMembers: 0 });
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberModalTab, setMemberModalTab] = useState('actions'); // 'actions' | 'info'
  const [memberAttendance, setMemberAttendance] = useState([]);
  const scanRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [paymentPlan, setPaymentPlan] = useState('Full Access Elite');

  // Team/Role management state
  const [roleSearchEmail, setRoleSearchEmail] = useState('');
  const [roleSearchResult, setRoleSearchResult] = useState(null);
  const [roleSearchLoading, setRoleSearchLoading] = useState(false);
  const [roleMessage, setRoleMessage] = useState(null);

  // New client registration state
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', plan: 'Full Access Elite', password: '' });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState(null);
  const [paymentMethodReg, setPaymentMethodReg] = useState('EFECTIVO');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  useEffect(() => {
    const fetchAll = async () => {
      const today = new Date().toISOString().split('T')[0];

      // Auto-checkout: close entries older than 90 minutes without checkout
      const cutoff = new Date(Date.now() - 90 * 60 * 1000).toISOString();
      await supabase.from('attendance')
        .update({ checked_out_at: new Date().toISOString() })
        .gte('checked_in_at', today)
        .lt('checked_in_at', cutoff)
        .is('checked_out_at', null);

      const { count: occ } = await supabase.from('attendance').select('*', { count: 'exact', head: true }).gte('checked_in_at', today).is('checked_out_at', null);
      const { count: checkins } = await supabase.from('attendance').select('*', { count: 'exact', head: true }).gte('checked_in_at', today);
      const { count: total } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { data: memberList } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(50);
      const { data: todayScans } = await supabase.from('attendance').select('*, users(full_name, email, membership_status, membership_plan)').gte('checked_in_at', today).order('checked_in_at', { ascending: false }).limit(20);

      setStats({ occupancy: occ || 0, checkinsToday: checkins || 0, totalMembers: total || 0 });
      setMembers(memberList || []);
      setScanLog(todayScans || []);
    };
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus scanner when on access tab
  useEffect(() => { if (scanRef.current && adminTab === 'access') scanRef.current.focus(); }, [adminTab]);

  // Handle QR Scan
  const handleScan = async (e) => {
    if (e.key !== 'Enter' || !scanInput.trim()) return;
    const userId = scanInput.trim();
    setScanInput('');
    setScannedProfile(null);

    const { data: scannedUser, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error || !scannedUser) {
      setFlashAlert({ type: 'error', message: '⚠ Usuario no encontrado en el sistema.' });
      setScannedProfile(null);
      setTimeout(() => setFlashAlert(null), 5000);
      if (scanRef.current) scanRef.current.focus();
      return;
    }

    // Show client profile card
    setScannedProfile(scannedUser);

    // Check for duplicate (already checked in within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase.from('attendance').select('id').eq('user_id', userId).gte('checked_in_at', oneHourAgo).limit(1);

    if (recent && recent.length > 0) {
      setFlashAlert({ type: 'error', message: `⚠ ${scannedUser.full_name || scannedUser.email} — Ya registrado (hace menos de 1 hora)` });
      setTimeout(() => setFlashAlert(null), 5000);
      if (scanRef.current) scanRef.current.focus();
      return;
    }

    const isActive = scannedUser.membership_status === 'ACTIVE';

    if (isActive) {
      await supabase.from('attendance').insert({ user_id: userId, method: 'QR' });
      setFlashAlert({ type: 'success', message: `✓ ${scannedUser.full_name || scannedUser.email} — ACCESO PERMITIDO` });
      setStats(prev => ({ ...prev, occupancy: prev.occupancy + 1, checkinsToday: prev.checkinsToday + 1 }));
      setScanLog(prev => [{ users: scannedUser, checked_in_at: new Date().toISOString(), status: 'success' }, ...prev]);
    } else {
      setFlashAlert({ type: 'error', message: `⚠ ${scannedUser.full_name || scannedUser.email} — MEMBRESÍA INACTIVA` });
      setScanLog(prev => [{ users: scannedUser, checked_in_at: new Date().toISOString(), status: 'error' }, ...prev]);
    }

    setTimeout(() => setFlashAlert(null), 5000);
    if (scanRef.current) scanRef.current.focus();
  };

  // Mark checkout
  const handleCheckout = async (id) => {
    const now = new Date().toISOString();
    const { error } = await supabase.from('attendance').update({ checked_out_at: now }).eq('id', id);
    if (!error) {
      setScanLog(prev => prev.map(entry => entry.id === id ? { ...entry, checked_out_at: now } : entry));
      setStats(prev => ({ ...prev, occupancy: Math.max(0, prev.occupancy - 1) }));
    }
  };

  // Search user by email for role management
  const handleRoleSearch = async () => {
    if (!roleSearchEmail.trim()) return;
    setRoleSearchLoading(true);
    setRoleMessage(null);
    setRoleSearchResult(null);
    const { data, error } = await supabase.from('users').select('*').eq('email', roleSearchEmail.trim().toLowerCase()).single();
    if (error || !data) {
      setRoleMessage({ type: 'error', text: `No se encontró ningún usuario con el correo "${roleSearchEmail}".` });
    } else {
      setRoleSearchResult(data);
    }
    setRoleSearchLoading(false);
  };

  // Assign role to user
  const handleRoleAssign = async (newRole) => {
    if (!roleSearchResult) return;
    if (roleSearchResult.role === newRole) return;
    if (newRole === 'ADMIN' && !window.confirm(`¿Estás seguro de dar permisos de ADMINISTRADOR a ${roleSearchResult.full_name || roleSearchResult.email}?`)) return;
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', roleSearchResult.id);
    if (error) {
      setRoleMessage({ type: 'error', text: 'Error al actualizar rol: ' + error.message });
    } else {
      setRoleSearchResult({ ...roleSearchResult, role: newRole });
      setRoleMessage({ type: 'success', text: `✓ Rol actualizado a ${newRole} para ${roleSearchResult.full_name || roleSearchResult.email}` });
      setMembers(prev => prev.map(m => m.id === roleSearchResult.id ? { ...m, role: newRole } : m));
    }
  };

  // Register new client from reception
  const handleRegisterClient = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterMessage(null);

    if (newClient.password.length < 6) {
      setRegisterMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
      setRegisterLoading(false);
      return;
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newClient.email.trim().toLowerCase(),
      password: newClient.password,
      options: {
        data: { full_name: newClient.name, phone: newClient.phone }
      }
    });

    if (authError) {
      setRegisterMessage({ type: 'error', text: 'Error: ' + authError.message });
      setRegisterLoading(false);
      return;
    }

    // Activate membership
    if (authData?.user?.id) {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);
      await supabase.from('users').update({
        membership_plan: newClient.plan,
        membership_status: 'ACTIVE',
        membership_expiry: expiry.toISOString().split('T')[0]
      }).eq('id', authData.user.id);
    }

    setRegisterMessage({ type: 'success', text: `✓ Cliente "${newClient.name}" registrado con plan ${newClient.plan}. Pago: ${paymentMethodReg}. Contraseña temporal: ${newClient.password}` });
    setNewClient({ name: '', email: '', phone: '', plan: 'Full Access Elite', password: '' });
    setPaymentMethodReg('EFECTIVO');
    setRegisterLoading(false);
  };

  // Financial data
  const weeklyData = [
    { label: 'Sem 1', value: 35000 },
    { label: 'Sem 2', value: 42000 },
    { label: 'Sem 3', value: 38000 },
    { label: 'Sem 4', value: 27000 },
  ];
  const maxVal = Math.max(...weeklyData.map(w => w.value));
  const totalRevenue = weeklyData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="brand-logo">ELITE <span style={{color:'var(--primary)'}}>ADMIN</span></div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {/* Tab Navigation */}
      <div style={{display:'flex',gap:'0',marginBottom:'2rem',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <button onClick={() => setAdminTab('access')} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',padding:'0.8rem 0.5rem',background:'transparent',border:'none',color: adminTab === 'access' ? 'var(--text-main)' : 'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight: adminTab === 'access' ? '600' : '300',cursor:'pointer',borderBottom: adminTab === 'access' ? '2px solid var(--primary)' : '2px solid transparent',transition:'all 0.3s'}}>
          <ShieldCheck size={14} /> Acceso
        </button>
        <button onClick={() => setAdminTab('financial')} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',padding:'0.8rem 0.5rem',background:'transparent',border:'none',color: adminTab === 'financial' ? 'var(--text-main)' : 'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight: adminTab === 'financial' ? '600' : '300',cursor:'pointer',borderBottom: adminTab === 'financial' ? '2px solid var(--primary)' : '2px solid transparent',transition:'all 0.3s'}}>
          <LineChart size={14} /> Financiero
        </button>
        <button onClick={() => setAdminTab('team')} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',padding:'0.8rem 0.5rem',background:'transparent',border:'none',color: adminTab === 'team' ? 'var(--text-main)' : 'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight: adminTab === 'team' ? '600' : '300',cursor:'pointer',borderBottom: adminTab === 'team' ? '2px solid var(--primary)' : '2px solid transparent',transition:'all 0.3s'}}>
          <Shield size={14} /> Equipo
        </button>
      </div>

      {/* ===== TAB: CONTROL DE ACCESO ===== */}
      {adminTab === 'access' && (
        <div className="dashboard-grid-2col">
          {/* Left Column */}
          <div>
            {flashAlert && <div className={`flash-alert ${flashAlert.type}`}>{flashAlert.message}</div>}

            {/* QR Scanner */}
            <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
              <div className="app-section-title"><ScanLine size={16} className="lucide-icon"/> Lector de Acceso QR</div>
              <input
                ref={scanRef}
                className="scanner-input"
                placeholder="Esperando escaneo del lector..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={handleScan}
                autoFocus
              />
            </div>

            {/* Scanned Client Profile Card */}
            {scannedProfile && (
              <div className="app-section" style={{borderTop:'none',paddingTop:0}}>
                <div style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                    <div>
                      <h3 style={{fontFamily:'Playfair Display',fontSize:'1.5rem',marginBottom:'0.3rem'}}>{scannedProfile.full_name || 'Sin nombre'}</h3>
                      <p style={{fontFamily:'Montserrat',fontWeight:'300',fontSize:'0.8rem',color:'var(--text-muted)'}}>{scannedProfile.email}</p>
                    </div>
                    <span className={scannedProfile.membership_status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>
                      {scannedProfile.membership_status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    <div>
                      <p style={{fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--text-muted)',fontFamily:'Montserrat',fontWeight:'600',marginBottom:'0.3rem'}}>Plan</p>
                      <p style={{fontFamily:'Montserrat',fontSize:'0.9rem',color:'var(--text-main)'}}>{scannedProfile.membership_plan || '—'}</p>
                    </div>
                    <div>
                      <p style={{fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--text-muted)',fontFamily:'Montserrat',fontWeight:'600',marginBottom:'0.3rem'}}>Vencimiento</p>
                      <p style={{fontFamily:'Montserrat',fontSize:'0.9rem',color:'var(--text-main)'}}>{scannedProfile.membership_expiry ? new Date(scannedProfile.membership_expiry).toLocaleDateString('es-MX') : '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Stat Cards */}
            <div className="stat-grid" style={{marginBottom: '2rem'}}>
              <div className="stat-card highlight">
                <div className="stat-label" style={{display:'flex', alignItems:'center'}}><span className="pulse-dot"></span><Flame size={12} style={{marginRight:'4px'}}/> En el Gym</div>
                <div className="stat-value">{stats.occupancy}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Check-ins Hoy</div>
                <div className="stat-value">{stats.checkinsToday}</div>
              </div>
            </div>

            {/* Scan Log */}
            <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
              <div className="app-section-title"><Clock size={16} className="lucide-icon"/> Entradas de Hoy</div>
              <div style={{background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.03)'}}>
                {scanLog.length === 0 && <p style={{color:'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.85rem'}}>Sin registros aún.</p>}
                {scanLog.slice(0, 15).map((entry, i) => (
                  <div key={i} className={`scan-entry ${entry.status || (entry.users?.membership_status === 'ACTIVE' ? 'success' : 'error')}`} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <span className="scan-name">{entry.users?.full_name || entry.users?.email || 'Desconocido'}</span>
                      <span className="scan-time">{new Date(entry.checked_in_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {entry.id && (
                      entry.checked_out_at ? (
                        <span style={{fontFamily:'Montserrat', fontSize:'0.6rem', color:'var(--text-muted)', background:'rgba(255,255,255,0.04)', padding:'0.2rem 0.5rem', borderRadius:'6px', fontWeight:'500'}}>Salió {new Date(entry.checked_out_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                      ) : (
                        <button 
                          onClick={() => handleCheckout(entry.id)}
                          style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-main)', cursor:'pointer', fontSize:'0.6rem', fontFamily:'Montserrat', fontWeight:'500', padding:'0.25rem 0.6rem', borderRadius:'6px', transition:'all 0.2s'}}
                        >
                          Marcar Salida
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: FINANCIERO ===== */}
      {adminTab === 'financial' && (
        <div className="dashboard-grid-2col" style={{overflow:'hidden'}}>
          {/* Left Column */}
          <div>
            <div className="stat-grid">
              <div className="stat-card highlight">
                <div className="stat-label">Ingresos del Mes</div>
                <div className="stat-value" style={{fontSize:'1.5rem'}}>${totalRevenue.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Socios Totales</div>
                <div className="stat-value">{stats.totalMembers}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Activos</div>
                <div className="stat-value">{members.filter(m => m.membership_status === 'ACTIVE').length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Inactivos</div>
                <div className="stat-value">{members.filter(m => m.membership_status !== 'ACTIVE').length}</div>
              </div>
            </div>

            {/* Chart */}
            <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
              <div className="app-section-title"><TrendingUp size={16} className="lucide-icon"/> Ingresos Semanales</div>
              <div style={{background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.03)'}}>
                <div className="chart-bars">
                  {weeklyData.map((w, i) => (
                    <div key={i} className="chart-bar" style={{ height: `${(w.value / maxVal) * 100}%` }}></div>
                  ))}
                </div>
                <div className="chart-labels">
                  {weeklyData.map((w, i) => <span key={i}>{w.label}<br/>${(w.value/1000).toFixed(0)}k</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{minWidth:0, overflow:'hidden'}}>
            {/* Members Table */}
            <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
              <div className="app-section-title"><Users size={16} className="lucide-icon"/> Socios Registrados</div>
              <div style={{background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.03)', overflowX:'hidden'}}>
                <table className="socios-table">
                  <thead><tr><th>Nombre</th><th>Plan</th><th>Vencimiento</th><th>Status</th></tr></thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr key={i}>
                        <td><span className="clickable-name" onClick={() => setSelectedMember(m)}>{m.full_name || m.email}</span></td>
                        <td>{m.membership_plan || '—'}</td>
                        <td>{m.membership_expiry ? new Date(m.membership_expiry).toLocaleDateString('es-MX') : '—'}</td>
                        <td><span className={m.membership_status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>{m.membership_status === 'ACTIVE' ? 'Activa' : 'Inactiva'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: EQUIPO ===== */}
      {adminTab === 'team' && (
        <div style={{maxWidth:'600px'}}>
          {/* ROLE MANAGER */}
          <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
            <div className="app-section-title"><Shield size={16} className="lucide-icon"/> Asignar Roles</div>
            <p style={{fontFamily:'Montserrat', fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'1.2rem', lineHeight:'1.6'}}>
              Busca un usuario registrado por su correo electrónico y asígnale un rol (Admin, Coach o Cliente).
            </p>
            <div style={{display:'flex', gap:'0.5rem', marginBottom:'1rem'}}>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="scanner-input"
                style={{flex:1, marginBottom:0}}
                value={roleSearchEmail}
                onChange={e => setRoleSearchEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRoleSearch(); }}
              />
              <button className="btn-luxury" style={{padding:'0.6rem 1rem', fontSize:'0.65rem', display:'flex', alignItems:'center', gap:'4px', whiteSpace:'nowrap'}} onClick={handleRoleSearch} disabled={roleSearchLoading}>
                <Search size={14} /> Buscar
              </button>
            </div>

            {roleMessage && (
              <div style={{padding:'0.6rem 1rem', borderRadius:'10px', marginBottom:'1rem', fontFamily:'Montserrat', fontSize:'0.72rem',
                background: roleMessage.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${roleMessage.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
                color: roleMessage.type === 'success' ? '#4ade80' : '#ef4444'
              }}>{roleMessage.text}</div>
            )}

            {roleSearchResult && (
              <div style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'1.2rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
                  <div>
                    <p style={{fontFamily:'Montserrat', fontSize:'0.85rem', fontWeight:'600', color:'var(--text-main)'}}>{roleSearchResult.full_name || 'Sin nombre'}</p>
                    <p style={{fontFamily:'Montserrat', fontSize:'0.7rem', color:'var(--text-muted)'}}>{roleSearchResult.email}</p>
                  </div>
                  <span style={{
                    padding:'0.25rem 0.7rem', borderRadius:'20px', fontFamily:'Montserrat', fontSize:'0.6rem', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em',
                    background: roleSearchResult.role === 'ADMIN' ? 'rgba(239,68,68,0.1)' : roleSearchResult.role === 'COACH' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)',
                    color: roleSearchResult.role === 'ADMIN' ? '#ef4444' : roleSearchResult.role === 'COACH' ? '#3b82f6' : 'var(--text-muted)',
                    border: `1px solid ${roleSearchResult.role === 'ADMIN' ? 'rgba(239,68,68,0.2)' : roleSearchResult.role === 'COACH' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)'}`
                  }}>{roleSearchResult.role || 'CLIENT'}</span>
                </div>
                <p style={{fontFamily:'Montserrat', fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'600', marginBottom:'0.5rem'}}>Cambiar Rol</p>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  {['CLIENT', 'COACH', 'ADMIN'].map(role => (
                    <button key={role} onClick={() => handleRoleAssign(role)} style={{
                      flex:1, padding:'0.6rem', borderRadius:'10px', cursor:'pointer',
                      fontFamily:'Montserrat', fontSize:'0.65rem', fontWeight: roleSearchResult.role === role ? '700' : '400',
                      textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.3s',
                      background: roleSearchResult.role === role ? (role === 'ADMIN' ? 'var(--primary)' : role === 'COACH' ? '#3b82f6' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.03)',
                      color: roleSearchResult.role === role ? 'white' : 'var(--text-muted)',
                      border: roleSearchResult.role === role ? 'none' : '1px solid rgba(255,255,255,0.08)'
                    }}>{role === 'CLIENT' ? '👤 Cliente' : role === 'COACH' ? '🏋️ Coach' : '🛡️ Admin'}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* REGISTER NEW CLIENT */}
          <div className="app-section">
            <div className="app-section-title"><UserPlus size={16} className="lucide-icon"/> Dar de Alta Cliente</div>
            <p style={{fontFamily:'Montserrat', fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'1.2rem', lineHeight:'1.6'}}>
              Registra un nuevo cliente directamente desde recepción. Se creará su cuenta y se activará su membresía.
            </p>

            {registerMessage && (
              <div style={{padding:'0.6rem 1rem', borderRadius:'10px', marginBottom:'1rem', fontFamily:'Montserrat', fontSize:'0.72rem',
                background: registerMessage.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${registerMessage.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
                color: registerMessage.type === 'success' ? '#4ade80' : '#ef4444'
              }}>{registerMessage.text}</div>
            )}

            <form onSubmit={handleRegisterClient} style={{display:'flex', flexDirection:'column', gap:'0.8rem'}}>
              <input type="text" placeholder="Nombre Completo" className="scanner-input" style={{marginBottom:0}} value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} required />
              <input type="email" placeholder="Correo Electrónico" className="scanner-input" style={{marginBottom:0}} value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} required />
              <input type="tel" placeholder="Teléfono" className="scanner-input" style={{marginBottom:0}} value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
              
              <p style={{fontFamily:'Montserrat', fontSize:'0.6rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'600', marginTop:'0.3rem', marginBottom:'-0.3rem'}}>Seleccionar Plan</p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
                {[
                  { name: 'Full Access Elite', price: '$4,000' },
                  { name: 'Clases Elite', price: '$3,800' },
                  { name: 'Personalizado Elite', price: '$16,000' },
                  { name: 'Personalizado Lite', price: '$10,000' },
                  { name: 'Kids Elite', price: '$2,500' },
                ].map(plan => (
                  <button type="button" key={plan.name} onClick={() => setNewClient({...newClient, plan: plan.name})} style={{
                    padding:'0.7rem 0.6rem', borderRadius:'10px', cursor:'pointer', textAlign:'left',
                    background: newClient.plan === plan.name ? 'rgba(194,46,40,0.08)' : 'rgba(255,255,255,0.02)',
                    border: newClient.plan === plan.name ? '1.5px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                    transition:'all 0.2s'
                  }}>
                    <p style={{fontFamily:'Montserrat', fontSize:'0.65rem', fontWeight: newClient.plan === plan.name ? '600' : '400', color: newClient.plan === plan.name ? 'var(--text-main)' : 'var(--text-muted)', margin:0, lineHeight:'1.3'}}>{plan.name}</p>
                    <p style={{fontFamily:'Montserrat', fontSize:'0.55rem', color: newClient.plan === plan.name ? 'var(--primary)' : 'rgba(255,255,255,0.25)', margin:'0.15rem 0 0', fontWeight:'600'}}>{plan.price}</p>
                  </button>
                ))}
              </div>

              <p style={{fontFamily:'Montserrat', fontSize:'0.6rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'600', marginTop:'0.3rem', marginBottom:'-0.3rem'}}>Método de Pago</p>
              <div style={{display:'flex', gap:'0.5rem'}}>
                {['EFECTIVO', 'TARJETA'].map(method => (
                  <button type="button" key={method} onClick={() => setPaymentMethodReg(method)} style={{
                    flex:1, padding:'0.6rem', borderRadius:'10px', cursor:'pointer',
                    fontFamily:'Montserrat', fontSize:'0.65rem', fontWeight: paymentMethodReg === method ? '600' : '400',
                    textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.2s',
                    background: paymentMethodReg === method ? 'rgba(194,46,40,0.08)' : 'rgba(255,255,255,0.02)',
                    color: paymentMethodReg === method ? 'var(--text-main)' : 'var(--text-muted)',
                    border: paymentMethodReg === method ? '1.5px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)'
                  }}>{method === 'EFECTIVO' ? '💵 Efectivo' : '💳 Tarjeta'}</button>
                ))}
              </div>

              <input type="text" placeholder="Contraseña temporal (mín. 6 caracteres)" className="scanner-input" style={{marginBottom:0}} value={newClient.password} onChange={e => setNewClient({...newClient, password: e.target.value})} required minLength={6} />
              <button type="submit" className="btn-luxury" style={{width:'100%', padding:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'}} disabled={registerLoading}>
                <UserPlus size={16} /> {registerLoading ? 'Creando cuenta...' : 'Registrar Cliente'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ACTION MODAL */}
      {selectedMember && (
        <div className="stripe-modal-overlay" onClick={() => { setSelectedMember(null); setMemberModalTab('actions'); }}>
          <div className="stripe-modal" onClick={e => e.stopPropagation()} style={{textAlign: 'center', padding: '0', maxWidth: '460px', overflow:'hidden'}}>
            <button onClick={() => { setSelectedMember(null); setMemberModalTab('actions'); }} style={{position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', zIndex:2}}>
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{padding:'2rem 2rem 0'}}>
              <h2 style={{fontSize: '1.6rem', marginBottom: '0.3rem'}}>{selectedMember.full_name || selectedMember.email}</h2>
              <p style={{color: 'var(--primary)', fontFamily: 'Montserrat', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem'}}>{selectedMember.membership_plan || 'Sin plan'}</p>
              <p style={{color: 'var(--text-muted)', fontFamily: 'Montserrat', fontSize: '0.75rem', marginBottom: '1rem'}}>
                Estado: <span style={{color: selectedMember.membership_status === 'ACTIVE' ? '#4ade80' : '#ef4444', fontWeight: '600'}}>{selectedMember.membership_status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</span>
                {selectedMember.membership_expiry && ` · Vence: ${new Date(selectedMember.membership_expiry).toLocaleDateString('es-MX')}`}
              </p>
            </div>

            {/* Tab Switcher */}
            <div style={{display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              <button onClick={() => setMemberModalTab('actions')} style={{flex:1, padding:'0.7rem', background:'transparent', border:'none', borderBottom: memberModalTab === 'actions' ? '2px solid var(--primary)' : '2px solid transparent', color: memberModalTab === 'actions' ? 'var(--text-main)' : 'var(--text-muted)', fontFamily:'Montserrat', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight: memberModalTab === 'actions' ? '600' : '400', cursor:'pointer', transition:'all 0.2s'}}>Acciones</button>
              <button onClick={async () => {
                setMemberModalTab('info');
                const { data } = await supabase.from('attendance').select('*').eq('user_id', selectedMember.id).order('checked_in_at', { ascending: false }).limit(30);
                setMemberAttendance(data || []);
              }} style={{flex:1, padding:'0.7rem', background:'transparent', border:'none', borderBottom: memberModalTab === 'info' ? '2px solid var(--primary)' : '2px solid transparent', color: memberModalTab === 'info' ? 'var(--text-main)' : 'var(--text-muted)', fontFamily:'Montserrat', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight: memberModalTab === 'info' ? '600' : '400', cursor:'pointer', transition:'all 0.2s'}}><Eye size={12} style={{verticalAlign:'middle', marginRight:'4px'}}/> Info & Historial</button>
            </div>

            {/* TAB: ACCIONES */}
            {memberModalTab === 'actions' && (
              <div style={{padding:'1.5rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                <button className="btn-luxury" style={{width: '100%', padding: '0.8rem', fontSize:'0.7rem'}} onClick={async () => {
                  const expiry = new Date();
                  expiry.setMonth(expiry.getMonth() + 1);
                  const { error } = await supabase.from('users').update({
                    membership_status: 'ACTIVE',
                    membership_expiry: expiry.toISOString().split('T')[0]
                  }).eq('id', selectedMember.id);
                  if (error) { alert('Error: ' + error.message); } 
                  else { 
                    alert(`¡Membresía renovada! Activo hasta ${expiry.toLocaleDateString('es-MX')}.`);
                    setSelectedMember({...selectedMember, membership_status: 'ACTIVE', membership_expiry: expiry.toISOString().split('T')[0]});
                    setMembers(prev => prev.map(m => m.id === selectedMember.id ? {...m, membership_status: 'ACTIVE', membership_expiry: expiry.toISOString().split('T')[0]} : m));
                  }
                }}>Renovar Membresía (+1 mes)</button>
                
                <button className="btn-luxury" style={{width: '100%', padding: '0.8rem', fontSize:'0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} onClick={() => setShowPaymentModal(true)}>
                  <Wallet size={16} /> Registrar Pago en Recepción
                </button>

                <button style={{background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', width: '100%', padding: '0.8rem', borderRadius: '12px', fontFamily: 'Montserrat', fontWeight: '400', cursor: 'pointer', transition: 'all 0.3s', fontSize:'0.7rem'}} onMouseOver={e => e.target.style.background='rgba(239, 68, 68, 0.06)'} onMouseOut={e => e.target.style.background='transparent'} onClick={async () => { 
                  if(window.confirm(`¿Revocar acceso a ${selectedMember.full_name || selectedMember.email}?`)) {
                    const { error } = await supabase.from('users').update({ membership_status: 'INACTIVE' }).eq('id', selectedMember.id);
                    if (!error) {
                      setSelectedMember({...selectedMember, membership_status: 'INACTIVE'});
                      setMembers(prev => prev.map(m => m.id === selectedMember.id ? {...m, membership_status: 'INACTIVE'} : m));
                    }
                  }
                }}>Revocar Acceso</button>

                <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem', marginTop: '0.3rem'}}>
                  <button style={{background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.15)', color: 'rgba(239,68,68,0.6)', width: '100%', padding: '0.8rem', borderRadius: '12px', fontFamily: 'Montserrat', fontWeight: '400', cursor: 'pointer', transition: 'all 0.3s', fontSize:'0.65rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'}} onMouseOver={e => { e.currentTarget.style.background='rgba(239, 68, 68, 0.08)'; e.currentTarget.style.color='#ef4444'; }} onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(239,68,68,0.6)'; }} onClick={async () => {
                    const name = selectedMember.full_name || selectedMember.email;
                    if (!window.confirm(`⚠ ELIMINAR PERMANENTEMENTE a "${name}"?\n\nEsto borrará:\n• Todos sus registros de asistencia\n• Sus workouts y mensajes\n• Su perfil y membresía\n\nEsta acción NO se puede deshacer.`)) return;
                    if (!window.confirm(`Última confirmación: ¿Eliminar "${name}" del sistema por completo?`)) return;

                    try {
                      // Delete all related records first (FK constraints)
                      await supabase.from('reservations').delete().eq('user_id', selectedMember.id);
                      await supabase.from('messages').delete().eq('sender_id', selectedMember.id);
                      await supabase.from('messages').delete().eq('receiver_id', selectedMember.id);
                      await supabase.from('workouts').delete().eq('athlete_id', selectedMember.id);
                      await supabase.from('workouts').delete().eq('coach_id', selectedMember.id);
                      await supabase.from('attendance').delete().eq('user_id', selectedMember.id);
                      
                      // Delete the user profile
                      const { error } = await supabase.from('users').delete().eq('id', selectedMember.id);
                      
                      if (error) {
                        alert('Error al eliminar: ' + error.message + '\n\nVerifica que ejecutaste las políticas DELETE en Supabase SQL Editor.');
                        return;
                      }

                      setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
                      setStats(prev => ({ ...prev, totalMembers: prev.totalMembers - 1 }));
                      setSelectedMember(null);
                      alert(`✓ "${name}" eliminado permanentemente del sistema.`);
                    } catch (err) {
                      alert('Error inesperado: ' + err.message);
                    }
                  }}>
                    <Trash2 size={14} /> Eliminar Cliente Permanentemente
                  </button>
                </div>
              </div>
            )}

            {/* TAB: INFO & HISTORIAL */}
            {memberModalTab === 'info' && (
              <div style={{padding:'1.5rem 2rem 2rem', textAlign:'left'}}>
                {/* Profile Details */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem'}}>
                  {[
                    { label: 'Correo', value: selectedMember.email },
                    { label: 'Teléfono', value: selectedMember.phone || '—' },
                    { label: 'Rol', value: selectedMember.role || 'CLIENT' },
                    { label: 'Registro', value: selectedMember.created_at ? new Date(selectedMember.created_at).toLocaleDateString('es-MX', { year:'numeric', month:'short', day:'numeric' }) : '—' },
                    { label: 'Plan', value: selectedMember.membership_plan || '—' },
                    { label: 'Vencimiento', value: selectedMember.membership_expiry ? new Date(selectedMember.membership_expiry).toLocaleDateString('es-MX') : '—' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p style={{fontFamily:'Montserrat', fontSize:'0.55rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', fontWeight:'600', marginBottom:'0.2rem'}}>{item.label}</p>
                      <p style={{fontFamily:'Montserrat', fontSize:'0.8rem', color:'var(--text-main)', wordBreak:'break-all'}}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Attendance History */}
                <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1rem'}}>
                  <p style={{fontFamily:'Montserrat', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', fontWeight:'600', marginBottom:'0.8rem'}}>Historial de Asistencia ({memberAttendance.length})</p>
                  <div style={{maxHeight:'200px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'0.4rem'}}>
                    {memberAttendance.length === 0 && <p style={{fontFamily:'Montserrat', fontSize:'0.75rem', color:'var(--text-muted)'}}>Sin registros de asistencia.</p>}
                    {memberAttendance.map((att, i) => (
                      <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.5rem 0.7rem', background:'rgba(255,255,255,0.02)', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.04)'}}>
                        <div>
                          <span style={{fontFamily:'Montserrat', fontSize:'0.7rem', color:'var(--text-main)'}}>{new Date(att.checked_in_at).toLocaleDateString('es-MX', { weekday:'short', month:'short', day:'numeric' })}</span>
                          <span style={{fontFamily:'Montserrat', fontSize:'0.6rem', color:'var(--text-muted)', marginLeft:'0.5rem'}}>{new Date(att.checked_in_at).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })}</span>
                        </div>
                        {att.checked_out_at ? (
                          <span style={{fontFamily:'Montserrat', fontSize:'0.55rem', color:'rgba(74,222,128,0.7)'}}>Salió {new Date(att.checked_out_at).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })}</span>
                        ) : (
                          <span style={{fontFamily:'Montserrat', fontSize:'0.55rem', color:'var(--primary)'}}>En gym</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* PAYMENT IN RECEPTION MODAL */}
      {showPaymentModal && selectedMember && (
        <div className="stripe-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="stripe-modal" onClick={e => e.stopPropagation()} style={{textAlign: 'center', padding: '2rem', maxWidth: '400px'}}>
            <button onClick={() => setShowPaymentModal(false)} style={{position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex'}}>
              <X size={20} />
            </button>
            <span className="overline">Pago en Recepción</span>
            <h2 style={{fontSize: '1.8rem', marginBottom: '1.5rem'}}>{selectedMember.full_name || selectedMember.email}</h2>
            
            <div style={{marginBottom: '1.5rem'}}>
              <p style={{fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'Montserrat', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'left'}}>Método de Pago</p>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                {['EFECTIVO', 'TARJETA'].map(method => (
                  <button key={method} onClick={() => setPaymentMethod(method)} style={{
                    flex: 1, padding: '0.8rem', borderRadius: '12px', cursor: 'pointer',
                    fontFamily: 'Montserrat', fontSize: '0.75rem', fontWeight: paymentMethod === method ? '600' : '300',
                    textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s',
                    background: paymentMethod === method ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: paymentMethod === method ? 'white' : 'var(--text-muted)',
                    border: paymentMethod === method ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)'
                  }}>{method === 'EFECTIVO' ? '💵 Efectivo' : '💳 Tarjeta'}</button>
                ))}
              </div>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <p style={{fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'Montserrat', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'left'}}>Plan</p>
              <select className="scanner-input" value={paymentPlan} onChange={e => setPaymentPlan(e.target.value)}>
                <option value="Full Access Elite">Full Access Elite — $4,000 MXN</option>
                <option value="Clases Elite">Clases Elite — $3,800 MXN</option>
                <option value="Plan Personalizado Elite">Plan Personalizado Elite — $16,000 MXN</option>
                <option value="Plan Personalizado Lite">Plan Personalizado Lite — $10,000 MXN</option>
                <option value="Kids Elite">Kids Elite — $2,500 MXN</option>
                <option value="Programación Online">Programación Online — $2,000 MXN</option>
                <option value="Semana de Visitas">Semana de Visitas — $1,500 MXN</option>
                <option value="Visita Full">Visita Full — $800 MXN</option>
                <option value="Visita Básica">Visita Básica — $400 MXN</option>
              </select>
            </div>

            <button className="btn-luxury" style={{width: '100%', padding: '1rem'}} onClick={async () => {
              const expiry = new Date();
              expiry.setMonth(expiry.getMonth() + 1);
              const { error } = await supabase.from('users').update({
                membership_plan: paymentPlan,
                membership_status: 'ACTIVE',
                membership_expiry: expiry.toISOString().split('T')[0]
              }).eq('id', selectedMember.id);
              if (error) { alert('Error: ' + error.message); }
              else {
                alert(`✓ Pago registrado: ${paymentPlan} vía ${paymentMethod}\n${selectedMember.full_name || selectedMember.email} activo hasta ${expiry.toLocaleDateString('es-MX')}`);
                setSelectedMember({...selectedMember, membership_status: 'ACTIVE', membership_plan: paymentPlan, membership_expiry: expiry.toISOString().split('T')[0]});
                setMembers(prev => prev.map(m => m.id === selectedMember.id ? {...m, membership_status: 'ACTIVE', membership_plan: paymentPlan, membership_expiry: expiry.toISOString().split('T')[0]} : m));
                setShowPaymentModal(false);
              }
            }}>Confirmar Pago</button>
          </div>
        </div>
      )}
    </div>
  );
}
