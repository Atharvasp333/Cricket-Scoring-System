import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playerName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper']
  },
  registrationType: {
    type: String,
    required: true,
    enum: ['tournament', 'match']
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  },
  team: {
    type: String
  },
  isCaptain: {
    type: Boolean,
    default: false
  },
  isWicketKeeper: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: String,
    enum: ['captain', 'organiser'],
    default: null
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure that either tournamentId or matchId is provided
RegistrationSchema.pre('validate', function(next) {
  if (this.registrationType === 'tournament' && !this.tournamentId) {
    return next(new Error('Tournament ID is required for tournament registrations'));
  }
  if (this.registrationType === 'match' && !this.matchId) {
    return next(new Error('Match ID is required for match registrations'));
  }
  next();
});

const Registration = mongoose.model('Registration', RegistrationSchema);

export default Registration;