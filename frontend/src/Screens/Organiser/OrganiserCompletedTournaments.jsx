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
  FiUsers,
  FiMapPin,
  FiDownload,
  FiEye,
  FiTrash2,
  FiSearch,
  FiChevronRight
} = Icons;

const CalendarIcon = () => (
    <FiCalendar className="h-4 w-4 mr-2" />
);

const TrophyIcon = () => (
    <FiAward className="h-4 w-4 mr-2" />
);

const TeamIcon = () => (
    <FiUsers className="h-4 w-4 mr-2" />
);

const LocationIcon = () => (
    <FiMapPin className="h-4 w-4 mr-2" />
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
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out p-4 border border-indigo-200 hover:border-indigo-300">
            <div className="flex items-center mb-2">
                <TrophyIcon />
                <Badge className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {type}
                </Badge>
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
        </Card>
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
                        <LoadingSpinner className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></LoadingSpinner>
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
                                    <EmptyState className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
                                        <TrophyIcon />
                                        <p className="text-gray-500 text-sm">No completed tournaments yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Completed tournaments will appear here</p>
                                    </EmptyState>
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