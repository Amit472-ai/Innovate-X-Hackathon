import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SymptomForm = ({ onAnalyze, loading }) => {
    const [input, setInput] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        // Split by comma if user enters multiple, or just pass raw string to be handled by backend
        // For now, let's split by comma for better matching
        const symptoms = input.split(',').map(s => s.trim()).filter(s => s);
        onAnalyze(symptoms);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">{t.symptomQuestion}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder={t.placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 rounded text-white font-bold transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? t.analyzing : t.analyzeBtn}
                </button>
            </form>
        </div>
    );
};

export default SymptomForm;
