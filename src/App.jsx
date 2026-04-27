import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Landing from './components/Landing';
import Login from './components/Login';
import SetupAccount from './components/SetupAccount';
import ClientPortal from './components/ClientPortal';
import AdminDashboard from './components/AdminDashboard';
import CoachDashboard from './components/CoachDashboard';
import './index.css';

// ============================================
// MAIN ROUTER
// ============================================
export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    const { data } = await supabase.from('users').select('role').eq('id', userId).single();
    const userRole = data?.role || 'CLIENT';
    setRole(userRole);
    if (userRole === 'ADMIN') setView('admin');
    else if (userRole === 'COACH') setView('coach');
    else setView('client-portal');
  };

  const renderView = () => {
    switch (view) {
      case 'landing': return <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
      case 'login': return <Login setView={setView} setUser={setUser} />;
      case 'setup-account': return <SetupAccount setView={setView} setUser={setUser} selectedPlan={selectedPlan} />;
      case 'client-portal': return user ? <ClientPortal setView={setView} user={user} /> : <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
      case 'admin': return user ? <AdminDashboard setView={setView} user={user} /> : <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
      case 'coach': return <CoachDashboard setView={setView} user={user} />; // Allowing dev access without strict user check for now
      default: return <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
    }
  };

  return (
    <>
      <div className="ambient-glow-red"></div>
      <div className="ambient-glow-blue"></div>
      {renderView()}
    </>
  );
}
