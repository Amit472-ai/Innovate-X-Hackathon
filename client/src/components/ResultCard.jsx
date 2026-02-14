import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ResultCard = ({ result }) => {
    const { language, t } = useLanguage();
    console.log('ResultCard Render:', { language, result });
    const { condition, condition_hi, severity, severity_hi, description, description_hi, advice, advice_hi, matchParams } = result;

    const displayCondition = language === 'hi' && condition_hi ? condition_hi : condition;
    const displaySeverity = language === 'hi' && severity_hi ? severity_hi : severity;
    const displayDescription = language === 'hi' && description_hi ? description_hi : description;
    const displayAdvice = language === 'hi' && advice_hi ? advice_hi : advice;

    const severityColor = {
        Low: 'bg-green-100 text-green-800 border-green-300',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        High: 'bg-orange-100 text-orange-800 border-orange-300',
        Critical: 'bg-red-100 text-red-800 border-red-300 animate-pulse'
    };

    const badgeColor = {
        Low: 'bg-green-200 text-green-800',
        Medium: 'bg-yellow-200 text-yellow-800',
        High: 'bg-orange-200 text-orange-800',
        Critical: 'bg-red-200 text-red-800'
    };

    return (
        <div className={`p-4 mb-4 border rounded-lg shadow-sm bg-white`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{displayCondition}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${badgeColor[severity] || 'bg-gray-200'}`}>
                    {t.risk}: {displaySeverity}
                </span>
            </div>

            <p className="text-gray-600 mb-3">{displayDescription}</p>

            <div className="bg-blue-50 p-3 rounded border border-blue-100 mb-3">
                <p className="font-semibold text-blue-800 text-sm mb-1">{t.whatToDo}</p>
                <p className="text-blue-900 text-sm">{displayAdvice}</p>
            </div>

            {matchParams && matchParams.length > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                    {t.matchedSymptoms} {matchParams.join(', ')}
                </div>
            )}
        </div>
    );
};

export default ResultCard;
