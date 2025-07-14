import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Components, Icons } from '../../exports';

const {
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState
} = Components;

const {
  FiCalendar,
  FiAward,
  FiClock,
  FiDownload,
  FiEye,
  FiTrash2,
  FiSearch
} = Icons;

const OrganiserCompletedMatches = () => {

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('/api/matches/completed');
                if (!response.ok) throw new Error('Failed to fetch completed matches');
                const data = await response.json();
                setMatches(data);
            } catch (err) {
                setError('Failed to load completed matches.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const MatchCard = ({ _id, name, tournament, date, teams, winner, score }) => (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out p-4 border border-blue-200 hover:border-blue-300">
            <div className="flex items-center mb-2">
                <FiCalendar className="h-4 w-4 mr-2" />
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {new Date(date).toLocaleDateString()}
                </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
            <p className="text-xs text-gray-600 mb-2">{tournament}</p>
            
            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{teams[0]?.name}</span>
                    <span className="font-semibold text-gray-800">{score?.team1 || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-700">{teams[1]?.name}</span>
                    <span className="font-semibold text-gray-800">{score?.team2 || 0}</span>
                </div>
            </div>
            
            {winner && (
                <div className="flex items-center justify-between bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg px-3 py-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-800">Winner</span>
                    <span className="text-xs font-bold text-emerald-900">{winner.name}</span>
                </div>
            )}
            
            <div className="flex justify-end">
                <Link 
                    to={`/organiser/match/${_id}`} 
                    className="px-3 py-1 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto p-6">
                {/* Header Section */}
                <header className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Completed Matches
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm">Review past matches and their results</p>
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
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading completed matches...</p>
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
                            <FiAward className="h-4 w-4 mr-2" />
                            <h2 className="text-xl font-bold text-gray-800">Match History</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {matches.length === 0 ? (
                                <div className="col-span-full">
                                    <div className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
                                        <FiAward className="h-4 w-4 mr-2" />
                                        <p className="text-gray-500 text-sm">No completed matches yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Completed matches will appear here</p>
                                    </div>
                                </div>
                            ) : (
                                matches.map(match => <MatchCard key={match._id} {...match} />)
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganiserCompletedMatches;
