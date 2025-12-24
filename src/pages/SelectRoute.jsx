import { useEffect, useState } from "react";
import API_BASE from "../apiBase";

export default function SelectRoute() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Stores stops fetched from backend
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);

  // Fetch available stops from backend
  const fetchStops = async () => {
    try {
      const res = await fetch(`${API_BASE}/getStops`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      const data = await res.json();
      setStops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch stops:", err.message);
      setStops([]);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!pickup || !destination) return;

    try {
      const res = await fetch(`${API_BASE}/getBusesForRoutes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupId: pickup,
          dropId: destination,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      const data = await res.json();
      setBuses(Array.isArray(data) ? data : []);
      setShowResults(true);
    } catch (err) {
      console.error("Failed to fetch buses:", err.message);
      setBuses([]);
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <section className="bg-gradient-to-r from-dark to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Welcome to Kiit Bus</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-dark mb-8">
            See Available Buses
          </h1>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Pickup Location
                </label>
                <select
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full px-4 py-3 border border-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select pickup location</option>
                  {stops.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 border border-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select destination</option>
                  {stops.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary text-dark font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Show Buses
                </button>
              </div>
            </div>
          </form>
        </div>

        {showResults && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark mb-6">
              Available Buses
            </h2>

            {buses.map((bus) => (
              <div
                key={bus.bus_id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bus Number</p>
                    <p className="text-2xl font-bold text-dark">
                      {bus.bus_code}
                    </p>
                  </div>

                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-600 mb-1">Route</p>
                    <p className="text-lg font-semibold text-dark">
                      {bus.route.map((s) => s.name).join(" → ")}
                    </p>
                  </div>

                  <div>
                    <button className="w-full bg-primary text-dark font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {buses.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-600">
                No buses available for the selected route
              </div>
            )}
          </div>
        )}

        {!showResults && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              Select pickup and destination to see available buses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
