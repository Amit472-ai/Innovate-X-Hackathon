import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for User Location (Blue Dot or similar)
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for Hospitals (Red Cross or similar)
const hospitalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to recenter map when user location changes
function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
}

const MapComponent = ({ userLocation, hospitals }) => {
    if (!userLocation) return null;

    return (
        <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg z-0"
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

            {/* User Location: Circle Marker + Accuracy Circle */}
            <React.Fragment>
                <CircleMarker
                    center={[userLocation.lat, userLocation.lng]}
                    radius={8}
                    fillColor="#2563eb"
                    color="#ffffff"
                    weight={2}
                    opacity={1}
                    fillOpacity={1}
                >
                    <Popup>
                        <b>You are here</b>
                    </Popup>
                </CircleMarker>
                {/* Accuracy Circle (Soft Blue) */}
                <CircleMarker
                    center={[userLocation.lat, userLocation.lng]}
                    radius={20}
                    fillColor="#2563eb"
                    color="#2563eb"
                    weight={0}
                    fillOpacity={0.2}
                />
            </React.Fragment>

            {/* Hospital Markers */}
            {hospitals.map(hospital => (
                <Marker
                    key={hospital.id}
                    position={[hospital.lat, hospital.lng]}
                    icon={hospitalIcon}
                >
                    <Popup>
                        <div className="text-sm">
                            <h3 className="font-bold text-gray-800">{hospital.name}</h3>
                            <p className="text-gray-600 capitalize">{hospital.type}</p>
                            <p className="text-gray-500 mt-1">{hospital.address}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline mt-2 block text-xs"
                            >
                                Get Directions →
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
