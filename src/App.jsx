import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import Landing from './components/Landing';
import AuthPortal from './components/AuthPortal';
import SetupAccount from './components/SetupAccount';
import ClientPortal from './components/ClientPortal';
import AdminDashboard from './components/AdminDashboard';
import CoachDashboard from './components/CoachDashboard';
import Navbar from './components/Navbar';
import './index.css';

// ============================================
// MAIN ROUTER
// ============================================
export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const viewRef = useRef(view);

  // Keep ref in sync with state
  useEffect(() => { viewRef.current = view; }, [view]);

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
        // Don't auto-redirect if user is on the register screen (let them see the success message)
        if (viewRef.current !== 'register') {
          fetchRole(session.user.id);
        }
      } else {
        setUser(null);
        setRole(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    const { data } = await supabase.from('users').select('role, membership_status').eq('id', userId).single();
    const userRole = data?.role || 'CLIENT';
    setRole(userRole);
    if (userRole === 'ADMIN') setView('admin');
    else if (userRole === 'COACH') setView('coach');
    else if (data?.membership_status === 'ACTIVE') setView('client-portal');
    else setView('landing'); // No active membership → landing page
  };

  const renderView = () => {
    switch (view) {
      case 'landing': return <><Navbar setView={setView} user={user} /><Landing setView={setView} setSelectedPlan={setSelectedPlan} user={user} /></>;
      case 'login': return <AuthPortal setView={setView} setUser={setUser} initialTab="login" />;
      case 'register': return <AuthPortal setView={setView} setUser={setUser} initialTab="register" selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />;
      case 'setup-account': return <SetupAccount setView={setView} setUser={setUser} selectedPlan={selectedPlan} />;
      
      // Protected Routes con validación de Rol
      case 'client-portal': 
        return (user && role) ? <ClientPortal setView={setView} user={user} /> : <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
      
      case 'admin': 
        return (user && role === 'ADMIN') ? <AdminDashboard setView={setView} user={user} /> : <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
      
      case 'coach': 
        return (user && role === 'COACH') ? <CoachDashboard setView={setView} user={user} /> : <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
      
      default: return <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
    }
  };

  return (
    <div className="app-root-container">
      <div className="ambient-glow-red"></div>
      <div className="ambient-glow-blue"></div>
      <div className="main-content-wrapper">
        {renderView()}
      </div>
    </div>
  );
}
