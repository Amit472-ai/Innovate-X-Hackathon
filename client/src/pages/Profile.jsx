import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Header from '../components/Header';

const Profile = () => {
    const { user, logout } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/history');
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Access Denied</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto p-4 max-w-4xl mt-24">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    <div className="flex items-center gap-4 z-10">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Welcome, {user.name} 👋</h1>
                            <p className="text-slate-500">{user.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { logout(); window.location.href = '/'; }}
                        className="px-6 py-2.5 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all z-10 shadow-sm"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-2xl">📜</span> Your Health History
                    </h2>
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {history.length} Reports
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-white rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                        <div className="text-6xl mb-4 opacity-50">📂</div>
                        <p className="text-slate-500 text-lg font-medium">No history found</p>
                        <p className="text-slate-400 mb-6 max-w-xs mx-auto">Run a checkup to see your past analysis results here.</p>
                        <a href="/" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all inline-block">
                            Start Analysis
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {history.map(report => (
                            <div key={report._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            {new Date(report.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="font-semibold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                                            {report.symptoms.join(', ')}
                                        </p>
                                    </div>
                                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                                        {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    {report.analysis.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <span className="font-semibold text-slate-700">{item.condition}</span>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                                                ${item.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                                    item.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                        item.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {item.severity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
