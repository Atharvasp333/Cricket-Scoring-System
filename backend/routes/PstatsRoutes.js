import express from 'express';
import Player from '../models/Player.js';

const router = express.Router();

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get player by name
router.get('/:name', async (req, res) => {
  try {
    const player = await Player.findOne({ name: req.params.name });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add demo data (one-time use)
router.post('/demo', async (req, res) => {
  try {
    const demoPlayers = [
      {
        name: 'Virat Kohli',
        role: 'Batsman',
        team: 'India',
        batting: { matches: 275, innings: 265, runs: 12898, highestScore: 183, average: 57.3, strikeRate: 93.2, hundreds: 46, fifties: 65, fours: 1200, sixes: 140 },
        bowling: { matches: 275, innings: 12, wickets: 4, bestFigures: '1/15', average: 45.0, economy: 6.2, strikeRate: 40.0, fiveWicketHauls: 0 },
        recentScores: [89, 12, 56, 102, 34],
        wagonWheel: {},
        photoURL: '',
      },
      {
        name: 'Rohit Sharma',
        role: 'Batsman',
        team: 'India',
        batting: { matches: 243, innings: 236, runs: 9825, highestScore: 264, average: 48.6, strikeRate: 89.5, hundreds: 30, fifties: 48, fours: 900, sixes: 250 },
        bowling: { matches: 243, innings: 20, wickets: 8, bestFigures: '2/27', average: 38.0, economy: 5.8, strikeRate: 39.0, fiveWicketHauls: 0 },
        recentScores: [45, 78, 23, 0, 101],
        wagonWheel: {},
        photoURL: '',
      },
      {
        name: 'Jasprit Bumrah',
        role: 'Bowler',
        team: 'India',
        batting: { matches: 80, innings: 40, runs: 65, highestScore: 14, average: 5.2, strikeRate: 45.0, hundreds: 0, fifties: 0, fours: 5, sixes: 1 },
        bowling: { matches: 80, innings: 80, wickets: 130, bestFigures: '5/27', average: 22.0, economy: 4.5, strikeRate: 29.0, fiveWicketHauls: 2 },
        recentScores: [2, 0, 7, 1, 0],
        wagonWheel: {},
        photoURL: '',
      },
      {
        name: 'Hardik Pandya',
        role: 'All-rounder',
        team: 'India',
        batting: { matches: 80, innings: 70, runs: 1518, highestScore: 92, average: 33.7, strikeRate: 112.0, hundreds: 0, fifties: 9, fours: 110, sixes: 60 },
        bowling: { matches: 80, innings: 70, wickets: 72, bestFigures: '4/24', average: 35.0, economy: 5.6, strikeRate: 37.0, fiveWicketHauls: 0 },
        recentScores: [34, 56, 12, 78, 40],
        wagonWheel: {},
        photoURL: '',
      },
      {
        name: 'Suryakumar Yadav',
        role: 'Batsman',
        team: 'India',
        batting: { matches: 60, innings: 55, runs: 1245, highestScore: 117, average: 28.0, strikeRate: 105.0, hundreds: 2, fifties: 8, fours: 100, sixes: 50 },
        bowling: { matches: 60, innings: 2, wickets: 0, bestFigures: '-', average: 0, economy: 0, strikeRate: 0, fiveWicketHauls: 0 },
        recentScores: [67, 45, 0, 23, 89],
        wagonWheel: {},
        photoURL: '',
      },
      {
        name: 'Tilak Verma',
        role: 'Batsman',
        team: 'India',
        batting: { matches: 20, innings: 18, runs: 450, highestScore: 84, average: 30.0, strikeRate: 98.0, hundreds: 0, fifties: 3, fours: 40, sixes: 15 },
        bowling: { matches: 20, innings: 1, wickets: 0, bestFigures: '-', average: 0, economy: 0, strikeRate: 0, fiveWicketHauls: 0 },
        recentScores: [12, 34, 56, 78, 90],
        wagonWheel: {},
        photoURL: '',
      },
      {
        name: 'Shubman Gill',
        role: 'Batsman',
        team: 'India',
        batting: { matches: 44, innings: 44, runs: 2271, highestScore: 208, average: 61.0, strikeRate: 102.0, hundreds: 6, fifties: 12, fours: 200, sixes: 40 },
        bowling: { matches: 44, innings: 0, wickets: 0, bestFigures: '-', average: 0, economy: 0, strikeRate: 0, fiveWicketHauls: 0 },
        recentScores: [112, 34, 56, 78, 90],
        wagonWheel: {},
        photoURL: '',
      },
    ];
    for (const player of demoPlayers) {
      await Player.updateOne({ name: player.name }, player, { upsert: true });
    }
    res.json({ message: 'Demo players added/updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
