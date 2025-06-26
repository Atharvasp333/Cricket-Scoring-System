import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const MatchSetup = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  // State for match data
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch match data
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/matches/${matchId}`);
        
        // Transform the data to match the expected format
        const match = response.data;
        setMatchData({
          id: match._id,
          team1: {
            name: match.team1.name,
            players: match.team1.players.map(player => player.name)
          },
          team2: {
            name: match.team2.name,
            players: match.team2.players.map(player => player.name)
          },
          venue: match.venue,
          date: match.date,
          time: match.time
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching match data:', err);
        setError('Failed to load match data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchMatchData();
  }, [matchId]);

  // State for toss
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('');
  const [tossCompleted, setTossCompleted] = useState(false);
  
  // State for team selection
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [teamSelectionCompleted, setTeamSelectionCompleted] = useState(false);
  
  // State for batting setup
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');
  const [setupCompleted, setSetupCompleted] = useState(false);

  // Handle toss submission
  const handleTossSubmit = (e) => {
    e.preventDefault();
    if (tossWinner && tossDecision) {
      setTossCompleted(true);
    } else {
      alert('Please select toss winner and decision');
    }
  };

  // Handle team selection submission
  const handleTeamSelectionSubmit = (e) => {
    e.preventDefault();
    if (team1Players.length === 11 && team2Players.length === 11) {
      setTeamSelectionCompleted(true);
    } else {
      alert('Please select 11 players for each team');
    }
  };

  // Handle player selection for team 1
  const handleTeam1PlayerSelection = (player) => {
    if (team1Players.includes(player)) {
      setTeam1Players(team1Players.filter(p => p !== player));
    } else if (team1Players.length < 11) {
      setTeam1Players([...team1Players, player]);
    } else {
      alert('You can only select 11 players');
    }
  };

  // Handle player selection for team 2
  const handleTeam2PlayerSelection = (player) => {
    if (team2Players.includes(player)) {
      setTeam2Players(team2Players.filter(p => p !== player));
    } else if (team2Players.length < 11) {
      setTeam2Players([...team2Players, player]);
    } else {
      alert('You can only select 11 players');
    }
  };

  // Handle batting setup submission
  const handleBattingSetupSubmit = async (e) => {
    e.preventDefault();
    if (striker && nonStriker && bowler) {
      try {
        setLoading(true);
        // Update match status to Live
        await api.put(`/api/matches/${matchId}`, {
          status: 'Live'
        });
        
        setSetupCompleted(true);
        // Navigate to scoring page
        navigate(`/scoring/${matchId}`);
      } catch (err) {
        console.error('Error updating match status:', err);
        alert('Failed to start scoring. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please select striker, non-striker, and bowler');
    }
  };

  // Determine batting and bowling teams based on toss decision
  const battingTeam = tossDecision === 'bat' ? 
    (tossWinner === matchData.team1.name ? matchData.team1 : matchData.team2) : 
    (tossWinner === matchData.team1.name ? matchData.team2 : matchData.team1);
  
  const bowlingTeam = tossDecision === 'bowl' ? 
    (tossWinner === matchData.team1.name ? matchData.team1 : matchData.team2) : 
    (tossWinner === matchData.team1.name ? matchData.team2 : matchData.team1);

  // Get selected players for batting and bowling teams
  const battingTeamPlayers = battingTeam.name === matchData.team1.name ? team1Players : team2Players;
  const bowlingTeamPlayers = bowlingTeam.name === matchData.team1.name ? team1Players : team2Players;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E3F5FF' }}>
      <main className="w-full max-w-screen-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8 text-[#16638A]">Match Setup</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16638A]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : matchData ? (
          <>
            {/* Match Info */}
            <div className="bg-[#16638A] p-6 text-white rounded-lg shadow-md mb-8">
              <h2 className="text-3xl text-center font-bold mb-4">{matchData.team1.name} vs {matchData.team2.name}</h2>
              <div className="flex flex-wrap justify-center text-xl gap-x-4 gap-y-2 text-white">
                <p><span className="font-medium">Venue:</span> {matchData.venue}</p>
                <p><span className="font-medium">Date:</span> {matchData.date}</p>
                <p><span className="font-medium">Time:</span> {matchData.time}</p>
              </div>
            </div>
        
        {/* Toss Section */}
        {!tossCompleted ? (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
            <h2 className="text-2xl text-[#16638A] font-bold mb-4">TOSS</h2>
            <form onSubmit={handleTossSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-xl font-medium mb-2">Toss Winner</label>
                  <select 
                    className="w-full p-4 text-gray-700 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16638A] focus:border-[#16638A]"
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value)}
                    required
                  >
                    <option value="">Select Team</option>
                    <option value={matchData.team1.name}>{matchData.team1.name}</option>
                    <option value={matchData.team2.name}>{matchData.team2.name}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-xl font-medium mb-2">Decision</label>
                  <select 
                    className="w-full p-4 border text-gray-700 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16638A] focus:border-[#16638A]"
                    value={tossDecision}
                    onChange={(e) => setTossDecision(e.target.value)}
                    required
                  >
                    <option value="">Select Decision</option>
                    <option value="bat">Bat</option>
                    <option value="bowl">Bowl</option>
                  </select>
                </div>
              </div>
              
              {/* Toss Selection Preview */}
              {tossWinner && tossDecision && (
                <div className="mt-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-center text-gray-800 font-medium">
                    <span className="font-bold text-[#16638A]">{tossWinner}</span> won the toss and elected to <span className="font-bold text-[#16638A]">{tossDecision.toLowerCase()}</span> first
                  </p>
                </div>
              )}
              
              <button 
                type="submit"
                className="w-full py-3 px-4 bg-[#16638A] text-white font-bold rounded-lg hover:bg-[#1a7ca8] transition duration-200"
              >
                Confirm Toss
              </button>
            </form>
          </div>
        ) : !teamSelectionCompleted ? (
          // Team Selection Section
          <section className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-2xl text-[#16638A] font-semibold mb-4">Select Playing XI</h2>
            <p className="mb-6 text-gray-700">
              <span className="font-medium text-[#16638A]">{tossWinner}</span> won the toss and elected to <span className="font-medium">{tossDecision.toLowerCase()}</span> first
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Team 1 Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{matchData.team1.name}</h3>
                <p className="mb-2 text-sm text-gray-600">Select 11 players ({team1Players.length}/11 selected)</p>
                <div className="bg-gray-50 text-gray-800 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  {matchData.team1.players.map((player, index) => (
                    <div 
                      key={index} 
                      className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
                        team1Players.includes(player) 
                          ? 'bg-[#16638A] text-white border border-[#16638A]' 
                          : 'bg-white border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTeam1PlayerSelection(player)}
                    >
                      {player}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Team 2 Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{matchData.team2.name}</h3>
                <p className="mb-2 text-sm text-gray-600">Select 11 players ({team2Players.length}/11 selected)</p>
                <div className="bg-gray-50 p-4 text-gray-800 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  {matchData.team2.players.map((player, index) => (
                    <div 
                      key={index} 
                      className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
                        team2Players.includes(player) 
                          ? 'bg-[#16638A] text-white border border-[#16638A]' 
                          : 'bg-white border border-gray-200 hover:bg-gray-100'
                      }`}
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
              disabled={team1Players.length !== 11 || team2Players.length !== 11}
              className={`mt-6 w-full py-3 px-4 text-white font-bold rounded-lg focus:outline-none transition duration-200 ${
                team1Players.length === 11 && team2Players.length === 11
                  ? 'bg-[#16638A] hover:bg-[#1a7ca8]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Playing XI
            </button>
          </section>
        ) : (
          // Batting Setup Section
          <section className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-[#16638A]">Batting Setup</h2>
            <p className="mb-6 text-gray-700">
              <span className="font-medium text-[#16638A]">{battingTeam.name}</span> is batting first
            </p>
            
            <form onSubmit={handleBattingSetupSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Batsmen Selection */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Batsmen</h3>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Striker</label>
                    <select 
                      className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16638A] focus:border-[#16638A]"
                      value={striker}
                      onChange={(e) => setStriker(e.target.value)}
                      required
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
                      className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16638A] focus:border-[#16638A]"
                      value={nonStriker}
                      onChange={(e) => setNonStriker(e.target.value)}
                      required
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
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Bowler</h3>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Opening Bowler</label>
                    <select 
                      className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16638A] focus:border-[#16638A]"
                      value={bowler}
                      onChange={(e) => setBowler(e.target.value)}
                      required
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
                className="w-full py-3 px-4 bg-[#16638A] hover:bg-[#1a7ca8] text-white font-bold rounded-lg focus:outline-none transition duration-200"
              >
                Start Scoring
              </button>
            </form>
          </section>
        )}
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
            <p className="text-gray-600">Match data not found. Please go back and try again.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchSetup;
