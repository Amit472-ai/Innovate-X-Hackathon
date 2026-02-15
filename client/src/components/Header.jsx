import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                        Swasthya<span className="text-blue-600">Sahayak</span>
                    </h1>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                            {user.name}
                        </Link>
                    ) : (
                        <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Login
                        </Link>
                    )}

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
                    >
                        <span>{language === 'en' ? '🇮🇳' : '🇺🇸'}</span>
                        <span>{language === 'en' ? 'HI' : 'EN'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
