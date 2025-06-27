import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../../utils/api';

const ViewerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const navigate = useNavigate();

  // --- MATCHES & TOURNAMENTS STATE ---
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  // --- SOCKET.IO INTEGRATION START ---
  const SOCKET_URL = 'http://localhost:5000'; // Change port if needed
  const [socket] = useState(() => io(SOCKET_URL, { autoConnect: true }));
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
      teams: tournament.teams?.length || tournament.teams || 0,
      matches: tournament.matches?.length || tournament.matches || 0,
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">Live Cricket Scores</h1>
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

      {/* Live Matches Carousel */}
      <section className="py-8 px-4 bg-white border-b-2 border-gray-100">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#16638A]">Live Matches</h2>
            <button className="bg-gray-200 px-2  flex items-center text-[#16638A] hover:text-[#0F4C75] font-medium">
              View All <ChevronRight className="ml-1" size={16} />
            </button>
          </div>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {organizeMatches('Live').map((match) => (
              <div
                key={match._id}
                className="min-w-[320px] bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">● LIVE</span>
                  <span className="text-sm text-gray-600 font-medium">{match.date}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{match.team1?.logo || "🏏"}</span>
                      <span className="font-semibold text-gray-800">{match.team1?.name || "Team 1"}</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">{match.team1?.score || "-"} <span className="text-sm text-gray-600">({match.team1?.overs || "-"})</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{match.team2?.logo || "🏏"}</span>
                      <span className="font-semibold text-gray-800">{match.team2?.name || "Team 2"}</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">{match.team2?.score || "-"} <span className="text-sm text-gray-600">({match.team2?.overs || "-"})</span></span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-sm text-center text-red-600 font-semibold mb-2">{match.status}</div>
                  <div className="text-xs text-gray-500 text-center">{match.venue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matches and Tournaments Section */}
      <section className="py-8 px-4 bg-gray-50 border-b-2 border-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Matches Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#16638A] mb-6">Matches</h2>
              {/* Live Matches */}
              <h3 className="text-xl font-semibold text-red-600 mb-2">Live</h3>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide mb-6">
                {organizeMatches('Live').length === 0 && <div className="text-gray-500">No live matches</div>}
                {organizeMatches('Live').map((match) => (
                  <div key={match._id} className="min-w-[280px] bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-800">LIVE</span>
                      <span className="text-sm text-gray-600 font-medium">{match.date} {match.time ? `| ${match.time}` : ''}</span>
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
                      <div className="text-xs text-center mt-1 font-semibold text-gray-800">{match.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Upcoming Matches */}
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Upcoming</h3>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide mb-6">
                {organizeMatches('Upcoming').length === 0 && <div className="text-gray-500">No upcoming matches</div>}
                {organizeMatches('Upcoming').map((match) => (
                  <div key={match._id} className="min-w-[280px] bg-blue-50 rounded-lg p-4 border border-blue-200 hover:bg-blue-100 transition-colors flex-shrink-0 cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">UPCOMING</span>
                      <span className="text-sm text-gray-600 font-medium">{match.date} {match.time ? `| ${match.time}` : ''}</span>
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
              {/* Completed Matches */}
              <h3 className="text-xl font-semibold text-green-600 mb-2">Completed</h3>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {organizeMatches('Completed').length === 0 && <div className="text-gray-500">No completed matches</div>}
                {organizeMatches('Completed').map((match) => (
                  <div key={match._id} className="min-w-[280px] bg-green-50 rounded-lg p-4 border border-green-200 hover:bg-green-100 transition-colors flex-shrink-0 cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">COMPLETED</span>
                      <span className="text-sm text-gray-600 font-medium">{match.date} {match.time ? `| ${match.time}` : ''}</span>
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
                      <div className="text-xs text-center mt-1 font-semibold text-gray-800">{match.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Tournaments Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#16638A] mb-6">Tournaments</h2>
              {/* Live Tournaments */}
              <h3 className="text-xl font-semibold text-red-600 mb-2">Live</h3>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide mb-6">
                {organizeTournaments('Live').length === 0 && <div className="text-gray-500">No live tournaments</div>}
                {organizeTournaments('Live').map((tournament) => (
                  <div key={tournament._id} className="min-w-[280px] bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer">
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
              {/* Upcoming Tournaments */}
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Upcoming</h3>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide mb-6">
                {organizeTournaments('Upcoming').length === 0 && <div className="text-gray-500">No upcoming tournaments</div>}
                {organizeTournaments('Upcoming').map((tournament) => (
                  <div key={tournament._id} className="min-w-[280px] bg-blue-50 rounded-lg p-4 border border-blue-200 hover:bg-blue-100 transition-colors flex-shrink-0 cursor-pointer">
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
                      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-blue-200">
                        <div>{tournament.startDate} to {tournament.endDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Completed Tournaments */}
              <h3 className="text-xl font-semibold text-green-600 mb-2">Completed</h3>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {organizeTournaments('Completed').length === 0 && <div className="text-gray-500">No completed tournaments</div>}
                {organizeTournaments('Completed').map((tournament) => (
                  <div key={tournament._id} className="min-w-[280px] bg-green-50 rounded-lg p-4 border border-green-200 hover:bg-green-100 transition-colors flex-shrink-0 cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-800">COMPLETED</span>
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
                      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-green-200">
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
      <section className="py-8 px-4 bg-white">
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
              {newsData.slice(0, 7).map((item, index) => (
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
    </div>
  );
};

export default ViewerHome;