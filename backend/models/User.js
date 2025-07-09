import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['viewer', 'scorer', 'organiser', 'player'],
    default: 'viewer'
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
  // Player-specific fields
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save middleware to ensure player-specific fields are only set for players
userSchema.pre('save', function(next) {
  if (this.role !== 'player') {
    this.battingStyle = undefined;
    this.bowlingStyle = undefined;
    this.bowlerType = undefined;
    this.phoneNumber = undefined;
    this.dateOfBirth = undefined;
    this.height = undefined;
    this.weight = undefined;
    this.bio = undefined;
    this.address = undefined;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;