import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Confess from './pages/Confess';
import ConfessionDetail from './pages/ConfessionDetail';
import Login from './pages/Login';
import Confessions from './pages/Confessions';
import { AuthProvider, useAuth } from './components/AuthContext';
import './index.css';
import CursorEffects from './components/CursorEffects';

function ProtectedRoute({ children }) {
  const { user, loading, setMessage } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) {
    setMessage && setMessage('Please login to continue.');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CursorEffects />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="confessions" element={<Confessions />} />
            <Route path="confess" element={<Confess />} />
            <Route path="confession/:id" element={<ConfessionDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 