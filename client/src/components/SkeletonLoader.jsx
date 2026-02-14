import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="space-y-2 mb-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="p-3 rounded border border-gray-100 bg-gray-50">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
