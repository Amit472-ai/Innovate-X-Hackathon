import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: 'Describe Symptoms',
            description: 'Simply type efficiently how you are feeling or what symptoms you are experiencing.',
            icon: '✍️',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 2,
            title: 'AI Analysis',
            description: 'Our advanced AI analyzes your input against a vast medical database to identify potential conditions.',
            icon: '🧠',
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            id: 3,
            title: 'Get Results & Advice',
            description: 'Receive instant insights, severity assessment, and actionable medical advice or doctor recommendations.',
            icon: '📋',
            color: 'bg-green-100 text-green-600'
        }
    ];

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Simple Process</span>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mt-2 mb-4">How It Works</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    Get health insights in three simple steps. Fast, secure, and easy to use.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-4">
                {/* Connecting Line (Desktop only) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 transform -translate-y-1/2"></div>

                {steps.map((step) => (
                    <div key={step.id} className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-sm`}>
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">{step.title}</h3>
                        <p className="text-slate-500 text-center leading-relaxed">
                            {step.description}
                        </p>
                        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white">
                            {step.id}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to check your health?</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        Don't wait in uncertainty. Get instant answers and peace of mind with our AI-powered symptom checker.
                    </p>
                    <Link
                        to="/chatbot"
                        className="inline-block bg-white text-blue-700 font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-slate-50 hover:scale-105 transition-all duration-300"
                    >
                        Start Symptom Check Now
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
