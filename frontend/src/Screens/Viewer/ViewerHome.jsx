import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

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
      date: '2023-10-15'
    },
    {
      id: 2,
      title: 'ICC announces schedule for T20 World Cup 2024',
      summary: 'Tournament to be held in West Indies and USA from June 4 to June 30',
      image: '📰',
      date: '2023-10-14'
    },
    {
      id: 3,
      title: 'Virat Kohli announces retirement from T20 internationals',
      summary: 'Will continue to play Tests and ODIs for India',
      image: '📰',
      date: '2023-10-12'
    },
    {
      id: 4,
      title: 'England wins ODI series against Australia 3-2',
      summary: 'Jos Buttler named Player of the Series for his outstanding performance',
      image: '📰',
      date: '2023-10-10'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="bg-[#16638A] text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Live Cricket Scores</h1>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search for matches, teams, or players..."
              className="w-full py-3 px-5 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#74D341]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Live Matches Carousel */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#16638A]">Live Matches</h2>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {liveMatches.map((match) => (
              <Link 
                to={`/viewer/match/${match.id}`} 
                key={match.id} 
                className="min-w-[300px] bg-white rounded-lg shadow-md p-4 border-l-4 border-[#16638A] hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                  <span className="text-sm text-gray-500">{match.date}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="mr-2">{match.team1.logo}</span>
                    <span className="font-medium">{match.team1.name}</span>
                  </div>
                  <span className="font-bold">{match.team1.score} ({match.team1.overs})</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <span className="mr-2">{match.team2.logo}</span>
                    <span className="font-medium">{match.team2.name}</span>
                  </div>
                  <span className="font-bold">{match.team2.score} ({match.team2.overs})</span>
                </div>
                <div className="text-sm text-center text-red-600 font-medium">{match.status}</div>
                <div className="text-xs text-gray-500 mt-2 text-center">{match.venue}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Matches and Tournaments Section */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* All Matches */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-[#16638A]">All Matches</h2>
              <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                {allMatches.map((match) => (
                  <Link 
                    to={`/viewer/match/${match.id}`} 
                    key={match.id} 
                    className="block border-b border-gray-200 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors p-2 rounded"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={
                        `text-xs px-2 py-1 rounded-full ${
                          match.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                          match.status.includes('won') ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'
                        }`
                      }>
                        {match.status === 'Upcoming' ? 'UPCOMING' : 
                         match.status.includes('won') ? 'COMPLETED' : 'LIVE'}
                      </span>
                      <span className="text-sm text-gray-500">{match.date} {match.time ? `| ${match.time}` : ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-2">{match.team1.logo}</span>
                        <span className="font-medium">{match.team1.name}</span>
                      </div>
                      {match.team1.score && (
                        <span className="font-bold">{match.team1.score}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <span className="mr-2">{match.team2.logo}</span>
                        <span className="font-medium">{match.team2.name}</span>
                      </div>
                      {match.team2.score && (
                        <span className="font-bold">{match.team2.score}</span>
                      )}
                    </div>
                    <div className="text-sm text-center mt-2 text-gray-600">{match.venue}</div>
                    {match.status !== 'Upcoming' && (
                      <div className="text-xs text-center mt-1 font-medium text-gray-800">{match.status}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Tournaments */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Tournaments</h2>
              <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                {tournaments.map((tournament) => (
                  <Link 
                    to={`/viewer/tournament/${tournament.id}`} 
                    key={tournament.id} 
                    className="block border-b border-gray-200 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors p-2 rounded"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={
                        `text-xs px-2 py-1 rounded-full ${
                          tournament.status === 'Live' ? 'bg-red-100 text-red-800' : 
                          tournament.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`
                      }>
                        {tournament.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{tournament.name}</h3>
                    <div className="text-sm text-gray-600">
                      <span>{tournament.teams} Teams</span> • <span>{tournament.matches} Matches</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tournament.startDate} to {tournament.endDate}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#16638A]">Cricket News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gray-200 flex items-center justify-center text-4xl">
                  {item.image}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{item.date}</span>
                    <Link to={`/viewer/news/${item.id}`} className="text-[#16638A] text-sm font-medium hover:underline">Read More</Link>
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