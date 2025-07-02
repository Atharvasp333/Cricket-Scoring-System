import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coach: { type: String, required: true },
  logo: { type: String }, // Store as URL or base64 string
  captains: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of captain user IDs
});

const PlayerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  name: String,
  role: String,
  team: String,
  isCaptain: Boolean,
  isWicketKeeper: Boolean,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: String, enum: ['captain', 'organiser'], default: null },
});

const AccessSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
});

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  location: { type: String, required: true },
  banner: { type: String }, // Store as URL or base64 string
  teams: [TeamSchema],
  players: [PlayerSchema],
  maxPlayers: Number,
  overs: Number,
  powerplay: String,
  drsEnabled: Boolean,
  drsReviews: Number,
  tieBreaker: String,
  customScoring: Boolean,
  autoGenerate: Boolean,
  days: [String],
  maxMatchesPerDay: Number,
  access: [AccessSchema],
  status: { type: String, enum: ['Upcoming', 'Live', 'completed'], default: 'Upcoming' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

export default mongoose.model('Tournament', TournamentSchema);