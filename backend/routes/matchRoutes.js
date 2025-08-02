import express from 'express';
import Match from '../models/Match.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Simple mailer utility (for demo, use environment variables for real credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // set in .env
    pass: process.env.EMAIL_PASS  // set in .env
  }
});

async function sendScorerEmail(to, match) {
  const scorerHomeUrl = 'http://localhost:5173/scorer-home'; // Update with actual URL if needed
  const matchDetails = `
    <h2>Match Invitation</h2>
    <p><b>Match:</b> ${match.match_name || ''}</p>
    <p><b>Teams:</b> ${Array.isArray(match.teams) ? match.teams.join(' vs ') : ''}</p>
    <p><b>Date:</b> ${match.date || ''}</p>
    <p><b>Time:</b> ${match.time || ''}</p>
    <p><b>Venue:</b> ${match.venue || ''}</p>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use the sender's email
    to,
    subject: `Dear ${to.name || 'Scorer'}, You have been assigned to score: ${match.match_name || 'a match'}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <p>Dear ${to.name || 'Scorer'}, You have been invited to score the following match:</p>
        ${matchDetails}
        <p>
          <a href="${scorerHomeUrl}" style="display:inline-block;padding:10px 20px;background:#1976d2;color:#fff;text-decoration:none;border-radius:4px;">Go to Scorer Homepage</a>
        </p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
}

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
    // Email notification to scorer(s)
    if (match.scorers && Array.isArray(match.scorers)) {
      for (const scorerEmail of match.scorers) {
        try {
          await sendScorerEmail(scorerEmail, match);
          console.log(`Email sent successfully to scorer: ${scorerEmail}`);
        } catch (e) {
          console.error('Failed to send scorer email:', scorerEmail, e);
          // Don't fail the entire request if email fails
        }
      }
    }
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

// Get matches by scorer email (accessible to all authenticated users)
router.get('/scorer/:email', verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Getting matches for scorer ${email}`);
    
    // Remove the organizerId filter to allow scorers to see all matches assigned to them
    const matches = await Match.find({ 
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
    
    // Get the original match to check status and compare scorers
    const originalMatch = await Match.findById(req.params.id);
    
    if (!originalMatch) {
      console.log(`Match ${req.params.id} not found`);
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Check if the match is live - prevent updates for live matches
    if (originalMatch.status === 'Live') {
      console.log(`Cannot update match ${req.params.id} - match is live`);
      return res.status(403).json({ 
        error: 'Cannot update match details while match is live',
        details: 'Match updates are not allowed during live matches for data integrity'
      });
    }
    
    // Check if user is the organizer
    if (originalMatch.organizerId !== req.user.uid) {
      console.log(`Access denied for match ${req.params.id} - user ${req.user.uid} is not the organizer`);
      return res.status(403).json({ error: 'Access denied - only the organizer can update this match' });
    }
    
    const match = await Match.findOneAndUpdate(
      { 
        _id: req.params.id,
        organizerId: req.user.uid 
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!match) {
      console.log(`Match ${req.params.id} not found during update`);
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Send emails to new scorers if scorers were changed
    if (req.body.scorers && Array.isArray(req.body.scorers) && originalMatch) {
      const originalScorers = originalMatch.scorers || [];
      const newScorers = req.body.scorers;
      
      // Find new scorers that weren't in the original list
      const addedScorers = newScorers.filter(scorer => !originalScorers.includes(scorer));
      
      for (const scorerEmail of addedScorers) {
        try {
          await sendScorerEmail(scorerEmail, match);
          console.log(`Email sent successfully to new scorer: ${scorerEmail}`);
        } catch (e) {
          console.error('Failed to send scorer email:', scorerEmail, e);
          // Don't fail the entire request if email fails
        }
      }
    }
    
    console.log(`Match ${match._id} updated successfully`);
    res.json(match);
  } catch (err) {
    console.error('Error updating match:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a match by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // First check if the match exists and get its status
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Check if user is the organizer
    if (match.organizerId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied - only the organizer can delete this match' });
    }
    
    // Prevent deletion of live matches
    if (match.status === 'Live') {
      return res.status(403).json({ 
        error: 'Cannot delete match while it is live',
        details: 'Match deletion is not allowed during live matches for data integrity'
      });
    }
    
    // Prevent deletion of completed matches
    if (match.status === 'completed') {
      return res.status(403).json({ 
        error: 'Cannot delete completed matches',
        details: 'Completed matches cannot be deleted to preserve match history'
      });
    }
    
    // Delete the match
    await Match.findByIdAndDelete(req.params.id);
    
    // Emit socket event for deleted match
    const io = req.app.get('io');
    if (io) io.emit('matchDeleted', req.params.id);
    
    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    console.error('Error deleting match:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;