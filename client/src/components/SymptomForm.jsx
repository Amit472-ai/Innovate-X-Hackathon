import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import VoiceInput from './VoiceInput';

const SymptomForm = ({ onAnalyze, loading }) => {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { t, language } = useLanguage();

    const handleSpeechInput = (text) => {
        if (input) {
            setInput(prev => `${prev}, ${text}`);
        } else {
            setInput(text);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const symptoms = input.split(',').map(s => s.trim()).filter(s => s);
        onAnalyze(symptoms);
    };

    return (
        <div className="bg-white p-1 rounded-2xl shadow-xl shadow-blue-100/50 mb-8 border border-white/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <span className="text-3xl">🩺</span> {t.symptomQuestion}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className={`relative transition-all duration-300 ${isFocused ? 'transform -translate-y-1' : ''}`}>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-xl blur opacity-20 transition duration-500 ${isFocused ? 'opacity-70' : ''}`}></div>
                        <textarea
                            className="relative w-full p-5 border border-slate-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-400 transition-all min-h-[140px] text-slate-700 text-lg placeholder-slate-400 bg-white shadow-sm resize-none"
                            placeholder={t.placeholder}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            disabled={loading}
                        />
                        <div className="absolute bottom-4 right-4 z-10">
                            <VoiceInput
                                onSpeechInput={handleSpeechInput}
                                lang={language === 'hi' ? 'hi-IN' : 'en-US'}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`py-4 px-8 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 flex justify-center items-center gap-3 relative overflow-hidden
                            ${loading || !input.trim()
                                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 transform hover:-translate-y-1 active:translate-y-0'
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
                                <span>{t.analyzeBtn}</span>
                                <span className="text-xl">🚀</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SymptomForm;
