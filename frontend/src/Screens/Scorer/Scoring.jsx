import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Scoring = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  // Match data from database
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Match state
  const [matchState, setMatchState] = useState({
    innings: 1,
    battingTeam: null,
    bowlingTeam: null,
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    currentOver: [],
    previousOvers: [],
    crr: 0,
    target: null,
    rrr: null,
    striker: null,
    nonStriker: null,
    currentBowler: null,
    lastBowler: '',
    bowlers: [],
    batsmen: [],
    extras: {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
      total: 0
    },
    matchStatus: 'Live'
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
    showChangeBowlerModal: false,
    showStartInningsModal: false
  });

  // Fetch match data from API
  const fetchMatchData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching match data for match ID: ${matchId}`);
      const response = await api.get(`/api/matches/${matchId}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch match data');
      }
      const data = response.data;
      console.log('Match data fetched successfully:', data);
      setMatchData(data);
      
      // Initialize match state if match is just starting
      if (data.status === 'Upcoming') {
        console.log('Match is upcoming, showing start innings modal');
        setUiState(prev => ({ ...prev, showStartInningsModal: true }));
      } else if (data.status === 'Live') {
        console.log('Match is live, loading existing match state');
        // Load existing match state
        try {
          await loadMatchState();
        } catch (loadErr) {
          console.error('Error loading match state:', loadErr);
          // If loading fails, show the start innings modal
          setUiState(prev => ({ ...prev, showStartInningsModal: true }));
        }
      }
    } catch (err) {
      console.error('Error fetching match data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load existing match state from database
  const loadMatchState = async () => {
    try {
      console.log(`Loading match state for match ID: ${matchId}`);
      const response = await api.get(`/api/matchStates/${matchId}/state`);
      if (response.status === 200) {
        const state = response.data;
        console.log('Loaded match state:', state);
        setMatchState(state);
      }
    } catch (err) {
      console.error('Failed to load match state:', err);
      
      // If match state doesn't exist yet, initialize it
      if (err.response && err.response.status === 404) {
        console.log('Match state not found, initializing new state');
        
        try {
          // First update the match status to Live if needed
          if (matchData && matchData.status !== 'Live') {
            console.log('Updating match status to Live');
            await updateMatchStatus('Live');
          }
          
          // Initialize a new match state
          const newMatchState = {
            matchId,
            innings: 1,
            battingTeam: null,
            bowlingTeam: null,
            score: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
            currentOver: [],
            previousOvers: [],
            crr: 0,
            target: null,
            rrr: null,
            striker: null,
            nonStriker: null,
            currentBowler: null,
            lastBowler: '',
            bowlers: [],
            batsmen: [],
            extras: {
              wides: 0,
              noBalls: 0,
              byes: 0,
              legByes: 0,
              total: 0
            },
            matchStatus: 'Live'
          };
          
          console.log('Creating new match state');
          const savedState = await saveMatchState(newMatchState);
          console.log('New match state created successfully:', savedState);
          setMatchState(savedState);
          
          // Show the start innings modal since this is a new match state
          setUiState(prev => ({ ...prev, showStartInningsModal: true }));
        } catch (createErr) {
          console.error('Failed to create new match state:', createErr);
          // Show the start innings modal even if creation fails
          setUiState(prev => ({ ...prev, showStartInningsModal: true }));
        }
      } else {
        // For other errors, show the start innings modal
        setUiState(prev => ({ ...prev, showStartInningsModal: true }));
      }
    }
  };

  // Save match state to database
  const saveMatchState = async (state) => {
    try {
      console.log(`Saving match state for match ID: ${matchId}`);
      // Ensure matchId is included in the state
      const stateWithMatchId = { ...state, matchId };
      const response = await api.post(`/api/matchStates/${matchId}/state`, stateWithMatchId);
      console.log('Match state saved successfully:', response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to save match state:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
      throw err;
    }
  };

  // Update match status
  const updateMatchStatus = async (status) => {
    try {
      console.log(`Updating match status to ${status} for match ID: ${matchId}`);
      const response = await api.put(`/api/matchStates/${matchId}/status`, { status });
      console.log('Match status updated successfully:', response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to update match status:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
      throw err;
    }
  };

  // Initialize match when component mounts
  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  // Save state whenever it changes
  useEffect(() => {
    const saveState = async () => {
      if (matchData && matchState.battingTeam) {
        try {
          await saveMatchState(matchState);
        } catch (err) {
          console.error('Error in useEffect when saving match state:', err);
        }
      }
    };
    
    // Use a debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      saveState();
    }, 500); // Wait 500ms before saving
    
    return () => clearTimeout(timeoutId);
  }, [matchState, matchData]);

  // Start innings
  const handleStartInnings = async (battingTeamIndex) => {
    const battingTeam = battingTeamIndex === 0 ? 
      { name: matchData.team1_name, players: matchData.team1_players } :
      { name: matchData.team2_name, players: matchData.team2_players };
    
    const bowlingTeam = battingTeamIndex === 0 ? 
      { name: matchData.team2_name, players: matchData.team2_players } :
      { name: matchData.team1_name, players: matchData.team1_players };

    // Initialize batsmen (first two players)
    const striker = {
      name: battingTeam.players[0].name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false
    };

    const nonStriker = {
      name: battingTeam.players[1].name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false
    };

    // Initialize bowlers
    const bowlers = bowlingTeam.players.map(player => ({
      name: player.name,
      overs: 0,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0
    }));

    // Set first bowler
    const currentBowler = bowlers[0];

    const newMatchState = {
      matchId,
      innings: 1,
      battingTeam,
      bowlingTeam,
      score: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      currentOver: [],
      previousOvers: [],
      crr: 0,
      target: null,
      rrr: null,
      striker,
      nonStriker,
      currentBowler,
      lastBowler: '',
      bowlers,
      batsmen: [striker, nonStriker],
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
        total: 0
      },
      matchStatus: 'Live'
    };

    // Update state
    setMatchState(newMatchState);

    // Update match status in database
    await updateMatchStatus('Live');

    // Also update the main match status in the matches collection
    try {
      await api.put(`/api/matches/${matchId}`, { status: 'Live' });
      console.log('Main match status set to Live');
    } catch (err) {
      console.error('Failed to update main match status:', err);
    }

    // Explicitly save the initial match state to the database
    try {
      console.log('Saving initial match state to database');
      const savedState = await saveMatchState(newMatchState);
      console.log('Initial match state saved successfully:', savedState);
    } catch (err) {
      console.error('Failed to save initial match state:', err);
      // If there's an error, try one more time with a delay
      setTimeout(async () => {
        try {
          console.log('Retrying saving initial match state...');
          await saveMatchState(newMatchState);
          console.log('Initial match state saved successfully on retry');
        } catch (retryErr) {
          console.error('Failed to save initial match state on retry:', retryErr);
        }
      }, 1000);
    }

    setUiState(prev => ({ ...prev, showStartInningsModal: false }));
  };

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

  // Calculate CRR and RRR
  useEffect(() => {
    if (!matchData || !matchState.battingTeam) return;

    const totalOvers = matchState.overs + matchState.balls / 6;
    const crr = totalOvers > 0 ? matchState.score / totalOvers : 0;

    let rrr = null;
    if (matchState.innings === 2 && matchState.target) {
      const remainingRuns = matchState.target - matchState.score;
      const remainingOvers = matchData.total_overs - totalOvers;
      rrr = remainingOvers > 0 ? remainingRuns / remainingOvers : 0;
    }

    setMatchState(prev => ({ ...prev, crr, rrr }));
  }, [matchState.score, matchState.overs, matchState.balls, matchState.innings, matchState.target, matchData]);

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
  const handleNewBatsmanSelect = (playerName) => {
    const newBatsman = {
      name: playerName,
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
  const handleSubmitBall = async () => {
    // Validation
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
    let isBatsmanDelivery = true;

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
          isBatsmanDelivery = true;
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
      displayText: getBallDisplayText(uiState.runsScored, uiState.isExtra, uiState.extraType, uiState.isWicket),
      timestamp: new Date().toISOString()
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

    // Increment balls bowled only for legal deliveries
    if (isLegalDelivery) {
      updatedBowler.balls += 1;
    }

    // Add runs conceded
    updatedBowler.runs += runsToAdd;

    // Add wickets
    if (uiState.isWicket) {
      updatedBowler.wickets += 1;
    }

    // Calculate overs
    updatedBowler.overs = parseFloat(
      (Math.floor(updatedBowler.balls / 6) + (updatedBowler.balls % 6) / 10)
    ).toFixed(1);

    // Calculate economy rate
    const oversBowled = updatedBowler.balls / 6;
    updatedBowler.economy = oversBowled > 0 ? parseFloat((updatedBowler.runs / oversBowled).toFixed(2)) : 0;

    // Check for maiden over
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

    // Check if over is complete and end over automatically
    if (isLegalDelivery && matchState.balls === 5) {
      handleEndOver();
    }

    // Check if innings is over
    if (matchState.wickets === 10 ||
      (matchState.overs === matchData.total_overs - 1 && matchState.balls === 5 && isLegalDelivery)) {
      // End of innings
      if (matchState.innings === 1) {
        // Set target for second innings
        setMatchState(prev => ({
          ...prev,
          target: prev.score + runsToAdd + 1
        }));
        // Navigate to innings break
        navigate(`/innings-break/${matchId}`);
      } else {
        // End of match
        await updateMatchStatus('completed');
        navigate(`/match-summary/${matchId}`);
      }
    }

    // Swap striker if odd runs on legal delivery that counts against batsman
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

    // Save ball to database
    try {
      await fetch(`/api/matches/${matchId}/balls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ball),
      });
    } catch (err) {
      console.error('Failed to save ball:', err);
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
  const handleUndoLastBall = async () => {
    if (matchState.currentOver.length === 0) {
      alert('No balls to undo in current over');
      return;
    }

    const lastBall = matchState.currentOver[matchState.currentOver.length - 1];

    // Create a deep copy of match state to revert changes
    const newState = { ...matchState };

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
      const batsmanIndex = newState.batsmen.findIndex(b => b.name === lastBall.batsman);
      if (batsmanIndex !== -1) {
        newState.batsmen[batsmanIndex].isOut = false;
      }
    }

    // Update state
    setMatchState(newState);

    // Save undo action to database
    try {
      await fetch(`/api/matches/${matchId}/undo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ballId: lastBall.id }),
      });
    } catch (err) {
      console.error('Failed to undo ball:', err);
    }
  };

  // Handle swap batsmen
  const handleSwapBatsmen = () => {
    setMatchState(prev => ({
      ...prev,
      striker: prev.nonStriker,
      nonStriker: prev.striker
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl font-bold text-blue-900">Loading match data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl font-bold text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  // No match data
  if (!matchData) {
    return (
      <div className="w-full bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl font-bold text-red-600">Match not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 mx-auto px-4 py-6">
      {/* Match Info */}
      <div className="bg-white/90 p-4 shadow-lg mb-6 text-black">
        <span className="font-bold text-5xl mb-2 text-blue-900">
          {matchData.team1_name} vs {matchData.team2_name}
        </span>
        <p className="text-black text-xl mb-2">
          <span className="font-medium text-green-900">Venue:</span> {matchData.venue}
          <span className="text-xl font-bold text-black"> | </span>
          <span className="font-medium font-bold text-green-900">Date:</span> {matchData.date}
          <span className="text-xl font-bold text-black"> | </span>
          <span className="font-medium font-bold text-green-900">Status:</span> {matchData.status}
        </p>
        
        {matchState.battingTeam && (
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-xl font-bold">
              {matchState.battingTeam.name}: {matchState.score}/{matchState.wickets}
              {matchState.extras.total > 0 && ` (${matchState.extras.total} extras)`}
            </div>
            <div>
              <span className="font-medium text-lg text-blue-900">CRR:</span> {matchState.crr.toFixed(2)}
            </div>
            <div>
              <span className="font-medium text-lg text-blue-900">Overs:</span> {matchState.overs}.{matchState.balls} / {matchData.total_overs}
              {matchState.innings === 2 && matchState.target && (
                <span className="ml-4">
                  <span className="font-medium text-blue-900">Target:</span> {matchState.target} |
                  <span className="font-medium text-blue-900">RRR:</span> {matchState.rrr?.toFixed(2) || 0}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Show scoring interface only if match has started */}
      {matchState.battingTeam && (
        <>
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
                <div className="p-2 rounded bg-blue-700 text-white">
                  <div className="font-medium">{matchState.striker?.name} *</div>
                  <div className="text-sm">
                    {matchState.striker?.runs} ({matchState.striker?.balls}) |
                    {matchState.striker?.fours}x4 | {matchState.striker?.sixes}x6 |
                    SR: {matchState.striker?.strikeRate}
                  </div>
                </div>
                <div className="p-2 rounded bg-gray-700 text-white">
                  <div className="font-medium">{matchState.nonStriker?.name}</div>
                  <div className="text-sm">
                    {matchState.nonStriker?.runs} ({matchState.nonStriker?.balls}) |
                    {matchState.nonStriker?.fours}x
                    4 | {matchState.nonStriker?.sixes}x6 |
                    SR: {matchState.nonStriker?.strikeRate}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSwapBatsmen}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
              >
                Swap Batsmen
              </button>
            </div>

            {/* Bowler Info */}
            <div className="bg-white/90 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2 text-blue-900">Bowler</h2>
              {matchState.currentBowler && (
                <div className="p-2 rounded bg-red-700 text-white">
                  <div className="font-medium">{matchState.currentBowler.name}</div>
                  <div className="text-sm">
                    {matchState.currentBowler.overs} overs | {matchState.currentBowler.runs}/{matchState.currentBowler.wickets} | 
                    Econ: {matchState.currentBowler.economy}
                  </div>
                </div>
              )}
              <button 
                onClick={handleChangeBowler}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Change Bowler
              </button>
            </div>
          </div>

          {/* Scoring Controls */}
          <div className="bg-white/90 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-900">Scoring Controls</h2>
            
            {/* Runs Buttons */}
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-blue-900">Runs</h3>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map(runs => (
                  <button
                    key={runs}
                    onClick={() => handleRunsClick(runs)}
                    className={`py-2 px-4 rounded ${uiState.runsScored === runs ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {runs}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Extras and Wickets */}
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                onClick={handleExtraClick}
                className={`py-2 px-4 rounded ${uiState.isExtra ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Extra
              </button>
              <button
                onClick={handleWicketClick}
                className={`py-2 px-4 rounded ${uiState.isWicket ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Wicket
              </button>
              <button
                onClick={handleBallTypeClick}
                className={`py-2 px-4 rounded ${uiState.ballType ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Ball Type
              </button>
            </div>
            
            {/* Submit and Undo */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSubmitBall}
                className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
              >
                Submit Ball
              </button>
              <button
                onClick={handleUndoLastBall}
                className="py-2 px-6 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-medium"
              >
                Undo Last Ball
              </button>
            </div>
          </div>

          {/* Current Over */}
          <div className="bg-white/90 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-900">Current Over</h2>
            <div className="flex flex-wrap gap-2">
              {matchState.currentOver.map((ball, index) => (
                <div 
                  key={index} 
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    ball.isWicket ? 'bg-red-500 text-white' : 
                    ball.isExtra ? 'bg-yellow-500 text-black' : 
                    ball.runs > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                  {ball.displayText}
                </div>
              ))}
            </div>
          </div>

          {/* Previous Overs */}
          <div className="bg-white/90 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-blue-900">Previous Overs</h2>
            <div className="flex flex-wrap gap-4">
              {matchState.previousOvers.map((over, overIndex) => (
                <div key={overIndex} className="mb-2">
                  <div className="font-medium text-sm text-blue-900">
                    Over {overIndex + 1} ({over[0]?.bowler})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {over.map((ball, ballIndex) => (
                      <div 
                        key={ballIndex} 
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                          ball.isWicket ? 'bg-red-500 text-white' : 
                          ball.isExtra ? 'bg-yellow-500 text-black' : 
                          ball.runs > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                        }`}
                      >
                        {ball.displayText}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Start Innings Modal */}
      {uiState.showStartInningsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Start Innings</h2>
            <p className="mb-4">Which team is batting first?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleStartInnings(0)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {matchData.team1_name}
              </button>
              <button
                onClick={() => handleStartInnings(1)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {matchData.team2_name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wicket Modal */}
      {uiState.showWicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select Wicket Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket'].map(type => (
                <button
                  key={type}
                  onClick={() => handleWicketTypeSelect(type)}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Batsman Modal */}
      {uiState.showNewBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select New Batsman</h2>
            <div className="max-h-96 overflow-y-auto">
              {matchState.battingTeam?.players
                .filter(player => !matchState.batsmen.some(b => b.name === player.name) || b.isOut)
                .map(player => (
                  <button
                    key={player.name}
                    onClick={() => handleNewBatsmanSelect(player.name)}
                    className="w-full py-2 px-4 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-left"
                  >
                    {player.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Extra Modal */}
      {uiState.showExtraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select Extra Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {['wide', 'no-ball', 'bye', 'leg-bye'].map(type => (
                <button
                  key={type}
                  onClick={() => handleExtraTypeSelect(type)}
                  className="py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded capitalize"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ball Type Modal */}
      {uiState.showBallTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select Ball Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Normal', 'Bouncer', 'Yorker', 'Full', 'Good Length', 'Short'].map(type => (
                <button
                  key={type}
                  onClick={() => handleBallTypeSelect(type)}
                  className={`py-2 px-4 ${
                    uiState.ballType === type ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'
                  } text-white rounded`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Change Bowler Modal */}
      {uiState.showChangeBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select New Bowler</h2>
            <div className="max-h-96 overflow-y-auto">
              {matchState.bowlingTeam?.players
                .filter(player => player.name !== matchState.lastBowler)
                .map(player => (
                  <button
                    key={player.name}
                    onClick={() => handleBowlerSelect(player.name)}
                    className="w-full py-2 px-4 mb-2 bg-red-600 hover:bg-red-700 text-white rounded text-left"
                  >
                    {player.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoring;