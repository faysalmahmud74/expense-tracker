import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const InitLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center animate-fade-in flex flex-col items-center gap-4">
                {/* Optional GIF or Lottie animation */}
                <img
                    src="loader.gif"
                    alt="Loading..."
                    className="w-40 h-auto"
                />

                <h1 className="text-gray-800 text-2xl font-semibold">
                    Initializing Expense Tracker
                </h1>
                <p className="text-gray-500 text-sm">Hang tight, we’re getting things ready...</p>
            </div>
        </div>
    );
};

export default InitLoader;
