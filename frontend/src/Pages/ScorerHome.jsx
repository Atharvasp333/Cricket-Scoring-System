import React from 'react'

const ScorerHome = () => {
  // Mock data for assigned matches
  const liveMatches = [
    {
      id: 1,
      team1: 'Team A',
      team2: 'Team B',
      venue: 'Stadium 1',
      date: '2023-10-15',
      time: '14:00',
      status: 'live'
    }
  ]

  const upcomingMatches = [
    {
      id: 2,
      team1: 'Team C',
      team2: 'Team D',
      venue: 'Stadium 2',
      date: '2023-10-18',
      time: '15:30',
      status: 'upcoming'
    },
    {
      id: 3,
      team1: 'Team E',
      team2: 'Team F',
      venue: 'Stadium 3',
      date: '2023-10-20',
      time: '13:00',
      status: 'upcoming'
    }
  ]

  const recentMatches = [
    {
      id: 4,
      team1: 'Team G',
      team2: 'Team H',
      venue: 'Stadium 4',
      date: '2023-10-10',
      time: '14:00',
      result: 'Team G won by 5 wickets',
      status: 'completed'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Scorer Dashboard</h1>
      
      {/* Live Matches Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Live Matches</h2>
        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map(match => (
              <div key={match.id} className="bg-green-100 border border-green-500 rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">LIVE</span>
                  <span className="text-gray-600 text-sm">{match.date} | {match.time}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{match.team1} vs {match.team2}</h3>
                <p className="text-gray-600 mb-4">{match.venue}</p>
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  onClick={() => window.location.href = `/match-setup/${match.id}`}
                >
                  Start Scoring
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No live matches assigned to you.</p>
        )}
      </section>

      {/* Upcoming Matches Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Matches</h2>
        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map(match => (
              <div key={match.id} className="bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">UPCOMING</span>
                  <span className="text-gray-600 text-sm">{match.date} | {match.time}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{match.team1} vs {match.team2}</h3>
                <p className="text-gray-600 mb-4">{match.venue}</p>
                <p className="text-sm text-gray-500">You are assigned as the scorer for this match.</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming matches assigned to you.</p>
        )}
      </section>

      {/* Recent Matches Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Matches</h2>
        {recentMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMatches.map(match => (
              <div key={match.id} className="bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-semibold">COMPLETED</span>
                  <span className="text-gray-600 text-sm">{match.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{match.team1} vs {match.team2}</h3>
                <p className="text-gray-600 mb-2">{match.venue}</p>
                <p className="text-green-600 font-medium">{match.result}</p>
                <button 
                  className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  onClick={() => window.location.href = `/match-summary/${match.id}`}
                >
                  View Summary
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent matches.</p>
        )}
      </section>
    </div>
  )
}

export default ScorerHome