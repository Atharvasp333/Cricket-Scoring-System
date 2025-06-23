import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

const ViewerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for live matches
  const liveMatches = [
    {
      id: 1,
      team1: { name: 'Mumbai Indians', logo: '🏏', score: '189/4', overs: '18.2' },
      team2: { name: 'Chennai Super Kings', logo: '🏏', score: '185/7', overs: '20.0' },
      status: 'MI needs 24 runs in 10 balls',
      venue: 'Wankhede Stadium',
      date: '2023-10-15'
    },
    {
      id: 2,
      team1: { name: 'Royal Challengers Bangalore', logo: '🏏', score: '56/2', overs: '7.0' },
      team2: { name: 'Kolkata Knight Riders', logo: '🏏', score: '210/6', overs: '20.0' },
      status: 'RCB needs 155 runs in 78 balls',
      venue: 'Chinnaswamy Stadium',
      date: '2023-10-15'
    },
    {
      id: 3,
      team1: { name: 'Delhi Capitals', logo: '🏏', score: '145/8', overs: '16.4' },
      team2: { name: 'Punjab Kings', logo: '🏏', score: '180/5', overs: '20.0' },
      status: 'DC needs 36 runs in 20 balls',
      venue: 'Arun Jaitley Stadium',
      date: '2023-10-15'
    }
  ];

  // Mock data for all matches
  const allMatches = [
    // Live matches
    ...liveMatches,
    // Upcoming matches
    {
      id: 4,
      team1: { name: 'Rajasthan Royals', logo: '🏏' },
      team2: { name: 'Sunrisers Hyderabad', logo: '🏏' },
      status: 'Upcoming',
      venue: 'Sawai Mansingh Stadium',
      date: '2023-10-20',
      time: '19:30'
    },
    {
      id: 5,
      team1: { name: 'Gujarat Titans', logo: '🏏' },
      team2: { name: 'Lucknow Super Giants', logo: '🏏' },
      status: 'Upcoming',
      venue: 'Narendra Modi Stadium',
      date: '2023-10-22',
      time: '15:30'
    },
    // Recent matches
    {
      id: 6,
      team1: { name: 'Mumbai Indians', logo: '🏏', score: '210/5', overs: '20.0' },
      team2: { name: 'Punjab Kings', logo: '🏏', score: '189/8', overs: '20.0' },
      status: 'Mumbai Indians won by 21 runs',
      venue: 'Wankhede Stadium',
      date: '2023-10-10'
    },
    {
      id: 7,
      team1: { name: 'Chennai Super Kings', logo: '🏏', score: '175/8', overs: '20.0' },
      team2: { name: 'Royal Challengers Bangalore', logo: '🏏', score: '176/4', overs: '19.2' },
      status: 'Royal Challengers Bangalore won by 6 wickets',
      venue: 'M. A. Chidambaram Stadium',
      date: '2023-10-08'
    }
  ];

  // Mock data for tournaments
  const tournaments = [
    {
      id: 1,
      name: 'Indian Premier League 2023',
      status: 'Live',
      teams: 10,
      matches: 74,
      startDate: '2023-09-15',
      endDate: '2023-11-20'
    },
    {
      id: 2,
      name: 'T20 World Cup 2023',
      status: 'Upcoming',
      teams: 16,
      matches: 45,
      startDate: '2023-12-01',
      endDate: '2023-12-28'
    },
    {
      id: 3,
      name: 'Big Bash League 2023',
      status: 'Upcoming',
      teams: 8,
      matches: 61,
      startDate: '2023-12-10',
      endDate: '2024-02-05'
    },
    {
      id: 4,
      name: 'The Hundred 2023',
      status: 'Concluded',
      teams: 8,
      matches: 34,
      startDate: '2023-08-01',
      endDate: '2023-08-27'
    }
  ];

  // Mock data for news
  const news = [
    {
      id: 1,
      title: 'Rohit Sharma becomes fastest to 5000 T20 runs',
      summary: 'Mumbai Indians captain achieves milestone in just 192 innings',
      image: '📰',
      date: '2023-10-15',
      category: 'Records'
    },
    {
      id: 2,
      title: 'ICC announces schedule for T20 World Cup 2024',
      summary: 'Tournament to be held in West Indies and USA from June 4 to June 30',
      image: '📰',
      date: '2023-10-14',
      category: 'Tournaments'
    },
    {
      id: 3,
      title: 'Virat Kohli announces retirement from T20 internationals',
      summary: 'Will continue to play Tests and ODIs for India',
      image: '📰',
      date: '2023-10-12',
      category: 'International'
    },
    {
      id: 4,
      title: 'England wins ODI series against Australia 3-2',
      summary: 'Jos Buttler named Player of the Series for his outstanding performance',
      image: '📰',
      date: '2023-10-10',
      category: 'International'
    }
  ];

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
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="min-w-[320px] bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">● LIVE</span>
                  <span className="text-sm text-gray-600 font-medium">{match.date}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{match.team1.logo}</span>
                      <span className="font-semibold text-gray-800">{match.team1.name}</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">{match.team1.score} <span className="text-sm text-gray-600">({match.team1.overs})</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{match.team2.logo}</span>
                      <span className="font-semibold text-gray-800">{match.team2.name}</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">{match.team2.score} <span className="text-sm text-gray-600">({match.team2.overs})</span></span>
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
            {/* All Matches */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#16638A]">Recent Matches</h2>
                <button to="/viewer/matches" className="bg-gray-200 px-2 flex items-center text-[#16638A] hover:text-[#0F4C75] font-medium">
                  View All <ChevronRight className="ml-1" size={16} />
                </button>
              </div>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {allMatches.slice(0, 6).map((match) => (
                  <div
                    key={match.id}
                    className="min-w-[280px] bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={
                        `text-xs px-2 py-1 rounded-full font-medium ${match.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                          match.status.includes('won') ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`
                      }>
                        {match.status === 'Upcoming' ? 'UPCOMING' :
                          match.status.includes('won') ? 'COMPLETED' : 'LIVE'}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">{match.date} {match.time ? `| ${match.time}` : ''}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{match.team1.logo}</span>
                          <span className="font-medium text-gray-800">{match.team1.name}</span>
                        </div>
                        {match.team1.score && (
                          <span className="font-bold text-gray-900">{match.team1.score}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{match.team2.logo}</span>
                          <span className="font-medium text-gray-800">{match.team2.name}</span>
                        </div>
                        {match.team2.score && (
                          <span className="font-bold text-gray-900">{match.team2.score}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="text-sm text-center text-gray-600 font-medium">{match.venue}</div>
                      {match.status !== 'Upcoming' && !match.status.includes('needs') && (
                        <div className="text-xs text-center mt-1 font-semibold text-gray-800">{match.status}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournaments */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#16638A]">Tournaments</h2>
                <button className="bg-gray-200 px-2 flex items-center text-[#16638A] hover:text-[#0F4C75] font-medium">
                  View All <ChevronRight className="ml-1" size={16} />
                </button>
              </div>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="min-w-[280px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex-shrink-0 cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={
                        `text-xs px-3 py-1 rounded-full font-medium ${tournament.status === 'Live' ? 'bg-red-100 text-red-800' :
                          tournament.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`
                      }>
                        {tournament.status.toUpperCase()}
                      </span>
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
      {/* Enhanced News Section */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#16638A]">Cricket News</h2>
            <button className="bg-gray-200 px-2 flex items-center text-[#16638A] hover:text-[#0F4C75] font-medium">
              View All <ChevronRight className="ml-1" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
              >
                <div className={`bg-gradient-to-br from-[#16638A] to-[#0F4C75] flex items-center justify-center text-white ${index === 0 ? 'h-48' : 'h-32'
                  }`}>
                  <span className="text-5xl">{item.image}</span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs px-2 py-1 bg-[#74D341] text-white rounded-full font-medium">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-3 leading-tight ${index === 0 ? 'text-xl' : 'text-lg'
                    }`}>{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.summary}</p>
                  <div className="flex justify-end">
                    <span className="text-[#16638A] text-sm font-semibold hover:text-[#0F4C75] transition-colors">
                      Read More →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewerHome;