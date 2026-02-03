// src/components/UserDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getTasks, logout } from '../api/api.js';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        const taskData = await getTasks();
        setTasks(taskData || []);
      } catch (err) {
        console.error(err);
        logout();
        navigate('/login');
      }
    };
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
              <span className="text-xl font-bold tracking-tight">Dashy</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm text-slate-500 font-medium">
                {user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-rose-50 text-rose-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome back, <span className="text-indigo-600">{user.name || 'User'}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your tasks today.</p>
        </header>

        
      </main>
    </div>
  );
};

export default UserDashboard;