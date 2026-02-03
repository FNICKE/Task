import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, logout } from '../api/api.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();

        if (data?.success && Array.isArray(data.users)) {
          setUsers(data.users);
          setFilteredUsers(data.users);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load users. Please check your admin permissions.'
        );

        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Client-side search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
    );

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
          <p className="text-slate-500 font-medium">Accessing Admin Records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-rose-100">
          <div className="text-rose-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold block leading-none text-slate-900">Admin Control</span>
                <span className="text-[10px] uppercase tracking-widest text-violet-600 font-black">
                  Management Suite
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
            >
              <span>Logout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Users</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">{users.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Sessions</p>
            <h3 className="text-4xl font-black text-emerald-500 mt-1">
              {Math.floor(users.length * 0.8)}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-violet-500">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">System Status</p>
            <h3 className="text-xl font-bold text-slate-900 mt-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              Operational
            </h3>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-900">User Directory</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    User Details
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Email Address
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Access Role
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 font-medium text-lg">
                      {searchTerm ? 'No matching users found' : 'No registered users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id || user._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-700">{user.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-slate-600 text-sm">
                        {user.email}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            user.role === 'admin'
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;