// import mongoose from 'mongoose';

// const MatchSchema = new mongoose.Schema({
//   match_name: { type: String, required: true },
//   match_type: { type: String },
//   date: { type: String, required: true },
//   time: { type: String, required: true },
//   teams: [{ type: String, required: true }],
//   status: { type: String, enum: ['Upcoming', 'Live', 'Completed'], default: 'Upcoming' },
//   venue: { type: String, required: true },
  
//   // Team information with enhanced captain details
//   team1: {
//     name: { type: String, required: true },
//     captain: {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       name: { type: String },
//       imageUrl: { type: String },
//       contact: { type: String },
//       // Add other captain-specific fields as needed
//     },
//     drsAvailable: { type: Number, default: 2, min: 0 },
//     players: [
//       {
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         name: { type: String, required: true },
//         role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
//         isCaptain: { type: Boolean, default: false },
//         isWicketKeeper: { type: Boolean, default: false },
//         status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//         approvedBy: { type: String, enum: ['captain', 'organiser'], default: null },
//       }
//     ]
//   },
  
//   team2: {
//     name: { type: String, required: true },
//     captain: {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       name: { type: String },
//       imageUrl: { type: String },
//       contact: { type: String },
//       // Add other captain-specific fields as needed
//     },
//     drsAvailable: { type: Number, default: 2, min: 0 },
//     players: [
//       {
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         name: { type: String, required: true },
//         role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
//         isCaptain: { type: Boolean, default: false },
//         isWicketKeeper: { type: Boolean, default: false },
//         status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//         approvedBy: { type: String, enum: ['captain', 'organiser'], default: null },
//       }
//     ]
//   },

//   total_overs: { type: Number, required: true },
//   powerplay_overs: { type: Number, required: true },
//   drs_enabled: { type: Boolean, default: false },
//   scorers: [{ type: String, required: true }],
  
//   // Additional match metadata
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true } 
// });

// // Virtual for easy access to both teams' captains
// MatchSchema.virtual('captains').get(function() {
//   return {
//     team1: this.team1.captain,
//     team2: this.team2.captain
//   };
// });

// // Pre-save hook to validate captains
// MatchSchema.pre('save', function(next) {
//   // Validate that captain exists in players array if set
//   if (this.team1.captain?.userId) {
//     const isCaptainInTeam = this.team1.players.some(
//       player => player.userId.equals(this.team1.captain.userId)
//     );
//     if (!isCaptainInTeam) {
//       throw new Error('Team 1 captain must be a member of the team');
//     }
//   }
  
//   if (this.team2.captain?.userId) {
//     const isCaptainInTeam = this.team2.players.some(
//       player => player.userId.equals(this.team2.captain.userId)
//     );
//     if (!isCaptainInTeam) {
//       throw new Error('Team 2 captain must be a member of the team');
//     }
//   }
  
//   next();
import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  match_name: { type: String, required: true },
  match_type: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  
  // Team 1 with enhanced captain details
  team1: {
    name: { type: String, required: true },
    captain: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      imageUrl: { type: String },
      drsAvailable: { type: Number, default: 2, min: 0 },
      isCaptain: { type: Boolean, default: true }
    },
    players: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        role: { 
          type: String, 
          enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'], 
          required: true 
        },
        isCaptain: { type: Boolean, default: false },
        isWicketKeeper: { type: Boolean, default: false },
        status: { 
          type: String, 
          enum: ['pending', 'approved', 'rejected'], 
          default: 'pending' 
        },
        approvedBy: { 
          type: String, 
          enum: ['captain', 'organizer', null], 
          default: null 
        },
        joinedAt: { type: Date, default: Date.now }
      }
    ]
  },
  
  // Team 2 with enhanced captain details
  team2: {
    name: { type: String, required: true },
    captain: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      imageUrl: { type: String },
      drsAvailable: { type: Number, default: 2, min: 0 },
      isCaptain: { type: Boolean, default: true }
    },
    players: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        role: { 
          type: String, 
          enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'], 
          required: true 
        },
        isCaptain: { type: Boolean, default: false },
        isWicketKeeper: { type: Boolean, default: false },
        status: { 
          type: String, 
          enum: ['pending', 'approved', 'rejected'], 
          default: 'pending' 
        },
        approvedBy: { 
          type: String, 
          enum: ['captain', 'organizer', null], 
          default: null 
        },
        joinedAt: { type: Date, default: Date.now }
      }
    ]
  },
  
  // Team 1 details
  team1: {
    name: { type: String, required: true },
    captain: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      imageUrl: { type: String },
      role: { type: String, default: 'Captain' },
      drsAvailable: { type: Number, default: 2, min: 0, max: 2 }
    },
    players: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      approvedBy: { type: String, enum: ['captain', 'organizer'], default: 'organizer' },
      isCaptain: { type: Boolean, default: false }
    }]
  },
  
  // Team 2 details
  team2: {
    name: { type: String, required: true },
    captain: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      imageUrl: { type: String },
      role: { type: String, default: 'Captain' },
      drsAvailable: { type: Number, default: 2, min: 0, max: 2 }
    },
    players: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      approvedBy: { type: String, enum: ['captain', 'organizer'], default: 'organizer' },
      isCaptain: { type: Boolean, default: false }
    }]
  },
  teams: [{ type: String, required: true }],
  status: { type: String, enum: ['Upcoming', 'Live', 'Completed'], default: 'Upcoming' },
  venue: { type: String, required: true },
  team1_name: { type: String, required: true },
  team2_name: { type: String, required: true },
  // Updated captain fields
  team1_captain: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    photoURL: String,
    contact: String
  },
  team2_captain: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    photoURL: String,
    contact: String
  },
  
  team1_players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Virtual for easy access to captains
MatchSchema.virtual('captains').get(function() {
  return {
    team1: this.team1_captain,
    team2: this.team2_captain
  };
});

export default mongoose.model('Match', MatchSchema);