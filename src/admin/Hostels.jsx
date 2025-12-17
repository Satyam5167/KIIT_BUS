import AdminNavbar from "../components/AdminNavbar";

export default function Hostels() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-dark mb-6">
          Hostel Demand Monitoring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary">
            <h3 className="font-semibold text-lg">Hostel B</h3>
            <p className="text-gray-600">Students Waiting: <strong>78</strong></p>
            <p className="text-gray-600">Buses Allocated: 2</p>
            <p className="text-green-600 font-semibold mt-2">Normal</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <h3 className="font-semibold text-lg">Hostel K</h3>
            <p className="text-gray-600">Students Waiting: <strong>112</strong></p>
            <p className="text-gray-600">Buses Allocated: 1</p>
            <p className="text-red-600 font-semibold mt-2">Overcrowded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
