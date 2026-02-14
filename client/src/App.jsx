import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import SymptomForm from './components/SymptomForm';
import ResultCard from './components/ResultCard';
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
    try {
      // Assuming server is running on localhost:5000
      const response = await axios.post('http://localhost:5000/api/analyze', { symptoms });
      setResults(response.data.results || []);
    } catch (err) {
      console.error("API Error:", err);
      setError('Failed to analyze symptoms. Please try again or check your connection.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="container mx-auto p-4 max-w-3xl">
        <Disclaimer />

        <SymptomForm onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded border border-red-300">
            {error}
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <div className="p-4 text-center text-gray-500 bg-white rounded shadow-sm">
            {t.noMatch}
          </div>
        )}

        <div className="space-y-4">
          {results.map((result, index) => (
            <ResultCard key={index} result={result} />
          ))}
        </div>
      </main>
      <footer className="bg-gray-200 text-center p-4 mt-8 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} {t.footer}
      </footer>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
