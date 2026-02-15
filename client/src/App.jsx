import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { analyzeSymptoms } from './services/api';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import SymptomForm from './components/SymptomForm';
import ResultCard from './components/ResultCard';
import SkeletonLoader from './components/SkeletonLoader';
import DoctorLocator from './components/DoctorLocator';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showLocator, setShowLocator] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleAnalyze = async (symptoms) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]); // Clear previous results immediately
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
          // console.log("Report saved to history");
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

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  React.useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-12">
      <Header />
      {isOffline && (
        <div className="bg-yellow-500 text-white text-center py-1 px-4 text-sm font-medium animate-fade-in">
          You are currently offline. Using limited local database.
        </div>
      )}

      {/* Floating Action Button for Locator */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowLocator(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl">🏥</span>
          <span className="font-medium hidden md:inline">Find Nearby Help</span>
        </button>
      </div>

      {showLocator && <DoctorLocator onClose={() => setShowLocator(false)} />}

      <main className="container mx-auto p-4 max-w-3xl mt-4">
        <Disclaimer />

        <SymptomForm onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-50 rounded-lg border border-red-200 shadow-sm animate-fade-in">
            {error}
          </div>
        )}

        {loading && <SkeletonLoader />}

        {searched && !loading && results.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg">{t.noMatch || "No matching conditions found. Try describing your symptoms differently."}</p>
          </div>
        )}

        <div className="space-y-6">
          {results.map((result, index) => (
            <ResultCard key={index} result={result} />
          ))}
        </div>
      </main>
      <footer className="text-center p-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} BrajCoders Health Platform
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
