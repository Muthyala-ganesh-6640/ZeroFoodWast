import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

const donors = [
  { name: 'Banjara Hills', position: [17.4151, 78.4505] },
  { name: 'Madhapur', position: [17.4399, 78.3911] },
  { name: 'Gachibowli', position: [17.4401, 78.3762] },
];

export default function MapPanel() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Pickup & distribution map</h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live locations</span>
      </div>
      <MapContainer center={[17.4401, 78.3911]} zoom={12} style={{ height: '320px', width: '100%', borderRadius: '1rem' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {donors.map((donor) => (
          <CircleMarker key={donor.name} center={donor.position} radius={12} pathOptions={{ color: '#0f8a5f', fillColor: '#10b981', fillOpacity: 0.9 }}>
            <Popup>{donor.name}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
