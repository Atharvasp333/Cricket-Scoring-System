import express from 'express';
import Match from '../models/Match.js';

const router = express.Router();

// Create a new match
router.post('/', async (req, res) => {
  try {
    const match = new Match(req.body);
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
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;