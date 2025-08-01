import express from 'express';
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new registration
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Creating new registration with data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['userId', 'playerName', 'role', 'team', 'registrationType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: `Missing fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Ensure we have either tournamentId or matchId based on registrationType
    if (req.body.registrationType === 'tournament' && !req.body.tournamentId) {
      return res.status(400).json({ error: 'tournamentId is required for tournament registrations' });
    }
    
    if (req.body.registrationType === 'match' && !req.body.matchId) {
      return res.status(400).json({ error: 'matchId is required for match registrations' });
    }
    
    // Convert string IDs to ObjectIds if needed
    let registrationData = { ...req.body };
    
    // Convert userId to ObjectId if it's a string
    if (typeof registrationData.userId === 'string' && mongoose.Types.ObjectId.isValid(registrationData.userId)) {
      registrationData.userId = new mongoose.Types.ObjectId(registrationData.userId);
    }
    
    // Convert tournamentId to ObjectId if it's a string
    if (registrationData.tournamentId && typeof registrationData.tournamentId === 'string' && 
        mongoose.Types.ObjectId.isValid(registrationData.tournamentId)) {
      registrationData.tournamentId = new mongoose.Types.ObjectId(registrationData.tournamentId);
    }
    
    // Convert matchId to ObjectId if it's a string
    if (registrationData.matchId && typeof registrationData.matchId === 'string' && 
        mongoose.Types.ObjectId.isValid(registrationData.matchId)) {
      registrationData.matchId = new mongoose.Types.ObjectId(registrationData.matchId);
    }
    
    // Check if user already registered for this event
    const existingRegistration = await Registration.findOne({
      userId: registrationData.userId,
      $or: [
        { tournamentId: registrationData.tournamentId },
        { matchId: registrationData.matchId }
      ]
    });
    
    if (existingRegistration) {
      console.log('User already registered for this event:', existingRegistration._id);
      return res.status(400).json({ error: 'You have already registered for this event' });
    }
    
    // Create registration
    const registration = new Registration(registrationData);
    
    // Validate the registration data
    const validationError = registration.validateSync();
    if (validationError) {
      console.error('Registration validation error:', validationError);
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validationError.errors 
      });
    }
    
    // Add event name for easier reference
    if (registration.registrationType === 'tournament' && registration.tournamentId) {
      const tournament = await Tournament.findById(registration.tournamentId);
      if (tournament) {
        registration.tournamentName = tournament.name;
      }
    } else if (registration.registrationType === 'match' && registration.matchId) {
      const match = await Match.findById(registration.matchId);
      if (match) {
        registration.matchName = match.match_name;
      }
    }
    
    await registration.save();
    
    // Emit socket event for new registration
    const io = req.app.get('io');
    if (io) io.emit('registrationAdded', registration);
    
    console.log('Registration created successfully:', registration._id);
    res.status(201).json(registration);
  } catch (err) {
    console.error('Error creating registration:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all registrations
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Getting all registrations');
    const registrations = await Registration.find().sort({ registrationDate: -1 });
    console.log(`Found ${registrations.length} registrations`);
    res.json(registrations);
  } catch (err) {
    console.error('Error getting registrations:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get registrations by user ID
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Getting registrations for user ${userId}`);
    
    // Convert to ObjectId if needed
    let userIdQuery = userId;
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userIdQuery = new mongoose.Types.ObjectId(userId);
    }
    
    const registrations = await Registration.find({ userId: userIdQuery }).sort({ registrationDate: -1 });
    console.log(`Found ${registrations.length} registrations for user ${userId}`);
    res.json(registrations);
  } catch (err) {
    console.error('Error getting user registrations:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get registrations by tournament ID
router.get('/tournament/:tournamentId', verifyToken, async (req, res) => {
  try {
    const { tournamentId } = req.params;
    console.log(`Getting registrations for tournament ${tournamentId}`);
    
    // Convert to ObjectId if needed
    let tournamentIdQuery = tournamentId;
    if (typeof tournamentId === 'string' && mongoose.Types.ObjectId.isValid(tournamentId)) {
      tournamentIdQuery = new mongoose.Types.ObjectId(tournamentId);
    }
    
    const registrations = await Registration.find({ 
      tournamentId: tournamentIdQuery,
      registrationType: 'tournament'
    }).sort({ registrationDate: -1 });
    
    console.log(`Found ${registrations.length} registrations for tournament ${tournamentId}`);
    res.json(registrations);
  } catch (err) {
    console.error('Error getting tournament registrations:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get registrations by match ID
router.get('/match/:matchId', verifyToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    console.log(`Getting registrations for match ${matchId}`);
    
    // Convert to ObjectId if needed
    let matchIdQuery = matchId;
    if (typeof matchId === 'string' && mongoose.Types.ObjectId.isValid(matchId)) {
      matchIdQuery = new mongoose.Types.ObjectId(matchId);
    }
    
    const registrations = await Registration.find({ 
      matchId: matchIdQuery,
      registrationType: 'match'
    }).sort({ registrationDate: -1 });
    
    console.log(`Found ${registrations.length} registrations for match ${matchId}`);
    res.json(registrations);
  } catch (err) {
    console.error('Error getting match registrations:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update registration status (approve/reject)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, approverRole } = req.body;
    console.log(`Updating registration ${req.params.id} status to ${status} by ${approverRole}`);
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Validate approver role if provided
    const approvedBy = approverRole && ['captain', 'organiser'].includes(approverRole) ? approverRole : null;
    
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        approvedBy: status === 'approved' ? approvedBy : null
      },
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
          const playerExists = tournament.players.some(p => 
            (p.userId && p.userId.equals(registration.userId)) || 
            p.name === registration.playerName
          );
          
          if (!playerExists) {
            // Check if we're at the squad limit (15 players per team)
            const teamPlayers = tournament.players.filter(p => p.team === registration.team);
            if (teamPlayers.length >= 15) {
              return res.status(400).json({ error: 'Squad limit reached (15 players per team)' });
            }
            
            tournament.players.push({
              userId: registration.userId,
              name: registration.playerName,
              role: registration.role,
              team: registration.team,
              isCaptain: registration.isCaptain,
              isWicketKeeper: registration.isWicketKeeper,
              status: 'approved',
              approvedBy: approvedBy
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
          const playerExists = match[teamKey].some(p => 
            (p.userId && p.userId.equals(registration.userId)) || 
            p.name === registration.playerName
          );
          
          if (!playerExists) {
            // Check if we're at the squad limit (15 players per team)
            if (match[teamKey].length >= 15) {
              return res.status(400).json({ error: 'Squad limit reached (15 players per team)' });
            }
            
            match[teamKey].push({
              userId: registration.userId,
              name: registration.playerName,
              role: registration.role,
              isCaptain: registration.isCaptain,
              isWicketKeeper: registration.isWicketKeeper,
              status: 'approved',
              approvedBy: approvedBy
            });
            await match.save();
          }
        }
      }
    }
    
    // Emit socket event for updated registration
    const io = req.app.get('io');
    if (io) io.emit('registrationUpdated', registration);
    
    console.log(`Registration ${registration._id} updated successfully to ${status}`);
    res.json(registration);
  } catch (err) {
    console.error('Error updating registration status:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a registration
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    console.log(`Deleting registration ${req.params.id}`);
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    // Emit socket event for deleted registration
    const io = req.app.get('io');
    if (io) io.emit('registrationRemoved', req.params.id);
    
    console.log(`Registration ${req.params.id} deleted successfully`);
    res.json({ message: 'Registration deleted successfully' });
  } catch (err) {
    console.error('Error deleting registration:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;