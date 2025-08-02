import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const MatchCard = ({ match, onManage }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
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
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span className="mr-2">Status:</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">{match.status || 'Upcoming'}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onManage}
      >
        Manage
      </Button>
    </div>
  </Card>
);

const TournamentCard = ({ tournament, onManage }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{tournament.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <FiCalendar className="mr-1" />
          {new Date(tournament.startDate || tournament.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiUser className="mr-1" />
          {Array.isArray(tournament.teams) ? tournament.teams.length : (typeof tournament.teams === 'number' ? tournament.teams : 0)} Teams
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span className="mr-2">Type:</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">{tournament.type || 'T20'}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span className="mr-2">Status:</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">{tournament.status || 'Upcoming'}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onManage}
      >
        Manage
      </Button>
    </div>
  </Card>
);

const OrganiserHomepage = () => {
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [tournamentsResponse, matchesResponse] = await Promise.all([
                api.get('/api/tournaments'),
                api.get('/api/matches')
            ]);
            setTournaments(tournamentsResponse.data);
            setMatches(matchesResponse.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load data. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    // Refresh if redirected from create pages
    }, [location.state]);

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
                        to="/organiser/completed-matches" 
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                        View All <FiChevronRight className="ml-1" />
                    </Link>
                </div>
                
                {matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.slice(0, 3).map((match) => (
                          <MatchCard key={match._id} match={match} onManage={() => navigate(`/organiser/matches/${match._id}`)} />
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
                        to="/organiser/completed-tournaments" 
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                        View All <FiChevronRight className="ml-1" />
                    </Link>
                </div>
                
                {tournaments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tournaments.slice(0, 3).map((tournament) => (
                          <TournamentCard key={tournament._id} tournament={tournament} onManage={() => navigate(`/organiser/tournament/${tournament._id}`)} />
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