export default function MLPredictions() {
  const predictions = [
    {
      hostel: 'Hostel K',
      time: '6:30 PM – 7:00 PM',
      action: 'Allocate Bus #12',
      level: 'High'
    },
    {
      hostel: 'Hostel B',
      time: '8:00 AM – 8:30 AM',
      action: 'Increase frequency',
      level: 'Medium'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-dark mb-2">ML Predictions</h1>
        <p className="text-gray-600 mb-8">AI-based demand forecasting & suggestions</p>

        <div className="space-y-6">
          {predictions.map((p, i) => (
            <div key={i} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
              p.level === 'High' ? 'border-red-500' : 'border-primary'
            }`}>
              <h3 className="text-xl font-bold text-dark mb-1">{p.hostel}</h3>
              <p className="text-gray-600 mb-2">Time Window: {p.time}</p>
              <p className="font-semibold text-dark">Suggested Action:</p>
              <p className="text-gray-700">{p.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
