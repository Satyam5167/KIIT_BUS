import { useEffect, useState } from "react";
import { Bus, MapPin, Activity, Plus } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import API_BASE from "../apiBase";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Vehicles() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBusRoutes = async () => {
    try {
      const res = await fetch(`${API_BASE}/getBusRoutes`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bus routes:", err.message);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusRoutes();
  }, []);

  const statusConfig = {
    active: { label: "Running", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    idle: { label: "Idle", className: "bg-amber-100 text-amber-700 border-amber-200" },
    maintenance: { label: "Maintenance", className: "bg-red-100 text-red-700 border-red-200" },
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <AdminNavbar />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight">Vehicle Fleet</h1>
          <p className="text-slate-500 mt-1">Monitor and manage bus status</p>
        </div>
        <Button icon={Plus} variant="primary">Add Vehicle</Button>
      </div>

      <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle ID</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Route</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">Loading fleet data...</td></tr>
              ) : buses.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No vehicles found</td></tr>
              ) : (
                buses.map((bus) => {
                  const status = statusConfig[bus.status] || statusConfig.idle;
                  return (
                    <tr key={bus.bus_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                            <Bus size={20} />
                          </div>
                          <span className="font-bold text-secondary">{bus.bus_code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={16} className="text-slate-400" />
                          {bus.route.length > 0 ? (
                            <span>
                              {bus.route[0].name} <span className="text-slate-300 mx-1">→</span> {bus.route[bus.route.length - 1].name}
                            </span>
                          ) : <span className="text-slate-400 italic">No route assigned</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-blue-50">Edit</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
