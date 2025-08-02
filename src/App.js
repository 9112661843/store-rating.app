import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Stores from './pages/Stores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Toaster position="top-right" />
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={
            user ? (
              user.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
              user.role === 'store_owner' ? <Navigate to="/store-owner/dashboard" /> :
              <Navigate to="/stores" />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
          } />
          
          <Route path="/register" element={
            user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
          } />
          
          <Route path="/admin/dashboard" element={
            user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
          } />
          
          <Route path="/stores" element={
            user?.role === 'user' ? <Stores /> : <Navigate to="/login" />
          } />
          
          <Route path="/store-owner/dashboard" element={
            user?.role === 'store_owner' ? <StoreOwnerDashboard /> : <Navigate to="/login" />
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 