import React, { useState, useEffect } from 'react';

const CalorieTracker = () => {
    const [target, setTarget] = useState(2000); // Default 2000 kcal
    const [current, setCurrent] = useState(0);
    const [foodLogs, setFoodLogs] = useState([]);
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Load data
    useEffect(() => {
        const today = getTodayDate();
        const savedData = localStorage.getItem(`calorie_tracker_${today}`);

        if (savedData) {
            const { savedCurrent, savedTarget, savedLogs } = JSON.parse(savedData);
            setCurrent(savedCurrent);
            if (savedTarget) setTarget(savedTarget);
            if (savedLogs) setFoodLogs(savedLogs);
        } else {
            setCurrent(0);
            setFoodLogs([]);
        }
    }, []);

    // Save data
    useEffect(() => {
        const today = getTodayDate();
        localStorage.setItem(`calorie_tracker_${today}`, JSON.stringify({
            savedCurrent: current,
            savedTarget: target,
            savedLogs: foodLogs
        }));
    }, [current, target, foodLogs]);

    const addFood = (e) => {
        e.preventDefault();
        if (!foodName || !calories) return;

        const calAmount = parseInt(calories);
        if (isNaN(calAmount)) return;

        const newLog = {
            id: Date.now(),
            name: foodName,
            calories: calAmount,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setFoodLogs([newLog, ...foodLogs]);
        setCurrent(prev => prev + calAmount);

        setFoodName('');
        setCalories('');
    };

    const removeLog = (id) => {
        const logToRemove = foodLogs.find(log => log.id === id);
        if (logToRemove) {
            setFoodLogs(foodLogs.filter(log => log.id !== id));
            setCurrent(prev => prev - logToRemove.calories);
        }
    };

    const resetDaily = () => {
        if (window.confirm('Are you sure you want to clear your food logs?')) {
            setCurrent(0);
            setFoodLogs([]);
        }
    };

    const percentage = Math.min(100, Math.round((current / target) * 100));

    return (
        <div className="bg-white rounded-xl shadow p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                    <span>🔥</span> Calorie Tracker
                </h2>
                <button onClick={resetDaily} className="text-xs text-slate-400 hover:text-red-500">Reset</button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-3xl font-bold text-slate-700">{current}</span>
                    <span className="text-sm text-slate-500 mb-1">/ {target} kcal</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${percentage > 100 ? 'bg-red-500' : 'bg-orange-500'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-slate-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Add Food Form */}
            <form onSubmit={addFood} className="flex gap-2 mb-6">
                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        placeholder="Food item (e.g. Apple)"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="flex-[2] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Kcal"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                        required
                    />
                </div>
                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition">
                    +
                </button>
            </form>

            {/* Food Logs List */}
            <div className="flex-1 overflow-y-auto max-h-60 pr-1 custom-scrollbar">
                {foodLogs.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-4">No food logged today.</p>
                ) : (
                    <div className="space-y-2">
                        {foodLogs.map(log => (
                            <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:shadow-sm transition-all">
                                <div>
                                    <p className="font-medium text-slate-700">{log.name}</p>
                                    <p className="text-xs text-slate-400">{log.time}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-orange-600">{log.calories} kcal</span>
                                    <button
                                        onClick={() => removeLog(log.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default CalorieTracker;
