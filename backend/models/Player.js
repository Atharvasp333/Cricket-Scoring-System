import mongoose from 'mongoose';

const BattingStatsSchema = new mongoose.Schema({
  matches: Number,
  innings: Number,
  runs: Number,
  highestScore: Number,
  average: Number,
  strikeRate: Number,
  hundreds: Number,
  fifties: Number,
  fours: Number,
  sixes: Number,
});

const BowlingStatsSchema = new mongoose.Schema({
  matches: Number,
  innings: Number,
  wickets: Number,
  bestFigures: String,
  average: Number,
  economy: Number,
  strikeRate: Number,
  fiveWicketHauls: Number,
});

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  team: { type: String },
  batting: BattingStatsSchema,
  bowling: BowlingStatsSchema,
  recentScores: [Number], // Last 5 matches
  wagonWheel: { type: Object }, // Placeholder for wagon wheel data
  photoURL: { type: String },
});

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
