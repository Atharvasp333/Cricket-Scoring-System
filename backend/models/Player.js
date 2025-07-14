import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  firebaseUID: {
    type: String,
    required: true,
    unique: true
  },
  battingStyle: {
    type: String,
    enum: ['Right-handed', 'Left-handed'],
    default: 'Right-handed'
  },
  bowlingStyle: {
    type: String,
    enum: ['Right-arm', 'Left-arm'],
    default: 'Right-arm'
  },
  bowlerType: {
    type: String,
    enum: ['Fast', 'Medium', 'Spin', 'Pace', 'Leg-spin', 'Off-spin'],
    default: 'Medium'
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  runsScored: {
    type: Number,
    default: 0
  },
  wicketsTaken: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Player = mongoose.model('Player', playerSchema);

export default Player;