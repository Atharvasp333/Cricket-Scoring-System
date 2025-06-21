import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const MatchSetup = () => {
  const { matchId } = useParams()
  const navigate = useNavigate()
  
  // Mock match data
  const matchData = {
    id: matchId,
    team1: {
      name: 'Team A',
      players: [
        'Player A1', 'Player A2', 'Player A3', 'Player A4', 'Player A5',
        'Player A6', 'Player A7', 'Player A8', 'Player A9', 'Player A10',
        'Player A11', 'Player A12', 'Player A13', 'Player A14', 'Player A15'
      ]
    },
    team2: {
      name: 'Team B',
      players: [
        'Player B1', 'Player B2', 'Player B3', 'Player B4', 'Player B5',
        'Player B6', 'Player B7', 'Player B8', 'Player B9', 'Player B10',
        'Player B11', 'Player B12', 'Player B13', 'Player B14', 'Player B15'
      ]
    },
    venue: 'Stadium 1',
    date: '2023-10-15',
    time: '14:00'
  }

  // State for toss
  const [tossWinner, setTossWinner] = useState('')
  const [tossDecision, setTossDecision] = useState('')
  const [tossCompleted, setTossCompleted] = useState(false)
  
  // State for team selection
  const [team1Players, setTeam1Players] = useState([])
  const [team2Players, setTeam2Players] = useState([])
  const [teamSelectionCompleted, setTeamSelectionCompleted] = useState(false)
  
  // State for batting setup
  const [striker, setStriker] = useState('')
  const [nonStriker, setNonStriker] = useState('')
  const [bowler, setBowler] = useState('')
  const [setupCompleted, setSetupCompleted] = useState(false)

  // Handle toss submission
  const handleTossSubmit = (e) => {
    e.preventDefault()
    if (tossWinner && tossDecision) {
      setTossCompleted(true)
    } else {
      alert('Please select toss winner and decision')
    }
  }

  // Handle team selection submission
  const handleTeamSelectionSubmit = (e) => {
    e.preventDefault()
    if (team1Players.length === 11 && team2Players.length === 11) {
      setTeamSelectionCompleted(true)
    } else {
      alert('Please select 11 players for each team')
    }
  }

  // Handle player selection for team 1
  const handleTeam1PlayerSelection = (player) => {
    if (team1Players.includes(player)) {
      setTeam1Players(team1Players.filter(p => p !== player))
    } else if (team1Players.length < 11) {
      setTeam1Players([...team1Players, player])
    } else {
      alert('You can only select 11 players')
    }
  }

  // Handle player selection for team 2
  const handleTeam2PlayerSelection = (player) => {
    if (team2Players.includes(player)) {
      setTeam2Players(team2Players.filter(p => p !== player))
    } else if (team2Players.length < 11) {
      setTeam2Players([...team2Players, player])
    } else {
      alert('You can only select 11 players')
    }
  }

  // Handle batting setup submission
  const handleBattingSetupSubmit = (e) => {
    e.preventDefault()
    if (striker && nonStriker && bowler) {
      setSetupCompleted(true)
      // Navigate to scoring page
      navigate(`/scoring/${matchId}`)
    } else {
      alert('Please select striker, non-striker, and bowler')
    }
  }

  // Determine batting and bowling teams based on toss decision
  const battingTeam = tossDecision === 'bat' ? 
    (tossWinner === matchData.team1.name ? matchData.team1 : matchData.team2) : 
    (tossWinner === matchData.team1.name ? matchData.team2 : matchData.team1)
  
  const bowlingTeam = tossDecision === 'bowl' ? 
    (tossWinner === matchData.team1.name ? matchData.team1 : matchData.team2) : 
    (tossWinner === matchData.team1.name ? matchData.team2 : matchData.team1)

  // Get selected players for batting and bowling teams
  const battingTeamPlayers = battingTeam.name === matchData.team1.name ? team1Players : team2Players
  const bowlingTeamPlayers = bowlingTeam.name === matchData.team1.name ? team1Players : team2Players

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Match Setup</h1>
      
      {/* Match Info */}
      <div className="bg-green-700 p-6 text-blue rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">{matchData.team1.name} vs {matchData.team2.name}</h2>
        <p className="text-gray-200 text-lg">
          <span className="font-medium">Venue:</span> {matchData.venue} <space>|</space> <space/>
          <span className="font-medium">Date:</span> {matchData.date}   <space>|</space>  <space/>
          <span className="font-medium">Time:</span> {matchData.time}
        </p>
      </div>
      
      {/* Toss Section */}
      {!tossCompleted ? (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl text-black font-bold mb-4">TOSS</h2>
          <form onSubmit={handleTossSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Toss Winner</label>
                <select 
                  className="w-full p-2 text-gray-700 border border-gray-300 rounded"
                  value={tossWinner}
                  onChange={(e) => setTossWinner(e.target.value)}
                  required
                >
                  <option value="">Select Team</option>
                  <option value="Team A">Team A</option>
                  <option value="Team B">Team B</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Decision</label>
                <select 
                  className="w-full p-2 border text-gray-700 border-gray-300 rounded"
                  value={tossDecision}
                  onChange={(e) => setTossDecision(e.target.value)}
                  required
                >
                  <option value="">Select Decision</option>
                  <option value="Bat">Bat</option>
                  <option value="Bowl">Bowl</option>
                </select>
              </div>
            </div>
            
            {/* Toss Selection Preview */}
            {tossWinner && tossDecision && (
              <div className="mt-4 mb-4 p-3 bg-blue-100 border border-blue-200 rounded-md">
                <p className="text-center text-black font-medium">
                  <span className="font-bold text-blue-700">{tossWinner}</span> won the toss and elected to <span className="font-bold text-blue-700">{tossDecision.toLowerCase()}</span> first
                </p>
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
            >
              Confirm Toss
            </button>
          </form>
        </div>
      ) : !teamSelectionCompleted ? (
        // Team Selection Section
        <section className="bg-green-100 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl text-gray-800 font-semibold mb-4">Select Playing XI</h2>
          <p className="mb-4 text-gray-600">
            <span className="font-medium">{tossWinner}</span> won the toss and elected to {tossDecision} first
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team 1 Selection */}
            <div>
              <h3 className="text-xl text-black font-semibold mb-3">{matchData.team1.name}</h3>
              <p className="mb-2 text-sm text-gray-600">Select 11 players ({team1Players.length}/11 selected)</p>
              <div className="bg-gray-100 text-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
                {matchData.team1.players.map((player, index) => (
                  <div 
                    key={index} 
                    className={`p-2 mb-2 rounded cursor-pointer ${team1Players.includes(player) ? 'bg-blue-100 border border-blue-500' : 'bg-white border'}`}
                    onClick={() => handleTeam1PlayerSelection(player)}
                  >
                    {player}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Team 2 Selection */}
            <div>
              <h3 className="text-xl text-black font-semibold mb-3">{matchData.team2.name}</h3>
              <p className="mb-2 text-sm text-gray-600">Select 11 players ({team2Players.length}/11 selected)</p>
              <div className="bg-gray-100 p-4 text-gray-800 rounded-lg max-h-96 overflow-y-auto">
                {matchData.team2.players.map((player, index) => (
                  <div 
                    key={index} 
                    className={`p-2 mb-2 rounded cursor-pointer ${team2Players.includes(player) ? 'bg-blue-100 border border-blue-500' : 'bg-white border'}`}
                    onClick={() => handleTeam2PlayerSelection(player)}
                  >
                    {player}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleTeamSelectionSubmit}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Confirm Playing XI
          </button>
        </section>
      ) : (
        // Batting Setup Section
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Batting Setup</h2>
          <p className="mb-6 text-gray-600">
            <span className="font-medium">{battingTeam.name}</span> is batting first
          </p>
          
          <form onSubmit={handleBattingSetupSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Batsmen Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Batsmen</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Striker</label>
                  <select 
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={striker}
                    onChange={(e) => setStriker(e.target.value)}
                  >
                    <option value="">Select Striker</option>
                    {battingTeamPlayers.map((player, index) => (
                      <option key={index} value={player} disabled={player === nonStriker}>
                        {player}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Non-Striker</label>
                  <select 
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={nonStriker}
                    onChange={(e) => setNonStriker(e.target.value)}
                  >
                    <option value="">Select Non-Striker</option>
                    {battingTeamPlayers.map((player, index) => (
                      <option key={index} value={player} disabled={player === striker}>
                        {player}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Bowler Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Bowler</h3>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Opening Bowler</label>
                  <select 
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={bowler}
                    onChange={(e) => setBowler(e.target.value)}
                  >
                    <option value="">Select Bowler</option>
                    {bowlingTeamPlayers.map((player, index) => (
                      <option key={index} value={player}>
                        {player}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline text-lg"
            >
              Start Scoring
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

export default MatchSetup