import AdminNavbar from "../components/AdminNavbar";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-dark to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Transport Control Dashboard</h1>
          <p className="text-slate text-lg">
            Real-time monitoring & intelligent allocation
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Active Buses" value="18" badge="LIVE" />
          <StatCard title="Students Waiting" value="246" badge="NOW" />
          <StatCard title="Overcrowded Hostels" value="3" badge="ALERT" />
          <StatCard title="Idle Vehicles" value="4" />
        </div>

        {/* Live Map + ML Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-dark mb-3">
              Live Vehicle Tracking
            </h3>
            <p className="text-gray-600 mb-4">
              Real-time GPS location of buses, carts & shuttles
            </p>
            <Link
              to="/admin/live-map"
              className="inline-block bg-primary text-dark font-semibold px-6 py-3 rounded-lg"
            >
              Open Live Map
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-red-500">
            <h3 className="text-2xl font-bold text-dark mb-3">
              ML Allocation Suggestion
            </h3>
            <p className="text-gray-700 mb-2">
              ⚠ Hostel K expected to overcrowd
            </p>
            <p className="text-gray-600 mb-4">
              Suggested Action:
              <br />
              Allocate <strong>Bus #12</strong> from <strong>6:30–7:00 PM</strong>
            </p>
            <Link
              to="/admin/ml"
              className="inline-block bg-primary text-dark font-semibold px-6 py-3 rounded-lg"
            >
              View Predictions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
