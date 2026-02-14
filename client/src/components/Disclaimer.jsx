import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Disclaimer = () => {
    const { t } = useLanguage();

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4 rounded shadow-sm">
            <p className="font-bold">{t.disclaimerTitle}</p>
            <p>
                {t.disclaimerText}
            </p>
        </div>
    );
};

export default Disclaimer;
