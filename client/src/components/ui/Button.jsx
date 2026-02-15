import React from 'react';

const Button = ({ children, onClick, type = 'button', disabled = false, variant = 'primary', className = '' }) => {
    const baseStyles = "w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none";

    const variants = {
        primary: "text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25 disabled:bg-slate-300",
        secondary: "text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25 disabled:bg-slate-300",
        outline: "border-2 border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 disabled:border-slate-100 disabled:text-slate-300"
    };

    const variantStyles = variants[variant] || variants.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
