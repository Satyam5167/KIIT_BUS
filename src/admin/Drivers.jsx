import { useEffect, useState } from "react";
import API_BASE from "../apiBase";

export default function Drivers() {
  // Holds the list of drivers returned by the backend
  const [drivers, setDrivers] = useState([]);

  // Fetch driver details from admin-only endpoint
  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/getDriverDetails`, {
        credentials: "include", // required to send auth cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If backend blocks the request (401 / 403), handle it explicitly
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error("Failed to fetch drivers:", err.message);
      setDrivers([]); // fallback to empty state
    }
  };

  // Load driver data once when component mounts
  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-dark mb-2">
          Driver Management
        </h1>
        <p className="text-gray-600 mb-8">
          View and manage driver assignments
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm text-gray-600">Driver</th>
                <th className="px-6 py-4 text-sm text-gray-600">Phone</th>
                <th className="px-6 py-4 text-sm text-gray-600">Vehicle</th>
                <th className="px-6 py-4 text-sm text-gray-600">Driver's Status</th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((d, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="px-6 py-4 font-semibold text-dark">
                    {d.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {d.phone || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {d.vehicle || "Unassigned"}
                  </td>

                  {/* Backend sends boolean status (b.active) */}
                  <td
                    className={`px-6 py-4 font-semibold ${d.status === "active"
                        ? "text-green-600"
                        : d.status === "idle"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                  >
                    {d.status === "active"
                      ? "Active"
                      : d.status === "idle"
                        ? "Idle"
                        : "Maintenance"}
                  </td>
                </tr>
              ))}

              {/* Empty state when no drivers are returned */}
              {drivers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No drivers found
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
