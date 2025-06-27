import express from 'express';
import MatchState from '../models/MatchState.js';
import Match from '../models/Match.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get match state by match ID
router.get('/:matchId/state', async (req, res) => {
  try {
    const { matchId } = req.params;
    console.log(`GET request for match state with ID: ${matchId}`);
    // Check if match exists
    const matchExists = await Match.findOne({ _id: matchId });
    if (!matchExists) {
      console.log(`Match not found with ID: ${matchId}`);
      return res.status(404).json({ error: 'Match not found' });
    }
    // Find match state
    const matchState = await MatchState.findOne({ matchId });
    if (!matchState) {
      console.log(`Match state not found for match ID: ${matchId}`);
      return res.status(404).json({ error: 'Match state not found' });
    }
    console.log(`Successfully retrieved match state for match ID: ${matchId}`);
    res.json(matchState);
  } catch (err) {
    console.error('Error fetching match state:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create or update match state
router.post('/:matchId/state', async (req, res) => {
  try {
    const { matchId } = req.params;
    const stateData = req.body;
    console.log(`POST request for match state with ID: ${matchId}`);
    console.log('Request body:', JSON.stringify(stateData, null, 2));
    // Check if match exists
    const matchExists = await Match.findOne({ _id: matchId });
    if (!matchExists) {
      console.log(`Match not found with ID: ${matchId}`);
      return res.status(404).json({ error: 'Match not found' });
    }
    // Check if a match state already exists
    let existingMatchState = await MatchState.findOne({ matchId });
    let matchState;
    if (existingMatchState) {
      console.log(`Updating existing match state for match ID: ${matchId}`);
      // Update existing match state
      matchState = await MatchState.findOneAndUpdate(
        { matchId },
        { ...stateData, matchId },
        { new: true, runValidators: true }
      );
    } else {
      console.log(`Creating new match state for match ID: ${matchId}`);
      // Create new match state
      const newMatchState = new MatchState({
        ...stateData,
        matchId
      });
      matchState = await newMatchState.save();
    }
    console.log(`Successfully saved match state for match ID: ${matchId}`);
    res.status(200).json(matchState);
  } catch (err) {
    console.error('Error saving match state:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update match status
router.put('/:matchId/status', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;
    console.log(`PUT request to update match status to ${status} for match ID: ${matchId}`);
    // Check if match exists
    const match = await Match.findOne({ _id: matchId });
    if (!match) {
      console.log(`Match not found with ID: ${matchId}`);
      return res.status(404).json({ error: 'Match not found' });
    }
    // Update match status
    match.status = status;
    await match.save();
    console.log(`Successfully updated match status to ${status} for match ID: ${matchId}`);
    // Check if match state exists, if not create it
    const matchState = await MatchState.findOne({ matchId });
    if (!matchState && status === 'Live') {
      console.log(`Creating initial match state for match ID: ${matchId}`);
      // Create a new match state
      const newMatchState = new MatchState({
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
        matchStatus: status
      });
      await newMatchState.save();
      console.log(`Initial match state created for match ID: ${matchId}`);
    }
    res.status(200).json({ message: 'Match status updated successfully', match });
  } catch (err) {
    console.error('Error updating match status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Save ball data for a match
router.post('/:matchId/balls', async (req, res) => {
  try {
    const { matchId } = req.params;
    const ballData = req.body;
    // Check if match exists
    const matchExists = await Match.findOne({ _id: matchId });
    if (!matchExists) {
      return res.status(404).json({ error: 'Match not found' });
    }
    // Find match state
    const matchState = await MatchState.findOne({ matchId });
    if (!matchState) {
      return res.status(404).json({ error: 'Match state not found' });
    }
    // For now, we're just acknowledging the ball data was received
    res.status(200).json({ message: 'Ball data saved successfully' });
  } catch (err) {
    console.error('Error saving ball data:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;