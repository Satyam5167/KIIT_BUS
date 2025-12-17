export default function Reports() {
  const reports = [
    { title: 'Daily Usage', value: '1,248 rides' },
    { title: 'Peak Hour', value: '8:00 AM – 9:00 AM' },
    { title: 'Avg Wait Time', value: '6 mins' },
    { title: 'Bus Utilization', value: '82%' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-dark mb-2">Reports & Analytics</h1>
        <p className="text-gray-600 mb-8">Operational insights & performance metrics</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {reports.map((r, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
              <p className="text-sm text-gray-600 mb-1">{r.title}</p>
              <p className="text-2xl font-bold text-dark">{r.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
