import express from 'express';
import Match from '../models/Match.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new match
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Creating new match with data:', JSON.stringify(req.body, null, 2));
    console.log('User from token:', req.user);
    
    // Ensure required fields are present
    const requiredFields = ['match_name', 'date', 'time', 'venue', 'team1_name', 'team2_name', 'total_overs', 'powerplay_overs', 'scorers'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: `Missing fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Ensure scorers is an array of strings
    if (!Array.isArray(req.body.scorers)) {
      console.error('Scorers must be an array');
      return res.status(400).json({ error: 'Scorers must be an array' });
    }
    
    // Format the data
    const matchData = {
      ...req.body,
      organizerId: req.user.uid, // Set the organizer ID from the authenticated user
      total_overs: Number(req.body.total_overs),
      powerplay_overs: Number(req.body.powerplay_overs),
      drs_enabled: Boolean(req.body.drs_enabled),
      teams: Array.isArray(req.body.teams) ? req.body.teams : [req.body.team1_name, req.body.team2_name]
    };
    
    console.log('Final match data to save:', JSON.stringify(matchData, null, 2));
    
    const match = new Match(matchData);
    
    // Validate the match data
    const validationError = match.validateSync();
    if (validationError) {
      console.error('Match validation error:', validationError);
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validationError.errors 
      });
    }
    
    await match.save();
    // Emit socket event for new match
    const io = req.app.get('io');
    if (io) io.emit('matchAdded', match);
    
    console.log('Match created successfully:', match._id);
    res.status(201).json(match);
  } catch (err) {
    console.error('Error creating match:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all matches for the logged-in organizer
router.get('/', verifyToken, async (req, res) => {
  try {
    // Check if the request is from a player (looking for all matches)
    if (req.user.role === 'player') {
      console.log('Getting all matches for player view');
      const matches = await Match.find().sort({ date: 1 });
      console.log(`Found ${matches.length} matches for player`);
      return res.json(matches);
    }
    
    // For organizers, return only their matches
    console.log('Getting matches for organizer:', req.user.uid);
    const matches = await Match.find({ organizerId: req.user.uid }).sort({ createdAt: -1 });
    console.log(`Found ${matches.length} matches for organizer`);
    res.json(matches);
  } catch (err) {
    console.error('Error getting matches:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all available matches for players
router.get('/available', verifyToken, async (req, res) => {
  try {
    console.log('Getting all available matches for player registration');
    const matches = await Match.find({ 
      status: { $ne: 'completed' } // Only upcoming and live matches
    }).sort({ date: 1 });
    
    console.log(`Found ${matches.length} available matches for registration`);
    res.json(matches);
  } catch (err) {
    console.error('Error getting available matches:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get matches by scorer email (only for matches organized by the logged-in user)
router.get('/scorer/:email', verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Getting matches for scorer ${email} and organizer ${req.user.uid}`);
    const matches = await Match.find({ 
      organizerId: req.user.uid,
      scorers: email 
    }).sort({ date: 1, time: 1 });
    console.log(`Found ${matches.length} matches for scorer ${email}`);
    res.json(matches);
  } catch (err) {
    console.error('Error getting matches by scorer:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get completed matches for the logged-in organizer
router.get('/completed', verifyToken, async (req, res) => {
  try {
    console.log('Getting completed matches for organizer:', req.user.uid);
    const completedMatches = await Match.find({ 
      organizerId: req.user.uid,
      status: 'completed' 
    }).sort({ date: -1 });
    console.log(`Found ${completedMatches.length} completed matches`);
    res.json(completedMatches);
  } catch (err) {
    console.error('Error getting completed matches:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific match by ID (accessible to all authenticated users)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    console.log(`Getting match ${req.params.id}`);
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      console.log(`Match ${req.params.id} not found`);
      return res.status(404).json({ error: 'Match not found' });
    }
    
    console.log(`Found match ${match._id}`);
    res.json(match);
  } catch (err) {
    console.error('Error getting match by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a match (only if user is the organizer)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    console.log(`Updating match ${req.params.id} for organizer ${req.user.uid}`);
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    
    const match = await Match.findOneAndUpdate(
      { 
        _id: req.params.id,
        organizerId: req.user.uid 
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!match) {
      console.log(`Match ${req.params.id} not found or access denied for update`);
      return res.status(404).json({ error: 'Match not found or access denied' });
    }
    
    console.log(`Match ${match._id} updated successfully`);
    res.json(match);
  } catch (err) {
    console.error('Error updating match:', err);
    res.status(400).json({ error: err.message });
  }
});

export default router;