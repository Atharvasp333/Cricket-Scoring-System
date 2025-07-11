import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, UserPlus, X } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const PlayerHome = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { currentUser } = useAuth();
  
  // State for search and data
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [playerStats, setPlayerStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [isCaptain, setIsCaptain] = useState(false);
  
  // State for registration
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationType, setRegistrationType] = useState(null); // 'tournament' or 'match'
  const [registrationItem, setRegistrationItem] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    playerName: '',
    role: '',
    team: '',
    isCaptain: false,
    isWicketKeeper: false
  });
  const [registrationStatus, setRegistrationStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  const [userRegistrations, setUserRegistrations] = useState([]);

  // Helper functions for data normalization
  const normalizeMatch = (match) => ({
    ...match,
    date: new Date(match.date).toLocaleDateString(),
    team1_name: match.team1_name || 'Team 1', // Ensure team1_name is available
    team2_name: match.team2_name || 'Team 2', // Ensure team2_name is available
    team1: {
      ...match.team1,
      score: match.team1Score ? `${match.team1Score}/${match.team1Wickets}` : '-',
      overs: match.team1Overs ? `${match.team1Overs}` : '-',
    },
    team2: {
      ...match.team2,
      score: match.team2Score ? `${match.team2Score}/${match.team2Wickets}` : '-',
      overs: match.team2Overs ? `${match.team2Overs}` : '-',
    },
  });

  const normalizeTournament = (tournament) => ({
    ...tournament,
    startDate: new Date(tournament.startDate).toLocaleDateString(),
    endDate: new Date(tournament.endDate).toLocaleDateString(),
    teams: Array.isArray(tournament.teams) ? tournament.teams.length : 
           (typeof tournament.teams === 'number' ? tournament.teams : 0),
    matches: Array.isArray(tournament.matches) ? tournament.matches.length : 
             (typeof tournament.matches === 'number' ? tournament.matches : 0),
  });

  // State to store the MongoDB user ID
  const [mongoUserId, setMongoUserId] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch matches
        const matchesResponse = await api.get('/api/matches');
        const matchesData = matchesResponse.data.map(normalizeMatch);
        setMatches(matchesData);
        
        // Fetch tournaments
        const tournamentsResponse = await api.get('/api/tournaments');
        const tournamentsData = tournamentsResponse.data.map(normalizeTournament);
        setTournaments(tournamentsData);
        
        // Check if user is a captain of any team
        if (currentUser && currentUser.uid) {
          // Check tournaments
          const isTournamentCaptain = tournamentsData.some(tournament => 
            tournament.teams && tournament.teams.some(team => 
              team.captains && team.captains.includes(currentUser.uid)
            )
          );
          
          // Check matches
          const isMatchCaptain = matchesData.some(match => 
            (match.team1_captains && match.team1_captains.includes(currentUser.uid)) || 
            (match.team2_captains && match.team2_captains.includes(currentUser.uid))
          );
          
          setIsCaptain(isTournamentCaptain || isMatchCaptain);
        }
        
        // Fetch user data and player stats
        setLoadingStats(true);
        if (currentUser && currentUser.uid) {
          try {
            // Get the MongoDB user document using Firebase UID
            const userResponse = await api.get(`/api/users/${currentUser.uid}`);
            if (userResponse.data && userResponse.data._id) {
              // Store the MongoDB user ID for later use
              setMongoUserId(userResponse.data._id);
              
              // Fetch player stats
              const statsResponse = await api.get(`/api/pstats/player/${userResponse.data._id}`);
              setPlayerStats(statsResponse.data);
              setStatsError(null);
              
              // Fetch user's registrations
              const registrationsResponse = await api.get(`/api/registrations/user/${userResponse.data._id}`);
              setUserRegistrations(registrationsResponse.data);
            }
          } catch (err) {
            console.error('Error fetching player stats:', err);
            setStatsError('Could not load your player statistics. Please try again later.');
          }
        }
        setLoadingStats(false);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  // Socket.io for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('matchUpdated', (updatedMatch) => {
      setMatches((prev) => {
        const filtered = prev.filter((m) => m._id !== updatedMatch._id);
        return [...filtered, normalizeMatch(updatedMatch)];
      });
    });
    socket.on('matchAdded', (newMatch) => {
      setMatches((prev) => [...prev, normalizeMatch(newMatch)]);
    });
    socket.on('matchRemoved', (id) => {
      setMatches((prev) => prev.filter((m) => m._id !== id));
    });
    socket.on('tournamentUpdated', (updatedTournament) => {
      setTournaments((prev) => {
        const filtered = prev.filter((t) => t._id !== updatedTournament._id);
        return [...filtered, normalizeTournament(updatedTournament)];
      });
    });
    socket.on('tournamentAdded', (newTournament) => {
      setTournaments((prev) => [...prev, normalizeTournament(newTournament)]);
    });
    socket.on('tournamentRemoved', (id) => {
      setTournaments((prev) => prev.filter((t) => t._id !== id));
    });
    socket.on('registrationAdded', (newRegistration) => {
      if (newRegistration.userId === currentUser?._id) {
        setUserRegistrations(prev => [...prev, newRegistration]);
      }
    });
    socket.on('registrationUpdated', (updatedRegistration) => {
      if (updatedRegistration.userId === currentUser?._id) {
        setUserRegistrations(prev => {
          const filtered = prev.filter(r => r._id !== updatedRegistration._id);
          return [...filtered, updatedRegistration];
        });
      }
    });
    socket.on('registrationRemoved', (id) => {
      setUserRegistrations(prev => prev.filter(r => r._id !== id));
    });
    return () => {
      socket.off('matchUpdated');
      socket.off('matchAdded');
      socket.off('matchRemoved');
      socket.off('tournamentUpdated');
      socket.off('tournamentAdded');
      socket.off('tournamentRemoved');
      socket.off('registrationAdded');
      socket.off('registrationUpdated');
      socket.off('registrationRemoved');
    };
  }, [socket, currentUser]);

  // --- ORGANIZE BY STATUS ---
  const organizeMatches = (status) =>
    matches.filter((m) => {
      if (status === 'Live') return m.status === 'Live';
      if (status === 'Upcoming') return m.status === 'Upcoming';
      if (status === 'Completed') return m.status === 'Completed' || m.status === 'Concluded';
      return false;
    });
  const organizeTournaments = (status) =>
    tournaments.filter((t) => {
      if (status === 'Live') return t.status === 'Live';
      if (status === 'Upcoming') return t.status === 'Upcoming';
      if (status === 'Completed') return t.status === 'Completed' || t.status === 'Concluded';
      return false;
    });

  // Fetch cricket news from GNews API
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      setNewsError(null);
      try {
        const response = await fetch('https://gnews.io/api/v4/search?q=cricket&apikey=9914b00bb34f7028b046b8586de86393');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNewsData(data.articles || []);
      } catch (err) {
        setNewsError('Could not load news. Please try again later.');
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-[#16638A] to-[#0F4C75] text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">Player Dashboard</h1>
          {isCaptain && (
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => navigate('/captain-approval')} 
                className="bg-[#74D341] hover:bg-[#5FB535] text-white font-medium py-2 px-6 rounded-lg shadow-md transition-colors duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                Captain Approval Dashboard
              </button>
            </div>
          )}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search for matches, teams, or players..."
              className="w-full py-3 px-5 pr-12 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#74D341] shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-gray-200 p-1 absolute right-4 top-1/2 transform -translate-y-1/2">
              <Search className="text-gray-600" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Registration Status Section */}
      <section className="py-8 px-4 bg-white border-b-2 border-gray-100">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#16638A]">My Registrations</h2>
          </div>
          
          {userRegistrations.length === 0 ? (
            <div className="text-center text-gray-500 font-medium py-8">
              You haven't registered for any matches or tournaments yet.
              Look for the <UserPlus size={16} className="inline mx-1" /> icon to register!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead className="bg-gray-50 rounded-t-xl">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userRegistrations.map((registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.registrationType === 'tournament' ? registration.tournamentName : registration.matchName}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {registration.registrationType === 'tournament' ? 'Tournament' : 'Match'}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.role}</div>
                        <div className="text-xs text-gray-500">
                          {registration.isCaptain && 'Captain'}
                          {registration.isCaptain && registration.isWicketKeeper && ' & '}
                          {registration.isWicketKeeper && 'Wicket-Keeper'}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{registration.team || '-'}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${registration.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            registration.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.registrationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      
      {/* Player Stats Section */}
      <section className="py-8 px-4 bg-gray-50 border-b-2 border-gray-100">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#16638A]">My Statistics</h2>
            <button 
              className="bg-gray-200 px-2 flex items-center text-[#16638A] hover:text-[#0F4C75] font-medium"
              onClick={() => navigate('/player-stats')}
            >
              View Detailed Stats <ChevronRight className="ml-1" size={16} />
            </button>
          </div>
          
          {loadingStats ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16638A]"></div>
              <span className="ml-4 text-[#16638A] font-medium">Loading your statistics...</span>
            </div>
          ) : statsError ? (
            <div className="text-center text-red-600 font-semibold py-8">{statsError}</div>
          ) : !playerStats ? (
            <div className="text-center text-gray-500 font-medium py-8">No statistics available yet. Play some matches to see your stats!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Batting</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Matches</span>
                    <span className="font-bold text-gray-900">{playerStats.batting?.matches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Runs</span>
                    <span className="font-bold text-gray-900">{playerStats.batting?.runs || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average</span>
                    <span className="font-bold text-gray-900">{playerStats.batting?.average?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Strike Rate</span>
                    <span className="font-bold text-gray-900">{playerStats.batting?.strikeRate?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Highest Score</span>
                    <span className="font-bold text-gray-900">{playerStats.batting?.highestScore || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bowling</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Matches</span>
                    <span className="font-bold text-gray-900">{playerStats.bowling?.matches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wickets</span>
                    <span className="font-bold text-gray-900">{playerStats.bowling?.wickets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Economy</span>
                    <span className="font-bold text-gray-900">{playerStats.bowling?.economy?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average</span>
                    <span className="font-bold text-gray-900">{playerStats.bowling?.average?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Figures</span>
                    <span className="font-bold text-gray-900">{playerStats.bowling?.bestFigures || '0/0'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Matches</span>
                    <span className="font-bold text-gray-900">{playerStats.totalMatches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Man of the Match</span>
                    <span className="font-bold text-gray-900">{playerStats.manOfTheMatch || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Catches</span>
                    <span className="font-bold text-gray-900">{playerStats.fielding?.catches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Run Outs</span>
                    <span className="font-bold text-gray-900">{playerStats.fielding?.runOuts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tournaments</span>
                    <span className="font-bold text-gray-900">{playerStats.tournaments?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="py-8 px-4 bg-gray-50 border-b-2 border-gray-100">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#16638A]">My Upcoming Matches</h2>
            <button className="bg-gray-200 px-2 flex items-center text-[#16638A] hover:text-[#0F4C75] font-medium">
              View All <ChevronRight className="ml-1" size={16} />
            </button>
          </div>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {organizeMatches('Upcoming').length === 0 ? (
              <div className="text-gray-500 py-4">No upcoming matches scheduled for you</div>
            ) : (
              organizeMatches('Upcoming').map((match) => (
                <div
                  key={match._id}
                  className="min-w-[320px] bg-blue-50 rounded-xl shadow-lg p-5 border border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative"
                  onClick={() => navigate(`/match-details/${match._id}`)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">UPCOMING</span>
                    <span className="text-sm text-gray-600 font-medium">{match.date}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{match.team1?.logo || "🏏"}</span>
                        <span className="font-semibold text-gray-800">{match.team1?.name || "Team 1"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{match.team2?.logo || "🏏"}</span>
                        <span className="font-semibold text-gray-800">{match.team2?.name || "Team 2"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="text-sm text-center text-blue-600 font-semibold mb-2">{match.time || "TBD"}</div>
                    <div className="text-xs text-gray-500 text-center">{match.venue}</div>
                    <button 
                      className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRegistrationModal('match', match);
                      }}
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Matches and Tournaments Section */}
      <section className="py-8 px-4 bg-white border-b-2 border-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Matches */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#16638A] mb-6">Live Matches</h2>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {organizeMatches('Live').length === 0 && <div className="text-gray-500">No live matches</div>}
                {organizeMatches('Live').map((match) => (
                  <div 
                    key={match._id} 
                    className="min-w-[280px] bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/match-details/${match._id}`)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-800">LIVE</span>
                      <span className="text-sm text-gray-600 font-medium">{match.date}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{match.team1?.logo || "🏏"}</span>
                          <span className="font-medium text-gray-800">{match.team1?.name || "Team 1"}</span>
                        </div>
                        {match.team1?.score && (
                          <span className="font-bold text-gray-900">{match.team1?.score}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{match.team2?.logo || "🏏"}</span>
                          <span className="font-medium text-gray-800">{match.team2?.name || "Team 2"}</span>
                        </div>
                        {match.team2?.score && (
                          <span className="font-bold text-gray-900">{match.team2?.score}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="text-sm text-center text-gray-600 font-medium">{match.venue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Live Tournaments */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#16638A] mb-6">Tournaments</h2>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {organizeTournaments('Live').length === 0 && <div className="text-gray-500">No live tournaments</div>}
                {organizeTournaments('Upcoming').length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Upcoming Tournaments</h3>
                    <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                      {organizeTournaments('Upcoming').map((tournament) => (
                        <div 
                          key={tournament._id} 
                          className="min-w-[280px] bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer relative"
                          onClick={() => navigate(`/tournament-details/${tournament._id}`)}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800">UPCOMING</span>
                          </div>
                          <h3 className="font-bold text-lg mb-3 text-gray-900 leading-tight">{tournament.name}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Teams:</span>
                              <span className="font-semibold text-gray-800">{tournament.teams}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Matches:</span>
                              <span className="font-semibold text-gray-800">{tournament.matches}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                              <div>{tournament.startDate} to {tournament.endDate}</div>
                            </div>
                          </div>
                          <button 
                            className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRegistrationModal('tournament', tournament);
                            }}
                          >
                            <UserPlus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {organizeTournaments('Live').map((tournament) => (
                  <div 
                    key={tournament._id} 
                    className="min-w-[280px] bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer relative"
                    onClick={() => navigate(`/tournament-details/${tournament._id}`)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-red-100 text-red-800">LIVE</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900 leading-tight">{tournament.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Teams:</span>
                        <span className="font-semibold text-gray-800">{tournament.teams}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Matches:</span>
                        <span className="font-semibold text-gray-800">{tournament.matches}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                        <div>{tournament.startDate} to {tournament.endDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced News Section */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#16638A]">Cricket News</h2>
            <button className="bg-gray-200 px-2 flex items-center text-[#16638A] hover:text-[#0F4C75] font-medium" onClick={() => navigate('/old-news')}>
              Previous News <ChevronRight className="ml-1" size={16} />
            </button>
          </div>
          {loadingNews ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16638A]"></div>
              <span className="ml-4 text-[#16638A] font-medium">Loading news...</span>
            </div>
          ) : newsError ? (
            <div className="text-center text-red-600 font-semibold py-8">{newsError}</div>
          ) : newsData.length === 0 ? (
            <div className="text-center text-gray-500 font-medium py-8">No news available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newsData.slice(0, 4).map((item, index) => (
                <div
                  key={item.url || item.title}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer fade-in ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                  onClick={() => navigate(`/news/${index}`)}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className={`bg-gradient-to-br from-[#16638A] to-[#0F4C75] flex items-center justify-center text-white ${index === 0 ? 'h-48' : 'h-32'}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="object-cover w-full h-full" style={{ maxHeight: index === 0 ? '12rem' : '8rem' }} />
                    ) : (
                      <span className="text-5xl">📰</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-2 py-1 bg-[#74D341] text-white rounded-full font-medium">
                        {item.source?.name || 'News'}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}</span>
                    </div>
                    <h3 className={`font-bold text-gray-900 mb-3 leading-tight ${index === 0 ? 'text-xl' : 'text-lg'}`}>{item.title}</h3>
                    {item.description && <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{item.description}</p>}
                    <div className="flex justify-end">
                      <span className="text-[#16638A] text-sm font-semibold hover:text-[#0F4C75] transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Register for {registrationType === 'tournament' ? 'Tournament' : 'Match'}
              </h2>
              <button 
                onClick={() => setShowRegistrationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                {registrationType === 'tournament' ? registrationItem?.name : registrationItem?.match_name}
              </h3>
              <p className="text-sm text-gray-600">
                {registrationType === 'tournament' 
                  ? `${registrationItem?.startDate} to ${registrationItem?.endDate}` 
                  : `${registrationItem?.date} at ${registrationItem?.time}`}
              </p>
            </div>
            
            {registrationStatus.success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p>Registration submitted successfully! The organizer will review your request.</p>
                <button 
                  onClick={() => {
                    setShowRegistrationModal(false);
                    setRegistrationStatus({ loading: false, success: false, error: null });
                  }}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegistrationSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Player Name</label>
                    <input 
                      type="text" 
                      value={registrationForm.playerName} 
                      onChange={(e) => setRegistrationForm({...registrationForm, playerName: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Role</label>
                    <select 
                      value={registrationForm.role} 
                      onChange={(e) => setRegistrationForm({...registrationForm, role: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Batsman">Batsman</option>
                      <option value="Bowler">Bowler</option>
                      <option value="All-Rounder">All-Rounder</option>
                      <option value="Wicket-Keeper">Wicket-Keeper</option>
                    </select>
                  </div>
                  
                  {registrationType === 'match' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Team</label>
                      <select 
                        value={registrationForm.team} 
                        onChange={(e) => setRegistrationForm({...registrationForm, team: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Team</option>
                        <option value={registrationItem?.team1_name}>{registrationItem?.team1_name}</option>
                        <option value={registrationItem?.team2_name}>{registrationItem?.team2_name}</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={registrationForm.isCaptain} 
                        onChange={(e) => setRegistrationForm({...registrationForm, isCaptain: e.target.checked})}
                        className="mr-2"
                      />
                      Captain
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={registrationForm.isWicketKeeper} 
                        onChange={(e) => setRegistrationForm({...registrationForm, isWicketKeeper: e.target.checked})}
                        className="mr-2"
                      />
                      Wicket-Keeper
                    </label>
                  </div>
                  
                  {registrationStatus.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      <p>{registrationStatus.error}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowRegistrationModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                      disabled={registrationStatus.loading}
                    >
                      {registrationStatus.loading ? 'Submitting...' : 'Register'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
  // Function to open registration modal
  function openRegistrationModal(type, item) {
    setRegistrationType(type);
    setRegistrationItem(item);
    setRegistrationForm({
      playerName: currentUser?.displayName || '',
      role: '',
      team: '',
      isCaptain: false,
      isWicketKeeper: false
    });
    setShowRegistrationModal(true);
  }
  
  // Function to handle registration form submission
  async function handleRegistrationSubmit(e) {
    e.preventDefault();
    setRegistrationStatus({ loading: true, success: false, error: null });
    
    try {
      // Check if user is already registered
      const isAlreadyRegistered = userRegistrations.some(reg => {
        if (registrationType === 'tournament') {
          return reg.tournamentId === registrationItem._id && reg.status !== 'rejected';
        } else {
          return reg.matchId === registrationItem._id && reg.status !== 'rejected';
        }
      });
      
      if (isAlreadyRegistered) {
        throw new Error('You have already registered for this event');
      }
      
      // Check if we have the MongoDB user ID
      if (!mongoUserId) {
        throw new Error('User ID not available. Please refresh the page and try again.');
      }
      
      const payload = {
        userId: mongoUserId,
        playerName: registrationForm.playerName,
        role: registrationForm.role,
        registrationType,
        team: registrationForm.team,
        isCaptain: registrationForm.isCaptain,
        isWicketKeeper: registrationForm.isWicketKeeper,
      };
      
      if (registrationType === 'tournament') {
        payload.tournamentId = registrationItem._id;
      } else {
        payload.matchId = registrationItem._id;
      }
      
      const response = await api.post('/api/registrations', payload);
      setUserRegistrations(prev => [...prev, response.data]);
      setRegistrationStatus({ loading: false, success: true, error: null });
    } catch (err) {
      console.error('Registration error:', err);
      setRegistrationStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.error || err.message || 'Failed to register. Please try again.'
      });
    }
  }
};

export default PlayerHome;