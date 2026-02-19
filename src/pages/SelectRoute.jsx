import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Bus, Clock, Search } from "lucide-react";
import API_BASE from "../apiBase";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function SelectRoute() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);

  // Fetch stops
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await fetch(`${API_BASE}/getStops`);
        const data = await res.json();
        setStops(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch stops:", err);
        setStops([]);
      }
    };
    fetchStops();
  }, []);

  // Fetch buses with ETA
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pickup || !destination) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/getBusesForRoutes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupId: pickup,
          dropId: destination,
        }),
      });

      const data = await res.json();
      setBuses(Array.isArray(data) ? data : []);
      setShowResults(true);
    } catch (err) {
      console.error("Failed to fetch buses:", err);
      setBuses([]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8 bg-slate-50 relative">
      {/* Header Decor */}
      <div className="h-48 bg-primary rounded-b-[40px] absolute top-0 inset-x-0 overflow-hidden">
        <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[200%] bg-white/10 rounded-full blur-3xl rotate-12" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[150%] bg-white/5 rounded-full blur-3xl -rotate-12" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 relative z-10 w-full">

        {/* Welcome Text */}
        <div className="text-white mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Find your ride</h1>
          <p className="opacity-90">Where are you going today?</p>
        </div>

        {/* SEARCH CARD */}
        <Card className="mb-8 !p-6 shadow-xl border-0">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative pl-8 space-y-4">
              {/* Decor Line */}
              <div className="absolute left-3 top-3 bottom-10 w-0.5 bg-slate-200">
                <div className="absolute -top-1 -left-[5px] w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                <div className="absolute -bottom-1 -left-[5px] w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
              </div>

              <SelectBox
                label="Pickup Location"
                value={pickup}
                onChange={setPickup}
                options={stops}
                placeholder="Current Location"
                icon={MapPin}
              />

              <SelectBox
                label="Destination"
                value={destination}
                onChange={setDestination}
                options={stops}
                placeholder="Where to?"
                icon={Navigation}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-500/30 mt-4"
              isLoading={loading}
            >
              Search Buses
            </Button>
          </form>
        </Card>

        {/* RESULTS */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-800 px-1">
              Available Buses <span className="text-slate-400 text-sm font-normal">({buses.length})</span>
            </h2>

            {buses.length > 0 ? (
              buses.map((bus, idx) => (
                <Card
                  key={bus.bus_id}
                  className="!p-4 active:scale-[0.98] transition-transform cursor-pointer border shadow-sm hover:shadow-md hover:border-primary/30"
                  delay={idx * 0.1}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                        <Bus size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-secondary">{bus.bus_code}</h3>
                        <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block">AC Seater</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-semibold">ETA</p>
                      <p className="text-xl font-bold text-emerald-600 flex items-center gap-1">
                        <Clock size={16} />
                        {bus.eta_minutes} <span className="text-xs text-slate-400 font-normal">min</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => navigate('/live-tracking', { state: { busId: bus.bus_id } })}
                  >
                    Track Live Location
                  </Button>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Bus size={30} />
                </div>
                <p className="text-slate-500 font-medium">No buses found for this route.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function SelectBox({ label, value, onChange, options, placeholder, icon: Icon }) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 text-slate-400 z-10 bg-white">
          {/* Icon placeholder if needed outside, but distinct styling used above */}
        </div>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 pr-10 text-slate-800 font-medium
                       focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
      </div>
    </div>
  );
}
