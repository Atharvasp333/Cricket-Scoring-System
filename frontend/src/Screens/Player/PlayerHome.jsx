import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { Components, Icons } from '../../exports';

const { 
  Card, 
  Button, 
  Input, 
  Badge, 
  Modal, 
  LoadingSpinner 
} = Components;

const { 
  FiSearch, 
  FiUserPlus, 
  FiX, 
  FiChevronRight,
  FiCalendar,
  FiAward,
  FiClock,
  FiBarChart2,
  FiUserCheck
} = Icons;

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

  // State for captain notifications
  const [captainMatches, setCaptainMatches] = useState([]);
  const [captainTournaments, setCaptainTournaments] = useState([]);
  const [loadingCaptain, setLoadingCaptain] = useState(true);

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
        // Fetch matches - use the available endpoint for players
        const matchesResponse = await api.get('/api/matches');
        const matchesData = matchesResponse.data.map(normalizeMatch);
        setMatches(matchesData);
        
        // Fetch tournaments - use the available endpoint for players
        const tournamentsResponse = await api.get('/api/tournaments');
        const tournamentsData = tournamentsResponse.data.map(normalizeTournament);
        setTournaments(tournamentsData);
        
        // Check if user is a captain of any team
        if (currentUser && currentUser.uid) {
          // Safely check tournaments
          let isTournamentCaptain = false;
          for (const tournament of tournamentsData) {
            if (!Array.isArray(tournament?.teams)) continue;
            
            for (const team of tournament.teams) {
              if (!team || !Array.isArray(team.captains)) continue;
              
              for (const captain of team.captains) {
                if (typeof captain === 'object') {
                  if (captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid) {
                    isTournamentCaptain = true;
                    break;
                  }
                } else if (currentUser && captain === currentUser.uid) {
                  isTournamentCaptain = true;
                  break;
                }
              }
              if (isTournamentCaptain) break;
            }
            if (isTournamentCaptain) break;
          }
          
          // Safely check matches
          let isMatchCaptain = false;
          for (const match of matchesData) {
            console.log('Checking match for captain:', match.match_name, 'team1_captains:', match.team1_captains, 'team2_captains:', match.team2_captains);
            
            // Check team 1 captains
            if (Array.isArray(match.team1_captains)) {
              for (const captainEntry of match.team1_captains) {
                // Handle the case where captainEntry is an array (nested array)
                if (Array.isArray(captainEntry)) {
                  for (const captain of captainEntry) {
                    if (typeof captain === 'object') {
                      console.log('Comparing captain object:', captain, 'with current user:', currentUser?.uid);
                      if (captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid) {
                        console.log('Found match! User is team1 captain');
                        isMatchCaptain = true;
                        break;
                      }
                    } else if (currentUser && captain === currentUser.uid) {
                      console.log('Found match! User is team1 captain (string comparison)');
                      isMatchCaptain = true;
                      break;
                    }
                  }
                } else if (typeof captainEntry === 'object') {
                  console.log('Comparing captain object:', captainEntry, 'with current user:', currentUser?.uid);
                  if (captainEntry && captainEntry.firebaseUID && currentUser && captainEntry.firebaseUID === currentUser.uid) {
                    console.log('Found match! User is team1 captain');
                    isMatchCaptain = true;
                    break;
                  }
                } else if (currentUser && captainEntry === currentUser.uid) {
                  console.log('Found match! User is team1 captain (string comparison)');
                  isMatchCaptain = true;
                  break;
                }
              }
            }
            
            // Check team 2 captains if not already found
            if (!isMatchCaptain && Array.isArray(match.team2_captains)) {
              for (const captainEntry of match.team2_captains) {
                // Handle the case where captainEntry is an array (nested array)
                if (Array.isArray(captainEntry)) {
                  for (const captain of captainEntry) {
                    if (typeof captain === 'object') {
                      console.log('Comparing captain object:', captain, 'with current user:', currentUser?.uid);
                      if (captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid) {
                        console.log('Found match! User is team2 captain');
                        isMatchCaptain = true;
                        break;
                      }
                    } else if (currentUser && captain === currentUser.uid) {
                      console.log('Found match! User is team2 captain (string comparison)');
                      isMatchCaptain = true;
                      break;
                    }
                  }
                } else if (typeof captainEntry === 'object') {
                  console.log('Comparing captain object:', captainEntry, 'with current user:', currentUser?.uid);
                  if (captainEntry && captainEntry.firebaseUID && currentUser && captainEntry.firebaseUID === currentUser.uid) {
                    console.log('Found match! User is team2 captain');
                    isMatchCaptain = true;
                    break;
                  }
                } else if (currentUser && captainEntry === currentUser.uid) {
                  console.log('Found match! User is team2 captain (string comparison)');
                  isMatchCaptain = true;
                  break;
                }
              }
            }
            
            if (isMatchCaptain) break;
          }
          
          setIsCaptain(isTournamentCaptain || isMatchCaptain);
        }
        
        // Fetch user data and player stats
        setLoadingStats(true);
        if (currentUser && currentUser.uid) {
          try {
            // Get the MongoDB user document using Firebase UID
            const userResponse = await api.get(`/api/users/${currentUser.uid}`);
            if (userResponse.data && userResponse.data.success && userResponse.data.data) {
              // Store the MongoDB user ID for later use
              setMongoUserId(userResponse.data.data._id);
              
              try {
                // Fetch player stats with error handling
                const statsResponse = await api.get(`/api/player-stats/player/${userResponse.data.data._id}`);
                if (statsResponse.data) {
                  setPlayerStats(statsResponse.data);
                  setStatsError(null);
                }
              } catch (err) {
                if (err.response?.status === 404) {
                  // Stats not found, initialize with default values
                  setPlayerStats({
                    matches: 0,
                    runs: 0,
                    wickets: 0,
                    // Add other default stats fields as needed
                  });
                  setStatsError(null);
                } else {
                  console.error('Error fetching player stats:', err);
                  setStatsError('Could not load your player statistics. Please try again later.');
                }
              }
              
              // Fetch user's registrations
              try {
                const registrationsResponse = await api.get(`/api/registrations/user/${userResponse.data.data._id}`);
                setUserRegistrations(registrationsResponse.data || []);
              } catch (err) {
                console.error('Error fetching registrations:', err);
                setUserRegistrations([]);
              }
            } else {
              console.error('Invalid user response format:', userResponse.data);
              setStatsError('Could not load your player data. Please try again later.');
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
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

  // Fetch matches and tournaments where the player is a captain
  useEffect(() => {
    const fetchCaptainData = async () => {
      if (!currentUser) return;
      
      try {
        setLoadingCaptain(true);
        
        // Fetch matches where user is a captain
        const matchesResponse = await api.get('/api/matches');
        const captainMatchesData = matchesResponse.data.filter(match => {
          // Safely check if user is a captain for team 1
          let isTeam1Captain = false;
          if (Array.isArray(match.team1_captains)) {
            for (const captainEntry of match.team1_captains) {
              if (Array.isArray(captainEntry)) {
                // Handle nested array structure
                for (const captain of captainEntry) {
                  if (typeof captain === 'object') {
                    if (captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid) {
                      isTeam1Captain = true;
                      break;
                    }
                  } else if (currentUser && captain === currentUser.uid) {
                    isTeam1Captain = true;
                    break;
                  }
                }
              } else if (typeof captainEntry === 'object') {
                if (captainEntry && captainEntry.firebaseUID && currentUser && captainEntry.firebaseUID === currentUser.uid) {
                  isTeam1Captain = true;
                  break;
                }
              } else if (currentUser && captainEntry === currentUser.uid) {
                isTeam1Captain = true;
                break;
              }
              
              if (isTeam1Captain) break;
            }
          }
          
          // Safely check if user is a captain for team 2
          let isTeam2Captain = false;
          if (Array.isArray(match.team2_captains)) {
            for (const captainEntry of match.team2_captains) {
              if (Array.isArray(captainEntry)) {
                // Handle nested array structure
                for (const captain of captainEntry) {
                  if (typeof captain === 'object') {
                    if (captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid) {
                      isTeam2Captain = true;
                      break;
                    }
                  } else if (currentUser && captain === currentUser.uid) {
                    isTeam2Captain = true;
                    break;
                  }
                }
              } else if (typeof captainEntry === 'object') {
                if (captainEntry && captainEntry.firebaseUID && currentUser && captainEntry.firebaseUID === currentUser.uid) {
                  isTeam2Captain = true;
                  break;
                }
              } else if (currentUser && captainEntry === currentUser.uid) {
                isTeam2Captain = true;
                break;
              }
              
              if (isTeam2Captain) break;
            }
          }
            
          return isTeam1Captain || isTeam2Captain;
        }).map(normalizeMatch);
        
        // Fetch tournaments where user is a captain
        const tournamentsResponse = await api.get('/api/tournaments');
        const captainTournamentsData = tournamentsResponse.data.filter(tournament => {
          // Safely check if user is a captain for any team in the tournament
          if (!Array.isArray(tournament.teams)) return false;
          
          return tournament.teams.some(team => {
            if (!team || !Array.isArray(team.captains)) return false;
            
            return team.captains.some(captain => {
              if (typeof captain === 'object') {
                return captain && captain.firebaseUID && currentUser && captain.firebaseUID === currentUser.uid;
              } else {
                return currentUser && captain === currentUser.uid;
              }
            });
          });
        }).map(normalizeTournament);
        
        setCaptainMatches(captainMatchesData);
        setCaptainTournaments(captainTournamentsData);
        
        // Update isCaptain state
        setIsCaptain(captainMatchesData.length > 0 || captainTournamentsData.length > 0);
        
      } catch (error) {
        console.error('Error fetching captain data:', error);
      } finally {
        setLoadingCaptain(false);
      }
    };
    
    fetchCaptainData();
  }, [currentUser]);

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
              <FiSearch className="text-gray-600" size={20} />
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
              Look for the <FiUserPlus size={16} className="inline mx-1" /> icon to register!
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
              View Detailed Stats <FiChevronRight className="ml-1" size={16} />
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
              View All <FiChevronRight className="ml-1" size={16} />
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
                        <span className="mr-3 text-lg">🏏</span>
                        <span className="font-semibold text-gray-800">{match.team1_name || "Team 1"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">🏏</span>
                        <span className="font-semibold text-gray-800">{match.team2_name || "Team 2"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="text-sm text-center text-blue-600 font-semibold mb-2">{match.time || "TBD"}</div>
                    <div className="text-xs text-gray-500 text-center">{match.venue}</div>
                    <div className="mt-3 flex justify-between items-center">
                      <button 
                        className="text-blue-600 text-xs hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/match-details/${match._id}`);
                        }}
                      >
                        View Details
                      </button>
                      <button 
                        className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRegistrationModal('match', match);
                        }}
                      >
                        <FiUserPlus size={16} />
                      </button>
                    </div>
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
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{match.team2?.logo || "🏏"}</span>
                          <span className="font-medium text-gray-800">{match.team2?.name || "Team 2"}</span>
                        </div>
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
                            <FiUserPlus size={16} />
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
              Previous News <FiChevronRight className="ml-1" size={16} />
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
      <Modal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        title={`Register for ${registrationType === 'tournament' ? 'Tournament' : 'Match'}`}
      >
        {registrationItem && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-lg text-blue-800 mb-1">
              {registrationType === 'tournament' ? registrationItem.name : registrationItem.match_name}
            </h3>
            <p className="text-sm text-blue-600">
              {registrationType === 'tournament' 
                ? `${registrationItem.startDate} to ${registrationItem.endDate}` 
                : `${registrationItem.date} at ${registrationItem.time}`}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {registrationType === 'match' 
                ? `${registrationItem.team1_name} vs ${registrationItem.team2_name}` 
                : ''}
            </p>
          </div>
        )}
        
        <form onSubmit={handleRegistrationSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">Player Name</label>
            <Input
              id="playerName"
              type="text"
              value={registrationForm.playerName}
              onChange={(e) => setRegistrationForm({...registrationForm, playerName: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={registrationForm.role}
              onChange={(e) => setRegistrationForm({...registrationForm, role: e.target.value})}
              required
            >
              <option value="">Select Role</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket-Keeper">Wicket-Keeper</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700">Team</label>
            <select
              id="team"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={registrationForm.team}
              onChange={(e) => setRegistrationForm({...registrationForm, team: e.target.value})}
              required
            >
              <option value="">Select Team</option>
              {registrationType === 'match' && registrationItem && (
                <>
                  <option value={registrationItem.team1_name}>{registrationItem.team1_name}</option>
                  <option value={registrationItem.team2_name}>{registrationItem.team2_name}</option>
                </>
              )}
              {registrationType === 'tournament' && registrationItem && registrationItem.teams && 
                registrationItem.teams.map((team, index) => (
                  <option key={index} value={team.name || team}>{team.name || team}</option>
                ))
              }
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="isWicketKeeper"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={registrationForm.isWicketKeeper}
              onChange={(e) => setRegistrationForm({...registrationForm, isWicketKeeper: e.target.checked})}
            />
            <label htmlFor="isWicketKeeper" className="ml-2 block text-sm text-gray-700">
              Register as Wicket Keeper
            </label>
          </div>
          
          {registrationStatus.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {registrationStatus.error}
            </div>
          )}
          
          {registrationStatus.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Registration submitted successfully! Waiting for approval.
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRegistrationModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={registrationStatus.loading || registrationStatus.success}
            >
              {registrationStatus.loading ? <LoadingSpinner size="sm" /> : 'Submit Registration'}
            </Button>
          </div>
        </form>
      </Modal>

      {isCaptain && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Captain Responsibilities</h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <Icons.FiAward className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-amber-800">You are a Team Captain!</h3>
            </div>
            <p className="text-amber-700 mb-4">
              You have been selected as a captain for one or more teams. As a captain, you can:
            </p>
            <ul className="list-disc pl-5 text-amber-700 mb-4 space-y-1">
              <li>Approve or reject player registration requests</li>
              <li>Manage your team during matches</li>
              <li>View team statistics and performance</li>
            </ul>
            
            <Button
              onClick={() => navigate('/captain-approval')}
              variant="secondary"
              className="mt-2 w-full sm:w-auto"
            >
              <Icons.FiUserCheck className="mr-2" />
              Manage Player Requests
            </Button>
          </div>
          
          {captainMatches.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Matches as Captain</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {captainMatches.slice(0, 3).map((match) => (
                  <Card key={match._id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{match.match_name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Icons.FiCalendar className="mr-1" />
                          {match.date}
                        </div>
                        <Badge color={match.status === 'Live' ? 'green' : match.status === 'completed' ? 'blue' : 'yellow'}>
                          {match.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {captainTournaments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Tournaments as Captain</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {captainTournaments.slice(0, 3).map((tournament) => (
                  <Card key={tournament._id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{tournament.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Icons.FiCalendar className="mr-1" />
                          {tournament.startDate} - {tournament.endDate}
                        </div>
                        <Badge color={tournament.status === 'Live' ? 'green' : tournament.status === 'completed' ? 'blue' : 'yellow'}>
                          {tournament.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
  
  // Function to open registration modal
  function openRegistrationModal(type, item) {
    console.log('Opening registration modal for:', type, item);
    
    // Reset form
    let initialTeam = '';
    
    if (type === 'match') {
      initialTeam = item.team1_name || '';
    } else if (type === 'tournament' && item.teams) {
      // Handle different team formats
      if (Array.isArray(item.teams) && item.teams.length > 0) {
        if (typeof item.teams[0] === 'string') {
          initialTeam = item.teams[0];
        } else if (typeof item.teams[0] === 'object' && item.teams[0].name) {
          initialTeam = item.teams[0].name;
        }
      }
    }
    
    setRegistrationForm({
      playerName: currentUser?.displayName || '',
      role: '',
      team: initialTeam,
      isCaptain: false, // Players cannot request to be captains
      isWicketKeeper: false // Players can request to be wicket keepers
    });
    
    // Set registration type and item
    setRegistrationType(type);
    setRegistrationItem(item);
    setShowRegistrationModal(true);
    
    // Reset registration status
    setRegistrationStatus({
      loading: false,
      success: false,
      error: null
    });
  }
  
  // Function to handle registration form submission
  async function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    if (!mongoUserId) {
      setRegistrationStatus({
        loading: false,
        success: false,
        error: 'User ID not found. Please try again later.'
      });
      return;
    }
    
    // Validate form
    if (!registrationForm.playerName || !registrationForm.role || !registrationForm.team) {
      setRegistrationStatus({
        loading: false,
        success: false,
        error: 'Please fill in all required fields.'
      });
      return;
    }
    
    try {
      setRegistrationStatus({
        loading: true,
        success: false,
        error: null
      });
      
      // Check if user already registered for this event
      const existingRegistration = userRegistrations.find(reg => {
        if (registrationType === 'tournament') {
          return reg.tournamentId === registrationItem._id && reg.team === registrationForm.team;
        } else {
          return reg.matchId === registrationItem._id && reg.team === registrationForm.team;
        }
      });
      
      if (existingRegistration) {
        setRegistrationStatus({
          loading: false,
          success: false,
          error: 'You have already registered for this event with this team.'
        });
        return;
      }
      
      const payload = {
        userId: mongoUserId,
        playerName: registrationForm.playerName,
        role: registrationForm.role,
        team: registrationForm.team,
        isCaptain: false, // Players cannot request to be captains
        isWicketKeeper: registrationForm.isWicketKeeper,
        registrationType: registrationType,
        status: 'pending'
      };
      
      // Add tournament or match ID based on registration type
      if (registrationType === 'tournament') {
        payload.tournamentId = registrationItem._id;
        payload.tournamentName = registrationItem.name;
      } else {
        payload.matchId = registrationItem._id;
        payload.matchName = registrationItem.match_name;
      }
      
      console.log('Sending registration payload:', payload);
      
      // Send registration request
      const response = await api.post('/api/registrations', payload);
      
      // Update registration status
      setRegistrationStatus({
        loading: false,
        success: true,
        error: null
      });
      
      // Add to user registrations
      setUserRegistrations([...userRegistrations, response.data]);
      
      // Close modal after a delay
      setTimeout(() => {
        setShowRegistrationModal(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      setRegistrationStatus({
        loading: false,
        success: false,
        error: error.response?.data?.error || 'Failed to submit registration. You may have already registered for this event.'
      });
    }
  }
};

export default PlayerHome;