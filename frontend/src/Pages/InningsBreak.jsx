import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const InningsBreak = () => {
  const { matchId } = useParams()
  const navigate = useNavigate()
  
  // Mock match data for first innings
  const firstInningsData = {
    battingTeam: 'Team A',
    score: 165,
    wickets: 8,
    overs: 20,
    runRate: 8.25,
    target: 166,
    requiredRunRate: 8.3,
    topBatsmen: [
      { name: 'Player A3', runs: 45, balls: 32, fours: 3, sixes: 2, strikeRate: 140.63 },
      { name: 'Player A5', runs: 38, balls: 25, fours: 4, sixes: 1, strikeRate: 152.00 },
      { name: 'Player A1', runs: 32, balls: 28, fours: 2, sixes: 1, strikeRate: 114.29 }
    ],
    topBowlers: [
      { name: 'Player B7', overs: 4, maidens: 0, runs: 28, wickets: 3, economy: 7.00 },
      { name: 'Player B2', overs: 4, maidens: 0, runs: 32, wickets: 2, economy: 8.00 }
    ]
  }

  // Handle start second innings
  const handleStartSecondInnings = () => {
    navigate(`/scoring/${matchId}?innings=2`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Innings Break</h1>
      
      {/* First Innings Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">{firstInningsData.battingTeam} - {firstInningsData.score}/{firstInningsData.wickets}</h2>
        <p className="text-center text-lg mb-6">
          <span className="font-medium">Overs:</span> {firstInningsData.overs} | 
          <span className="font-medium">Run Rate:</span> {firstInningsData.runRate}
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-2 text-center text-blue-800">Target: {firstInningsData.target} runs</h3>
          <p className="text-center text-blue-700">
            Required Run Rate: {firstInningsData.requiredRunRate} runs per over
          </p>
        </div>
      </div>
      
      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Top Batsmen */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Batsmen</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Batsman</th>
                  <th className="py-2 px-4 text-right">Runs</th>
                  <th className="py-2 px-4 text-right">Balls</th>
                  <th className="py-2 px-4 text-right">4s</th>
                  <th className="py-2 px-4 text-right">6s</th>
                  <th className="py-2 px-4 text-right">SR</th>
                </tr>
              </thead>
              <tbody>
                {firstInningsData.topBatsmen.map((batsman, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4 font-medium">{batsman.name}</td>
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Bowlers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Bowler</th>
                  <th className="py-2 px-4 text-right">O</th>
                  <th className="py-2 px-4 text-right">M</th>
                  <th className="py-2 px-4 text-right">R</th>
                  <th className="py-2 px-4 text-right">W</th>
                  <th className="py-2 px-4 text-right">Econ</th>
                </tr>
              </thead>
              <tbody>
                {firstInningsData.topBowlers.map((bowler, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4 font-medium">{bowler.name}</td>
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
      </div>
      
      {/* Start Second Innings Button */}
      <div className="text-center">
        <button 
          onClick={handleStartSecondInnings}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline text-lg transition duration-150 ease-in-out"
        >
          Start Second Innings
        </button>
      </div>
    </div>
  )
}

export default InningsBreak