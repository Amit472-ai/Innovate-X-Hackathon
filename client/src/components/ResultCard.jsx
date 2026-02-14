import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ResultCard = ({ result }) => {
    const { language, t } = useLanguage();
    const { condition, condition_hi, severity, severity_hi, description, description_hi, advice, advice_hi, matchParams } = result;

    const displayCondition = language === 'hi' && condition_hi ? condition_hi : condition;
    const displaySeverity = language === 'hi' && severity_hi ? severity_hi : severity;
    const displayDescription = language === 'hi' && description_hi ? description_hi : description;
    const displayAdvice = language === 'hi' && advice_hi ? advice_hi : advice;

    const severityMap = {
        Low: { color: 'text-green-800', bg: 'bg-green-100', border: 'border-green-200', icon: '🟢' },
        Medium: { color: 'text-yellow-800', bg: 'bg-yellow-100', border: 'border-yellow-200', icon: '🟡' },
        High: { color: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-200', icon: '🟠' },
        Critical: { color: 'text-red-800', bg: 'bg-red-100', border: 'border-red-200', icon: '🔴' }
    };

    const styles = severityMap[severity] || severityMap.Low;

    return (
        <div className={`p-5 mb-4 border rounded-xl shadow-sm bg-white transition-all duration-300 hover:shadow-md animate-fade-in`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{displayCondition}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${styles.bg} ${styles.color}`}>
                    <span>{styles.icon}</span> {t.risk}: {displaySeverity}
                </span>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{displayDescription}</p>

            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-2">
                <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    {t.whatToDo}
                </h4>
                <p className="text-blue-800 text-sm">{displayAdvice}</p>
            </div>

            {matchParams && matchParams.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="text-gray-500 py-1">{t.matchedSymptoms}:</span>
                    {matchParams.map((sym, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                            {sym}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultCard;
