import express from 'express';
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';
import Match from '../models/Match.js';
import User from '../models/User.js';

const router = express.Router();

// Create a new registration
router.post('/', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    
    // Emit socket event for new registration
    const io = req.app.get('io');
    if (io) io.emit('registrationAdded', registration);
    
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get registrations by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const registrations = await Registration.find({ userId }).sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get registrations by tournament ID
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const registrations = await Registration.find({ 
      tournamentId,
      registrationType: 'tournament'
    }).sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get registrations by match ID
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const registrations = await Registration.find({ 
      matchId,
      registrationType: 'match'
    }).sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update registration status (approve/reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    // If approved, add player to tournament or match
    if (status === 'approved') {
      if (registration.registrationType === 'tournament') {
        const tournament = await Tournament.findById(registration.tournamentId);
        if (tournament) {
          // Check if player already exists in the tournament
          const playerExists = tournament.players.some(p => p.name === registration.playerName);
          if (!playerExists) {
            tournament.players.push({
              name: registration.playerName,
              role: registration.role,
              team: registration.team,
              isCaptain: registration.isCaptain,
              isWicketKeeper: registration.isWicketKeeper
            });
            await tournament.save();
          }
        }
      } else if (registration.registrationType === 'match') {
        const match = await Match.findById(registration.matchId);
        if (match) {
          // Determine which team to add the player to
          const teamKey = registration.team === match.team1_name ? 'team1_players' : 'team2_players';
          
          // Check if player already exists in the match
          const playerExists = match[teamKey].some(p => p.name === registration.playerName);
          if (!playerExists) {
            match[teamKey].push({
              name: registration.playerName,
              role: registration.role,
              isCaptain: registration.isCaptain,
              isWicketKeeper: registration.isWicketKeeper
            });
            await match.save();
          }
        }
      }
    }
    
    // Emit socket event for updated registration
    const io = req.app.get('io');
    if (io) io.emit('registrationUpdated', registration);
    
    res.json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a registration
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    // Emit socket event for deleted registration
    const io = req.app.get('io');
    if (io) io.emit('registrationRemoved', req.params.id);
    
    res.json({ message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;