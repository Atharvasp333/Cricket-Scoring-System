import React from 'react';
import { Link } from 'react-router-dom';

const ScorerHome = () => {
  // Mock data for matches
  const liveMatches = [
    {
      id: 1,
      team1: 'Mumbai Indians',
      team2: 'Chennai Super Kings',
      venue: 'Wankhede Stadium',
      date: '2023-10-15',
      time: '14:00',
      status: 'live',
      score: 'MI 189/4 (18.2) vs CSK 185/7',
      current: 'Rohit 78*, Hardik 42*'
    },
    {
      id: 2,
      team1: 'Royal Challengers Bangalore',
      team2: 'Kolkata Knight Riders',
      venue: 'Chinnaswamy Stadium',
      date: '2023-10-15',
      time: '19:30',
      status: 'live',
      score: 'RCB 56/2 (7) vs KKR 210/6',
      current: 'Kohli 28*, Patidar 15*'
    }
  ];

  const upcomingMatches = [
    {
      id: 3,
      team1: 'Delhi Capitals',
      team2: 'Punjab Kings',
      venue: 'Arun Jaitley Stadium',
      date: '2023-10-18',
      time: '15:30',
      status: 'upcoming'
    },
    {
      id: 4,
      team1: 'Rajasthan Royals',
      team2: 'Sunrisers Hyderabad',
      venue: 'Sawai Mansingh Stadium',
      date: '2023-10-20',
      time: '13:00',
      status: 'upcoming'
    },
    {
      id: 5,
      team1: 'Gujarat Titans',
      team2: 'Lucknow Super Giants',
      venue: 'Narendra Modi Stadium',
      date: '2023-10-22',
      time: '19:30',
      status: 'upcoming'
    }
  ];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E3F5FF' }}>
      <main className="w-full max-w-screen-2xl mx-auto px-4 py-6">
        {/* Live Matches Section */}
        <section className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Live Matches</h2>
          {liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {liveMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden flex flex-col h-full"
                >
                  <div className="bg-[#007595] text-white px-4 py-2 flex justify-between items-center">
                    <span className="font-bold">LIVE</span>
                    <span className="text-sm">{match.date} | {match.time}</span>
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{match.team1}</h3>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">{match.score.split(' vs ')[0]}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{match.team2}</h3>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">{match.score.split(' vs ')[1]}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{match.current}</p>
                    <p className="text-gray-500 text-sm mb-4">{match.venue}</p>
                  </div>
                  <div className="p-4 text-center border-t border-gray-200">
                    <Link
                      to={`/match-setup/${match.id}`}
                      className="inline-block w-3/4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Score Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full bg-white rounded-lg p-6 shadow-md text-center border border-gray-200">
              <p className="text-gray-600">No live matches assigned to you.</p>
            </div>
          )}
        </section>

        {/* Your Assigned Matches Section */}
        <section className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-4 text-[#16638A]">Your Assigned Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {upcomingMatches.map((match) => (
              <div 
                key={match.id} 
                className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden flex flex-col h-full"
              >
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">UPCOMING</span>
                    <span className="text-gray-600 text-sm">{match.date} | {match.time}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{match.team1}</h3>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">vs</h3>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{match.team2}</h3>
                  <p className="text-gray-600 mb-4">{match.venue}</p>
                </div>
                <div className="p-4 text-center border-t border-gray-200">
                  <span className="text-sm text-gray-500 block mb-2">You are assigned as scorer</span>
                  <Link
                    to={`/match-setup/${match.id}`}
                    className="inline-block w-3/4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold py-2 px-4 rounded transition duration-200"
                  >
                    Start Scoring
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScorerHome;