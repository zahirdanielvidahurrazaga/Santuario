import React, { useState, useEffect } from 'react';
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
    console.log("Buscando rol para ID:", userId);
    const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();
    
    if (error) {
      console.error("Error obteniendo rol:", error);
    }
    
    const userRole = data?.role || 'CLIENT';
    console.log("Rol obtenido:", userRole);
    
    setRole(userRole);
    if (userRole === 'ADMIN') setView('admin');
    else if (userRole === 'COACH') setView('coach');
    else setView('client-portal');
  };

  const renderView = () => {
    switch (view) {
      case 'landing': return <><Navbar setView={setView} /><Landing setView={setView} setSelectedPlan={setSelectedPlan} /></>;
      case 'login': return <AuthPortal setView={setView} setUser={setUser} initialTab="login" />;
      case 'register': return <AuthPortal setView={setView} setUser={setUser} initialTab="register" />;
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
