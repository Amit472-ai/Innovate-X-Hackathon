import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import locationService from '../services/locationService';
import SkeletonLoader from './SkeletonLoader';

const DoctorLocator = ({ onClose }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userAddress, setUserAddress] = useState("Locating...");

    useEffect(() => {
        const fetchLocationAndHospitals = async () => {
            try {
                setLoading(true);
                // 1. Get User Location
                const location = await locationService.getUserLocation();
                setUserLocation(location);

                // 2. Get User Address relative to location
                const address = await locationService.getAddressFromCoordinates(location.lat, location.lng);
                setUserAddress(address);

                // 3. Search for Hospitals nearby
                const results = await locationService.searchNearbyHospitals(location.lat, location.lng);
                setHospitals(results);
            } catch (err) {
                console.error("Locator Error:", err);
                setError(err.message || "Failed to access location or fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchLocationAndHospitals();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        🏥 Nearby Medical Help
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row">

                    {/* Map Section */}
                    <div className="w-full md:w-2/3 h-[400px] md:h-auto min-h-[400px] relative">
                        {loading && !userLocation && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                    <p className="text-gray-500">Accessing location...</p>
                                </div>
                            </div>
                        )}

                        {!loading && userLocation && (
                            <MapComponent userLocation={userLocation} hospitals={hospitals} />
                        )}

                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10 p-4 text-center text-red-600">
                                <div>
                                    <p className="font-bold mb-2">Error</p>
                                    <p>{error}</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* List Section */}
                    <div className="w-full md:w-1/3 bg-gray-50 border-l border-gray-200 overflow-y-auto max-h-[400px] md:max-h-none">
                        <div className="p-4 sticky top-0 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-700">Results ({hospitals.length})</h3>
                        </div>

                        {loading && (
                            <div className="p-4 space-y-4">
                                <SkeletonLoader />
                                <SkeletonLoader />
                            </div>
                        )}

                        {!loading && hospitals.length === 0 && !error && (
                            <div className="p-8 text-center text-gray-500">
                                <p>No hospitals found nearby.</p>
                            </div>
                        )}

                        <div className="divide-y divide-gray-100">
                            {hospitals.map(hospital => (
                                <div key={hospital.id} className="p-4 hover:bg-white transition-colors">
                                    <h4 className="font-bold text-gray-800 text-sm">{hospital.name}</h4>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-blue-600 capitalize">{hospital.type}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs font-medium text-emerald-600">
                                            {hospital.distance < 1
                                                ? `${(hospital.distance * 1000).toFixed(0)} m`
                                                : `${hospital.distance.toFixed(1)} km`}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2">{hospital.address}</p>
                                    <div className="mt-3 flex gap-2">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 font-medium"
                                        >
                                            Navigate 📍
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorLocator;
