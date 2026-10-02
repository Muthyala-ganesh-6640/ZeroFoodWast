import { useEffect, useState } from 'react';
import { Check, MapPin, Phone, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function PartnerDashboard({ user }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [destinationInputs, setDestinationInputs] = useState({});

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get('/donations');
        setDonations(response.data.donations || []);
      } catch (error) {
        console.error('Unable to fetch partner donations', error);
      }
    };

    fetchDonations();
  }, []);

  const handleAccept = async (donationId) => {
    setLoading(true);
    try {
      await api.post(`/donations/${donationId}/accept`);
      const response = await api.get('/donations');
      setDonations(response.data.donations || []);
      alert('Donation accepted successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to accept donation.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (donationId) => {
    try {
      await api.post(`/donations/${donationId}/pickup`, {
        pickupLocation: 'Pickup confirmed by delivery partner',
        lat: 17.4151,
        lng: 78.4505,
        notes: 'Food picked up safely from donor location.',
      });
      const response = await api.get('/donations');
      setDonations(response.data.donations || []);
      alert('Pickup marked successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to mark pickup.');
    }
  };

  const handleDestinationChange = (donationId, field, value) => {
    setDestinationInputs((previous) => ({
      ...previous,
      [donationId]: { ...previous[donationId], [field]: value },
    }));
  };

  const handleDeliver = async (event, donationId) => {
    event.preventDefault();
    const destination = destinationInputs[donationId];
    if (!destination?.organizationName?.trim() || !destination?.address?.trim() || !destination?.city?.trim()) {
      alert('Enter the receiving home or organization name, address, and city.');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/donations/${donationId}/deliver`, {
        destinationLocation: destination,
        notes: `Food delivered to ${destination.organizationName}.`,
      });
      const response = await api.get('/donations');
      setDonations(response.data.donations || []);
      alert('Delivery recorded successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to complete delivery.');
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async (donation) => {
    setLoading(true);
    try {
      await api.post(`/donations/${donation._id}/distribute`, {
        quantityDistributed: donation.quantity,
        peopleServed: donation.servings,
        notes: 'Distribution completed successfully.',
      });
      const response = await api.get('/donations');
      setDonations(response.data.donations || []);
      alert('Distribution confirmed successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to submit distribution proof.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Delivery partner</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome, {user.name}</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {donations.map((donation) => (
          <div key={donation._id} className="overflow-hidden rounded-xl border border-[#e2e5d9] bg-white shadow-[0_8px_24px_rgba(46,67,43,0.08)]">
            <img src={donation.images?.[0] || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'} alt={donation.foodName} className="h-48 w-full object-cover" />
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">{donation.foodName}</p>
                  <p className="text-sm text-slate-500">{donation.category}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{donation.status}</span>
              </div>

              <div className="grid gap-2 text-sm text-slate-600">
                <p>Quantity: {donation.quantity} {donation.quantityUnit}</p>
                <p>Servings: {donation.servings}</p>
                <p>Source: {donation.sourceType}</p>
                <div className="rounded-lg bg-[#f0f2e8] p-3 text-sm text-[#405844]">
                  <p className="flex items-start gap-2 font-semibold"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                    <span>{[donation.pickupLocation?.address || donation.donorId?.address, donation.pickupLocation?.city, donation.pickupLocation?.state, donation.pickupLocation?.pincode].filter(Boolean).join(', ') || 'Pickup address not provided'}</span>
                  </p>
                  {donation.partnerId?._id === user._id && donation.donorId?.phone && (
                    <a href={`tel:${donation.donorId.phone}`} className="mt-2 inline-flex items-center gap-2 font-semibold text-[#31583a] hover:underline">
                      <Phone className="h-4 w-4" /> {donation.donorId.phone}
                    </a>
                  )}
                  {donation.partnerId?._id !== user._id && <p className="mt-2 text-xs text-[#68746a]">Donor contact details are available after accepting this donation.</p>}
                </div>
                {donation.destinationLocation?.organizationName && (
                  <div className="rounded-lg bg-[#f0f2e8] p-3 text-sm text-[#405844]">
                    <p className="font-semibold">Destination: {donation.destinationLocation.organizationName}</p>
                    <p className="mt-1">{donation.destinationLocation.address}, {donation.destinationLocation.city}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {donation.status === 'AVAILABLE' && (
                  <button onClick={() => handleAccept(donation._id)} className="rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-white">
                    Accept Donation
                  </button>
                )}
                {donation.status === 'ACCEPTED' && (
                  <button onClick={() => handlePickup(donation._id)} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                    Mark as Picked Up
                  </button>
                )}
                {donation.status === 'PICKED_UP' && (
                  <form onSubmit={(event) => handleDeliver(event, donation._id)} className="w-full space-y-3 rounded-lg bg-[#f7f7f1] p-3">
                    <p className="text-sm font-semibold text-slate-800">Where will this food be distributed?</p>
                    <select
                      value={destinationInputs[donation._id]?.organizationType || ''}
                      onChange={(event) => handleDestinationChange(donation._id, 'organizationType', event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      required
                    >
                      <option value="" disabled>Choose destination type</option>
                      <option value="OLD_AGE_HOME">Old age home</option>
                      <option value="SHELTER">Shelter</option>
                      <option value="COMMUNITY_CENTER">Community center</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <input
                      value={destinationInputs[donation._id]?.organizationName || ''}
                      onChange={(event) => handleDestinationChange(donation._id, 'organizationName', event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      placeholder="Home or organization name"
                      aria-label="Receiving home or organization name"
                      required
                    />
                    <input
                      value={destinationInputs[donation._id]?.address || ''}
                      onChange={(event) => handleDestinationChange(donation._id, 'address', event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      placeholder="Street address"
                      aria-label="Destination street address"
                      required
                    />
                    <input
                      value={destinationInputs[donation._id]?.city || ''}
                      onChange={(event) => handleDestinationChange(donation._id, 'city', event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      placeholder="City"
                      aria-label="Destination city"
                      required
                    />
                    <button type="submit" disabled={loading} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      {loading ? 'Saving destination...' : 'Save destination & mark delivered'}
                    </button>
                  </form>
                )}
                {donation.status === 'DELIVERED' && (
                  <button onClick={() => handleDistribute(donation)} disabled={loading} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Confirm distribution'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#e2e5d9] bg-white/90 p-6 shadow-[0_6px_20px_rgba(46,67,43,0.05)]">
        <div className="mb-4 flex items-center gap-3">
          <RefreshCw className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-900">Operational checklist</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            'Verify donor',
            'Reach pickup location',
            'Confirm pickup details',
            'Confirm beneficiary',
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-4 w-4" /></div>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
