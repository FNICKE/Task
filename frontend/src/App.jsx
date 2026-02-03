import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './componant/Login.jsx';
import Register from './componant/Register.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './componant/ProtectedRoute.jsx';
import { getCurrentUser } from './api/api.js';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (data?.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [location.pathname]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-700">Verifying session...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : <Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="/" element={<Navigate to={user ? (user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'} replace />} />

        <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;