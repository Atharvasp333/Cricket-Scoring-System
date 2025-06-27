import React from 'react';

const MatchRules = ({ data, setData, nextStep, prevStep }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : parseInt(value, 10) || 0;
        setData(prev => ({ ...prev, [name]: val }));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Match Rules and Settings</h2>
            <div className="max-w-md mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="overs" className="block text-sm font-medium text-gray-700">Total Overs</label>
                        <input type="number" name="overs" id="overs" value={data.overs} onChange={handleChange} className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="powerplayOvers" className="block text-sm font-medium text-gray-700">Powerplay Overs</label>
                        <input type="number" name="powerplayOvers" id="powerplayOvers" value={data.powerplayOvers} onChange={handleChange} className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />

                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <label htmlFor="drsEnabled" className="font-medium text-gray-900">Enable DRS</label>
                        <label htmlFor="drsEnabled" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="drsEnabled" name="drsEnabled" className="sr-only peer" checked={data.drsEnabled} onChange={handleChange} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {data.drsEnabled && (
                        <div className="mt-4">
                            <label htmlFor="drsReviews" className="block text-sm font-medium text-gray-700">DRS Reviews per Team</label>
                            <input type="number" name="drsReviews" id="drsReviews" value={data.drsReviews} onChange={handleChange} className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />

                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300">
                    Back
                </button>
                <button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Save & Continue
                </button>
            </div>
        </div>
    );
};

export default MatchRules; 