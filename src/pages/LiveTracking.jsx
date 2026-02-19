import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Bus, ChevronRight, X } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LiveMap from '../components/LiveMap'
import { socket } from '../services/socket'
import { fetchLiveBuses, fetchBusRoutes } from '../services/api'

export default function LiveTracking() {
  const location = useLocation()
  const { busId } = location.state || {}
  const [selectedBus, setSelectedBus] = useState(null)
  const [viewMode, setViewMode] = useState('map')
  const [buses, setBuses] = useState([])
  const [filteredBuses, setFilteredBuses] = useState([])
  const [routes, setRoutes] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])
  const [etas, setEtas] = useState({}) // Map of busId -> array of stops with ETA

  useEffect(() => {
    // Initial fetch via REST API
    const loadInitialData = async () => {
      try {
        const data = await fetchLiveBuses();
        setBuses(data);
      } catch (err) {
        console.error("Failed to load initial bus data", err);
      }
    };

    loadInitialData();

    const loadRoutes = async () => {
      try {
        const data = await fetchBusRoutes();
        setRoutes(data || []);
      } catch (err) {
        console.error("Failed to load bus routes", err);
      }
    };
    loadRoutes();

    // Connect socket
    socket.connect();

    // Listen for events
    socket.on('initialBusLocations', (data) => {
      setBuses(data);
    });

    socket.on('busLocationUpdate', (updatedBus) => {
      setBuses(prevBuses => {
        const index = prevBuses.findIndex(b => b.busId === updatedBus.busId);
        if (index !== -1) {
          const newBuses = [...prevBuses];
          newBuses[index] = { ...newBuses[index], ...updatedBus };
          return newBuses;
        } else {
          return [...prevBuses, updatedBus];
        }
      });
    });

    socket.on('busETAUpdate', (data) => {
      setEtas(prevEtas => ({
        ...prevEtas,
        [data.busId]: data.stops
      }));
    });

    return () => {
      socket.off('initialBusLocations');
      socket.off('busLocationUpdate');
      socket.off('busETAUpdate');
      socket.disconnect();
    };
  }, []);

  // Filter buses based on navigation state (busId)
  useEffect(() => {
    if (busId && buses.length > 0) {
      const targetBus = buses.find(b => b.busId === busId);
      if (targetBus) {
        setFilteredBuses([targetBus]);
        setSelectedBus(targetBus);
      } else {
        // If the specific bus isn't found (maybe offline), show all or handle accordingly
        // For now, let's show all if not found, or maybe keep it empty?
        // User asked "only want to see the information about about the selected bus"
        // So if we can't find it, maybe show empty or all?
        // Let's fallback to all if ID doesn't match anything, or just empty.
        // Better UX: Show all if specific one isn't found?
        // Let's stick to the strict request: only see selected.
        setFilteredBuses([]);
      }
    } else {
      setFilteredBuses(buses);
    }
  }, [busId, buses]);

  // Filter routes based on visible buses
  useEffect(() => {
    if (routes.length > 0) {
      if (filteredBuses.length > 0) {
        const visibleBusIds = new Set(filteredBuses.map(b => b.busId));
        const visible = routes.filter(r => visibleBusIds.has(r.bus_id));
        setFilteredRoutes(visible);
      } else {
        // If no buses are filtered (which means no buses are visible or all are?), 
        // wait, if filteredBuses is empty it means "no active buses" or "specific bus not found".
        // If busId was provided but not found, filteredBuses is empty.
        // If no busId, filteredBuses = buses.
        // So if filteredBuses is empty, filteredRoutes should be empty.
        setFilteredRoutes([]);
      }
    }
  }, [filteredBuses, routes]);

  const routeStops = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Library', 'Campus 25']

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row relative overflow-hidden bg-slate-100">

      {/* MAP CONTAINER (Full height on mobile) */}
      <div className="flex-1 relative h-full bg-slate-200">
        <LiveMap buses={filteredBuses} etas={etas} routes={filteredRoutes} />

        {/* Mobile Floating Action Button to show list if hidden */}
        <div className="md:hidden absolute bottom-24 right-4 z-20">
          <button
            onClick={() => setViewMode('list')}
            className="bg-primary text-white p-4 rounded-full shadow-lg shadow-blue-500/40"
          >
            <Bus size={24} />
          </button>
        </div>
      </div>

      {/* SIDEBAR LIST (Hidden on mobile unless toggled, Visible on Desktop) */}
      <motion.div
        initial={false}
        animate={window.innerWidth < 768 ? (viewMode === 'list' ? { y: 0 } : { y: '100%' }) : { y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
           fixed inset-x-0 bottom-[56px] top-20 z-30 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)]
           md:static md:w-96 md:h-full md:shadow-none md:border-l md:border-slate-200 md:rounded-none md:z-0
           flex flex-col
           ${viewMode === 'list' ? 'pointer-events-auto' : 'pointer-events-none md:pointer-events-auto'}
         `}
      >
        {/* Mobile Handle */}
        <div className="md:hidden w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={() => setViewMode('map')}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-secondary">Active Buses</h2>
            <p className="text-sm text-slate-500 bg-white">{filteredBuses.length} vehicles online</p>
          </div>
          <button onClick={() => setViewMode('map')} className="md:hidden p-2 bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {filteredBuses.map((bus) => (
            <div
              key={bus.busId}
              onClick={() => setSelectedBus(bus)}
              className={`
                    bg-white p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md
                    ${selectedBus?.busId === bus.busId ? 'border-primary ring-1 ring-primary' : 'border-slate-100'}
                  `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                    <Bus size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{bus.code}</h3>
                    <p className="text-xs text-slate-500">{bus.routeId || 'Route 1'}</p>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${bus.speed_m_s > 0 ? 'bg-emerald-100 text-emerald-700' :
                  'bg-amber-100 text-amber-700'
                  }`}>
                  {bus.speed_m_s > 0 ? 'Moving' : 'Idle'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                <MapPin size={14} className="text-slate-400" />
                <span>Last updated just now</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SELECTED BUS DETAIL OVERLAY (Mobile & Desktop) */}
      <AnimatePresence>
        {selectedBus && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-[80px] left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:w-96 z-[1000]"
          >
            <Card className="shadow-2xl border-primary/20 bg-white/95 backdrop-blur">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-secondary">Bus {selectedBus.code}</h3>
                  <p className="text-sm text-slate-500">{selectedBus.routeId || 'Route 1'}</p>
                </div>
                <button onClick={() => setSelectedBus(null)} className="p-1 hover:bg-slate-100 rounded-full">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex justify-between items-center py-3 border-y border-slate-100 mb-4">
                <div className="text-center px-4 border-r border-slate-100">
                  <p className="text-xs text-slate-400 uppercase">Speed</p>
                  <p className="font-bold text-secondary">
                    {Math.round((selectedBus.speed_m_s || 0) * 3.6)} km/h
                  </p>
                </div>
                <div className="text-center px-4 border-r border-slate-100">
                  <p className="text-xs text-slate-400 uppercase">ETA</p>
                  <p className="font-bold text-emerald-600">
                    {etas[selectedBus.busId]?.[0]?.etaMinutes || '--'} min
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-xs text-slate-400 uppercase">Next</p>
                  <p className="font-bold text-secondary">
                    {etas[selectedBus.busId]?.[0]?.stopName || 'Calculating...'}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-2 relative">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -z-10" />
                {routeStops.slice(0, 4).map((stop, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 bg-white p-1">
                    <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-300'}`} />
                    <span className={i === 1 ? 'text-primary font-bold' : ''}>{stop.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
