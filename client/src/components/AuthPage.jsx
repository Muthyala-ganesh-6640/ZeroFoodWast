import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, MapPinned, Truck } from 'lucide-react';
import api from '../services/api';

export default function AuthPage({ setUser, setToken }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: 'donor@zerofoodwaste.com',
    password: 'Donor123!',
    phone: '',
    role: 'DONOR',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { ...form };

      const response = await api.post(endpoint, payload);
      const { token, user } = response.data;
      localStorage.setItem('zerofoodwaste_token', token);
      localStorage.setItem('zerofoodwaste_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6 py-16">
      <div className="grid w-full overflow-hidden rounded-2xl border border-[#e1e4d7] bg-white shadow-[0_20px_60px_rgba(46,67,43,0.12)] lg:grid-cols-2">
        <div
          className="min-h-80 bg-cover bg-center p-8 text-white md:p-10"
          style={{ backgroundImage: "linear-gradient(135deg, rgba(27, 48, 31, 0.88), rgba(44, 66, 39, 0.62)), url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85')" }}
        >
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#e9d7aa]"><Leaf className="h-4 w-4" /> ZeroFoodWaste</p>
          <h1 className="font-display mt-6 text-4xl font-semibold leading-tight">Save food.<br />Serve people.</h1>
          <p className="mt-4 max-w-md text-lg leading-7 text-white/85">
            Join donors, partners and administrators in building a smarter, kinder food rescue network.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/90">
            <p className="flex items-center gap-2"><Leaf className="h-4 w-4 text-[#e4b36a]" /> Secure donor and partner accounts</p>
            <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-[#e4b36a]" /> Real-time donation tracking</p>
            <p className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-[#e4b36a]" /> Verified distribution routes</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-6 flex gap-1 rounded-xl bg-[#f0f1e8] p-1">
            <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-lg px-4 py-2 font-semibold ${mode === 'login' ? 'bg-white text-[#31583a] shadow-sm' : 'text-slate-500'}`}>
              Login
            </button>
            <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-lg px-4 py-2 font-semibold ${mode === 'register' ? 'bg-white text-[#31583a] shadow-sm' : 'text-slate-500'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-sm font-medium">Full name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-emerald-500" placeholder="Your name" required />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-emerald-500" placeholder="Phone number" />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500">
                  <option value="DONOR">Donor</option>
                  <option value="PARTNER">Delivery Partner</option>
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" required />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" required />
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-green px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-[#e8e4d2] bg-[#f8f6eb] p-4 text-sm text-[#665735]">
            Demo credentials: admin@zerofoodwaste.com / Admin123!, donor@zerofoodwaste.com / Donor123!, partner@zerofoodwaste.com / Partner123!
          </div>
        </div>
      </div>
    </div>
  );
}
