import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const { user } = useAuth();

    return (
        <header className="fixed w-full top-0 z-50 glass transition-all duration-300">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">
                        Swasthya<span className="text-blue-600">Sahayak</span>
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Link to="/profile" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2">
                            Login
                        </Link>
                    )}

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-medium text-slate-700"
                    >
                        <span>{language === 'en' ? '🇮🇳' : '🇺🇸'}</span>
                        <span className="hidden sm:inline">{language === 'en' ? 'HI' : 'EN'}</span>
                    </button>

                    {/* Mobile Profile Icon (only if logged in) */}
                    {user && (
                        <Link to="/profile" className="md:hidden w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
