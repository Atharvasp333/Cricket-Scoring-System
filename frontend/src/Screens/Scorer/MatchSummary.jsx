import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const MatchSummary = () => {
  const { matchId } = useParams()
  const navigate = useNavigate()
  
  // Mock match data
  const matchData = {
    team1: {
      name: 'Team A',
      score: 165,
      wickets: 8,
      overs: 20,
      runRate: 8.25
    },
    team2: {
      name: 'Team B',
      score: 160,
      wickets: 9,
      overs: 20,
      runRate: 8.00
    },
    result: 'Team A won by 5 runs',
    playerOfTheMatch: 'Player A3',
    venue: 'Stadium 1',
    date: '2023-10-15',
    topPerformers: {
      batsmen: [
        { name: 'Player A3', team: 'Team A', runs: 45, balls: 32, fours: 3, sixes: 2, strikeRate: 140.63 },
        { name: 'Player B6', team: 'Team B', runs: 42, balls: 30, fours: 3, sixes: 2, strikeRate: 140.00 },
        { name: 'Player A5', team: 'Team A', runs: 38, balls: 25, fours: 4, sixes: 1, strikeRate: 152.00 }
      ],
      bowlers: [
        { name: 'Player B7', team: 'Team B', overs: 4, maidens: 0, runs: 28, wickets: 3, economy: 7.00 },
        { name: 'Player A9', team: 'Team A', overs: 4, maidens: 0, runs: 30, wickets: 3, economy: 7.50 },
        { name: 'Player B2', team: 'Team B', overs: 4, maidens: 0, runs: 32, wickets: 2, economy: 8.00 }
      ]
    }
  }

  // Handle return to home
  const handleReturnToHome = () => {
    navigate('/scorer-home')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Match Summary</h1>
      <p className="text-center text-gray-600 mb-8">
        <span className="font-medium">Venue:</span> {matchData.venue} | 
        <span className="font-medium">Date:</span> {matchData.date}
      </p>
      
      {/* Match Result */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-blue-800">{matchData.result}</h2>
        <p className="text-lg text-blue-700">
          Player of the Match: {matchData.playerOfTheMatch}
        </p>
      </div>
      
      {/* Innings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* First Innings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{matchData.team1.name} - First Innings</h2>
          <div className="text-3xl font-bold mb-2">
            {matchData.team1.score}/{matchData.team1.wickets}
          </div>
          <p className="text-gray-600">
            <span className="font-medium">Overs:</span> {matchData.team1.overs} | 
            <span className="font-medium">Run Rate:</span> {matchData.team1.runRate}
          </p>
        </div>
        
        {/* Second Innings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{matchData.team2.name} - Second Innings</h2>
          <div className="text-3xl font-bold mb-2">
            {matchData.team2.score}/{matchData.team2.wickets}
          </div>
          <p className="text-gray-600">
            <span className="font-medium">Overs:</span> {matchData.team2.overs} | 
            <span className="font-medium">Run Rate:</span> {matchData.team2.runRate}
          </p>
        </div>
      </div>
      
      {/* Top Performers */}
      <h2 className="text-2xl font-semibold mb-4">Top Performers</h2>
      
      {/* Top Batsmen */}
      <div className="bg-blue-200 p-6 text-black rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Batting</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Batsman</th>
                <th className="py-2 px-4 text-left">Team</th>
                <th className="py-2 px-4 text-right">Runs</th>
                <th className="py-2 px-4 text-right">Balls</th>
                <th className="py-2 px-4 text-right">4s</th>
                <th className="py-2 px-4 text-right">6s</th>
                <th className="py-2 px-4 text-right">SR</th>
              </tr>
            </thead>
            <tbody>
              {matchData.topPerformers.batsmen.map((batsman, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 font-medium">{batsman.name}</td>
                  <td className="py-2 px-4">{batsman.team}</td>
                  <td className="py-2 px-4 text-right">{batsman.runs}</td>
                  <td className="py-2 px-4 text-right">{batsman.balls}</td>
                  <td className="py-2 px-4 text-right">{batsman.fours}</td>
                  <td className="py-2 px-4 text-right">{batsman.sixes}</td>
                  <td className="py-2 px-4 text-right">{batsman.strikeRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Top Bowlers */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Bowling</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Bowler</th>
                <th className="py-2 px-4 text-left">Team</th>
                <th className="py-2 px-4 text-right">O</th>
                <th className="py-2 px-4 text-right">M</th>
                <th className="py-2 px-4 text-right">R</th>
                <th className="py-2 px-4 text-right">W</th>
                <th className="py-2 px-4 text-right">Econ</th>
              </tr>
            </thead>
            <tbody>
              {matchData.topPerformers.bowlers.map((bowler, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 font-medium">{bowler.name}</td>
                  <td className="py-2 px-4">{bowler.team}</td>
                  <td className="py-2 px-4 text-right">{bowler.overs}</td>
                  <td className="py-2 px-4 text-right">{bowler.maidens}</td>
                  <td className="py-2 px-4 text-right">{bowler.runs}</td>
                  <td className="py-2 px-4 text-right">{bowler.wickets}</td>
                  <td className="py-2 px-4 text-right">{bowler.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Return to Home Button */}
      <div className="text-center">
        <button 
          onClick={handleReturnToHome}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline text-lg transition duration-150 ease-in-out"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default MatchSummary