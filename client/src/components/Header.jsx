import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t.title}</h1>
                    <p className="text-sm italic">{t.tagline}</p>
                </div>
                <button
                    onClick={toggleLanguage}
                    className="bg-white text-blue-600 px-3 py-1 rounded font-semibold hover:bg-gray-100 transition"
                >
                    {language === 'en' ? 'हिंदी' : 'English'}
                </button>
            </div>
        </header>
    );
};

export default Header;
