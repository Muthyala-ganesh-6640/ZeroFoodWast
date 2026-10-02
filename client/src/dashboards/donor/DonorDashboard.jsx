import { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, PackageCheck, Truck } from 'lucide-react';
import api from '../../services/api';

const initialForm = {
  foodName: 'Rice + Curry',
  category: 'Meals',
  foodType: 'VEGETARIAN',
  quantity: 25,
  quantityUnit: 'KG',
  servings: 100,
  sourceType: 'WEDDING',
  description: 'Fresh vegetarian meal package from a wedding event.',
  expiryAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16),
  pickupLocation: {
    address: 'Banjara Hills Road No 12',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    lat: 17.4151,
    lng: 78.4505,
    pickupTime: '18:30',
  },
};

const statusList = [
  'AVAILABLE',
  'REQUESTED',
  'ACCEPTED',
  'PICKUP_SCHEDULED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'DISTRIBUTED',
  'COMPLETED',
];

export default function DonorDashboard({ user }) {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get('/donations');
        setDonations(response.data.donations || []);
      } catch (error) {
        console.error('Unable to fetch donor donations', error);
      }
    };

    fetchDonations();

    const refreshTimer = window.setInterval(fetchDonations, 5000);
    window.addEventListener('focus', fetchDonations);
    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', fetchDonations);
    };
  }, [user._id]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('pickupLocation.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        pickupLocation: {
          ...prev.pickupLocation,
          [key]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        expiryAt: new Date(form.expiryAt).toISOString(),
        pickupLocation: {
          ...form.pickupLocation,
          lat: Number(form.pickupLocation.lat),
          lng: Number(form.pickupLocation.lng),
        },
      };

      const response = await api.post('/donations', payload);
      setDonations((prev) => [response.data.donation, ...prev]);
      setForm(initialForm);
      alert('Donation submitted successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Donor dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome back, {user.name}</h1>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#e2e5d9] bg-white p-6 shadow-[0_8px_24px_rgba(46,67,43,0.06)]">
          <h2 className="text-2xl font-bold text-slate-900">Post surplus food</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Food name</label>
              <input name="foodName" value={form.foodName} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <input name="category" value={form.category} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Food type</label>
              <select name="foodType" value={form.foodType} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="NON_VEGETARIAN">Non-Vegetarian</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Quantity</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Quantity unit</label>
              <input name="quantityUnit" value={form.quantityUnit} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Servings</label>
              <input type="number" name="servings" value={form.servings} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Source</label>
              <select name="sourceType" value={form.sourceType} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="WEDDING">Wedding</option>
                <option value="FUNCTION">Function</option>
                <option value="PARTY">Party</option>
                <option value="BIRTHDAY">Birthday</option>
                <option value="FESTIVAL">Festival</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="HOTEL">Hotel</option>
                <option value="COLLEGE_EVENT">College Event</option>
                <option value="CORPORATE_EVENT">Corporate Event</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Expiry</label>
              <input type="datetime-local" name="expiryAt" value={form.expiryAt} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleFieldChange} rows="3" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">Pickup location</h3>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address</label>
              <input name="pickupLocation.address" value={form.pickupLocation.address} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input name="pickupLocation.city" value={form.pickupLocation.city} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">State</label>
              <input name="pickupLocation.state" value={form.pickupLocation.state} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pincode</label>
              <input name="pickupLocation.pincode" value={form.pickupLocation.pincode} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pickup time</label>
              <input type="time" name="pickupLocation.pickupTime" value={form.pickupLocation.pickupTime} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Latitude</label>
              <input type="number" name="pickupLocation.lat" value={form.pickupLocation.lat} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Longitude</label>
              <input type="number" name="pickupLocation.lng" value={form.pickupLocation.lng} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-6 rounded-xl bg-brand-green px-6 py-3 font-semibold text-white disabled:opacity-60">
            {loading ? 'Submitting donation...' : 'Submit Donation'}
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-xl border border-[#dfe4d5] bg-[#edf0e5] p-6">
            <div className="flex items-center gap-3">
              <PackageCheck className="h-8 w-8 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-900">Donation status</h3>
            </div>
            <div className="mt-6 space-y-4">
              {statusList.map((status, index) => (
                <div key={status} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${index <= 2 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-sm font-medium text-slate-700">{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-orange-500" />
              <h3 className="text-xl font-bold text-slate-900">Recent submissions</h3>
            </div>
            <div className="mt-4 space-y-3">
              {donations.slice(0, 4).map((donation) => (
                <div key={donation._id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{donation.foodName}</p>
                      <p className="text-xs text-slate-500">{donation.status}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
        <div className="mb-4 flex items-center gap-3">
          <Clock3 className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-slate-900">My donation timeline</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {donations.map((donation) => (
            <div key={donation._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{donation.foodName}</p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{donation.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{donation.quantity} {donation.quantityUnit}</p>
              <p className="mt-2 text-sm text-slate-600">Servings: {donation.servings}</p>
              <p className="mt-2 text-xs text-slate-500">Pickup: {donation.pickupLocation?.city || 'N/A'}</p>
              {donation.partnerId?.name && <p className="mt-2 text-xs text-slate-600">Partner: {donation.partnerId.name}</p>}
              {donation.destinationLocation?.organizationName && (
                <div className="mt-3 rounded-lg bg-[#eef1e5] p-3 text-sm text-[#405844]">
                  <p className="font-semibold">Receiving {donation.destinationLocation.organizationType?.replaceAll('_', ' ').toLowerCase() || 'organization'}</p>
                  <p className="mt-1 font-medium">{donation.destinationLocation.organizationName}</p>
                  <p className="mt-1 text-xs">{donation.destinationLocation.address}, {donation.destinationLocation.city}</p>
                </div>
              )}
              {donation.status === 'COMPLETED' && donation.distributionProof && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="mb-2 text-sm font-semibold text-emerald-800">Distribution confirmed</p>
                  {donation.distributionProof.imageUrl && <img src={donation.distributionProof.imageUrl} alt={`Distribution proof for ${donation.foodName}`} className="max-h-56 w-full rounded-xl object-cover" />}
                  <p className="mt-2 text-sm text-slate-700">{donation.distributionProof.quantityDistributed} {donation.quantityUnit} distributed to {donation.distributionProof.peopleServed} people</p>
                  <p className="mt-1 text-xs text-slate-500">{donation.distributionProof.organizationName} · {donation.distributionProof.location}</p>
                  {donation.distributionProof.notes && <p className="mt-2 text-sm text-slate-600">{donation.distributionProof.notes}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
