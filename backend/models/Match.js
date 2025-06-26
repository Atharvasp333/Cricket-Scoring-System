import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  match_name: { type: String, required: true }, // Match Name
  match_type: { type: String }, // Optional: Tournament name or ID
  date: { type: String, required: true },
  time: { type: String, required: true },
  teams: [{ type: String, required: true }],
  status: { type: String, default: 'Upcoming' },
  venue: { type: String, required: true },
  team1: {
    name: { type: String, required: true },
    players: [
      {
        name: { type: String, required: true },
        role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
        isCaptain: { type: Boolean, default: false },
        isWicketKeeper: { type: Boolean, default: false },
      }
    ]
  },
  team2: {
    name: { type: String, required: true },
    players: [
      {
        name: { type: String, required: true },
        role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
        isCaptain: { type: Boolean, default: false },
        isWicketKeeper: { type: Boolean, default: false },
      }
    ]
  },
  total_overs: { type: Number, required: true },
  powerplay_overs: { type: Number, required: true },
  drs_enabled: { type: Boolean, default: false },
  drs_enabled: { type: Boolean, default: false },
  scorers: [{ type: String, required: true }],

  // You can add more fields here as needed (e.g., venue, scorers, etc.)
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema); 