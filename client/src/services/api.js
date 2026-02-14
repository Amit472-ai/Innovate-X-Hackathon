import axios from 'axios';

// Use environment variable or default to localhost
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeSymptoms = async (symptoms) => {
    try {
        const response = await api.post('/analyze', { symptoms });
        return response.data;
    } catch (error) {
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
