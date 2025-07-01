import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const TeamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const OrganiserCompletedTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('/api/tournaments/completed');
                if (!response.ok) throw new Error('Failed to fetch completed tournaments');
                const data = await response.json();
                setTournaments(data);
            } catch (err) {
                setError('Failed to load completed tournaments.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const TournamentCard = ({ _id, name, type, startDate, endDate, location, teams, winner }) => (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out p-4 border border-indigo-200 hover:border-indigo-300">
            <div className="flex items-center mb-2">
                <TrophyIcon />
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {type}
                </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
            
            <div className="flex items-center text-xs text-gray-600 mb-3">
                <CalendarIcon />
                <span>{new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-600 mb-3">
                <LocationIcon />
                <span>{location}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-600 mb-3">
                <TeamIcon />
                <span>
                    {Array.isArray(teams) ? teams.length : 
                     (typeof teams === 'number' ? teams : 0)} Teams
                </span>
            </div>
            
            {winner && (
                <div className="flex items-center justify-between bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg px-3 py-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-800">Winner</span>
                    <span className="text-xs font-bold text-emerald-900">{winner.name}</span>
                </div>
            )}
            
            <div className="flex justify-end">
                <Link 
                    to={`/organiser/tournament/${_id}`} 
                    className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto p-6">
                {/* Header Section */}
                <header className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Completed Tournaments
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm">Review past tournaments and their results</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link 
                                to="/organiser-homepage" 
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading completed tournaments...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-red-600 font-medium text-sm">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <TrophyIcon />
                            <h2 className="text-xl font-bold text-gray-800">Tournament History</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {tournaments.length === 0 ? (
                                <div className="col-span-full">
                                    <div className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
                                        <TrophyIcon />
                                        <p className="text-gray-500 text-sm">No completed tournaments yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Completed tournaments will appear here</p>
                                    </div>
                                </div>
                            ) : (
                                tournaments.map(tournament => <TournamentCard key={tournament._id} {...tournament} />)
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganiserCompletedTournaments;