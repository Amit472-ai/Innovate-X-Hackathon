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
import Hero from './components/Hero';

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12 selection:bg-blue-100 selection:text-blue-900">
      <Header />

      {isOffline && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 text-center text-sm font-medium animate-fade-in fixed top-[64px] w-full z-40 shadow-sm">
          <p>You are currently offline. Using limited local database.</p>
        </div>
      )}

      {/* Hero Section (Only show when no results and not searching) */}
      {!searched && results.length === 0 && <Hero />}

      {/* Floating Action Button for Locator */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowLocator(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-full shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group"
        >
          <span className="text-2xl group-hover:animate-bounce">🏥</span>
          <span className="font-bold hidden md:inline">Find Nearby Help</span>
        </button>
      </div>

      {showLocator && <DoctorLocator onClose={() => setShowLocator(false)} />}

      <main className="container mx-auto p-4 max-w-3xl -mt-8 relative z-10">
        {!searched && <Disclaimer />}

        <SymptomForm onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="p-4 mb-8 text-rose-700 bg-rose-50 rounded-xl border border-rose-100 shadow-sm animate-fade-in flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading && <SkeletonLoader />}

        {searched && !loading && results.length === 0 && !error && (
          <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Matches Found</h3>
            <p className="text-slate-500 max-w-md mx-auto">{t.noMatch || "We couldn't identify a condition matching those symptoms. Try describing them differently."}</p>
            <button
              onClick={() => setSearched(false)}
              className="mt-6 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="space-y-6">
          {results.map((result, index) => (
            <ResultCard key={index} result={result} />
          ))}
        </div>
      </main>

      {!searched && (
        <footer className="text-center p-8 text-slate-400 text-sm mt-12 bg-white border-t border-slate-100">
          <p>&copy; {new Date().getFullYear()} SwasthyaSahayak. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-500 transition-colors">About</a>
          </div>
        </footer>
      )}
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
