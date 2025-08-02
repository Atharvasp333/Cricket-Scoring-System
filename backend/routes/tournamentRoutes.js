import express from 'express';
import Tournament from '../models/Tournament.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new tournament
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Creating new tournament with data:', JSON.stringify(req.body, null, 2));
    console.log('User from token:', req.user);
    
    // Ensure required fields are present
    const requiredFields = ['name', 'type', 'startDate', 'endDate', 'location'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: `Missing fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Format the data
    const tournamentData = {
      ...req.body,
      organizerId: req.user.uid, // Set the organizer ID from the authenticated user
      drsEnabled: Boolean(req.body.drsEnabled),
      maxPlayers: Number(req.body.maxPlayers || 0),
      overs: Number(req.body.overs || 0),
      drsReviews: Number(req.body.drsReviews || 0),
      maxMatchesPerDay: Number(req.body.maxMatchesPerDay || 0)
    };
    
    console.log('Final tournament data to save:', JSON.stringify(tournamentData, null, 2));
    
    const tournament = new Tournament(tournamentData);
    
    // Validate the tournament data
    const validationError = tournament.validateSync();
    if (validationError) {
      console.error('Tournament validation error:', validationError);
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validationError.errors 
      });
    }
    
    await tournament.save();
    // Emit socket event for new tournament
    const io = req.app.get('io');
    if (io) io.emit('tournamentAdded', tournament);
    
    console.log('Tournament created successfully:', tournament._id);
    res.status(201).json(tournament);
  } catch (err) {
    console.error('Error creating tournament:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all tournaments for the logged-in organizer
router.get('/', verifyToken, async (req, res) => {
  try {
    // Check if the request is from a player (looking for all tournaments)
    if (req.user.role === 'player') {
      console.log('Getting all tournaments for player view');
      const tournaments = await Tournament.find().sort({ startDate: 1 });
      console.log(`Found ${tournaments.length} tournaments for player`);
      return res.json(tournaments);
    }
    
    // For organizers, return only their tournaments
    console.log('Getting tournaments for organizer:', req.user.uid);
    const tournaments = await Tournament.find({ organizerId: req.user.uid }).sort({ createdAt: -1 });
    console.log(`Found ${tournaments.length} tournaments for organizer`);
    res.json(tournaments);
  } catch (err) {
    console.error('Error getting tournaments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all available tournaments for players
router.get('/available', verifyToken, async (req, res) => {
  try {
    console.log('Getting all available tournaments for player registration');
    const tournaments = await Tournament.find({ 
      status: { $ne: 'completed' } // Only upcoming and live tournaments
    }).sort({ startDate: 1 });
    
    console.log(`Found ${tournaments.length} available tournaments for registration`);
    res.json(tournaments);
  } catch (err) {
    console.error('Error getting available tournaments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get completed tournaments for the logged-in organizer
router.get('/completed', verifyToken, async (req, res) => {
  try {
    console.log('Getting completed tournaments for organizer:', req.user.uid);
    const completedTournaments = await Tournament.find({ 
      organizerId: req.user.uid,
      status: 'completed' 
    }).sort({ endDate: -1 });
    console.log(`Found ${completedTournaments.length} completed tournaments`);
    res.json(completedTournaments);
  } catch (err) {
    console.error('Error getting completed tournaments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific tournament by ID (only if user is the organizer)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    console.log(`Getting tournament ${req.params.id} for organizer ${req.user.uid}`);
    const tournament = await Tournament.findOne({
      _id: req.params.id,
      organizerId: req.user.uid
    });
    
    if (!tournament) {
      console.log(`Tournament ${req.params.id} not found or access denied`);
      return res.status(404).json({ error: 'Tournament not found or access denied' });
    }
    
    console.log(`Found tournament ${tournament._id}`);
    res.json(tournament);
  } catch (err) {
    console.error('Error getting tournament by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a tournament (only if user is the organizer)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    console.log(`Updating tournament ${req.params.id} for organizer ${req.user.uid}`);
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    
    // Format numeric fields
    if (req.body.maxPlayers) req.body.maxPlayers = Number(req.body.maxPlayers);
    if (req.body.overs) req.body.overs = Number(req.body.overs);
    if (req.body.drsReviews) req.body.drsReviews = Number(req.body.drsReviews);
    if (req.body.maxMatchesPerDay) req.body.maxMatchesPerDay = Number(req.body.maxMatchesPerDay);
    if ('drsEnabled' in req.body) req.body.drsEnabled = Boolean(req.body.drsEnabled);
    
    const tournament = await Tournament.findOneAndUpdate(
      { 
        _id: req.params.id,
        organizerId: req.user.uid 
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!tournament) {
      console.log(`Tournament ${req.params.id} not found or access denied for update`);
      return res.status(404).json({ error: 'Tournament not found or access denied' });
    }
    
    console.log(`Tournament ${tournament._id} updated successfully`);
    res.json(tournament);
  } catch (err) {
    console.error('Error updating tournament:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a tournament by ID
router.delete('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    // Emit socket event for deleted tournament
    const io = req.app.get('io');
    if (io) io.emit('tournamentDeleted', req.params.id);
    res.json({ message: 'Tournament deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;