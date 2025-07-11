import express from 'express';
import Match from '../models/Match.js';

const router = express.Router();

// Create a new match
router.post('/', async (req, res) => {
  try {
    const { team1, team2 } = req.body;
    
    // Validate that the same user is not captain of both teams
    if (team1.captain.userId && team2.captain.userId && 
        team1.captain.userId.toString() === team2.captain.userId.toString()) {
      return res.status(400).json({ error: 'A user cannot be captain of both teams' });
    }

    // Prepare captain data with all required fields
    const team1Captain = {
      userId: team1.captain.userId,
      name: team1.captain.name,
      email: team1.captain.email,
      phone: team1.captain.phone,
      imageUrl: team1.captain.imageUrl || '',
      drsAvailable: 2, // Default DRS count
      isCaptain: true
    };

    const team2Captain = {
      userId: team2.captain.userId,
      name: team2.captain.name,
      email: team2.captain.email,
      phone: team2.captain.phone,
      imageUrl: team2.captain.imageUrl || '',
      drsAvailable: 2, // Default DRS count
      isCaptain: true
    };

    // Create match with the request data
    const match = new Match({
      ...req.body,
      team1: {
        name: team1.name,
        captain: team1Captain,
        players: [
          ...(team1.players || []).map(p => ({
            ...p,
            isCaptain: false,
            status: 'pending',
            joinedAt: new Date()
          })),
          {
            ...team1Captain,
            role: 'All-Rounder',
            status: 'approved',
            approvedBy: 'organizer',
            joinedAt: new Date()
          }
        ]
      },
      team2: {
        name: team2.name,
        captain: team2Captain,
        players: [
          ...(team2.players || []).map(p => ({
            ...p,
            isCaptain: false,
            status: 'pending',
            joinedAt: new Date()
          })),
          {
            ...team2Captain,
            role: 'All-Rounder',
            status: 'approved',
            approvedBy: 'organizer',
            joinedAt: new Date()
          }
        ]
      }
    });

    await match.save();
    
    // Emit socket event for new match
    const io = req.app.get('io');
    if (io) io.emit('matchAdded', match);
    
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get matches by scorer email
router.get('/scorer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const matches = await Match.find({ scorers: email }).sort({ date: 1, time: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get completed matches
router.get('/completed', async (req, res) => {
  try {
    const completedMatches = await Match.find({ status: 'completed' }).sort({ date: -1 });
    res.json(completedMatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a match
router.put('/:id', async (req, res) => {
  try {
    const { team1, team2 } = req.body;
    
    // Get the existing match first
    const existingMatch = await Match.findById(req.params.id);
    if (!existingMatch) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Validate that the same user is not captain of both teams
    if (team1.captain.userId && team2.captain.userId && 
        team1.captain.userId.toString() === team2.captain.userId.toString()) {
      return res.status(400).json({ error: 'A user cannot be captain of both teams' });
    }

    // Prepare captain data with all required fields
    const team1Captain = {
      userId: team1.captain.userId,
      name: team1.captain.name,
      email: team1.captain.email,
      phone: team1.captain.phone,
      imageUrl: team1.captain.imageUrl || existingMatch.team1?.captain?.imageUrl || '',
      drsAvailable: existingMatch.team1?.captain?.drsAvailable || 2,
      isCaptain: true
    };

    const team2Captain = {
      userId: team2.captain.userId,
      name: team2.captain.name,
      email: team2.captain.email,
      phone: team2.captain.phone,
      imageUrl: team2.captain.imageUrl || existingMatch.team2?.captain?.imageUrl || '',
      drsAvailable: existingMatch.team2?.captain?.drsAvailable || 2,
      isCaptain: true
    };

    // Preserve existing players and their data
    const existingTeam1Players = existingMatch.team1?.players || [];
    const existingTeam2Players = existingMatch.team2?.players || [];

    // Update the match
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        team1: {
          name: team1.name,
          captain: team1Captain,
          players: [
            ...(team1.players || []).map(p => ({
              ...p,
              isCaptain: false,
              status: p.status || 'pending',
              joinedAt: p.joinedAt || new Date()
            })),
            // Add captain if not already in players
            ...(existingTeam1Players.some(p => p.isCaptain) ? [] : [{
              ...team1Captain,
              role: 'All-Rounder',
              status: 'approved',
              approvedBy: 'organizer',
              joinedAt: new Date()
            }])
          ]
        },
        team2: {
          name: team2.name,
          captain: team2Captain,
          players: [
            ...(team2.players || []).map(p => ({
              ...p,
              isCaptain: false,
              status: p.status || 'pending',
              joinedAt: p.joinedAt || new Date()
            })),
            // Add captain if not already in players
            ...(existingTeam2Players.some(p => p.isCaptain) ? [] : [{
              ...team2Captain,
              role: 'All-Rounder',
              status: 'approved',
              approvedBy: 'organizer',
              joinedAt: new Date()
            }])
          ]
        }
      },
      { new: true, runValidators: true }
    );

    // Emit socket event for match update
    const io = req.app.get('io');
    if (io) io.emit('matchUpdated', updatedMatch);
    
    res.json(updatedMatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;