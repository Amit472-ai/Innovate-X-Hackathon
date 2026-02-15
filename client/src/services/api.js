import axios from 'axios';
import offlineService from './offlineService';

// Use environment variable or default to localhost
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeSymptoms = async (symptoms) => {
    // Check for offline status immediately
    if (!navigator.onLine) {
        console.log("App is offline, using offline service.");
        const offlineResults = await offlineService.analyzeSymptoms(symptoms);
        return { ...offlineResults, isOffline: true };
    }

    try {
        const response = await api.post('/analyze', { symptoms });
        return response.data;
    } catch (error) {
        // Fallback to offline service on network error
        if (!error.response) { // Network Error
            console.log("Network error, switching to offline service.");
            const offlineResults = await offlineService.analyzeSymptoms(symptoms);
            return { ...offlineResults, isOffline: true };
        }
        throw error;
    }
};

export const getConditions = async () => {
    try {
        const response = await api.get('/conditions');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
