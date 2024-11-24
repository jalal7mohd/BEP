import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NavBar from './components/NavBar';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // To Manage logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setToken(null); // Clear token state
    window.location.href = '/'; // Redirect to login
  };

  // protected pages
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/" replace />; // Redirect to login if no token
    }
    return children;
  };

  return (
    <Router>
      {token && <NavBar handleLogout={handleLogout} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage token={token} setToken={setToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage token={token} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
