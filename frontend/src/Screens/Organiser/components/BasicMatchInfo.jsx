import React, { useState, useEffect } from 'react';

const BasicMatchInfo = ({ data, setData, nextStep }) => {
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const { match_name, match_type, team1, team2, venue, date, time } = data;
        setIsFormValid(!!(match_name && match_type && team1 && team2 && venue && date && time));
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const FormField = ({ id, label, children }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Basic Match Information</h2>
            <div className="space-y-6">
                <div className="flex flex-col">
                    <label htmlFor="match_name" className="text-sm font-medium text-gray-700 mb-1">Match Name</label>
                    <input
                        type="text"
                        name="match_name"
                        id="match_name"
                        value={data.match_name || ''}
                        onChange={handleChange}
                        placeholder="Enter Match Name"
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                </div>

                <FormField id="match_type" label="Match Type">
                    <select id="match_type" name="match_type" value={data.match_type} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                        <option>ODI</option>
                        <option>Test</option>
                        <option>T20</option>
                        <option>Custom</option>
                    </select>
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="team1" className="text-sm font-medium text-gray-700 mb-1">Team 1</label>
                        <input
                            type="text"
                            name="team1"
                            id="team1"
                            value={data.team1?.name || data.team1 || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData(prev => ({
                                    ...prev,
                                    team1: typeof prev.team1 === 'object' ? 
                                        { ...prev.team1, name: value } : value
                                }));
                            }}
                            placeholder="Enter Team 1 Name"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="team2" className="text-sm font-medium text-gray-700 mb-1">Team 2</label>
                        <input
                            type="text"
                            name="team2"
                            id="team2"
                            value={data.team2?.name || data.team2 || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData(prev => ({
                                    ...prev,
                                    team2: typeof prev.team2 === 'object' ? 
                                        { ...prev.team2, name: value } : value
                                }));
                            }}
                            placeholder="Enter Team 2 Name"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Venue Field */}
                    <div className="flex flex-col">
                        <label htmlFor="venue" className="text-sm font-medium text-gray-700 mb-1">Venue</label>
                        <input
                            type="text"
                            name="venue"
                            id="venue"
                            value={data.venue}
                            onChange={handleChange}
                            placeholder="Enter venue name"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    {/* Date & Time Field */}
                    <div className="flex flex-col">
                        <label htmlFor="dateTime" className="text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            id="dateTime"
                            value={data.dateTime || (() => {
                                if (data.date) {
                                    const dateObj = new Date(data.date);
                                    if (data.time) {
                                        const [hours, minutes] = data.time.split(':');
                                        dateObj.setHours(parseInt(hours, 10));
                                        dateObj.setMinutes(parseInt(minutes, 10));
                                    }
                                    return dateObj.toISOString().slice(0, 16);
                                }
                                return '';
                            })()}
                            onChange={handleChange}
                            min={new Date().toISOString().slice(0, 16)} // Prevent past date/time
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    onClick={nextStep}
                    disabled={!isFormValid}
                    className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
};

export default BasicMatchInfo;