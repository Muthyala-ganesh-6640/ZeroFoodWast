import { useEffect, useState } from 'react';
import { BarChart3, CircleDollarSign, Leaf, Truck, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../services/api';

const COLORS = ['#0f8a5f', '#f59e0b', '#f97316', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboard, analyticsData, usersData, donationsData] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/analytics'),
          api.get('/admin/users'),
          api.get('/admin/donations'),
        ]);

        setStats(dashboard.data || {});
        setAnalytics(analyticsData.data || {});
        setUsers(usersData.data.users || []);
        setDonations(donationsData.data.donations || []);
      } catch (error) {
        console.error('Unable to fetch admin data', error);
      }
    };

    fetchData();
  }, []);

  const summaryCards = [
    { label: 'Total Donations', value: stats.totalDonations || 0, icon: BarChart3 },
    { label: 'Today\'s Donations', value: stats.todaysDonations || 0, icon: CircleDollarSign },
    { label: 'Food Rescued', value: `${stats.totalFoodRescued || 0} KG`, icon: Leaf },
    { label: 'Meals Served', value: stats.totalMealsServed || 0, icon: Users },
    { label: 'Active Deliveries', value: stats.activeDeliveries || 0, icon: Truck },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Impact analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[#e2e5d9] bg-white/90 p-5 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <Icon className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-4 text-3xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Daily donation chart</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={analytics.dailyDonations || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0f8a5f" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Monthly donation chart</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.monthlyDonations || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Food category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={analytics.categoryBreakdown || []} dataKey="value" nameKey="name" outerRadius={90} label>
                {(analytics.categoryBreakdown || []).map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Donation status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={analytics.statusBreakdown || []} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} label>
                {(analytics.statusBreakdown || []).map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Food source</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.sourceBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Meals served by month</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.mealsServed || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Recent donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Donation ID</th>
                <th className="px-4 py-3 font-semibold">Donor</th>
                <th className="px-4 py-3 font-semibold">Food</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Receiving home / destination</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.slice(0, 8).map((donation) => (
                <tr key={donation._id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{donation.donationId}</td>
                  <td className="px-4 py-3">{donation.donorId?.name || 'Unknown donor'}</td>
                  <td className="px-4 py-3">{donation.foodName}</td>
                  <td className="px-4 py-3">{donation.quantity} {donation.quantityUnit}</td>
                  <td className="max-w-xs px-4 py-3">
                    {donation.destinationLocation?.organizationName ? (
                      <>
                        <p className="font-semibold text-[#31583a]">{donation.destinationLocation.organizationName}</p>
                        <p className="mt-1 text-xs text-slate-500">{donation.destinationLocation.address}, {donation.destinationLocation.city}</p>
                      </>
                    ) : <span className="text-slate-400">Not assigned yet</span>}
                  </td>
                  <td className="px-4 py-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{donation.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
        <h2 className="mb-4 text-xl font-bold text-slate-900">User overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {users.slice(0, 6).map((user) => (
            <div key={user._id} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.role}</p>
              <p className="mt-2 text-xs text-slate-500">{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
