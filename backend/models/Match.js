import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Match Name
  tournament: { type: String }, // Optional: Tournament name or ID
  date: { type: String, required: true },
  teams: [{ type: String, required: true }],
  status: { type: String, default: 'Upcoming' },
  // You can add more fields here as needed (e.g., venue, scorers, etc.)
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema); 