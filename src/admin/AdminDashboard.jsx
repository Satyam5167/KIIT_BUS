import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bus, Clock, Wrench, Users, Map as MapIcon, BrainCircuit, ArrowRight } from "lucide-react";
import StatCard from "../components/StatCard";
import API_BASE from "../apiBase";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function AdminDashboard() {
  const [busStats, setBusStats] = useState({
    active_buses: 0,
    idle_buses: 0,
    maintenance_buses: 0,
  });

  const fetchBusStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/getTotalActiveIdleMaintenanceBuses`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed with status ${res.status}`);

      const data = await res.json();
      setBusStats(data);
    } catch (err) {
      console.error("Failed to fetch bus stats:", err.message);
      setBusStats({ active_buses: 0, idle_buses: 0, maintenance_buses: 0 });
    }
  };

  useEffect(() => {
    fetchBusStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time fleet monitoring and management</p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" variant="outline">Export Data</Button>
          <Button size="sm" variant="primary" icon={Bus}>Add new Vehicle</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Buses"
          value={busStats.active_buses}
          badge="LIVE"
          icon={Bus}
          color="green"
        />
        <StatCard
          title="Idle Buses"
          value={busStats.idle_buses}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Maintenance"
          value={busStats.maintenance_buses}
          badge="ALERT"
          icon={Wrench}
          color="red"
        />
        <StatCard
          title="Students Waiting"
          value="246"
          badge="NOW"
          icon={Users}
          color="blue"
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Map Card */}
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MapIcon size={100} />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-secondary mb-2">Live Vehicle Tracking</h3>
            <p className="text-slate-500 mb-6 max-w-sm">Monitor real-time GPS locations of all shuttles and buses across the campus.</p>

            <Link to="/admin/live-map">
              <Button variant="primary" icon={MapIcon}>Open Live Map</Button>
            </Link>
          </div>
        </Card>

        {/* ML Suggestions Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 border-purple-100">
          <div className="absolute top-0 right-0 p-4 text-purple-500 opacity-10">
            <BrainCircuit size={100} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-secondary">AI Optimization</h3>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded">BETA</span>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-100 shadow-sm mb-6">
              <p className="text-sm font-semibold text-purple-900 mb-1">Recommendation:</p>
              <p className="text-slate-600 text-sm">Allocate <span className="font-bold text-secondary">Bus #12</span> to Hostel K from <span className="font-bold text-secondary">6:30–7:00 PM</span> to prevent overcrowding.</p>
            </div>

            <Link to="/admin/ml">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25" icon={BrainCircuit}>
                View Predictions
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
