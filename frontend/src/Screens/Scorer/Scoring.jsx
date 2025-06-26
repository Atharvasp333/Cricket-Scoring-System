import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Scoring = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  // Match data - in a real app, this would come from an API
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
  };

  // Match state
  const [matchState, setMatchState] = useState({
    innings: 1,
    battingTeam: matchData.team1,
    bowlingTeam: matchData.team2,
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    currentOver: [],
    previousOvers: [],
    crr: 0,
    target: null,
    rrr: null,
    striker: {
      name: 'Player A1',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false
    },
    nonStriker: {
      name: 'Player A2',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false
    },
    currentBowler: {
      name: 'Player B1',
      overs: 0,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0
    },
    lastBowler: '',
    bowlers: [],
    batsmen: [
      { name: 'Player A1', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false },
      { name: 'Player A2', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false }
    ],
    extras: {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
      total: 0
    }
  });

  // UI state
  const [uiState, setUiState] = useState({
    ballType: '',
    runsScored: null,
    isExtra: false,
    extraType: '',
    isWicket: false,
    wicketType: '',
    showWicketModal: false,
    showNewBatsmanModal: false,
    showExtraModal: false,
    showBallTypeModal: false,
    showChangeBowlerModal: false
  });

  // Helper function to update batsman stats
  const updateBatsmanStats = useCallback((name, updates) => {
    setMatchState(prev => ({
      ...prev,
      batsmen: prev.batsmen.map(batsman =>
        batsman.name === name ? { ...batsman, ...updates } : batsman
      )
    }));
  }, []);

  // Helper function to update bowler stats
  const updateBowlerStats = useCallback((name, updates) => {
    setMatchState(prev => ({
      ...prev,
      bowlers: prev.bowlers.map(bowler =>
        bowler.name === name ? { ...bowler, ...updates } : bowler
      )
    }));
  }, []);

  // Initialize bowlers
  useEffect(() => {
    if (matchState.bowlers.length === 0) {
      const initialBowlers = matchState.bowlingTeam.players.map(player => ({
        name: player,
        overs: 0,
        balls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0
      }));
      setMatchState(prev => ({ ...prev, bowlers: initialBowlers }));
    }
  }, [matchState.bowlingTeam.players, matchState.bowlers.length]);

  // Calculate CRR and RRR
  useEffect(() => {
    const totalOvers = matchState.overs + matchState.balls / 6;
    const crr = totalOvers > 0 ? matchState.score / totalOvers : 0;

    let rrr = null;
    if (matchState.innings === 2 && matchState.target) {
      const remainingRuns = matchState.target - matchState.score;
      const remainingOvers = matchData.overs - totalOvers;
      rrr = remainingOvers > 0 ? remainingRuns / remainingOvers : 0;
    }

    setMatchState(prev => ({ ...prev, crr, rrr }));
  }, [matchState.score, matchState.overs, matchState.balls, matchState.innings, matchState.target]);

  // Handle runs button click
  const handleRunsClick = (runs) => {
    setUiState(prev => ({
      ...prev,
      runsScored: runs,
      isExtra: false,
      isWicket: false,
      extraType: '',
      wicketType: ''
    }));
  };

  // Handle wicket button click
  const handleWicketClick = () => {
    setUiState(prev => ({
      ...prev,
      isWicket: true,
      showWicketModal: true,
      runsScored: 0,
      isExtra: false,
      extraType: ''
    }));
  };

  // Handle extra button click
  const handleExtraClick = () => {
    setUiState(prev => ({
      ...prev,
      isExtra: true,
      showExtraModal: true,
      isWicket: false,
      wicketType: ''
    }));
  };

  // Handle ball type button click
  const handleBallTypeClick = () => {
    setUiState(prev => ({ ...prev, showBallTypeModal: true }));
  };

  // Handle wicket type selection
  const handleWicketTypeSelect = (type) => {
    setUiState(prev => ({
      ...prev,
      wicketType: type,
      showWicketModal: false
    }));
  };

  // Handle new batsman selection
  const handleNewBatsmanSelect = (player) => {
    const newBatsman = {
      name: player,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false
    };

    setMatchState(prev => ({
      ...prev,
      striker: newBatsman,
      batsmen: [...prev.batsmen, newBatsman]
    }));

    setUiState(prev => ({ ...prev, showNewBatsmanModal: false }));
  };

  // Handle extra type selection
  const handleExtraTypeSelect = (type) => {
    setUiState(prev => ({
      ...prev,
      extraType: type,
      showExtraModal: false
    }));
  };

  // Handle ball type selection
  const handleBallTypeSelect = (type) => {
    setUiState(prev => ({ ...prev, ballType: type, showBallTypeModal: false }));
  };

  // Handle change bowler
  const handleChangeBowler = () => {
    setUiState(prev => ({ ...prev, showChangeBowlerModal: true }));
  };

  // Handle bowler selection
  const handleBowlerSelect = (bowlerName) => {
    // Prevent selecting the same bowler consecutively
    if (bowlerName === matchState.lastBowler) {
      alert('The same bowler cannot bowl consecutive overs');
      return;
    }

    // Find the bowler in the bowlers list
    const selectedBowler = matchState.bowlers.find(b => b.name === bowlerName) || {
      name: bowlerName,
      overs: 0,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0
    };

    setMatchState(prev => ({
      ...prev,
      currentBowler: selectedBowler,
      lastBowler: bowlerName
    }));

    setUiState(prev => ({ ...prev, showChangeBowlerModal: false }));
  };

  // Handle end over automatically when 6 legal balls are bowled
  const handleEndOver = useCallback(() => {
    // Add current over to previous overs
    setMatchState(prev => ({
      ...prev,
      previousOvers: [...prev.previousOvers, prev.currentOver],
      currentOver: [],
      overs: prev.overs + 1,
      balls: 0,
      lastBowler: prev.currentBowler.name
    }));

    // Swap striker and non-striker
    setMatchState(prev => ({
      ...prev,
      striker: prev.nonStriker,
      nonStriker: prev.striker
    }));

    // Show change bowler modal
    setUiState(prev => ({ ...prev, showChangeBowlerModal: true }));
  }, []);

  // Handle submit ball
  const handleSubmitBall = () => {
    // Check if ball type is selected for legal deliveries
    if (!uiState.isExtra && !uiState.ballType) {
      alert('Please select a ball type for legal deliveries');
      return;
    }

    if (uiState.isExtra && !uiState.extraType) {
      alert('Please select an extra type');
      return;
    }

    if (uiState.isWicket && !uiState.wicketType) {
      alert('Please select a wicket type');
      return;
    }

    // Calculate runs to add to team score
    let runsToAdd = uiState.runsScored || 0;
    let isLegalDelivery = true;
    let isBatsmanDelivery = true; // Does this delivery count against batsman stats

    // Handle extras
    if (uiState.isExtra) {
      switch (uiState.extraType) {
        case 'wide':
          runsToAdd += 1;
          isLegalDelivery = false;
          isBatsmanDelivery = false;
          setMatchState(prev => ({
            ...prev,
            extras: {
              ...prev.extras,
              wides: prev.extras.wides + 1,
              total: prev.extras.total + runsToAdd
            }
          }));
          break;
        case 'no-ball':
          runsToAdd += 1;
          isLegalDelivery = false;
          isBatsmanDelivery = true; // No-balls count against batsman
          setMatchState(prev => ({
            ...prev,
            extras: {
              ...prev.extras,
              noBalls: prev.extras.noBalls + 1,
              total: prev.extras.total + runsToAdd
            }
          }));
          break;
        case 'bye':
          isBatsmanDelivery = false;
          setMatchState(prev => ({
            ...prev,
            extras: {
              ...prev.extras,
              byes: prev.extras.byes + runsToAdd,
              total: prev.extras.total + runsToAdd
            }
          }));
          break;
        case 'leg-bye':
          isBatsmanDelivery = false;
          setMatchState(prev => ({
            ...prev,
            extras: {
              ...prev.extras,
              legByes: prev.extras.legByes + runsToAdd,
              total: prev.extras.total + runsToAdd
            }
          }));
          break;
        default:
          break;
      }
    }

    // Create ball object
    const ball = {
      runs: uiState.runsScored,
      isExtra: uiState.isExtra,
      extraType: uiState.extraType,
      isWicket: uiState.isWicket,
      wicketType: uiState.wicketType,
      ballType: uiState.ballType,
      bowler: matchState.currentBowler.name,
      batsman: matchState.striker.name,
      displayText: getBallDisplayText(uiState.runsScored, uiState.isExtra, uiState.extraType, uiState.isWicket)
    };

    // Update current over
    setMatchState(prev => ({
      ...prev,
      currentOver: [...prev.currentOver, ball]
    }));

    // Update team score
    setMatchState(prev => ({
      ...prev,
      score: prev.score + runsToAdd
    }));

    // Update wickets if wicket fell
    if (uiState.isWicket) {
      setMatchState(prev => ({
        ...prev,
        wickets: prev.wickets + 1
      }));

      // Mark batsman as out
      updateBatsmanStats(matchState.striker.name, { isOut: true });
    }

    // Update batsman stats for legal deliveries or no-balls
    if (isBatsmanDelivery) {
      const updatedStriker = { ...matchState.striker };

      // Increment balls faced (except for wides)
      if (!uiState.isExtra || uiState.extraType === 'no-ball') {
        updatedStriker.balls += 1;
      }

      // Add runs to batsman (except for byes/leg-byes)
      if (!uiState.isExtra || uiState.extraType === 'no-ball') {
        updatedStriker.runs += (uiState.runsScored || 0);
        if (uiState.runsScored === 4) updatedStriker.fours += 1;
        if (uiState.runsScored === 6) updatedStriker.sixes += 1;
      }

      // Calculate strike rate
      if (updatedStriker.balls > 0) {
        updatedStriker.strikeRate = parseFloat(((updatedStriker.runs / updatedStriker.balls) * 100).toFixed(2));
      }

      setMatchState(prev => ({
        ...prev,
        striker: updatedStriker
      }));

      // Update batsmen array
      updateBatsmanStats(updatedStriker.name, updatedStriker);
    }

    // Update bowler stats
    const updatedBowler = { ...matchState.currentBowler };

    // Increment balls bowled only for legal deliveries (not wides/no-balls)
    if (isLegalDelivery) {
      updatedBowler.balls += 1;
    }

    // Add runs conceded
    updatedBowler.runs += runsToAdd;

    // Add wickets
    if (uiState.isWicket) {
      updatedBowler.wickets += 1;
    }

    // Calculate overs (e.g., 1.3 means 1 over and 3 balls)
    updatedBowler.overs = parseFloat(
      (Math.floor(updatedBowler.balls / 6) + (updatedBowler.balls % 6) / 10)
    ).toFixed(1);

    // Calculate economy rate
    const oversBowled = updatedBowler.balls / 6;
    updatedBowler.economy = parseFloat((updatedBowler.runs / oversBowled).toFixed(2));

    // Check for maiden over (only if all 6 balls are legal deliveries)
    if (isLegalDelivery && matchState.balls === 5 && updatedBowler.runs === 0) {
      updatedBowler.maidens += 1;
    }

    setMatchState(prev => ({
      ...prev,
      currentBowler: updatedBowler
    }));

    // Update bowlers array
    updateBowlerStats(updatedBowler.name, updatedBowler);

    // Update balls count only for legal deliveries
    if (isLegalDelivery) {
      setMatchState(prev => ({
        ...prev,
        balls: prev.balls + 1
      }));
    }

    // Check if over is complete (6 legal deliveries) and end over automatically
    if (isLegalDelivery && matchState.balls === 5) {
      handleEndOver();
    }

    // Check if innings is over (all wickets or all overs)
    if (matchState.wickets === 10 ||
      (matchState.overs === matchData.overs - 1 && matchState.balls === 5 && isLegalDelivery)) {
      // End of innings
      if (matchState.innings === 1) {
        // Set target for second innings
        setMatchState(prev => ({
          ...prev,
          target: prev.score + runsToAdd + 1
        }));
        // Navigate to innings break page
        navigate(`/innings-break/${matchId}`);
      } else {
        // End of match
        navigate(`/match-summary/${matchId}`);
      }
    }

    // Swap striker if odd runs (1 or 3) on a legal delivery that counts against batsman
    if (uiState.runsScored && uiState.runsScored % 2 === 1 && isBatsmanDelivery) {
      setMatchState(prev => ({
        ...prev,
        striker: prev.nonStriker,
        nonStriker: prev.striker
      }));
    }

    // Reset UI state
    setUiState(prev => ({
      ...prev,
      runsScored: null,
      isExtra: false,
      extraType: '',
      isWicket: false,
      wicketType: '',
      ballType: ''
    }));

    // Show new batsman modal if a wicket fell
    if (uiState.isWicket) {
      setUiState(prev => ({ ...prev, showNewBatsmanModal: true }));
    }
  };

  // Helper function to get ball display text
  const getBallDisplayText = (runs, isExtra, extraType, isWicket) => {
    if (isWicket) return 'W';
    if (isExtra) {
      switch (extraType) {
        case 'wide': return runs > 0 ? `Wd+${runs}` : 'Wd';
        case 'no-ball': return runs > 0 ? `Nb+${runs}` : 'Nb';
        case 'bye': return runs > 0 ? `B+${runs}` : 'B';
        case 'leg-bye': return runs > 0 ? `Lb+${runs}` : 'Lb';
        default: return 'E';
      }
    }
    return runs !== null ? runs.toString() : '';
  };

  // Handle undo last ball
  const handleUndoLastBall = () => {
    if (matchState.currentOver.length === 0) {
      alert('No balls to undo in current over');
      return;
    }

    const lastBall = matchState.currentOver[matchState.currentOver.length - 1];

    // Create a deep copy of match state to revert changes
    const newState = JSON.parse(JSON.stringify(matchState));

    // Remove last ball from current over
    newState.currentOver = newState.currentOver.slice(0, -1);

    // Revert score
    let runsToSubtract = lastBall.runs || 0;
    if (lastBall.isExtra) {
      switch (lastBall.extraType) {
        case 'wide':
          runsToSubtract += 1;
          newState.extras.wides -= 1;
          newState.extras.total -= runsToSubtract;
          break;
        case 'no-ball':
          runsToSubtract += 1;
          newState.extras.noBalls -= 1;
          newState.extras.total -= runsToSubtract;
          break;
        case 'bye':
          newState.extras.byes -= runsToSubtract;
          newState.extras.total -= runsToSubtract;
          break;
        case 'leg-bye':
          newState.extras.legByes -= runsToSubtract;
          newState.extras.total -= runsToSubtract;
          break;
        default:
          break;
      }
    }
    newState.score -= runsToSubtract;

    // Revert wickets
    if (lastBall.isWicket) {
      newState.wickets -= 1;
      // Find the batsman and mark as not out
      const batsmanIndex = newState.batsmen.findIndex(b => b.name === lastBall.batsman);
      if (batsmanIndex !== -1) {
        newState.batsmen[batsmanIndex].isOut = false;
      }
    }

    // Revert batsman stats if it was a legal delivery or no-ball
    if (!lastBall.isExtra || lastBall.extraType === 'no-ball') {
      const strikerIndex = newState.batsmen.findIndex(b => b.name === newState.striker.name);
      if (strikerIndex !== -1) {
        const batsman = newState.batsmen[strikerIndex];
        if (!lastBall.isExtra) {
          batsman.balls -= 1;
          batsman.runs -= (lastBall.runs || 0);
          if (lastBall.runs === 4) batsman.fours -= 1;
          if (lastBall.runs === 6) batsman.sixes -= 1;
        } else if (lastBall.extraType === 'no-ball') {
          batsman.runs -= (lastBall.runs || 0);
          if (lastBall.runs === 4) batsman.fours -= 1;
          if (lastBall.runs === 6) batsman.sixes -= 1;
        }
        if (batsman.balls > 0) {
          batsman.strikeRate = parseFloat(((batsman.runs / batsman.balls) * 100).toFixed(2));
        } else {
          batsman.strikeRate = 0;
        }
      }
    }

    // Revert bowler stats
    const bowlerIndex = newState.bowlers.findIndex(b => b.name === lastBall.bowler);
    if (bowlerIndex !== -1) {
      const bowler = newState.bowlers[bowlerIndex];

      // Decrement balls bowled for legal deliveries (not wides/no-balls)
      if (!lastBall.isExtra || lastBall.extraType === 'no-ball') {
        bowler.balls -= 1;
      }

      // Subtract runs conceded
      bowler.runs -= runsToSubtract;

      // Subtract wickets
      if (lastBall.isWicket) {
        bowler.wickets -= 1;
      }

      // Recalculate overs and economy
      bowler.overs = parseFloat(
        (Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10)
      ).toFixed(1);

      const oversBowled = bowler.balls / 6;
      bowler.economy = oversBowled > 0 ?
        parseFloat((bowler.runs / oversBowled).toFixed(2)) : 0;

      // Revert maiden if needed
      if (newState.balls === 6 && bowler.runs === 0) {
        bowler.maidens -= 1;
      }
    }

    // Revert balls count only for legal deliveries
    if (!lastBall.isExtra || lastBall.extraType === 'no-ball') {
      newState.balls -= 1;
    }

    // Update state
    setMatchState(newState);
  };

  // Handle swap batsmen
  const handleSwapBatsmen = () => {
    setMatchState(prev => ({
      ...prev,
      striker: prev.nonStriker,
      nonStriker: prev.striker
    }));
  };

  return (
    <div className="w-full bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 mx-auto px-4 py-6">
      {/* Match Info */}
      <div className="bg-white/90 p-4 shadow-lg mb-6 text-black">
        <span className=" font-bold text-5xl mb-2 text-blue-900">
          {matchState.battingTeam.name} vs {matchState.bowlingTeam.name}
        </span>
        <p className="text-black text-xl mb-2">
          <span className="font-medium text-green-900">Venue:</span> {matchData.venue} <space></space>
          <span className="text-xl font-bold text-black"> | </span>
          <span className="font-medium font-bold text-green-900"> Date: </span> {matchData.date}
        </p>
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-xl font-bold">
            {matchState.battingTeam.name}: {matchState.score}/{matchState.wickets}
            {matchState.extras.total > 0 && ` (${matchState.extras.total} extras)`}
          </div>
          <div>
            <span className="font-medium text-lg text-blue-900">CRR:</span> {matchState.crr.toFixed(2)}
          </div>
          <div>
            <span className="font-medium text-lg text-blue-900">Overs:</span> {matchState.overs}.{matchState.balls} / {matchData.overs}

            {matchState.innings === 2 && matchState.target && (
              <span className="ml-4">
                <span className="font-medium text-blue-900">Target:</span> {matchState.target} |
                <span className="font-medium text-blue-900">RRR:</span> {matchState.rrr.toFixed(2)}
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
          <div className="flex flex-wrap text-lg items-center">
            <div className="mr-4 text-black mb-2">
              <span className="font-medium text-blue-900">Over:</span> {matchState.overs}.{matchState.balls + 1}
            </div>
            {uiState.runsScored !== null && (
              <div className="mr-4 text-black mb-2">
                <span className="font-medium text-blue-900">Runs:</span> {uiState.runsScored}
              </div>
            )}
            {uiState.isExtra && (
              <div className="mr-4 text-black mb-2">
                <span className="font-medium text-blue-900">Extra:</span> {uiState.extraType}
              </div>
            )}
            {uiState.isWicket && (
              <div className="mr-4 text-black mb-2">
                <span className="font-medium text-blue-900">Wicket:</span> {uiState.wicketType}
              </div>
            )}
            {uiState.ballType && (
              <div className="mr-4 text-black mb-2">
                <span className="font-medium text-blue-900">Ball Type:</span> {uiState.ballType}
              </div>
            )}
          </div>
        </div>

        {/* Batsmen Info */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Batsmen</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 rounded ${matchState.striker ? 'bg-blue-700' : 'bg-gray-700'}`}>
              <div className="font-medium">{matchState.striker.name} *</div>
              <div className="text-sm">
                {matchState.striker.runs} ({matchState.striker.balls}) |
                {matchState.striker.fours}x4 | {matchState.striker.sixes}x6 |
                SR: {matchState.striker.strikeRate}
              </div>
            </div>
            <div className={`p-2 rounded ${!matchState.striker ? 'bg-blue-700' : 'bg-gray-700'}`}>
              <div className="font-medium">{matchState.nonStriker.name}</div>
              <div className="text-sm">
                {matchState.nonStriker.runs} ({matchState.nonStriker.balls}) |
                {matchState.nonStriker.fours}x4 | {matchState.nonStriker.sixes}x6 |
                SR: {matchState.nonStriker.strikeRate}
              </div>
            </div>
          </div>
        </div>

        {/* Bowler Info */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Bowler</h2>
          <div className="p-2 rounded bg-red-500">
            <div className="font-medium">{matchState.currentBowler.name}</div>
            <div className="text-sm">
              {matchState.currentBowler.overs} overs | {matchState.currentBowler.runs}R |
              {matchState.currentBowler.wickets}W | Econ: {matchState.currentBowler.economy} |
              Maidens: {matchState.currentBowler.maidens}
            </div>
          </div>
        </div>
      </div>

      {/* Over Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Current Over */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Current Over</h2>
          <div className="flex flex-wrap">
            {matchState.currentOver.length > 0 ? (
              matchState.currentOver.map((ball, index) => (
                <div
                  key={index}
                  className={`
                    w-auto min-w-10 h-10 px-2 flex items-center justify-center rounded-full m-1 text-white font-bold
                    ${ball.isWicket ? 'bg-red-500' :
                      ball.isExtra ? 'bg-yellow-500' :
                        ball.runs === 4 ? 'bg-green-500' :
                          ball.runs === 6 ? 'bg-purple-500' : 'bg-blue-500'}
                  `}
                >
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
            {matchState.previousOvers.length > 0 ? (
              matchState.previousOvers.map((over, overIndex) => (
                <div key={overIndex} className="mb-2">
                  <span className="font-medium text-blue-900">Over {overIndex + 1}:</span>
                  <div className="flex flex-wrap">
                    {over.map((ball, ballIndex) => (
                      <div
                        key={ballIndex}
                        className={`
                          w-auto min-w-8 h-8 px-1 flex items-center justify-center rounded-full m-1 text-white font-bold text-sm
                          ${ball.isWicket ? 'bg-red-500' :
                            ball.isExtra ? 'bg-yellow-500' :
                              ball.runs === 4 ? 'bg-green-500' :
                                ball.runs === 6 ? 'bg-purple-500' : 'bg-blue-500'}
                        `}
                      >
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
          <div className="flex justify-center flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 6].map(runs => (
              <button
                key={runs}
                className={`w-12 h-12 rounded-full font-bold ${uiState.runsScored === runs && !uiState.isWicket && !uiState.isExtra ?
                  runs === 4 ? 'bg-green-500' :
                    runs === 6 ? 'bg-purple-500' : 'bg-blue-500' :
                  'bg-black'
                  } text-white hover:brightness-110`}
                onClick={() => handleRunsClick(runs)}
              >
                {runs}
              </button>
            ))}
          </div>
        </div>

        {/* Wicket and Extras Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-md font-medium mb-2 text-blue-900">Wicket</h3>
            <button
              className={`w-full py-2 px-4 rounded font-bold ${uiState.isWicket ? 'bg-red-500' : 'bg-black'
                } text-white hover:brightness-110`}
              onClick={handleWicketClick}
            >
              Wicket
            </button>
          </div>
          <div>
            <h3 className="text-md font-medium mb-2 text-blue-900">Extras</h3>
            <button
              className={`w-full py-2 px-4 rounded font-bold ${uiState.isExtra ? 'bg-yellow-500' : 'bg-black'
                } text-white hover:brightness-110`}
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
            className={`w-full py-2 px-4 rounded font-bold ${uiState.ballType ? 'bg-blue-500' : 'bg-black'
              } text-white hover:brightness-110`}
            onClick={handleBallTypeClick}
          >
            {uiState.ballType || 'Select Ball Type'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            className="py-2 px-4 rounded bg-green-600 text-white font-bold hover:bg-green-900"
            onClick={handleSubmitBall}
            disabled={uiState.runsScored === null && !uiState.isWicket && !uiState.isExtra}
          >
            Submit
          </button>
          <button
            className="py-2 px-4 rounded bg-red-500 text-white font-bold hover:bg-red-700"
            onClick={handleUndoLastBall}
            disabled={matchState.currentOver.length === 0 && matchState.previousOvers.length === 0}
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
            onClick={handleSwapBatsmen}
          >
            Swap Batsmen
          </button>
          {/* Add this new button */}
          <button
            className="py-2 px-4 rounded bg-purple-600 text-white font-bold hover:bg-purple-700"
            onClick={() => navigate(`/postmatch/${matchId}`)}
          >
            Go to Post-Match
          </button>
        </div>
      </div>

      {/* Wicket Modal */}
      {uiState.showWicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Wicket Type</h2>
            <div className="grid grid-cols-2 text-white gap-4">
              {['bowled', 'caught', 'lbw', 'run-out', 'stumped', 'hit-wicket'].map(type => (
                <button
                  key={type}
                  className="py-2 px-4 rounded bg-black hover:bg-red-700 font-medium"
                  onClick={() => handleWicketTypeSelect(type)}
                >
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full py-2 px-4 rounded bg-gray-400 text-black font-bold hover:bg-gray-600"
              onClick={() => setUiState(prev => ({ ...prev, showWicketModal: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Extra Modal */}
      {uiState.showExtraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Extra Type</h2>
            <div className="grid grid-cols-2 text-white gap-4">
              {['wide', 'no-ball', 'leg-bye', 'bye'].map(type => (
                <button
                  key={type}
                  className="py-2 px-4 rounded bg-black hover:bg-yellow-500 hover:text-black font-medium"
                  onClick={() => handleExtraTypeSelect(type)}
                >
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full py-2 px-4 rounded bg-gray-400 text-black font-bold hover:bg-gray-600"
              onClick={() => setUiState(prev => ({ ...prev, showExtraModal: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ball Type Modal */}
      {uiState.showBallTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-full max-w-4xl text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Ball Type</h2>
            <div className="grid text-white grid-cols-3 gap-4">
              {/* Pace Bowling */}
              <div>
                <h3 className="font-medium mb-2 text-blue-700">Pace</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Yorker', 'Bouncer', 'Full Toss', 'Length Ball', 'Short Ball', 'Slower Ball'].map(type => (
                    <button
                      key={type}
                      className="py-2 px-4 rounded bg-black hover:bg-blue-600 font-medium"
                      onClick={() => handleBallTypeSelect(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spin Bowling */}
              <div>
                <h3 className="font-medium mb-2 text-green-700">Spin</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Off Spin', 'Leg Spin', 'Googly', 'Doosra', 'Carrom Ball', 'Arm Ball'].map(type => (
                    <button
                      key={type}
                      className="py-2 px-4 rounded bg-black hover:bg-blue-600 font-medium"
                      onClick={() => handleBallTypeSelect(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seam Bowling */}
              <div>
                <h3 className="font-medium mb-2 text-red-700">Seam</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Outswinger', 'Inswinger', 'Reverse Swing', 'Cutter', 'Off Cutter', 'Leg Cutter'].map(type => (
                    <button
                      key={type}
                      className="py-2 px-4 rounded bg-black hover:bg-blue-600 font-medium"
                      onClick={() => handleBallTypeSelect(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="mt-4 w-full py-2 px-4 rounded bg-gray-400 text-black font-bold hover:bg-gray-600"
              onClick={() => setUiState(prev => ({ ...prev, showBallTypeModal: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Change Bowler Modal */}
      {uiState.showChangeBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select Bowler</h2>
            <div className="max-h-60 overflow-y-auto">
              {matchState.bowlingTeam.players.map((player, index) => (
                <button
                  key={index}
                  className={`w-full text-white py-2 px-4 rounded ${player === matchState.lastBowler ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                    } font-medium mb-2 text-left`}
                  onClick={() => handleBowlerSelect(player)}
                  disabled={player === matchState.lastBowler}
                >
                  {player} {player === matchState.lastBowler && "(bowled last over)"}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full py-2 px-4 rounded bg-gray-400 text-black font-bold hover:bg-gray-600"
              onClick={() => setUiState(prev => ({ ...prev, showChangeBowlerModal: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* New Batsman Modal */}
      {uiState.showNewBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Select New Batsman</h2>
            <div className="max-h-60 text-white overflow-y-auto">
              {matchState.battingTeam.players
                .filter(player =>
                  player !== matchState.striker.name &&
                  player !== matchState.nonStriker.name &&
                  !matchState.batsmen.some(b => b.name === player && b.isOut)
                )
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
              className="mt-4 w-full py-2 px-4 rounded bg-gray-400 text-black font-bold hover:bg-gray-600"
              onClick={() => setUiState(prev => ({ ...prev, showNewBatsmanModal: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoring;