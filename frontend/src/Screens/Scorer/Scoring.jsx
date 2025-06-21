import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Scoring = () => {
  const { matchId } = useParams()
  const navigate = useNavigate()
  
  // Mock match data
  const matchData = {
    id: matchId,
    team1: {
      name: 'Team A',
      players: ['Player A1', 'Player A2', 'Player A3', 'Player A4', 'Player A5', 'Player A6', 'Player A7', 'Player A8', 'Player A9', 'Player A10', 'Player A11']
    },
    team2: {
      name: 'Team B',
      players: ['Player B1', 'Player B2', 'Player B3', 'Player B4', 'Player B5', 'Player B6', 'Player B7', 'Player B8', 'Player B9', 'Player B10', 'Player B11']
    },
    venue: 'Stadium 1',
    date: '2023-10-15',
    overs: 20.0
  }

  // State for match progress
  const [innings, setInnings] = useState(1)
  const [battingTeam, setBattingTeam] = useState(matchData.team1)
  const [bowlingTeam, setBowlingTeam] = useState(matchData.team2)
  const [score, setScore] = useState(0)
  const [wickets, setWickets] = useState(0)
  const [overs, setOvers] = useState(0)
  const [balls, setBalls] = useState(0)
  const [currentOver, setCurrentOver] = useState([])
  const [previousOvers, setPreviousOvers] = useState([])
  const [crr, setCrr] = useState(0)
  const [target, setTarget] = useState(null)
  const [rrr, setRrr] = useState(null)
  
  // State for batsmen
  const [striker, setStriker] = useState({
    name: 'Player A1',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0
  })
  const [nonStriker, setNonStriker] = useState({
    name: 'Player A2',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0
  })
  
  // State for bowler
  const [currentBowler, setCurrentBowler] = useState({
    name: 'Player B1',
    overs: 0,
    balls: 0,
    runs: 0,
    wickets: 0,
    economy: 0
  })
  
  // State for current ball
  const [ballType, setBallType] = useState('')
  const [runsScored, setRunsScored] = useState(null)
  const [isExtra, setIsExtra] = useState(false)
  const [extraType, setExtraType] = useState('')
  const [isWicket, setIsWicket] = useState(false)
  const [wicketType, setWicketType] = useState('')
  const [showWicketModal, setShowWicketModal] = useState(false)
  const [showNewBatsmanModal, setShowNewBatsmanModal] = useState(false)
  const [showExtraModal, setShowExtraModal] = useState(false)
  const [showBallTypeModal, setShowBallTypeModal] = useState(false)
  const [showChangeBowlerModal, setShowChangeBowlerModal] = useState(false)
  const [lastBowler, setLastBowler] = useState('')

  // Handle runs button click
  const handleRunsClick = (runs) => {
    setRunsScored(runs)
    setIsExtra(false)
    setIsWicket(false)
    setExtraType('')
    setWicketType('')
  }

  // Handle wicket button click
  const handleWicketClick = () => {
    setIsWicket(true)
    setShowWicketModal(true)
    setRunsScored(0)
    setIsExtra(false)
    setExtraType('')
  }

  // Handle extra button click
  const handleExtraClick = () => {
    setIsExtra(true)
    setShowExtraModal(true)
    setIsWicket(false)
    setWicketType('')
  }

  // Handle ball type button click
  const handleBallTypeClick = () => {
    setShowBallTypeModal(true)
  }

  // Handle wicket type selection
  const handleWicketTypeSelect = (type) => {
    setWicketType(type)
    setShowWicketModal(false)
    // setShowNewBatsmanModal(true)
  }
  
  // Handle new batsman selection
  const handleNewBatsmanSelect = (player) => {
    setStriker({
      name: player,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0
    })
    setShowNewBatsmanModal(false)
  }

  // Handle extra type selection
  const handleExtraTypeSelect = (type) => {
    setExtraType(type)
    setShowExtraModal(false)
  }

  // Handle ball type selection
  const handleBallTypeSelect = (type) => {
    setBallType(type)
    setShowBallTypeModal(false)
  }

  // Handle change bowler
  const handleChangeBowler = () => {
    setShowChangeBowlerModal(true)
  }

  // Handle bowler selection
  const handleBowlerSelect = (bowlerName) => {
    // Prevent selecting the same bowler consecutively
    if (bowlerName === lastBowler) {
      alert('The same bowler cannot bowl consecutive overs')
      return
    }
    
    setCurrentBowler({
      name: bowlerName,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      economy: 0
    })
    setShowChangeBowlerModal(false)
  }

  // Handle end over
  const handleEndOver = () => {
    // Add current over to previous overs
    setPreviousOvers([...previousOvers, currentOver])
    // Clear current over
    setCurrentOver([])
    // Increment overs
    setOvers(overs + 1)
    setBalls(0)
    // Swap striker and non-striker
    const temp = striker
    setStriker(nonStriker)
    setNonStriker(temp)
    // Store current bowler as last bowler
    setLastBowler(currentBowler.name)
    // Show change bowler modal
    setShowChangeBowlerModal(true)
  }

  // Handle submit ball
  const handleSubmitBall = () => {
    // Check if ball type is selected for legal deliveries
    if (!isExtra && !ballType) {
      alert('Please select a ball type for legal deliveries')
      return
    }
    
    // Create ball object with display text for extras with runs
    let displayText = ''
    if (isExtra) {
      if (extraType === 'wide' || extraType === 'no-ball') {
        displayText = extraType === 'wide' ? 'Wd' : 'Nb'
        if (runsScored > 0) {
          displayText += '+' + runsScored
        }
      } else {
        displayText = extraType === 'leg-bye' ? 'Lb' : 'B'
        if (runsScored > 0) {
          displayText += '+' + runsScored
        }
      }
    } else {
      displayText = runsScored !== null ? runsScored.toString() : ''
      if (isWicket) displayText = 'W'
    }
    
    const ball = {
      runs: runsScored,
      isExtra,
      extraType,
      isWicket,
      wicketType,
      ballType,
      bowler: currentBowler.name,
      batsman: striker.name,
      displayText: displayText
    }

    // Update current over
    setCurrentOver([...currentOver, ball])

    // Update score
    let runsToAdd = runsScored || 0
    if (isExtra && (extraType === 'wide' || extraType === 'no-ball')) {
      runsToAdd += 1
    }
    setScore(score + runsToAdd)

    // Update wickets
    if (isWicket) {
      setWickets(wickets + 1)
      // Modal for new batsman selection will be shown after ball is submitted
      // We'll show it at the end of this function
    }

    // Update balls only if it's not a wide or no-ball
    if (!isExtra || (isExtra && extraType !== 'wide' && extraType !== 'no-ball')) {
      setBalls(balls + 1)
      
      // Update striker stats - only for legal deliveries
      // For singles and triples, don't add runs to batsman but change strike
      const updatedStriker = {
        ...striker
      }
      
      // Only update batsman stats if it's not a single or triple
      if (!isExtra && runsScored !== null) {
        updatedStriker.runs = striker.runs + runsScored
        updatedStriker.fours = runsScored === 4 ? striker.fours + 1 : striker.fours
        updatedStriker.sixes = runsScored === 6 ? striker.sixes + 1 : striker.sixes
      }
      
      // Always increment balls faced for legal deliveries
      updatedStriker.balls = striker.balls + 1
      updatedStriker.strikeRate = ((updatedStriker.runs / updatedStriker.balls) * 100).toFixed(2)
      setStriker(updatedStriker)
      
      // Update bowler stats
      const updatedBowler = {
        ...currentBowler,
        balls: currentBowler.balls + 1,
        runs: currentBowler.runs + runsToAdd,
        wickets: isWicket ? currentBowler.wickets + 1 : currentBowler.wickets
      }
      // Calculate overs (e.g., 1.3 means 1 over and 3 balls)
      updatedBowler.overs = Math.floor(updatedBowler.balls / 6) + (updatedBowler.balls % 6) / 10
      updatedBowler.economy = (updatedBowler.runs / (Math.floor(updatedBowler.balls / 6) + (updatedBowler.balls % 6) / 6)).toFixed(2)
      setCurrentBowler(updatedBowler)
    } else {
      // Update bowler runs for extras
      const updatedBowler = {
        ...currentBowler,
        runs: currentBowler.runs + runsToAdd
      }
      updatedBowler.economy = (updatedBowler.runs / (Math.floor(updatedBowler.balls / 6) + (updatedBowler.balls % 6) / 6)).toFixed(2)
      setCurrentBowler(updatedBowler)
    }

    // Check if over is complete (6 legal deliveries)
    if (balls === 5 && (!isExtra || (isExtra && extraType !== 'wide' && extraType !== 'no-ball'))) {
      handleEndOver()
    }

    // Check if innings is over (all wickets or all overs)
    if (wickets === 9 || (overs === matchData.overs - 1 && balls === 5)) {
      // End of innings
      if (innings === 1) {
        // Set target for second innings
        setTarget(score + runsToAdd + 1)
        // Navigate to innings break page
        navigate(`/innings-break/${matchId}`)
      } else {
        // End of match
        navigate(`/match-summary/${matchId}`)
      }
    }

    // Update current run rate
    const totalOvers = overs + (balls + 1) / 6
    setCrr((score + runsToAdd) / totalOvers)

    // Update required run rate if it's second innings
    if (innings === 2 && target) {
      const remainingRuns = target - (score + runsToAdd)
      const remainingOvers = matchData.overs - totalOvers
      setRrr(remainingRuns / remainingOvers)
    }

    // Reset ball state
    setRunsScored(null)
    setIsExtra(false)
    setExtraType('')
    setIsWicket(false)
    setWicketType('')
    setBallType('')

    // Swap striker if odd runs (1 or 3) on a legal delivery
    if (runsScored && runsScored % 2 === 1 && (!isExtra || (isExtra && extraType !== 'wide' && extraType !== 'no-ball'))) {
      const temp = striker
      setStriker(nonStriker)
      setNonStriker(temp)
    }
    
    // Show new batsman modal if a wicket fell
    if (isWicket) {
      setShowNewBatsmanModal(true)
    }
  }

  // Handle undo last ball
  const handleUndoLastBall = () => {
    // In a real app, you would implement logic to undo the last ball
    alert('Undo last ball functionality would be implemented here')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 container mx-auto px-4 py-6">
      {/* Match Info */}
      <div className="bg-white/90 p-4 rounded-lg shadow-lg mb-6 text-black">
        <h1 className="text-3xl font-bold mb-2 text-blue-900">{battingTeam.name} vs {bowlingTeam.name}</h1>
        <p className="text-gray-600 mb-2">
          <span className="font-medium text-blue-900">Venue:</span> {matchData.venue} | 
          <span className="font-medium text-blue-900">Date:</span> {matchData.date}
        </p>
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-xl font-bold">
            {battingTeam.name}: {score}/{wickets}
          </div>
          <div>
            <span className="font-medium text-blue-900">Overs:</span> {overs}.{balls} / {matchData.overs}
          </div>
          <div>
            <span className="font-medium text-blue-900">CRR:</span> {crr.toFixed(2)}
            {innings === 2 && target && (
              <span className="ml-4">
                <span className="font-medium text-blue-900">Target:</span> {target} | 
                <span className="font-medium text-blue-900">RRR:</span> {rrr.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Current Ball and Batsmen/Bowler Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current Ball */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Current Ball</h2>
          <div className="flex flex-wrap items-center">
            <div className="mr-4 text-black mb-2">
              <span className="font-medium text-blue-900">Over:</span> {overs}.{balls}
            </div>
            {runsScored !== null && (
              <div className="mr-4 mb-2">
                <span className="font-medium text-blue-900">Runs:</span> {runsScored}
              </div>
            )}
            {isExtra && (
              <div className="mr-4 mb-2">
                <span className="font-medium text-blue-900">Extra:</span> {extraType}
              </div>
            )}
            {isWicket && (
              <div className="mr-4 mb-2">
                <span className="font-medium text-blue-900">Wicket:</span> {wicketType}
              </div>
            )}
            {ballType && (
              <div className="mr-4 mb-2">
                <span className="font-medium text-blue-900">Ball Type:</span> {ballType}
              </div>
            )}
          </div>
        </div>
        
        {/* Batsmen Info */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Batsmen</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 rounded ${striker ? 'bg-blue-400' : 'bg-gray-700'}`}>
              <div className="font-medium">{striker.name} *</div>
              <div className="text-sm">{striker.runs} ({striker.balls}) | {striker.fours}x4 | {striker.sixes}x6 | SR: {striker.strikeRate}</div>
            </div>
            <div className={`p-2 rounded ${!striker ? 'bg-blue-400' : 'bg-gray-700'}`}>
              <div className="font-medium">{nonStriker.name}</div>
              <div className="text-sm">{nonStriker.runs} ({nonStriker.balls}) | {nonStriker.fours}x4 | {nonStriker.sixes}x6 | SR: {nonStriker.strikeRate}</div>
            </div>
          </div>
        </div>
        
        {/* Bowler Info */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Bowler</h2>
          <div className="p-2 rounded bg-red-500">
            <div className="font-medium">{currentBowler.name}</div>
            <div className="text-sm">{currentBowler.overs} overs | {currentBowler.runs}R | {currentBowler.wickets}W | Econ: {currentBowler.economy}</div>
          </div>
        </div>
      </div>

      {/* Over Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Current Over */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Current Over</h2>
          <div className="flex flex-wrap">
            {currentOver.length > 0 ? (
              currentOver.map((ball, index) => (
                <div key={index} className={`
                  w-auto min-w-10 h-10 px-2 flex items-center justify-center rounded-full m-1 text-white font-bold
                  ${ball.isWicket ? 'bg-red-500' : 
                    ball.isExtra ? 'bg-yellow-500' : 
                    ball.runs === 4 ? 'bg-green-500' : 
                    ball.runs === 6 ? 'bg-purple-500' : 'bg-blue-500'}
                `}>
                  {/* Display the ball's displayText which includes extras with runs */}
                  {ball.displayText}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No balls bowled yet in this over</p>
            )}
          </div>
        </div>
        
        {/* Previous Overs */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Previous Overs</h2>
          <div className="max-h-32 overflow-y-auto">
            {previousOvers.length > 0 ? (
              previousOvers.map((over, overIndex) => (
                <div key={overIndex} className="mb-2">
                  <span className="font-medium text-blue-900">Over {overIndex + 1}:</span>
                  <div className="flex flex-wrap">
                    {over.map((ball, ballIndex) => (
                      <div key={ballIndex} className={`
                        w-auto min-w-8 h-8 px-1 flex items-center justify-center rounded-full m-1 text-white font-bold text-sm
                        ${ball.isWicket ? 'bg-red-500' : 
                          ball.isExtra ? 'bg-yellow-500' : 
                          ball.runs === 4 ? 'bg-green-500' : 
                          ball.runs === 6 ? 'bg-purple-500' : 'bg-blue-500'}
                      `}>
                        {/* Display the ball's displayText which includes extras with runs */}
                        {ball.displayText}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No previous overs</p>
            )}
          </div>
        </div>
      </div>

      {/* Scoring Controls */}
      <div className="bg-white/90 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">Scoring Controls</h2>
        
        {/* Runs Buttons */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2 text-blue-900">Runs</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`w-12 h-12 rounded-full font-bold bg-blue-600 text-white hover:brightness-110 ${runsScored === 0 && !isWicket && !isExtra ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleRunsClick(0)}
            >
              0
            </button>
            <button 
              className={`w-12 h-12 rounded-full font-bold bg-blue-600 text-white hover:brightness-110 ${runsScored === 1 && !isWicket && !isExtra ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleRunsClick(1)}
            >
              1
            </button>
            <button 
              className={`w-12 h-12 rounded-full font-bold bg-blue-600 text-white hover:brightness-110 ${runsScored === 2 && !isWicket && !isExtra ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleRunsClick(2)}
            >
              2
            </button>
            <button 
              className={`w-12 h-12 rounded-full font-bold bg-blue-600 text-white hover:brightness-110 ${runsScored === 3 && !isWicket && !isExtra ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleRunsClick(3)}
            >
              3
            </button>
            <button 
              className={`w-12 h-12 rounded-full font-bold bg-blue-600 text-white hover:brightness-110 ${runsScored === 4 && !isWicket && !isExtra ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleRunsClick(4)}
            >
              4
            </button>
            <button 
              className={`w-12 h-12 rounded-full font-bold bg-blue-600 text-white hover:brightness-110 ${runsScored === 6 && !isWicket && !isExtra ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleRunsClick(6)}
            >
              6
            </button>
          </div>
        </div>
        
        {/* Wicket and Extras Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-md font-medium mb-2 text-blue-900">Wicket</h3>
            <button 
              className={`w-full py-2 px-4 rounded font-bold bg-red-500 text-white hover:brightness-110 ${isWicket ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              onClick={handleWicketClick}
            >
              Wicket
            </button>
          </div>
          <div>
            <h3 className="text-md font-medium mb-2 text-blue-900">Extras</h3>
            <button 
              className={`w-full py-2 px-4 rounded font-bold bg-yellow-400 text-white hover:brightness-110 ${isExtra ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              onClick={handleExtraClick}
            >
              Extras
            </button>
          </div>
        </div>
        
        {/* Ball Type Button */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2 text-blue-900">Ball Type</h3>
          <button 
            className={`w-full py-2 px-4 rounded font-bold bg-blue-600 text-white hover:brightness-110 ${ballType ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={handleBallTypeClick}
          >
            {ballType || 'Select Ball Type'}
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button 
            className="py-2 px-4 rounded bg-green-600 text-white font-bold hover:bg-green-700"
            onClick={handleSubmitBall}
            disabled={runsScored === null && !isWicket && !isExtra}
          >
            Submit
          </button>
          <button 
            className="py-2 px-4 rounded bg-orange-500 text-white font-bold hover:bg-orange-600"
            onClick={handleEndOver}
            disabled={currentOver.length === 0}
          >
            End Over
          </button>
          <button 
            className="py-2 px-4 rounded bg-red-500 text-white font-bold hover:bg-red-600"
            onClick={handleUndoLastBall}
            disabled={currentOver.length === 0 && previousOvers.length === 0}
          >
            Undo
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            className="py-2 px-4 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
            onClick={handleChangeBowler}
          >
            Change Bowler
          </button>
          <button 
            className="py-2 px-4 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
            onClick={() => {
              const temp = striker
              setStriker(nonStriker)
              setNonStriker(temp)
            }}
          >
            Swap Batsmen
          </button>
        </div>
      </div>

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Wicket Type</h2>
            <div className="grid grid-cols-2 text-white gap-4">
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleWicketTypeSelect('bowled')}
              >
                Bowled
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleWicketTypeSelect('caught')}
              >
                Caught
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleWicketTypeSelect('lbw')}
              >
                LBW
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleWicketTypeSelect('run-out')}
              >
                Run Out
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleWicketTypeSelect('stumped')}
              >
                Stumped
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleWicketTypeSelect('hit-wicket')}
              >
                Hit Wicket
              </button>
            </div>
            <button 
              className="mt-4 w-full py-2 px-4 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
              onClick={() => setShowWicketModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Extra Modal */}
      {showExtraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-yellow-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Extra Type</h2>
            <div className="grid grid-cols-2 text-white gap-4">
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleExtraTypeSelect('wide')}
              >
                Wide
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleExtraTypeSelect('no-ball')}
              >
                No Ball
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleExtraTypeSelect('leg-bye')}
              >
                Leg Bye
              </button>
              <button 
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                onClick={() => handleExtraTypeSelect('bye')}
              >
                Bye
              </button>
            </div>
            <button 
              className="mt-4 w-full py-2 px-4 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
              onClick={() => setShowExtraModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ball Type Modal */}
      {showBallTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-yellow-100 p-6 rounded-lg shadow-lg w-full max-w-4xl text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Ball Type</h2>
            <div className="grid text-white grid-cols-3 gap-4">
              {/* Pace Bowling */}
              <div>
                <h3 className="font-medium mb-2 text-blue-700">Pace</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Yorker')}
                  >
                    Yorker
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Bouncer')}
                  >
                    Bouncer
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Full Toss')}
                  >
                    Full Toss
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Length Ball')}
                  >
                    Length Ball
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Short Ball')}
                  >
                    Short Ball
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Slower Ball')}
                  >
                    Slower Ball
                  </button>
                </div>
              </div>
              
              {/* Spin Bowling */}
              <div>
                <h3 className="font-medium mb-2 text-green-700">Spin</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Off Spin')}
                  >
                    Off Spin
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Leg Spin')}
                  >
                    Leg Spin
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Googly')}
                  >
                    Googly
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Doosra')}
                  >
                    Doosra
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Carrom Ball')}
                  >
                    Carrom Ball
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Arm Ball')}
                  >
                    Arm Ball
                  </button>
                </div>
              </div>
              
              {/* Seam Bowling */}
              <div>
                <h3 className="font-medium mb-2 text-red-700">Seam</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Outswinger')}
                  >
                    Outswinger
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Inswinger')}
                  >
                    Inswinger
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Reverse Swing')}
                  >
                    Reverse Swing
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Cutter')}
                  >
                    Cutter
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Off Cutter')}
                  >
                    Off Cutter
                  </button>
                  <button 
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                    onClick={() => handleBallTypeSelect('Leg Cutter')}
                  >
                    Leg Cutter
                  </button>
                </div>
              </div>
            </div>
            <button 
              className="mt-4 w-full py-2 px-4 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
              onClick={() => setShowBallTypeModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Change Bowler Modal */}
      {showChangeBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-yellow-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Bowler</h2>
            <div className="max-h-60 overflow-y-auto">
              {bowlingTeam.players.map((player, index) => (
                <button 
                  key={index}
                  className="w-full py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium mb-2 text-left"
                  onClick={() => handleBowlerSelect(player)}
                  disabled={player === lastBowler}
                >
                  {player} {player === lastBowler && "(bowled last over)"}
                </button>
              ))}
            </div>
            <button 
              className="mt-4 w-full py-2 px-4 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
              onClick={() => setShowChangeBowlerModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* New Batsman Modal */}
      {showNewBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select New Batsman</h2>
            <div className="max-h-60 text-white overflow-y-auto">
              {battingTeam.players
                .filter(player => player !== striker.name && player !== nonStriker.name)
                .map((player, index) => (
                  <button 
                    key={index}
                    className="w-full py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 font-medium mb-2 text-left"
                    onClick={() => handleNewBatsmanSelect(player)}
                  >
                    {player}
                  </button>
                ))}
            </div>
            <button 
              className="mt-4 w-full py-2 px-4 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
              onClick={() => setShowNewBatsmanModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Scoring