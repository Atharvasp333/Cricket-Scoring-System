import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import WagonWheel from '../Scorer/WagonWheel';
import { Components, Icons } from '../../exports';

const {
  Button,
  Card,
  Modal,
  Select,
  Input,
  LoadingSpinner,
  Alert
} = Components;

const {
  FiAlertCircle,
  FiCheck,
  FiX,
  FiSave,
  FiRefreshCw,
  FiPlus,
  FiMinus
} = Icons;

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
    showStartInningsModal: false,
    showWagonWheel: false,
    selectedShotDirection: null,
  });

  // Initialize match state
  useEffect(() => {
    const initializeMatchState = async () => {
      try {
        setLoading(true);
        // Try to load existing match state from database
        const response = await api.get(`/api/matchStates/${matchId}/state`);

        if (response.status === 200 && response.data) {
          // Existing match state found
          const existingState = response.data;
          setMatchState(existingState);
          console.log('Loaded existing match state:', existingState);
        } else {
          // No existing match state, initialize new one
          console.log('No existing match state found, initializing new one');
          
          // Check if we have URL parameters from MatchSetup
          const urlParams = new URLSearchParams(window.location.search);
          const hasSetupParams = urlParams.has('striker') && urlParams.has('nonStriker') && urlParams.has('bowler');
          
          if (hasSetupParams && matchData) {
            console.log('Found setup parameters in URL, using them to initialize match');
            // If we have URL parameters, automatically start the match with the selected team
            const battingTeamIndex = matchData.team1_players?.some(p => p.name === urlParams.get('striker')) ? 0 : 1;
            await handleStartInnings(battingTeamIndex);
          } else {
            // If no URL parameters, show the start innings modal
            setUiState(prev => ({ ...prev, showStartInningsModal: true }));
          }
        }
      } catch (err) {
        console.error('Error initializing match state:', err);
        // If error is 404, show start innings modal
        if (err.response?.status === 404) {
          setUiState(prev => ({ ...prev, showStartInningsModal: true }));
        } else {
          setError('Failed to initialize match state: ' + (err.message || 'Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    };

    if (matchData && matchId) {
      initializeMatchState();
    }
  }, [matchData, matchId]);

  // Fetch match data from API
  const fetchMatchData = useCallback(async () => {
    if (!matchId) {
      setError('No match ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching match data for match ID: ${matchId}`);
      const response = await api.get(`/api/matches/${matchId}`);
      
      if (response.status !== 200 || !response.data) {
        throw new Error('Failed to fetch match data');
      }
      
      const data = response.data;
      console.log('Match data fetched successfully:', data);
      setMatchData(data);

    } catch (err) {
      console.error('Error fetching match data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch match data');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

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
  }, [matchId, fetchMatchData]);

  // Save state whenever it changes (with debounce)
  useEffect(() => {
    const saveState = async () => {
      if (matchData && matchState.battingTeam && matchId) {
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
  }, [matchState, matchData, matchId]);

  // Start innings
  const handleStartInnings = async (battingTeamIndex) => {
    try {
      if (!matchData || !matchData.team1_players || !matchData.team2_players) {
        throw new Error('Match data not available');
      }

      const battingTeam = battingTeamIndex === 0 ?
        { name: matchData.team1_name, players: matchData.team1_players } :
        { name: matchData.team2_name, players: matchData.team2_players };

      const bowlingTeam = battingTeamIndex === 0 ?
        { name: matchData.team2_name, players: matchData.team2_players } :
        { name: matchData.team1_name, players: matchData.team1_players };

      // Validate team data
      if (!battingTeam.players || battingTeam.players.length === 0) {
        throw new Error('Batting team has no players');
      }
      if (!bowlingTeam.players || bowlingTeam.players.length === 0) {
        throw new Error('Bowling team has no players');
      }

      // Get the URL search params to check if we have striker, non-striker, and bowler from MatchSetup
      const urlParams = new URLSearchParams(window.location.search);
      const strikerName = urlParams.get('striker');
      const nonStrikerName = urlParams.get('nonStriker');
      const bowlerName = urlParams.get('bowler');

      // Find the selected players or use defaults
      const strikerPlayer = strikerName ?
        battingTeam.players.find(p => p.name === strikerName) || battingTeam.players[0] :
        battingTeam.players[0];

      const nonStrikerPlayer = nonStrikerName ?
        battingTeam.players.find(p => p.name === nonStrikerName) || battingTeam.players[1] :
        battingTeam.players[1];

      const bowlerPlayer = bowlerName ?
        bowlingTeam.players.find(p => p.name === bowlerName) || bowlingTeam.players[0] :
        bowlingTeam.players[0];

      // Initialize batsmen (first two players)
      const striker = {
        name: strikerPlayer.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isOut: false
      };

      const nonStriker = {
        name: nonStrikerPlayer.name,
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
      const currentBowler = bowlers.find(b => b.name === bowlerPlayer.name) || bowlers[0];

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
        // Show error but don't block the UI
        setError('Failed to save match state. Continue scoring, but data may not persist.');
      }

      setUiState(prev => ({ ...prev, showStartInningsModal: false }));
    } catch (err) {
      console.error('Error starting innings:', err);
      setError('Failed to start innings: ' + err.message);
    }
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

  // Handle wagon wheel button click
  const handleShowWagonWheel = () => {
    setUiState(prev => ({ ...prev, showWagonWheel: true }));
  };

  // Handle close wagon wheel
  const handleCloseWagonWheel = () => {
    setUiState(prev => ({ ...prev, showWagonWheel: false }));
  };

  // Handle shot direction selection
  const handleShotDirectionSelect = (shotDirection) => {
    setUiState(prev => ({
      ...prev,
      selectedShotDirection: shotDirection
    }));
  };

  // Helper function to get available batsmen (not out and haven't batted yet)
  const getAvailableBatsmen = useCallback(() => {
    if (!matchState.battingTeam?.players) return [];
    
    // Filter players who haven't batted yet or aren't currently batting
    return matchState.battingTeam.players.filter(player => 
      !matchState.batsmen.some(b => b.name === player.name) ||
      (matchState.batsmen.some(b => b.name === player.name && !b.isOut))
    );
  }, [matchState.battingTeam, matchState.batsmen]);

  // Handle wicket type selection with additional info for certain dismissals
  const handleWicketTypeSelect = (type, fielderName = null) => {
    setUiState(prev => ({
      ...prev,
      wicketType: type,
      showWicketModal: false,
      dismissalInfo: type === 'run out' || type === 'caught' ? {
        fielderName,
        isRunOut: type === 'run out',
        isCaught: type === 'caught'
      } : null
    }));
  };

  // Handle new batsman selection
  const handleNewBatsmanSelect = (playerName) => {
    // Check if player already exists in batsmen array
    const existingBatsman = matchState.batsmen.find(b => b.name === playerName && !b.isOut);
    
    // If player exists and is not out, use that player
    if (existingBatsman) {
      setMatchState(prev => ({
        ...prev,
        striker: existingBatsman
      }));
    } else {
      // Create new batsman entry
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
    }

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
      lastBowler: prev.currentBowler?.name || ''
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

  // Helper function to get ball display text
  const getBallDisplayText = (runs, isExtra, extraType, isWicket, shotDirection) => {
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

  // Handle submit ball
  const handleSubmitBall = async () => {
    try {
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

      // Validate fielder for caught and run out
      if (uiState.isWicket && (uiState.wicketType === 'caught' || uiState.wicketType === 'run out') && !uiState.dismissalInfo?.fielderName) {
        alert('Please select a fielder for this dismissal type');
        return;
      }

      if (!matchState.currentBowler) {
        alert('No bowler selected');
        return;
      }

      if (!matchState.striker) {
        alert('No striker available');
        return;
      }
      
      // Calculate max wickets based on team size
      const maxWickets = matchState.battingTeam.players.length - 1;
      if (uiState.isWicket && matchState.wickets >= maxWickets) {
        alert('All batsmen are out! Innings should be over.');
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

      // Create ball object with dismissal info
      const ball = {
        runs: uiState.runsScored,
        isExtra: uiState.isExtra,
        extraType: uiState.extraType,
        isWicket: uiState.isWicket,
        wicketType: uiState.wicketType,
        ballType: uiState.ballType,
        bowler: matchState.currentBowler.name,
        batsman: matchState.striker.name,
        shotDirection: uiState.selectedShotDirection,
        displayText: getBallDisplayText(
          uiState.runsScored,
          uiState.isExtra,
          uiState.extraType,
          uiState.isWicket,
          uiState.selectedShotDirection
        ),
        timestamp: new Date().toISOString(),
        dismissalInfo: uiState.dismissalInfo,
        fielder: uiState.dismissalInfo?.fielderName
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
        const maxWickets = matchState.battingTeam.players.length - 1;
        
        setMatchState(prev => {
          const newWickets = prev.wickets + 1;
          const isInningsOver = newWickets >= maxWickets || 
                              (matchData?.total_overs && 
                               prev.overs === matchData.total_overs - 1 && 
                               prev.balls === 5 && 
                               isLegalDelivery);

          // Mark batsman as out
          const updatedBatsmen = prev.batsmen.map(b => 
            b.name === prev.striker.name ? { ...b, isOut: true } : b
          );

          return {
            ...prev,
            wickets: newWickets,
            batsmen: updatedBatsmen,
            matchStatus: isInningsOver ? 'Innings Break' : prev.matchStatus
          };
        });

        // For run outs, runs still count to batsman and team
        if (uiState.wicketType === 'run out' && uiState.runsScored) {
          // Note: We don't need to update team score here as it's already updated above
          // But we do need to ensure batsman gets credit for runs on run out
          updateBatsmanStats(matchState.striker.name, {
            runs: matchState.striker.runs + uiState.runsScored,
            balls: matchState.striker.balls + (isLegalDelivery ? 1 : 0),
            fours: uiState.runsScored === 4 ? matchState.striker.fours + 1 : matchState.striker.fours,
            sixes: uiState.runsScored === 6 ? matchState.striker.sixes + 1 : matchState.striker.sixes
          });
        }
      }

      // Update batsman stats for legal deliveries or no-balls
      if (isBatsmanDelivery && matchState.striker) {
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
      if (matchState.currentBowler) {
        const updatedBowler = { ...matchState.currentBowler };

        // Increment balls bowled only for legal deliveries
        if (isLegalDelivery) {
          updatedBowler.balls += 1;
        }

        // Add runs conceded (except byes)
        if (!uiState.isExtra || uiState.extraType !== 'bye') {
          updatedBowler.runs += runsToAdd;
        }

        // Add wickets (except run outs)
        if (uiState.isWicket && uiState.wicketType !== 'run out') {
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
      }

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
      // Using maxWickets already declared above
      if (matchState.wickets >= maxWickets ||
        (matchData?.total_overs && matchState.overs === matchData.total_overs - 1 && matchState.balls === 5 && isLegalDelivery)) {
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
        return;
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
        ballType: '',
        selectedShotDirection: null
      }));

      // Show new batsman modal if a wicket fell
      if (uiState.isWicket) {
        const availableBatsmen = getAvailableBatsmen();
        if (availableBatsmen.length > 0) {
          setUiState(prev => ({ ...prev, showNewBatsmanModal: true }));
        } else {
          alert('No available batsmen remaining!');
        }
      }

      // Save ball to database
      try {
        await api.post(`/api/matches/${matchId}/balls`, ball);
      } catch (err) {
        console.error('Failed to save ball:', err);
        // Don't block the UI for this error
      }

    } catch (err) {
      console.error('Error submitting ball:', err);
      setError('Failed to submit ball: ' + err.message);
    }
  };

  // Handle undo last ball
  const handleUndoLastBall = async () => {
    try {
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
        
        // Find the batsman who was out
        const batsmanIndex = newState.batsmen.findIndex(b => b.name === lastBall.batsman);
        if (batsmanIndex !== -1) {
          // Mark as not out
          newState.batsmen[batsmanIndex].isOut = false;
          
          // Revert batsman stats for run out with runs
          if (lastBall.wicketType === 'run out' && lastBall.runs > 0) {
            newState.batsmen[batsmanIndex].runs -= lastBall.runs;
            // Revert fours/sixes count if applicable
            if (lastBall.runs === 4) newState.batsmen[batsmanIndex].fours -= 1;
            if (lastBall.runs === 6) newState.batsmen[batsmanIndex].sixes -= 1;
          }
          
          // If this was the most recent wicket, restore the batsman as striker
          newState.striker = newState.batsmen[batsmanIndex];
        }
      }
      
      // Revert bowler stats
      const bowlerIndex = newState.bowlers.findIndex(b => b.name === lastBall.bowler);
      if (bowlerIndex !== -1) {
        // Determine if it was a legal delivery
        const isLegalDelivery = !(lastBall.extraType === 'wide' || lastBall.extraType === 'no-ball');
        
        // Update bowler stats
        if (isLegalDelivery) {
          newState.bowlers[bowlerIndex].balls -= 1;
          // Recalculate overs
          const totalBalls = newState.bowlers[bowlerIndex].balls;
          newState.bowlers[bowlerIndex].overs = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
        }
        
        // Subtract runs (except for byes)
        if (lastBall.extraType !== 'bye' && lastBall.extraType !== 'leg-bye') {
          newState.bowlers[bowlerIndex].runs -= runsToSubtract;
        }
        
        // Subtract wicket if applicable (except run outs)
        if (lastBall.isWicket && lastBall.wicketType !== 'run out') {
          newState.bowlers[bowlerIndex].wickets -= 1;
        }
        
        // Recalculate economy
        const totalOvers = newState.bowlers[bowlerIndex].overs;
        if (totalOvers > 0) {
          newState.bowlers[bowlerIndex].economy = (newState.bowlers[bowlerIndex].runs / totalOvers).toFixed(2);
        }
        
        // Update current bowler if needed
        if (newState.currentBowler.name === lastBall.bowler) {
          newState.currentBowler = newState.bowlers[bowlerIndex];
        }
      }
      
      // Revert balls count for legal deliveries
      if (!(lastBall.extraType === 'wide' || lastBall.extraType === 'no-ball')) {
        newState.balls -= 1;
        // Handle negative balls (go to previous over)
        if (newState.balls < 0) {
          newState.balls = 5;
          newState.overs -= 1;
        }
      }

      // Update state
      setMatchState(newState);

      // Save undo action to database
      try {
        await api.post(`/api/matches/${matchId}/undo`, { ballId: lastBall.id });
      } catch (err) {
        console.error('Failed to undo ball:', err);
        // Don't block the UI for this error
      }

    } catch (err) {
      console.error('Error undoing last ball:', err);
      setError('Failed to undo last ball: ' + err.message);
    }
  };

  // Handle swap batsmen
  const handleSwapBatsmen = () => {
    if (!matchState.striker || !matchState.nonStriker) {
      alert('Both batsmen must be selected to swap');
      return;
    }

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
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-4">Error: {error}</div>
            <Button
              onClick={() => {
                setError(null);
                fetchMatchData();
              }}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Retry
            </Button>
          </div>
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

      {/* If match state is not initialized, show the start innings button */}
      {!matchState.battingTeam && !uiState.showStartInningsModal && (
        <div className="bg-white/90 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Start Match</h2>
          <p className="mb-4 text-gray-700">This match hasn't been started yet. Click the button below to begin scoring.</p>
          <Button
            onClick={() => setUiState(prev => ({ ...prev, showStartInningsModal: true }))}
            className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg"
          >
            Start Match
          </Button>
        </div>
      )}

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
                {uiState.selectedShotDirection && (
                  <div className="mr-4 text-black mb-2">
                    <span className="font-medium text-blue-900">Shot:</span> {uiState.selectedShotDirection.label}
                  </div>
                )}
              </div>
            </div>

            {/* Batsmen Info */}
            <div className="bg-white/90 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2 text-blue-900">Batsmen</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-blue-700 text-white">
                  <div className="font-medium">{matchState.striker?.name || 'No Striker'} *</div>
                  <div className="text-sm">
                    {matchState.striker?.runs || 0} ({matchState.striker?.balls || 0}) |
                    {matchState.striker?.fours || 0}x4 | {matchState.striker?.sixes || 0}x6 |
                    SR: {matchState.striker?.strikeRate || 0}
                  </div>
                </div>
                <div className="p-2 rounded bg-gray-700 text-white">
                  <div className="font-medium">{matchState.nonStriker?.name || 'No Non-Striker'}</div>
                  <div className="text-sm">
                    {matchState.nonStriker?.runs || 0} ({matchState.nonStriker?.balls || 0}) |
                    {matchState.nonStriker?.fours || 0}x4 | {matchState.nonStriker?.sixes || 0}x6 |
                    SR: {matchState.nonStriker?.strikeRate || 0}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSwapBatsmen}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                disabled={!matchState.striker || !matchState.nonStriker}
              >
                Swap Batsmen
              </Button>
            </div>

            {/* Bowler Info */}
            <div className="bg-white/90 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2 text-blue-900">Bowler</h2>
              {matchState.currentBowler ? (
                <div className="p-2 rounded bg-red-700 text-white">
                  <div className="font-medium">{matchState.currentBowler.name}</div>
                  <div className="text-sm">
                    {matchState.currentBowler.overs} overs | {matchState.currentBowler.runs}/{matchState.currentBowler.wickets} |
                    Econ: {matchState.currentBowler.economy}
                  </div>
                </div>
              ) : (
                <div className="p-2 rounded bg-red-700 text-white">
                  <div className="font-medium">No Bowler Selected</div>
                </div>
              )}
              <Button
                onClick={handleChangeBowler}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Change Bowler
              </Button>
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
                  <Button
                    key={runs}
                    onClick={() => handleRunsClick(runs)}
                    className={`py-2 px-4 rounded ${uiState.runsScored === runs ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {runs}
                  </Button>
                ))}
              </div>
            </div>

            {/* Extras, Wickets, Ball Type, and Shot Direction */}
            <div className="flex flex-wrap gap-4 mb-4">
              <Button
                onClick={handleExtraClick}
                className={`py-2 px-4 rounded ${uiState.isExtra ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Extra
              </Button>
              <Button
                onClick={handleWicketClick}
                className={`py-2 px-4 rounded ${uiState.isWicket ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Wicket
              </Button>
              <Button
                onClick={handleBallTypeClick}
                className={`py-2 px-4 rounded ${uiState.ballType ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Ball Type
              </Button>
              <Button
                onClick={handleShowWagonWheel}
                className={`py-2 px-4 rounded ${uiState.selectedShotDirection ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Shot Direction
              </Button>
            </div>

            {/* Submit and Undo */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleSubmitBall}
                className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                disabled={!matchState.currentBowler || !matchState.striker}
              >
                Submit Ball
              </Button>
              <Button
                onClick={handleUndoLastBall}
                className="py-2 px-6 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-medium"
                disabled={matchState.currentOver.length === 0}
              >
                Undo Last Ball
              </Button>
            </div>
          </div>

          {/* Current Over */}
          <div className="bg-white/90 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-900">Current Over</h2>
            <div className="flex flex-wrap gap-2">
              {matchState.currentOver.map((ball, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 flex items-center justify-center rounded-full relative ${ball.isWicket ? 'bg-red-500 text-white' :
                      ball.isExtra ? 'bg-yellow-500 text-black' :
                        ball.runs > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                    }`}
                  title={ball.shotDirection ? `Shot: ${ball.shotDirection.label}` : ''}
                >
                  {ball.displayText}
                  {ball.shotDirection && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
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
                    Over {overIndex + 1} ({over[0]?.bowler || 'Unknown'})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {over.map((ball, ballIndex) => (
                      <div
                        key={ballIndex}
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs relative ${ball.isWicket ? 'bg-red-500 text-white' :
                            ball.isExtra ? 'bg-yellow-500 text-black' :
                              ball.runs > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                          }`}
                        title={ball.shotDirection ? `Shot: ${ball.shotDirection.label}` : ''}
                      >
                        {ball.displayText}
                        {ball.shotDirection && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
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
              <Button
                onClick={() => handleStartInnings(0)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {matchData.team1_name}
              </Button>
              <Button
                onClick={() => handleStartInnings(1)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {matchData.team2_name}
              </Button>
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
                <Button
                  key={type}
                  onClick={() => handleWicketTypeSelect(type.toLowerCase())}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  {type}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setUiState(prev => ({ ...prev, showWicketModal: false }))}
              className="mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Fielder Selection Modal for Run Out and Caught */}
      {uiState.showFielderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Select {uiState.wicketType === 'run out' ? 'Fielder who ran out' : 'Fielder who caught'}
            </h2>
            <div className="max-h-96 overflow-y-auto">
              {matchState.bowlingTeam?.players?.map(player => (
                <Button
                  key={player.name}
                  onClick={() => {
                    setUiState(prev => ({
                      ...prev,
                      dismissalInfo: {
                        ...prev.dismissalInfo,
                        fielderName: player.name
                      },
                      showFielderModal: false
                    }));
                  }}
                  className="w-full py-2 px-4 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-left"
                >
                  {player.name}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setUiState(prev => ({ ...prev, showFielderModal: false }))}
              className="mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded w-full"
            >
              Cancel
            </Button>
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
                ?.filter(player => !matchState.batsmen.some(b => b.name === player.name && !b.isOut))
                ?.map(player => (
                  <Button
                    key={player.name}
                    onClick={() => handleNewBatsmanSelect(player.name)}
                    className="w-full py-2 px-4 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-left"
                  >
                    {player.name}
                  </Button>
                )) || (
                <div className="text-center text-gray-500">No available batsmen</div>
              )}
            </div>
            <Button
              onClick={() => setUiState(prev => ({ ...prev, showNewBatsmanModal: false }))}
              className="mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded w-full"
            >
              Cancel
            </Button>
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
                <Button
                  key={type}
                  onClick={() => handleExtraTypeSelect(type)}
                  className="py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setUiState(prev => ({ ...prev, showExtraModal: false }))}
              className="mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded w-full"
            >
              Cancel
            </Button>
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
                <Button
                  key={type}
                  onClick={() => handleBallTypeSelect(type)}
                  className={`py-2 px-4 ${uiState.ballType === type ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'
                    } text-white rounded`}
                >
                  {type}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setUiState(prev => ({ ...prev, showBallTypeModal: false }))}
              className="mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded w-full"
            >
              Cancel
            </Button>
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
                ?.filter(player => player.name !== matchState.lastBowler)
                ?.map(player => (
                  <Button
                    key={player.name}
                    onClick={() => handleBowlerSelect(player.name)}
                    className="w-full py-2 px-4 mb-2 bg-red-600 hover:bg-red-700 text-white rounded text-left"
                  >
                    {player.name}
                  </Button>
                )) || (
                <div className="text-center text-gray-500">No available bowlers</div>
              )}
            </div>
            <Button
              onClick={() => setUiState(prev => ({ ...prev, showChangeBowlerModal: false }))}
              className="mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Wagon Wheel Modal */}
      {uiState.showWagonWheel && (
        <WagonWheel
          isVisible={uiState.showWagonWheel}
          selectedShot={uiState.selectedShotDirection}
          onShotSelect={handleShotDirectionSelect}
          onClose={handleCloseWagonWheel}
        />
      )}
    </div>
  );
};

export default Scoring;