import React from 'react';
export default function App() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="flex items-center justify-between py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Interview Scheduler</h1>
                </header>

                {/* Main Content */}
                <main className="py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left Column: Text and Button */}
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="space-y-4">
                                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                                    Simplify Your <br /> Interview Scheduling
                                </h2>
                            </div>

                            {/* Get Started Button */}
                            <div>
                                <button className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all transform hover:scale-105">
                                    Get Started
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Image Placeholder */}
                        <div className="hidden md:flex -mt-30">
                            <img
                                src="/i2.png"
                                alt="Interview scheduling illustration"
                                className="rounded-lg size-[500px]"
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
