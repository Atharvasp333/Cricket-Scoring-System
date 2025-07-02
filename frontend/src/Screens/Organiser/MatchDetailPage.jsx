import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const MatchDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/matches/${id}`);
                setMatch(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching match:', err);
                setError('Failed to load match details. Please try again later.');
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]);

    const handleEditMatch = () => {
        // Navigate to edit match page or implement inline editing
        // This is a placeholder for future functionality
        console.log('Edit match clicked');
    };

    const handleDeleteMatch = async () => {
        if (window.confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
            try {
                await api.delete(`/api/matches/${id}`);
                navigate('/organiser-homepage');
            } catch (err) {
                console.error('Error deleting match:', err);
                setError('Failed to delete match. Please try again later.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900">Loading match details...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-red-600">{error}</h2>
                        <button
                            onClick={() => navigate('/organiser-homepage')}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900">Match not found</h2>
                        <button
                            onClick={() => navigate('/organiser-homepage')}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/organiser-homepage')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        &larr; Back to Dashboard
                    </button>
                </div>

                {/* Match header */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{match.match_name}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{match.match_type}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleEditMatch}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Edit Match
                            </button>
                            <button
                                onClick={handleDeleteMatch}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete Match
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                                <dd className="mt-1 text-sm text-gray-900">{new Date(match.date).toLocaleDateString()} {match.time}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Venue</dt>
                                <dd className="mt-1 text-sm text-gray-900">{match.venue}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        match.status === 'Live' ? 'bg-green-100 text-green-800' : 
                                        match.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {match.status}
                                    </span>
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Total Overs</dt>
                                <dd className="mt-1 text-sm text-gray-900">{match.total_overs}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Teams section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Teams</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            {/* Team 1 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex flex-col mb-3">
                                    <h4 className="text-md font-medium text-gray-900">{match.team1_name}</h4>
                                    {match.team1_players && match.team1_players.find(player => player.isCaptain) ? (
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm text-gray-600">Captain: </span>
                                            <span className="ml-1 text-sm font-medium text-gray-900">
                                                {match.team1_players.find(player => player.isCaptain)?.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-600 mt-1">No captain assigned</span>
                                    )}
                                </div>
                                <div className="mb-2 pb-2 border-b border-gray-200">
                                    <h5 className="text-sm font-medium text-gray-700">Players</h5>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {match.team1_players && match.team1_players.map((player, index) => (
                                        <li key={index} className="py-2 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{player.name}</span>
                                                {player.isCaptain && (
                                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">C</span>
                                                )}
                                                {player.isWicketKeeper && (
                                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">WK</span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">{player.role}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Team 2 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex flex-col mb-3">
                                    <h4 className="text-md font-medium text-gray-900">{match.team2_name}</h4>
                                    {match.team2_players && match.team2_players.find(player => player.isCaptain) ? (
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm text-gray-600">Captain: </span>
                                            <span className="ml-1 text-sm font-medium text-gray-900">
                                                {match.team2_players.find(player => player.isCaptain)?.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-600 mt-1">No captain assigned</span>
                                    )}
                                </div>
                                <div className="mb-2 pb-2 border-b border-gray-200">
                                    <h5 className="text-sm font-medium text-gray-700">Players</h5>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {match.team2_players && match.team2_players.map((player, index) => (
                                        <li key={index} className="py-2 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{player.name}</span>
                                                {player.isCaptain && (
                                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">C</span>
                                                )}
                                                {player.isWicketKeeper && (
                                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">WK</span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">{player.role}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Rules */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Match Rules</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Powerplay Overs</dt>
                                <dd className="mt-1 text-sm text-gray-900">{match.powerplay_overs}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">DRS Enabled</dt>
                                <dd className="mt-1 text-sm text-gray-900">{match.drs_enabled ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Scorers */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Scorers</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <ul className="divide-y divide-gray-200">
                            {match.scorers && match.scorers.map((scorer, index) => (
                                <li key={index} className="py-3">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
                                                <span className="text-xs font-medium leading-none text-white">
                                                    {typeof scorer === 'string' ? scorer.charAt(0) : (scorer.email ? scorer.email.charAt(0) : 'S')}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {typeof scorer === 'string' ? 'Scorer' : (scorer.name || 'Unnamed Scorer')}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {typeof scorer === 'string' ? scorer : (scorer.email || 'No email provided')}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {(!match.scorers || match.scorers.length === 0) && (
                                <li className="py-3 text-sm text-gray-500">No scorers assigned</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailPage;