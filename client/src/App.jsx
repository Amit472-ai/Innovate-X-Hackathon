import React, { useState } from 'react';
import { analyzeSymptoms } from './services/api';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import SymptomForm from './components/SymptomForm';
import ResultCard from './components/ResultCard';
import SkeletonLoader from './components/SkeletonLoader';
import { useLanguage } from './context/LanguageContext';

function AppContent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const { t } = useLanguage();

  const handleAnalyze = async (symptoms) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]); // Clear previous results immediately
    try {
      const data = await analyzeSymptoms(symptoms);
      setResults(data.results || []);
    } catch (err) {
      console.error("API Error:", err);
      setError('Failed to analyze symptoms. Please try again or check your connection.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-12">
      <Header />
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
  return <AppContent />;
}

export default App;
