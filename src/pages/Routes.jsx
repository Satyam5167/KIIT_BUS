import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Users, ChevronDown, Bus } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Routes() {
  const [expandedRoute, setExpandedRoute] = useState(null)

  const [busRoutes, setBusRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const routesData = await import('../services/api').then(m => m.fetchBusRoutes());
        // Transform backend data to UI format
        const formattedRoutes = routesData.map(bus => {
          const stops = bus.route.map(s => s.name);
          const startNode = bus.route[0];
          const endNode = bus.route[bus.route.length - 1];

          // Calculate approximate distance (Haversine or simple Euclidean for now, or mock)
          // For now, let's mock distance/duration based on stop count as we don't have real routing engine distance
          const distance = (bus.route.length * 1.2).toFixed(1) + ' km';
          const duration = (bus.route.length * 5) + ' min';

          return {
            id: bus.bus_id,
            number: `Bus ${bus.bus_code}`,
            name: `${startNode.name} - ${endNode.name}`,
            stops: stops,
            schedule: ['Every 30 mins', '6:00 AM - 10:00 PM'], // Placeholder as we don't have schedule in DB
            distance: distance,
            duration: duration,
            buses: 1, // We are listing individual buses as routes since they are 1:1 in this system mostly
            status: bus.status
          };
        });
        setBusRoutes(formattedRoutes);
      } catch (err) {
        console.error("Failed to load routes", err);
      } finally {
        setLoading(false);
      }
    };
    loadRoutes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">Bus Routes</h1>
          <p className="text-slate-500">Explore all available routes and schedules</p>
        </div>

        <div className="space-y-4">
          {busRoutes.map((route, idx) => (
            <Card
              key={route.id}
              className="!p-0 overflow-hidden border-0 shadow-md"
              delay={idx * 0.1}
            >
              <div
                onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                className="p-5 bg-white cursor-pointer hover:bg-slate-50 transition-colors relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                      {route.number.split(' ')[1]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary">{route.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {route.stops.length} Stops • {route.duration}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedRoute === route.id ? 180 : 0 }}
                    className="text-slate-400"
                  >
                    <ChevronDown />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedRoute === route.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50 border-t border-slate-100"
                  >
                    <div className="p-5">
                      {/* Stats */}
                      <div className="flex gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                          <MapPin size={16} className="text-primary" />
                          <span className="font-semibold text-secondary">{route.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                          <Clock size={16} className="text-orange-500" />
                          <span className="font-semibold text-secondary">{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                          <Bus size={16} className="text-emerald-500" />
                          <span className="font-semibold text-secondary">{route.buses} Buses</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        {/* STOPS */}
                        <div>
                          <h4 className="font-bold text-secondary mb-4 text-sm uppercase tracking-wide">Stops</h4>
                          <div className="relative pl-2 space-y-6">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200" />
                            {route.stops.map((stop, i) => (
                              <div key={stop} className="relative z-10 flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${i === 0 || i === route.stops.length - 1 ? 'bg-primary' : 'bg-slate-300'}`}>
                                  {i === 0 || i === route.stops.length - 1 ? <div className="w-1.5 h-1.5 bg-white rounded-full" /> : null}
                                </div>
                                <span className={`text-sm ${i === 0 || i === route.stops.length - 1 ? 'font-bold text-secondary' : 'text-slate-600'}`}>{stop}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SCHEDULE */}
                        <div>
                          <h4 className="font-bold text-secondary mb-4 text-sm uppercase tracking-wide">Schedule</h4>
                          <div className="flex flex-wrap gap-2">
                            {route.schedule.map((time, i) => (
                              <div key={i} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary transition-colors cursor-default">
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex gap-3">
                        <Button className="flex-1" icon={Users}>See Capacity</Button>
                        <Button variant="outline" className="flex-1" icon={MapPin}>View Map</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
