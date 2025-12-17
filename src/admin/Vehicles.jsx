import AdminNavbar from "../components/AdminNavbar";

export default function Vehicles() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-dark mb-6">Vehicle Management</h2>

        <div className="bg-white rounded-xl shadow-md p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th>Vehicle</th>
                <th>Route</th>
                <th>Status</th>
                <th>Driver</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td>UT-205</td>
                <td>Hostel B → Campus 25</td>
                <td className="text-green-600 font-semibold">Running</td>
                <td>R. Mohanty</td>
              </tr>
              <tr>
                <td>UT-312</td>
                <td>Hostel K → Campus 25</td>
                <td className="text-yellow-600 font-semibold">Idle</td>
                <td>S. Das</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
