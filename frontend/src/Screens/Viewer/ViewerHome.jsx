import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import api from '../../utils/api';
import { Components, Icons } from '../../exports';

// Destructure with default empty object to prevent errors if Components is undefined
const { 
  Card = 'div', 
  SearchBar = 'div', 
  Button = 'button', 
  Badge = 'span', 
  Skeleton = 'div', 
  EmptyState = 'div' 
} = Components || {};

const { 
  FiAward, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiSearch 
} = Icons || {};

const ViewerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);
  const navigate = useNavigate();

  // Organize matches by status
  const organizeMatches = (status) => {
    if (!Array.isArray(matches)) return [];
    
    return matches.filter(match => {
      if (!match || typeof match !== 'object') return false;
      
      // Normalize status for comparison
      const matchStatus = match.status?.toLowerCase() || '';
      const statusLower = status?.toLowerCase() || '';
      
      switch (statusLower) {
        case 'live':
          return matchStatus === 'live' || matchStatus === 'in progress';
        case 'upcoming':
          return matchStatus === 'upcoming' || matchStatus === 'scheduled';
        case 'completed':
          return matchStatus === 'completed' || matchStatus === 'finished';
        default:
          return true;
      }
    });
  };

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    // You can add additional search filtering logic here
    // For example, filter matches and tournaments based on the search query
    if (query.trim() === '') {
      // If search query is empty, reset to show all items
      // The useEffect will handle refetching all data
      return;
    }
    
    // Convert query to lowercase for case-insensitive search
    const searchTerm = query.toLowerCase();
    
    // Filter matches and tournaments based on the search query
    // This is a basic implementation - you can enhance it based on your needs
    const filteredMatches = matches.filter(match => 
      match.team1.name.toLowerCase().includes(searchTerm) ||
      match.team2.name.toLowerCase().includes(searchTerm) ||
      match.venue?.toLowerCase().includes(searchTerm)
    );
    
    const filteredTournaments = tournaments.filter(tournament => 
      tournament.name.toLowerCase().includes(searchTerm)
    );
    
    // Update state with filtered results
    setMatches(filteredMatches);
    setTournaments(filteredTournaments);
  };

  // --- SOCKET.IO INTEGRATION ---
  const socket = useSocket();
  // --- SOCKET.IO INTEGRATION END ---

  // --- DATA NORMALIZATION HELPERS ---
  function normalizeMatch(match) {
    return {
      ...match,
      team1: {
        name: match.team1_name || match.team1?.name || 'Team 1',
        logo: '🏏',
        score: match.team1_score || match.team1?.score || '-',
        overs: match.team1_overs || match.team1?.overs || '-',
      },
      team2: {
        name: match.team2_name || match.team2?.name || 'Team 2',
        logo: '🏏',
        score: match.team2_score || match.team2?.score || '-',
        overs: match.team2_overs || match.team2?.overs || '-',
      },
      status: match.status,
      venue: match.venue,
      date: match.date,
      time: match.time,
      _id: match._id,
    };
  }

  function normalizeTournament(tournament) {
    return {
      ...tournament,
      name: tournament.name,
      status: tournament.status,
      teams: Array.isArray(tournament.teams) ? tournament.teams.length : 
             (typeof tournament.teams === 'number' ? tournament.teams : 0),
      matches: Array.isArray(tournament.matches) ? tournament.matches.length : 
               (typeof tournament.matches === 'number' ? tournament.matches : 0),
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      _id: tournament._id,
    };
  }

  // --- FETCH INITIAL DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setDataError(null);
      try {
        const [matchRes, tournamentRes] = await Promise.all([
          api.get('/api/matches'),
          api.get('/api/tournaments'),
        ]);
        setMatches((matchRes.data || []).map(normalizeMatch));
        setTournaments((tournamentRes.data || []).map(normalizeTournament));
      } catch (err) {
        setDataError('Could not load matches/tournaments.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // --- SOCKET EVENT HANDLERS ---
  useEffect(() => {
    if (!socket) return;
    // Matches
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
    // Tournaments
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
    return () => {
      socket.off('matchUpdated');
      socket.off('matchAdded');
      socket.off('matchRemoved');
      socket.off('tournamentUpdated');
      socket.off('tournamentAdded');
      socket.off('tournamentRemoved');
    };
  }, [socket]);

  // --- ORGANIZE BY STATUS ---
  const organizeMatchesByStatus = (status) =>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search Bar */}
            <div className="mb-8 max-w-2xl mx-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Search matches, tournaments..."
                showButton={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches Carousel */}
      <section className="py-8 px-4 bg-white border-b-2 border-gray-100">
        {/* Live Matches Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="w-2 h-6 bg-red-500 rounded-full mr-2"></span>
              Live Matches
            </h2>
            <Button 
              variant="ghost"
              size="sm"
              rightIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
              onClick={() => navigate('/live-matches')}
              className="text-primary-600 hover:bg-primary-50"
            >
              View All
            </Button>
          </div>
          
          {loadingData ? (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[320px] bg-white rounded-xl p-5 border border-gray-200">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : organizeMatchesByStatus('Live').length > 0 ? (
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
              {organizeMatchesByStatus('Live').map((match) => (
                <Card
                  key={match._id}
                  className="min-w-[320px] hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/match/${match._id}`)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="danger" className="animate-pulse">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                        LIVE
                      </span>
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-1 h-4 w-4" />
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold">{match.team1.name}</span>
                      </div>
                      <div className="text-lg font-bold">{match.team1.score || '-'}</div>
                    </div>
                    <div className="text-center text-gray-500 text-sm">
                      {match.status === 'Live' ? `${match.team1.overs} OVERS` : 'VS'}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold">{match.team2.name}</span>
                      </div>
                      <div className="text-lg font-bold">{match.team2.score || '-'}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiMapPin className="mr-1 h-4 w-4" />
                        <span>{match.venue || 'Venue TBD'}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1 h-4 w-4" />
                        <span>{match.time || 'Time TBD'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Live Matches"
              description="There are no matches being played right now. Check back later!"
              icon={<FiAward className="h-12 w-12 text-gray-400" />}
              action={
                <Button
                  variant="outline"
                  onClick={() => navigate('/matches')}
                  className="mt-4"
                >
                  View Upcoming Matches
                </Button>
              }
            />
          )}
        </section>

        {/* Upcoming Matches Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Matches</h2>
            <Button 
              variant="ghost"
              size="sm"
              rightIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
              onClick={() => navigate('/upcoming-matches')}
              className="text-primary-600 hover:bg-primary-50"
            >
              View All
            </Button>
          </div>
          
          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : organizeMatchesByStatus('Upcoming').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizeMatchesByStatus('Upcoming').slice(0, 3).map((match) => (
                <Card
                  key={match._id}
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/match/${match._id}`)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="info">
                      UPCOMING
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-1 h-4 w-4" />
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{match.team1.name}</span>
                      <span className="text-lg font-bold">-</span>
                    </div>
                    <div className="text-center text-gray-500 text-sm">VS</div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{match.team2.name}</span>
                      <span className="text-lg font-bold">-</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiMapPin className="mr-1 h-4 w-4" />
                        <span>{match.venue || 'Venue TBD'}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1 h-4 w-4" />
                        <span>{match.time || 'Time TBD'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Upcoming Matches"
              description="There are no upcoming matches scheduled yet. Check back later!"
              icon={<FiCalendar className="h-12 w-12 text-gray-400" />}
              action={
                <Button
                  variant="outline"
                  onClick={() => navigate('/tournaments')}
                  className="mt-4"
                >
                  View Tournaments
                </Button>
              }
            />
          )}
        </section>

        {/* Tournaments Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Tournaments</h2>
            <Button 
              variant="ghost"
              size="sm"
              rightIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
              onClick={() => navigate('/tournaments')}
              className="text-primary-600 hover:bg-primary-50"
            >
              View All
            </Button>
          </div>
          
          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.slice(0, 3).map((tournament) => (
                <Card
                  key={tournament._id}
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/tournament/${tournament._id}`)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant={tournament.status === 'Live' ? 'danger' : 'info'}>
                      {tournament.status}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {tournament.teams} Teams
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tournament.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Starts: {new Date(tournament.startDate).toLocaleDateString()}</span>
                    <span>{tournament.matches?.length || 0} Matches</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Tournaments"
              description="There are no tournaments available at the moment."
              icon={<FiAward className="h-12 w-12 text-gray-400" />}
              action={
                <Button
                  variant="outline"
                  onClick={() => navigate('/matches')}
                  className="mt-4"
                >
                  View All Matches
                </Button>
              }
            />
          )}
        </section>
      </section>

      {/* Enhanced News Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Cricket News</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
          </div>
          
          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-all duration-500">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : newsError ? (
            <EmptyState
              title="Error Loading News"
              description={newsError}
              icon={
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              }
              action={
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Retry
                </Button>
              }
            />
          ) : newsData.length === 0 ? (
            <EmptyState
              title="No News Available"
              description="There are no news articles available at the moment. Please check back later."
              icon={
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.slice(0, 6).map((item, index) => (
                <Card
                  key={item.url || index}
                  className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                  onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                >
                  <div className="relative overflow-hidden">
                    {item.urlToImage ? (
                      <img
                        src={item.urlToImage}
                        alt={item.title}
                        className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-56 bg-gray-100 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-sm font-medium">Read More →</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs font-medium">
                      {item.source?.name || 'Unknown Source'}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.description || 'No description available for this news article.'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                      <span>
                        {new Date(item.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center text-primary-600 font-medium">
                        Read Full Story
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewerHome;