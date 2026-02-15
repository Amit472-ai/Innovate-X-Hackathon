import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';

const Profile = () => {
    const { user, logout } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/history');
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

    if (!user) return <div>Access Denied</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto p-4 max-w-4xl mt-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name} 👋</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <button
                        onClick={() => { logout(); window.location.href = '/'; }}
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Health History</h2>

                {loading ? (
                    <div className="text-center py-8">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No history found. Run a checkup to see results here!</p>
                        <a href="/" className="text-blue-600 font-medium mt-2 inline-block">Go to Home</a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map(report => (
                            <div key={report._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}</p>
                                        <p className="font-medium text-gray-800 mt-1">Symptoms: {report.symptoms.join(', ')}</p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {report.analysis.length} Results
                                    </span>
                                </div>
                                <div className="space-y-2 mt-2 border-t pt-2 border-gray-50">
                                    {report.analysis.map((item, idx) => (
                                        <div key={idx} className="text-sm">
                                            <span className="font-semibold">{item.condition}</span>
                                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${item.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                                    item.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                                                        item.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
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
