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
  team1_captains: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of captain user IDs for team 1
  team2_captains: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of captain user IDs for team 2
  team1_players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
      name: { type: String, required: true },
      role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
      isCaptain: { type: Boolean, default: false },
      isWicketKeeper: { type: Boolean, default: false },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      approvedBy: { type: String, enum: ['captain', 'organiser'], default: null },
    }
  ],
  team2_players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
      name: { type: String, required: true },
      role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
      isCaptain: { type: Boolean, default: false },
      isWicketKeeper: { type: Boolean, default: false },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      approvedBy: { type: String, enum: ['captain', 'organiser'], default: null },
    }
  ],
  total_overs: { type: Number, required: true },
  powerplay_overs: { type: Number, required: true },
  drs_enabled: { type: Boolean, default: false },
  scorers: [{ type: String, required: true }],
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema);