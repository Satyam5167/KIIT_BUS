import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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

const LiveMap = ({ buses = [], etas = {}, routes = [] }) => {
    const markersRef = useRef({}); // Store marker references if needed for direct manipulation, though state is usually enough for React Leaflet

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

    // Center map on KIIT area or first bus
    const center = [20.3533, 85.8266]; // Default KIIT coordinates roughly
    const zoom = 14;

    return (
        <div className="h-full w-full">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {routes.map(route => {
                    const start = route.route[0];
                    const end = route.route[route.route.length - 1];
                    return (
                        <React.Fragment key={route.bus_id}>
                            <Polyline
                                positions={route.route.map(p => [p.lat, p.lng])}
                                color="blue"
                                weight={5}
                                opacity={0.6}
                            />
                            {start && (
                                <Marker position={[start.lat, start.lng]}>
                                    <Popup>Start Location: {start.name}</Popup>
                                </Marker>
                            )}
                            {end && (
                                <Marker position={[end.lat, end.lng]}>
                                    <Popup>End Location: {end.name}</Popup>
                                </Marker>
                            )}
                        </React.Fragment>
                    );
                })}
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
    );
};

export default LiveMap;
