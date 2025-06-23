import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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

    const TournamentCard = ({ name, teams, createdAt }) => (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 w-80 flex-shrink-0">
            <div className="mb-3 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                {new Date(createdAt).toLocaleDateString()}
            </div>
            <h3 className="text-xl font-bold text-gray-800 truncate">{name}</h3>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>{teams?.length || 0} Teams</span>
            </div>
        </div>
    );

    const MatchCard = ({ name, tournament, date }) => (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 w-80 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-800 truncate">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">{tournament}</p>
            <p className="text-sm font-semibold text-indigo-700 mt-4">{new Date(date).toLocaleString()}</p>
        </div>
    );

    const Carousel = ({ title, children }) => (
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
            <div className="flex space-x-6 overflow-x-auto pb-6">
                {children}
            </div>
        </div>
    );

    return (
        <>
            <div className="container mx-auto p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Organiser Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your tournaments and matches.</p>
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="/organiser/create-tournament">
                            <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <PlusIcon />
                                Create Tournament
                            </button>
                        </Link>
                        <Link to="/organiser/create-match">
                            <button className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <PlusIcon />
                                Create Match
                            </button>
                        </Link>
                    </div>
                </header>
                {loading ? (
                    <div className="text-center py-12 text-lg text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600 font-semibold">{error}</div>
                ) : (
                    <>
                        <Carousel title="Tournaments">
                            {tournaments.length === 0 ? <div className="text-gray-400">No tournaments found.</div> : tournaments.map(t => <TournamentCard key={t._id} {...t} />)}
                        </Carousel>
                        <Carousel title="Matches">
                            {matches.length === 0 ? <div className="text-gray-400">No matches found.</div> : matches.map(m => <MatchCard key={m._id} {...m} />)}
                        </Carousel>
                    </>
                )}
            </div>
        </>
    );
};

export default OrganiserHomepage;
