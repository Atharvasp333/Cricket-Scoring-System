import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Components, Icons } from '../../exports';
import api from '../../utils/api';

const { 
  Button, 
  Card, 
  LoadingSpinner, 
  ErrorAlert, 
  SuccessAlert 
} = Components;

const { 
  FiPlus, 
  FiUser, 
  FiCalendar, 
  FiAward, 
  FiChevronRight,
  FiAlertCircle,
  FiCheckCircle
} = Icons;

const OrganiserHomepage = () => {
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const [tournamentsResponse, matchesResponse] = await Promise.all([
                    api.get('/api/tournaments'),
                    api.get('/api/matches')
                ]);
                
                const tournamentsData = tournamentsResponse.data;
                const matchesData = matchesResponse.data;
                
                setTournaments(tournamentsData);
                setMatches(matchesData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <ErrorAlert message={error} />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Organiser Dashboard</h1>
                <div className="space-x-2">
                    <Button 
                        onClick={() => navigate('/organiser/tournaments/create')}
                        variant="primary"
                        className="flex items-center"
                    >
                        <FiPlus className="mr-1" />
                        New Tournament
                    </Button>
                    <Button 
                        onClick={() => navigate('/organiser/matches/create')}
                        variant="secondary"
                        className="flex items-center ml-2"
                    >
                        <FiPlus className="mr-1" />
                        New Match
                    </Button>
                </div>
            </div>

            {/* Upcoming Matches */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Upcoming Matches</h2>
                    <Link 
                        to="/organiser/matches" 
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                        View All <FiChevronRight className="ml-1" />
                    </Link>
                </div>
                
                {matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.slice(0, 3).map((match) => (
                            <Card key={match._id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{match.team1_name} vs {match.team2_name}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <FiCalendar className="mr-1" />
                                            {new Date(match.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FiAward className="mr-1" />
                                            {match.match_type || 'Friendly Match'}
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => navigate(`/organiser/matches/${match._id}`)}
                                    >
                                        Manage
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No upcoming matches found.</p>
                        <Button 
                            onClick={() => navigate('/organiser/matches/create')}
                            variant="link"
                            className="mt-2"
                        >
                            Create your first match
                        </Button>
                    </div>
                )}
            </section>

            {/* Tournaments */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Tournaments</h2>
                    <Link 
                        to="/organiser/tournaments" 
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                        View All <FiChevronRight className="ml-1" />
                    </Link>
                </div>
                
                {tournaments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tournaments.slice(0, 3).map((tournament) => (
                            <Card key={tournament._id} className="p-4 hover:shadow-md transition-shadow">
                                <h3 className="font-semibold">{tournament.name}</h3>
                                <div className="text-sm text-gray-600 mt-1">
                                    <div className="flex items-center">
                                        <FiCalendar className="mr-1" />
                                        {new Date(tournament.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <FiUser className="mr-1" />
                                        {Array.isArray(tournament.teams) ? tournament.teams.length : 
                                         (typeof tournament.teams === 'number' ? tournament.teams : 0)}
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-between items-center">
                                    <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                        {tournament.status || 'Upcoming'}
                                    </span>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => navigate(`/organiser/tournaments/${tournament._id}`)}
                                    >
                                        View
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No tournaments found.</p>
                        <Button 
                            onClick={() => navigate('/organiser/tournaments/create')}
                            variant="link"
                            className="mt-2"
                        >
                            Create your first tournament
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrganiserHomepage;