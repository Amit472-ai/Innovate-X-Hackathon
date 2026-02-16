import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ResultCard = ({ result }) => {
    const { language, t } = useLanguage();
    const { condition, condition_hi, severity, severity_hi, description, description_hi, advice, advice_hi, matchParams, medicines, medicines_hi, precautions, precautions_hi, home_remedies, home_remedies_hi } = result;

    const displayCondition = language === 'hi' && condition_hi ? condition_hi : condition;
    const displaySeverity = language === 'hi' && severity_hi ? severity_hi : severity;
    const displayDescription = language === 'hi' && description_hi ? description_hi : description;
    const displayAdvice = language === 'hi' && advice_hi ? advice_hi : advice;

    const displayMedicines = language === 'hi' && medicines_hi ? medicines_hi : medicines;
    const displayPrecautions = language === 'hi' && precautions_hi ? precautions_hi : precautions;
    const displayRemedies = language === 'hi' && home_remedies_hi ? home_remedies_hi : home_remedies;

    const severityMap = {
        Low: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🟢', label: 'Low Risk' },
        Medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡', label: 'Medium Risk' },
        High: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🟠', label: 'High Risk' },
        Critical: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: '🔴', label: 'Critical' }
    };

    const styles = severityMap[severity] || severityMap.Low;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in group">
            <div className={`h-1.5 w-full bg-gradient-to-r ${severity === 'Critical' ? 'from-rose-500 to-red-600' :
                severity === 'High' ? 'from-orange-400 to-orange-600' :
                    severity === 'Medium' ? 'from-amber-400 to-yellow-500' :
                        'from-emerald-400 to-green-600'
                }`}></div>

            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {displayCondition}
                    </h3>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 border ${styles.bg} ${styles.color} ${styles.border}`}>
                        <span className="text-[10px]">{styles.icon}</span>
                        {language === 'hi' ? displaySeverity : (styles.label || displaySeverity)}
                    </span>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed text-sm lg:text-base">
                    {displayDescription}
                </p>

                <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-100/50 mb-4">
                    <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        {t.whatToDo}
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        {displayAdvice}
                    </p>
                </div>

                {/* Medicines Section */}
                {displayMedicines && displayMedicines.length > 0 && (
                    <div className="mb-4 bg-green-50 p-4 rounded-xl border border-green-100">
                        <h4 className="font-bold text-green-800 text-sm mb-2 flex items-center gap-2">
                            <span className="text-lg">💊</span> Medicines <span className="text-xs font-normal opacity-75">(OTC)</span>
                        </h4>
                        <ul className="grid gap-2">
                            {displayMedicines.map((med, i) => (
                                <li key={i} className="text-green-900 text-sm flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                                    {med}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Home Remedies Section */}
                {displayRemedies && displayRemedies.length > 0 && (
                    <div className="mb-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                            <span className="text-lg">🍵</span> Home Remedies <span className="text-xs font-normal opacity-75">(Quick Relief)</span>
                        </h4>
                        <ul className="grid gap-2">
                            {displayRemedies.map((rem, i) => (
                                <li key={i} className="text-blue-900 text-sm flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                    {rem}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Precautions Section */}
                {displayPrecautions && displayPrecautions.length > 0 && (
                    <div className="mb-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                            <span className="text-lg">⚠️</span> Precautions
                        </h4>
                        <ul className="grid gap-2">
                            {displayPrecautions.map((pre, i) => (
                                <li key={i} className="text-amber-900 text-sm flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                    {pre}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {matchParams && matchParams.length > 0 && (
                    <div className="pt-4 border-t border-slate-50 flex flex-wrap gap-2 text-xs">
                        <span className="text-slate-400 py-1 font-medium">{t.matchedSymptoms}:</span>
                        {matchParams.map((sym, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                {sym}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultCard;
