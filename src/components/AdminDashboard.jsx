import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard({ setView, user }) {
  const [adminTab, setAdminTab] = useState('access'); // 'access' or 'financial'
  const [scanInput, setScanInput] = useState('');
  const [scanLog, setScanLog] = useState([]);
  const [flashAlert, setFlashAlert] = useState(null);
  const [scannedProfile, setScannedProfile] = useState(null);
  const [stats, setStats] = useState({ occupancy: 0, checkinsToday: 0, totalMembers: 0 });
  const [members, setMembers] = useState([]);
  const scanRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  useEffect(() => {
    const fetchAll = async () => {
      const today = new Date().toISOString().split('T')[0];
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

  // Delete an entry
  const handleDeleteEntry = async (id) => {
    if (!window.confirm('¿Eliminar este registro de entrada?')) return;
    const { error } = await supabase.from('attendance').delete().eq('id', id);
    if (!error) {
      setScanLog(prev => prev.filter(entry => entry.id !== id));
      setStats(prev => ({ ...prev, occupancy: Math.max(0, prev.occupancy - 1), checkinsToday: Math.max(0, prev.checkinsToday - 1) }));
    }
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
        <button onClick={() => setAdminTab('access')} style={{flex:1,padding:'1rem',background:'transparent',border:'none',color: adminTab === 'access' ? 'var(--text-main)' : 'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.15em',fontWeight: adminTab === 'access' ? '600' : '300',cursor:'pointer',borderBottom: adminTab === 'access' ? '2px solid var(--primary)' : '2px solid transparent',transition:'all 0.3s'}}>
          Control de Acceso
        </button>
        <button onClick={() => setAdminTab('financial')} style={{flex:1,padding:'1rem',background:'transparent',border:'none',color: adminTab === 'financial' ? 'var(--text-main)' : 'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.15em',fontWeight: adminTab === 'financial' ? '600' : '300',cursor:'pointer',borderBottom: adminTab === 'financial' ? '2px solid var(--primary)' : '2px solid transparent',transition:'all 0.3s'}}>
          Financiero
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
              <div className="app-section-title">Lector de Acceso QR</div>
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
                <div className="stat-label"><span className="pulse-dot"></span> En el Gym</div>
                <div className="stat-value">{stats.occupancy}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Check-ins Hoy</div>
                <div className="stat-value">{stats.checkinsToday}</div>
              </div>
            </div>

            {/* Scan Log */}
            <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
              <div className="app-section-title">Entradas de Hoy</div>
              <div style={{background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.03)'}}>
                {scanLog.length === 0 && <p style={{color:'var(--text-muted)',fontFamily:'Montserrat',fontSize:'0.85rem'}}>Sin registros aún.</p>}
                {scanLog.slice(0, 15).map((entry, i) => (
                  <div key={i} className={`scan-entry ${entry.status || (entry.users?.membership_status === 'ACTIVE' ? 'success' : 'error')}`} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <span className="scan-name">{entry.users?.full_name || entry.users?.email || 'Desconocido'}</span>
                      <span className="scan-time">{new Date(entry.checked_in_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {entry.id && (
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        style={{background:'transparent', border:'none', color:'var(--primary)', cursor:'pointer', fontSize:'0.7rem', opacity:0.6}}
                      >
                        ELIMINAR
                      </button>
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
        <div className="dashboard-grid-2col">
          {/* Left Column */}
          <div>
            <div className="stat-grid">
              <div className="stat-card highlight">
                <div className="stat-label">Ingresos del Mes</div>
                <div className="stat-value" style={{fontSize:'1.8rem'}}>${totalRevenue.toLocaleString()}</div>
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
              <div className="app-section-title">Ingresos Semanales</div>
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
          <div>
            {/* Members Table */}
            <div className="app-section" style={{borderTop: 'none', paddingTop: 0}}>
              <div className="app-section-title">Socios Registrados</div>
              <div style={{background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.03)', overflowX:'auto'}}>
                <table className="socios-table">
                  <thead><tr><th>Nombre</th><th>Plan</th><th>Vencimiento</th><th>Status</th></tr></thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr key={i}>
                        <td>{m.full_name || m.email}</td>
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
    </div>
  );
}
