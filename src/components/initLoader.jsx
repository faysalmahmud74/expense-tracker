import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const InitLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
            <div className="text-center animate-fade-in">
                <FaSpinner className="mx-auto h-12 w-12 text-white animate-spin mb-6" />
                <h1 className="text-white text-3xl font-semibold mb-2">
                    Initializing Expense Tracker
                </h1>
                <p className="text-white/80 text-sm">Hang tight, we're getting things ready...</p>
            </div>
        </div>
    );
};

export default InitLoader;
