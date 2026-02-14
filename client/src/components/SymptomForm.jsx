import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SymptomForm = ({ onAnalyze, loading }) => {
    const [input, setInput] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const symptoms = input.split(',').map(s => s.trim()).filter(s => s);
        onAnalyze(symptoms);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 transition-shadow hover:shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🩺 {t.symptomQuestion}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] text-gray-700 text-lg"
                        placeholder={t.placeholder}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                        Correct: "Fever, headache, cough"
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className={`px-6 py-3 rounded-lg text-white font-bold text-lg transition-all flex justify-center items-center gap-2
                        ${loading || !input.trim()
                            ? 'bg-gray-400 cursor-not-allowed opacity-70'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t.analyzing}
                        </>
                    ) : (
                        <>
                            {t.analyzeBtn} 🚀
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SymptomForm;
