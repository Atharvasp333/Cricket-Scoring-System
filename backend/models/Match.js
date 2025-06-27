import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  match_name: { type: String, required: true },
  match_type: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  teams: [{ type: String, required: true }], // Simple array of team names
  status: { type: String, enum: ['Upcoming', 'Live', 'completed'], default: 'Upcoming' },
  venue: { type: String, required: true },
  team1_name: { type: String, required: true }, // Direct team name
  team2_name: { type: String, required: true }, // Direct team name
  team1_players: [
    {
      name: { type: String, required: true },
      role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
      isCaptain: { type: Boolean, default: false },
      isWicketKeeper: { type: Boolean, default: false },
    }
  ],
  team2_players: [
    {
      name: { type: String, required: true },
      role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
      isCaptain: { type: Boolean, default: false },
      isWicketKeeper: { type: Boolean, default: false },
    }
  ],
  total_overs: { type: Number, required: true },
  powerplay_overs: { type: Number, required: true },
  drs_enabled: { type: Boolean, default: false },
  scorers: [{ type: String, required: true }],
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema);