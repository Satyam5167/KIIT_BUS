export default function LiveMap() {
  const vehicles = [
    { id: 1, number: 'UT-205', route: 'Hostel B → Campus 25', eta: '5 min', status: 'Running' },
    { id: 2, number: 'UT-312', route: 'Hostel K → Campus 25', eta: '12 min', status: 'Idle' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-dark mb-2">Live Vehicle Tracking</h1>
        <p className="text-gray-600 mb-8">Real-time location of buses & shuttles</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Live Map Placeholder (Leaflet / Mapbox)
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-dark">Active Vehicles</h3>
            {vehicles.map(v => (
              <div key={v.id} className="border rounded-lg p-4">
                <p className="font-semibold text-dark">{v.number}</p>
                <p className="text-sm text-gray-600">{v.route}</p>
                <p className="text-sm text-gray-600">ETA: {v.eta}</p>
                <p className={`text-sm font-semibold ${
                  v.status === 'Running' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {v.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
