import { useState } from 'react';
import { analyzeSymptoms } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useSymptomAnalysis = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const { user } = useAuth();

    const analyze = async (symptoms) => {
        setLoading(true);
        setError(null);
        setSearched(true);
        setResults([]);

        try {
            const data = await analyzeSymptoms(symptoms);
            setResults(data.results || []);

            // Save to History if Logged In
            if (user && data.results && data.results.length > 0) {
                try {
                    await axios.post('http://localhost:5000/api/history', {
                        symptoms: symptoms,
                        analysis: data.results
                    });
                } catch (saveError) {
                    console.error("Failed to save history:", saveError);
                }
            }

        } catch (err) {
            console.error("API Error:", err);
            setError('Failed to analyze symptoms. Please try again or check your connection.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearched(false);
        setResults([]);
        setError(null);
    };

    return { results, loading, error, searched, analyze, clearSearch };
};

export default useSymptomAnalysis;
