import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, required = false, className = '' }) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && <label className="text-sm font-semibold text-slate-600 ml-1">{label}</label>}
            <input
                type={type}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 bg-slate-50 focus:bg-white"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default Input;
