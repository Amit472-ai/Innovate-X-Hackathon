import axios from 'axios';

class LocationService {
    constructor() {
        this.overpassUrl = 'https://overpass-api.de/api/interpreter';
    }

    async getAddressFromCoordinates(lat, lng) {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            return response.data.display_name;
        } catch (error) {
            console.error("Reverse Geocoding Error:", error);
            return "Unknown Location";
        }
    }

    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by your browser"));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            }
        });
    }

    _calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this._deg2rad(lat2 - lat1);
        const dLon = this._deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    _deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    async searchNearbyHospitals(lat, lng, radius = 5000) {
        // Overpass QL query to find hospitals and clinics around the user
        // radius is in meters
        const query = `
            [out:json];
            (
              node["amenity"="hospital"](around:${radius},${lat},${lng});
              way["amenity"="hospital"](around:${radius},${lat},${lng});
              relation["amenity"="hospital"](around:${radius},${lat},${lng});
              node["amenity"="clinic"](around:${radius},${lat},${lng});
              way["amenity"="clinic"](around:${radius},${lat},${lng});
              relation["amenity"="clinic"](around:${radius},${lat},${lng});
            );
            out center;
        `;

        try {
            const response = await axios.post(this.overpassUrl, query, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data && response.data.elements) {
                const mappedResults = response.data.elements.map(element => {
                    // For ways and relations, 'center' property provided by 'out center' is used
                    const locationLat = element.lat || (element.center ? element.center.lat : null);
                    const locationLng = element.lon || (element.center ? element.center.lon : null);

                    if (!locationLat || !locationLng) return null;

                    const distance = this._calculateDistance(lat, lng, locationLat, locationLng);

                    return {
                        id: element.id,
                        name: element.tags.name || "Unnamed Medical Facility",
                        type: element.tags.amenity || "hospital",
                        lat: locationLat,
                        lng: locationLng,
                        address: this._formatAddress(element.tags),
                        phone: element.tags['contact:phone'] || element.tags.phone || "Not available",
                        distance: distance
                    };
                }).filter(item => item !== null);

                // Sort by distance (ascending)
                return mappedResults.sort((a, b) => a.distance - b.distance);
            }
            return [];
        } catch (error) {
            console.error("Error fetching hospitals from Overpass API:", error);
            throw new Error("Failed to fetch nearby hospitals.");
        }
    }

    _formatAddress(tags) {
        const parts = [];
        if (tags['addr:street']) parts.push(tags['addr:street']);
        if (tags['addr:city']) parts.push(tags['addr:city']);
        if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
        return parts.length > 0 ? parts.join(', ') : "Address not available";
    }
}

export default new LocationService();
