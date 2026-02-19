import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Bus, Navigation } from "lucide-react";
import Card from "../components/ui/Card";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { socket } from '../services/socket';
import { fetchLiveBuses } from '../services/api';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function LiveMapAdmin() {
    const [buses, setBuses] = useState([]);
    const [etas, setEtas] = useState({}); // Map of busId -> array of stops with ETA

    // Center map on KIIT area or first bus
    const center = [20.3533, 85.8266]; // Default KIIT coordinates roughly
    const zoom = 14;

    useEffect(() => {
        // Initial fetch via REST API (fallback/initial load)
        const loadInitialData = async () => {
            try {
                const data = await fetchLiveBuses();
                // Transform to map/object or just set array
                setBuses(data);
            } catch (err) {
                console.error("Failed to load initial bus data", err);
            }
        };

        loadInitialData();

        // Connect socket
        socket.connect();

        // Listen for events
        socket.on('initialBusLocations', (data) => {
            console.log('Received initial locations via socket', data);
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
            // data = { busId, stops: [...] }
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

    const getBusEtaParams = (busId) => {
        const busEtas = etas[busId];
        if (!busEtas || busEtas.length === 0) return <p>No ETA available</p>;

        return (
            <div className="mt-2 text-sm">
                <strong>Upcoming Stops:</strong>
                <ul className="list-none p-0 m-0 max-h-32 overflow-y-auto">
                    {busEtas.map(stop => (
                        <li key={stop.stopId} className="border-b border-gray-200 py-1 last:border-0">
                            {stop.stopName}: <span className="font-semibold text-blue-600">{stop.etaMinutes} min</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Helper to get next ETA for sidebar
    const getNextEta = (busId) => {
        const busEtas = etas[busId];
        if (busEtas && busEtas.length > 0) {
            return `${busEtas[0].etaMinutes} min`;
        }
        return 'N/A';
    }

    return (
        <div className="h-[calc(100vh-64px)] bg-slate-100 flex flex-col md:flex-row">
            {/* Sidebar/Overlay List */}
            <div className="w-full md:w-96 bg-white border-r border-slate-200 z-10 flex flex-col shadow-xl">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-secondary">Fleet Monitor</h1>
                    <p className="text-slate-500 text-sm">Real-time GPS tracking</p>
                    <p className="text-xs text-slate-400 mt-1">Active Vehicles: {buses.length}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                    {buses.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>No active buses found</p>
                        </div>
                    ) : (
                        buses.map(bus => (
                            <Card key={bus.busId || bus.id} className="!p-4 border border-slate-100 cursor-pointer hover:border-primary/50 transition-colors" hover>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                                            <Bus size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-secondary">{bus.code || bus.number || 'Unknown'}</h3>
                                            <p className="text-xs text-slate-500">ETA: <span className="text-emerald-600 font-bold">{getNextEta(bus.busId)}</span></p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${bus.speed_m_s > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {bus.speed_m_s > 0 ? 'Moving' : 'Idle'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2 rounded border border-slate-100">
                                    <Navigation size={12} /> {bus.routeId || 'Route Map'}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 bg-slate-200 relative flex items-center justify-center">
                <div className="h-full w-full">
                    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {buses.map(bus => (
                            <Marker key={bus.busId} position={[bus.lat, bus.lng]}>
                                <Popup>
                                    <div className="min-w-[150px]">
                                        <h3 className="font-bold text-lg mb-1">{bus.code}</h3>
                                        <p className="m-0 text-gray-600">Speed: {Math.round((bus.speed_m_s || 0) * 3.6)} km/h</p>
                                        {getBusEtaParams(bus.busId)}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}
