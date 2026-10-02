import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { House, LayoutDashboard, Leaf, LogOut } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DonorDashboard from './dashboards/donor/DonorDashboard';
import PartnerDashboard from './dashboards/partner/PartnerDashboard';
import AdminDashboard from './dashboards/admin/AdminDashboard';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('zerofoodwaste_user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('zerofoodwaste_token') || '');

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const persisted = localStorage.getItem('zerofoodwaste_user');
    if (persisted) {
      setUser(JSON.parse(persisted));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('zerofoodwaste_token');
    localStorage.removeItem('zerofoodwaste_user');
    setToken('');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f3e9] text-[#26352c]">
      <header className="sticky top-0 z-30 border-b border-[#e3e5d8] bg-[#f8f7ef]/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3.5 md:px-8">
          <Link to="/" className="flex items-center gap-2 text-base font-bold text-[#294c31] md:gap-2.5 md:text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e5ebd6] text-[#356c42] md:h-9 md:w-9"><Leaf className="h-5 w-5" /></span>
            <span>ZeroFoodWaste</span>
          </Link>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#536157] md:gap-6">
            <Link to="/" aria-label="Home" title="Home" className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[#e9ecdf] hover:text-[#356c42] md:h-auto md:w-auto md:rounded-none md:bg-transparent">
              <House className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">Home</span>
            </Link>
            <Link to="/dashboard" aria-label="Dashboard" title="Dashboard" className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[#e9ecdf] hover:text-[#356c42] md:h-auto md:w-auto md:rounded-none md:bg-transparent">
              <LayoutDashboard className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
            {user ? (
              <button onClick={handleLogout} aria-label="Logout" title="Logout" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#294c31] text-white transition hover:bg-[#1f3b27] md:h-auto md:w-auto md:px-4 md:py-2">
                <LogOut className="h-4 w-4 md:hidden" />
                <span className="hidden md:inline">Logout</span>
              </button>
            ) : (
              <Link to="/login" className="rounded-lg bg-[#294c31] px-3 py-2 text-white transition hover:bg-[#1f3b27] md:px-4">Login</Link>
            )}
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage setUser={setUser} setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === 'DONOR' ? <DonorDashboard user={user} /> :
              user.role === 'PARTNER' ? <PartnerDashboard user={user} /> :
              <AdminDashboard />
            ) : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
