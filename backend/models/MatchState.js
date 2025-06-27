import mongoose from 'mongoose';

// Define the MatchState schema
const MatchStateSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true
  },
  innings: {
    type: Number,
    required: true,
    default: 1
  },
  battingTeam: {
    name: String,
    players: [{
      name: String,
      role: String,
      isCaptain: Boolean,
      isWicketKeeper: Boolean
    }]
  },
  bowlingTeam: {
    name: String,
    players: [{
      name: String,
      role: String,
      isCaptain: Boolean,
      isWicketKeeper: Boolean
    }]
  },
  score: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0
  },
  overs: {
    type: Number,
    default: 0
  },
  balls: {
    type: Number,
    default: 0
  },
  currentOver: {
    type: Array,
    default: []
  },
  previousOvers: {
    type: Array,
    default: []
  },
  crr: {
    type: Number,
    default: 0
  },
  target: {
    type: Number,
    default: null
  },
  rrr: {
    type: Number,
    default: null
  },
  striker: {
    name: String,
    runs: {
      type: Number,
      default: 0
    },
    balls: {
      type: Number,
      default: 0
    },
    fours: {
      type: Number,
      default: 0
    },
    sixes: {
      type: Number,
      default: 0
    },
    strikeRate: {
      type: Number,
      default: 0
    },
    isOut: {
      type: Boolean,
      default: false
    }
  },
  nonStriker: {
    name: String,
    runs: {
      type: Number,
      default: 0
    },
    balls: {
      type: Number,
      default: 0
    },
    fours: {
      type: Number,
      default: 0
    },
    sixes: {
      type: Number,
      default: 0
    },
    strikeRate: {
      type: Number,
      default: 0
    },
    isOut: {
      type: Boolean,
      default: false
    }
  },
  currentBowler: {
    name: String,
    overs: {
      type: Number,
      default: 0
    },
    balls: {
      type: Number,
      default: 0
    },
    maidens: {
      type: Number,
      default: 0
    },
    runs: {
      type: Number,
      default: 0
    },
    wickets: {
      type: Number,
      default: 0
    },
    economy: {
      type: Number,
      default: 0
    }
  },
  lastBowler: {
    type: String,
    default: ''
  },
  bowlers: [{
    name: String,
    overs: {
      type: Number,
      default: 0
    },
    balls: {
      type: Number,
      default: 0
    },
    maidens: {
      type: Number,
      default: 0
    },
    runs: {
      type: Number,
      default: 0
    },
    wickets: {
      type: Number,
      default: 0
    },
    economy: {
      type: Number,
      default: 0
    }
  }],
  batsmen: [{
    name: String,
    runs: {
      type: Number,
      default: 0
    },
    balls: {
      type: Number,
      default: 0
    },
    fours: {
      type: Number,
      default: 0
    },
    sixes: {
      type: Number,
      default: 0
    },
    strikeRate: {
      type: Number,
      default: 0
    },
    isOut: {
      type: Boolean,
      default: false
    }
  }],
  extras: {
    wides: {
      type: Number,
      default: 0
    },
    noBalls: {
      type: Number,
      default: 0
    },
    byes: {
      type: Number,
      default: 0
    },
    legByes: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  matchStatus: {
    type: String,
    enum: ['Live', 'Completed', 'Abandoned', 'Delayed'],
    default: 'Live'
  }
}, { timestamps: true });

// Create a compound index to ensure one state per match
MatchStateSchema.index({ matchId: 1 }, { unique: true });

const MatchState = mongoose.model('MatchState', MatchStateSchema);

export default MatchState;