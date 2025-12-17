export default function Drivers() {
  const drivers = [
    { id: 1, name: 'R. Mohanty', phone: '9876543210', vehicle: 'UT-205', status: 'On Trip' },
    { id: 2, name: 'S. Das', phone: '9123456780', vehicle: 'UT-312', status: 'Idle' },
    { id: 3, name: 'A. Behera', phone: '9988776655', vehicle: 'UT-410', status: 'Maintenance' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-dark mb-2">Driver Management</h1>
        <p className="text-gray-600 mb-8">View and manage driver assignments</p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm text-gray-600">Driver</th>
                <th className="px-6 py-4 text-sm text-gray-600">Phone</th>
                <th className="px-6 py-4 text-sm text-gray-600">Vehicle</th>
                <th className="px-6 py-4 text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id} className="border-b last:border-none">
                  <td className="px-6 py-4 font-semibold text-dark">{d.name}</td>
                  <td className="px-6 py-4 text-gray-600">{d.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{d.vehicle}</td>
                  <td className={`px-6 py-4 font-semibold ${
                    d.status === 'On Trip' ? 'text-green-600' :
                    d.status === 'Idle' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {d.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
