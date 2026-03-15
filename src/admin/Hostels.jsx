import { useEffect, useState } from "react";
import { Building, Users, AlertTriangle, Bus, MapPin, Loader2 } from "lucide-react";
import Card from "../components/ui/Card";
import API_BASE from "../apiBase";

export default function Hostels() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/getStops`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch stops (${res.status})`);
        const data = await res.json();
        setStops(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary tracking-tight">Hostel Stops</h1>
        <p className="text-slate-500 mt-1">All registered bus stops and hostel locations</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card overflow-hidden">
              {/* Header row */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 skeleton-shimmer" />
                <div className="w-16 h-5 rounded-full bg-slate-100 skeleton-shimmer" />
              </div>
              {/* Title */}
              <div className="h-5 w-3/4 rounded-lg bg-slate-100 skeleton-shimmer mb-2" />
              {/* Coords */}
              <div className="h-3 w-1/2 rounded-lg bg-slate-100 skeleton-shimmer mb-6" />
              {/* Footer */}
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <div className="h-4 w-20 rounded-lg bg-slate-100 skeleton-shimmer" />
                <div className="h-4 w-16 rounded-lg bg-slate-100 skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-red-500 bg-red-50 border border-red-100 p-4 rounded-xl">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      ) : stops.length === 0 ? (
        <Card className="text-center py-16 text-slate-400">No stops found in the database.</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stops.map((stop, index) => {
            // Dummy data — replace with real API data later
            const studentsWaiting = (stop.id * 37 + 13) % 120 + 10; // deterministic fake number
            const busOptions = ["BUS-01", "BUS-02", "BUS-03", null, "BUS-04", null];
            const assignedBus = busOptions[index % busOptions.length];
            const isCrowded = studentsWaiting > 90;

            return (
              <Card
                key={stop.id}
                delay={index * 0.04}
                className="group hover:border-primary/20 transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Building size={21} />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isCrowded ? "bg-red-100 text-red-600 animate-pulse" : "bg-emerald-100 text-emerald-600"}`}>
                    {isCrowded ? "Crowded" : "Normal"}
                  </span>
                </div>

                {/* Stop Name */}
                <h3 className="text-lg font-bold text-secondary mb-1 truncate">{stop.name}</h3>

                {/* Coordinates */}
                {stop.lat && stop.lng ? (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-4">
                    <MapPin size={12} className="text-slate-300 shrink-0" />
                    {parseFloat(stop.lat).toFixed(5)}, {parseFloat(stop.lng).toFixed(5)}
                  </div>
                ) : (
                  <div className="mb-4" />
                )}

                {/* Footer — students + bus */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={15} className={isCrowded ? "text-red-400" : "text-slate-400"} />
                    <span className={`font-bold ${isCrowded ? "text-red-600" : "text-slate-700"}`}>{studentsWaiting}</span>
                    <span className="text-slate-400 text-xs">waiting</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Bus size={14} className={assignedBus ? "text-primary" : "text-slate-300"} />
                    {assignedBus
                      ? <span className="font-semibold text-primary text-xs">{assignedBus}</span>
                      : <span className="text-slate-400 text-xs italic">Unassigned</span>
                    }
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
