import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ForgotPassword from './components/ForgotPassword';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('chota_beta_token');
    setIsAuthenticated(Boolean(token));
  }, []);

  if (isAuthenticated) {
    return (
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem('chota_beta_token');
          localStorage.removeItem('chota_beta_user');
          setIsAuthenticated(false);
        }}
      />
    );
  }

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <Login 
      onLogin={() => setIsAuthenticated(true)} 
      onForgotPassword={() => setShowForgotPassword(true)} 
    />
  );
}
