import React, { useState, useEffect } from 'react';

const WaterTracker = () => {
    const [target, setTarget] = useState(2500); // Default target 2500ml
    const [current, setCurrent] = useState(0);
    const [customAmount, setCustomAmount] = useState('');

    // Get today's date string for local storage key
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    useEffect(() => {
        const today = getTodayDate();
        const savedData = localStorage.getItem(`water_tracker_${today}`);

        if (savedData) {
            const { savedCurrent, savedTarget } = JSON.parse(savedData);
            setCurrent(savedCurrent);
            if (savedTarget) setTarget(savedTarget);
        } else {
            // Reset for new day if needed (though new key handles it mostly, 
            // but we might want to cleanup old keys or just let them be)
            setCurrent(0);
        }
    }, []);

    useEffect(() => {
        const today = getTodayDate();
        localStorage.setItem(`water_tracker_${today}`, JSON.stringify({ savedCurrent: current, savedTarget: target }));
    }, [current, target]);

    const addWater = (amount) => {
        setCurrent(prev => prev + amount);
    };

    const handleCustomAdd = (e) => {
        e.preventDefault();
        if (customAmount && !isNaN(customAmount)) {
            addWater(parseInt(customAmount));
            setCustomAmount('');
        }
    };

    const resetDaily = () => {
        if (window.confirm('Are you sure you want to reset your daily progress?')) {
            setCurrent(0);
        }
    };

    const percentage = Math.min(100, Math.round((current / target) * 100));

    return (
        <div className="bg-white rounded-xl shadow p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                    <span>💧</span> Hydration Tracker
                </h2>
                <button onClick={resetDaily} className="text-xs text-slate-400 hover:text-red-500">Reset</button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center mb-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Circular Progress Container */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-blue-100"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * percentage) / 100}
                            className="text-blue-500 transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                        <span className="text-3xl font-bold">{current}</span>
                        <span className="text-xs text-slate-400">/ {target} ml</span>
                    </div>
                </div>
                <p className="mt-2 text-sm font-medium text-blue-600">
                    {percentage >= 100 ? '🎉 Goal Reached!' : `${Math.max(0, target - current)}ml to go`}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                    onClick={() => addWater(250)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                >
                    <span className="text-lg">🥤</span>
                    <span className="text-xs font-bold">250ml</span>
                </button>
                <button
                    onClick={() => addWater(500)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                >
                    <span className="text-lg">💧</span>
                    <span className="text-xs font-bold">500ml</span>
                </button>
                <button
                    onClick={() => addWater(1000)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                >
                    <span className="text-lg">🧴</span>
                    <span className="text-xs font-bold">1L</span>
                </button>
            </div>

            <form onSubmit={handleCustomAdd} className="flex gap-2">
                <input
                    type="number"
                    placeholder="Custom ml"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                    Add
                </button>
            </form>
        </div>
    );
};

export default WaterTracker;
