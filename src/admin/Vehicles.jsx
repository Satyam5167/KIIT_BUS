import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API_BASE from "../apiBase";

export default function Vehicles() {
  // Stores bus routes returned from backend
  const [buses, setBuses] = useState([]);

  // Fetch bus routes for all vehicles
  const fetchBusRoutes = async () => {
    try {
      const res = await fetch(`${API_BASE}/getBusRoutes`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error("Failed to fetch bus routes:", err.message);
      setBuses([]);
    }
  };

  // Load vehicle data on mount
  useEffect(() => {
    fetchBusRoutes();
  }, []);

  // Maps backend status to UI label + color
  const statusConfig = {
    active: { label: "Running", className: "text-green-600" },
    idle: { label: "Idle", className: "text-yellow-600" },
    maintenance: { label: "Maintenance", className: "text-red-600" },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-dark mb-6">
          Vehicle Management
        </h2>

        <div className="bg-white rounded-xl shadow-md p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {buses.map((bus) => {
                const status = statusConfig[bus.status];

                return (
                  <tr key={bus.bus_id} className="border-b last:border-none">
                    <td className="py-4 font-semibold text-dark">
                      {bus.bus_code}
                    </td>

                    <td className="py-4 text-gray-600">
                      {bus.route
                        .map((stop) => stop.name)
                        .join(" → ")}
                    </td>

                    <td
                      className={`py-4 font-semibold ${status.className}`}
                    >
                      {status.label}
                    </td>
                  </tr>
                );
              })}

              {buses.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-6 text-center text-gray-500"
                  >
                    No vehicles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
