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
  FiCheckCircle,
  FiSun,
  FiMoon
} = Icons;

const OrganiserHomepage = ({ isSidebarOpen = false }) => {
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for dark mode from document class
    useEffect(() => {
        const checkDarkMode = () => {
            setDarkMode(document.documentElement.classList.contains('dark'));
        };
        
        checkDarkMode();
        
        // Listen for theme changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        return () => observer.disconnect();
    }, []);

    // Toggle dark mode function
    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setDarkMode(!darkMode);
    };

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        }
    }, []);

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
    }, [location.state]);

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${
                darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-white text-gray-900'
            }`}>
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`container mx-auto p-4 min-h-screen ${
                darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-white text-gray-900'
            }`}>
                <ErrorAlert message={error} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-200 ${
            darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-50 text-gray-900'
        } ${isSidebarOpen ? 'md:ml-64' : ''}`}>
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
            )}
            
            <div className={`container mx-auto p-4 transition-all duration-300 ${
                isSidebarOpen ? 'md:ml-0' : ''
            }`}>
                {/* Header Section - Responsive */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <h1 className={`text-xl sm:text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Organiser Dashboard
                    </h1>
                    
                    {/* Button Container - Responsive */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                        {/* Dark Mode Toggle Button - Hidden on mobile, shown on desktop */}
                        {/* <button
                            onClick={toggleDarkMode}
                            className={`hidden sm:flex p-2 rounded-md transition-colors items-center justify-center ${
                                darkMode 
                                    ? 'bg-[#2A2A2A] text-[#A8FD24] hover:bg-[#3A3A3A]' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button> */}
                        
                        {/* Action Buttons */}
                        <Button 
                            onClick={() => navigate('/organiser/tournaments/create')}
                            className={`flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors w-full sm:w-auto ${
                                darkMode 
                                    ? 'bg-[#A8FD24] text-[#1E1E1E] hover:bg-[#D6F917]' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            <FiPlus className="mr-1 flex-shrink-0" />
                            <span className="whitespace-nowrap">New Tournament</span>
                        </Button>
                        
                        <Button 
                            onClick={() => navigate('/organiser/matches/create')}
                            className={`flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors w-full sm:w-auto ${
                                darkMode 
                                    ? 'bg-transparent border border-[#B3AC9B] text-white hover:bg-[#B3AC9B]/10' 
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            <FiPlus className="mr-1 flex-shrink-0" />
                            <span className="whitespace-nowrap">New Match</span>
                        </Button>
                    </div>
                </div>

                {/* Upcoming Matches Section */}
                <section className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <h2 className={`text-lg sm:text-xl font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Upcoming Matches
                        </h2>
                        <Link 
                            to="/organiser/completed-matches" 
                            className={`text-sm flex items-center transition-colors self-start sm:self-auto ${
                                darkMode 
                                    ? 'text-[#A8FD24] hover:text-[#D6F917]' 
                                    : 'text-indigo-600 hover:text-indigo-800'
                            }`}
                        >
                            View All <FiChevronRight className="ml-1" />
                        </Link>
                    </div>
                    
                    {matches.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matches.slice(0, 3).map((match) => (
                                <div 
                                    key={match._id} 
                                    className={`p-4 rounded-lg transition-all duration-200 hover:shadow-lg ${
                                        darkMode 
                                            ? 'bg-[#2A2A2A] border border-[#B3AC9B]/20 hover:border-[#B3AC9B]/40' 
                                            : 'bg-white border border-gray-200 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-semibold truncate ${
                                                darkMode ? 'text-white' : 'text-gray-900'
                                            }`} title={`${match.team1_name} vs ${match.team2_name}`}>
                                                {match.team1_name} vs {match.team2_name}
                                            </h3>
                                            <div className={`flex items-center text-sm mt-1 ${
                                                darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'
                                            }`}>
                                                <FiCalendar className="mr-1 flex-shrink-0" />
                                                <span className="truncate">
                                                    {new Date(match.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className={`flex items-center text-sm ${
                                                darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'
                                            }`}>
                                                <FiAward className="mr-1 flex-shrink-0" />
                                                <span className="truncate">
                                                    {match.match_type || 'Friendly Match'}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/organiser/matches/${match._id}`)}
                                            className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                                                darkMode 
                                                    ? 'border border-[#B3AC9B] text-white hover:bg-[#B3AC9B]/10' 
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-8 rounded-lg ${
                            darkMode ? 'bg-[#2A2A2A]' : 'bg-gray-50'
                        }`}>
                            <p className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}>
                                No upcoming matches found.
                            </p>
                            <button 
                                onClick={() => navigate('/organiser/matches/create')}
                                className={`mt-2 text-sm font-medium transition-colors ${
                                    darkMode 
                                        ? 'text-[#A8FD24] hover:text-[#D6F917]' 
                                        : 'text-indigo-600 hover:text-indigo-800'
                                }`}
                            >
                                Create your first match
                            </button>
                        </div>
                    )}
                </section>

                {/* Tournaments Section */}
                <section>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <h2 className={`text-lg sm:text-xl font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Your Tournaments
                        </h2>
                        <Link 
                            to="/organiser/completed-tournaments" 
                            className={`text-sm flex items-center transition-colors self-start sm:self-auto ${
                                darkMode 
                                    ? 'text-[#A8FD24] hover:text-[#D6F917]' 
                                    : 'text-indigo-600 hover:text-indigo-800'
                            }`}
                        >
                            View All <FiChevronRight className="ml-1" />
                        </Link>
                    </div>
                    
                    {tournaments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tournaments.slice(0, 3).map((tournament) => (
                                <div 
                                    key={tournament._id} 
                                    className={`p-4 rounded-lg transition-all duration-200 hover:shadow-lg ${
                                        darkMode 
                                            ? 'bg-[#2A2A2A] border border-[#B3AC9B]/20 hover:border-[#B3AC9B]/40' 
                                            : 'bg-white border border-gray-200 hover:shadow-md'
                                    }`}
                                >
                                    <h3 className={`font-semibold truncate ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`} title={tournament.name}>
                                        {tournament.name}
                                    </h3>
                                    <div className={`text-sm mt-1 space-y-1 ${
                                        darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'
                                    }`}>
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                                {new Date(tournament.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiUser className="mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                                {Array.isArray(tournament.teams) ? tournament.teams.length : 
                                                 (typeof tournament.teams === 'number' ? tournament.teams : 0)} teams
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <span className={`text-sm px-2 py-1 rounded-full whitespace-nowrap ${
                                            darkMode 
                                                ? 'bg-[#A8FD24]/20 text-[#A8FD24]' 
                                                : 'bg-indigo-100 text-indigo-800'
                                        }`}>
                                            {tournament.status || 'Upcoming'}
                                        </span>
                                        <button 
                                            onClick={() => navigate(`/organiser/tournament/${tournament._id}`)}
                                            className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap w-full sm:w-auto ${
                                                darkMode 
                                                    ? 'border border-[#B3AC9B] text-white hover:bg-[#B3AC9B]/10' 
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-8 rounded-lg ${
                            darkMode ? 'bg-[#2A2A2A]' : 'bg-gray-50'
                        }`}>
                            <p className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}>
                                No tournaments found.
                            </p>
                            <button 
                                onClick={() => navigate('/organiser/tournaments/create')}
                                className={`mt-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    darkMode 
                                        ? 'text-[#A8FD24] hover:text-[#D6F917]' 
                                        : 'text-indigo-600 hover:text-indigo-800'
                                }`}
                            >
                                Create your first tournament
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default OrganiserHomepage;