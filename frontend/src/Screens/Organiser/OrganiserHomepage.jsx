import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

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

const OrganiserHomepage = () => {
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const tRes = await fetch('/api/tournaments');
                const mRes = await fetch('/api/matches');
                if (!tRes.ok || !mRes.ok) throw new Error('Failed to fetch data');
                const tournaments = await tRes.json();
                const matches = await mRes.json();
                setTournaments(tournaments);
                setMatches(matches);
            } catch (err) {
                setError('Failed to load tournaments or matches.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const MatchCard = ({ _id, match_name, match_type, date }) => (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out p-4 border border-blue-200 hover:border-blue-300">
            <div className="flex items-center mb-2">
                <CalendarIcon />
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {new Date(date).toLocaleDateString()}
                </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{match_name}</h3>
            <p className="text-xs text-gray-600 mb-2">{match_type}</p>
            <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-indigo-700">
                    {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <Link 
                    to={`/organiser/match/${_id}`} 
                    className="px-3 py-1 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );

    const TournamentCard = ({ _id, name, teams, createdAt }) => (
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out p-4 border border-emerald-200 hover:border-emerald-300">
            <div className="flex items-center mb-2">
                <TrophyIcon />
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {new Date(createdAt).toLocaleDateString()}
                </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{name}</h3>
            <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600">
                    <span className="font-semibold text-emerald-700">{teams?.length || 0}</span> Teams
                </div>
                <Link 
                    to={`/organiser/tournament/${_id}`} 
                    className="px-3 py-1 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                    Manage
                </Link>
            </div>
        </div>
    );

    const Section = ({ title, children, icon }) => (
        <div className="mb-8">
            <div className="flex items-center mb-4">
                {icon}
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {children}
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
                                Organiser Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm">Manage your tournaments and matches</p>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <Link to="/organiser/create-tournament">
                                <button className="flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                    <PlusIcon />
                                    Create Tournament
                                </button>
                            </Link>
                            <Link to="/organiser/create-match">
                                <button className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                    <PlusIcon />
                                    Create Match
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading your dashboard...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-red-600 font-medium text-sm">{error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Scheduled Matches Section */}
                        <Section 
                            title="Scheduled Matches" 
                            icon={<CalendarIcon />}
                        >
                            {matches.length === 0 ? (
                                <div className="col-span-full">
                                    <div className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
                                        <CalendarIcon />
                                        <p className="text-gray-500 text-sm">No matches scheduled yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Create your first match to get started</p>
                                    </div>
                                </div>
                            ) : (
                                matches.map(match => <MatchCard key={match._id} {...match} />)
                            )}
                        </Section>

                        {/* Created Tournaments Section */}
                        <Section 
                            title="Your Tournaments" 
                            icon={<TrophyIcon />}
                        >
                            {tournaments.length === 0 ? (
                                <div className="col-span-full">
                                    <div className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
                                        <TrophyIcon />
                                        <p className="text-gray-500 text-sm">No tournaments created yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Create your first tournament to get started</p>
                                    </div>
                                </div>
                            ) : (
                                tournaments.map(tournament => <TournamentCard key={tournament._id} {...tournament} />)
                            )}
                        </Section>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrganiserHomepage;