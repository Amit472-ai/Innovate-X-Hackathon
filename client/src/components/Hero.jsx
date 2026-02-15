import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <div className="relative pt-32 pb-12 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-10 -left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
                <div className="absolute top-20 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-20 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="container mx-auto px-4 text-center">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium animate-fade-in">
                    ✨ Your Personal AI Health Assistant
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Identify Symptoms with <br />
                    <span className="text-gradient">AI Precision</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Describe how you feel, and get instant insights into possible conditions, severity, and advice. Fast, private, and powered by advanced AI.
                </p>
            </div>
        </div>
    );
};

export default Hero;
