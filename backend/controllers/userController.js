// import User from '../models/User.js';

// // Get users by role
// export const getUsersByRole = async (req, res) => {
//   try {
//     const { role } = req.params;
    
//     // Validate role
//     const validRoles = ['viewer', 'scorer', 'organiser', 'player'];
//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ message: 'Invalid role specified' });
//     }
    
//     const users = await User.find({ role }).select('_id displayName email');
    
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching users by role:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Create or update user after Firebase authentication
// export const createOrUpdateUser = async (req, res) => {
//   try {
//     console.log('Request body received:', req.body);
    
//     const { 
//       email, 
//       displayName, 
//       role, 
//       photoURL, 
//       firebaseUID, 
//       battingStyle, 
//       bowlingStyle, 
//       bowlerType, 
//       phoneNumber,
//       dateOfBirth,
//       height,
//       weight,
//       bio,
//       address 
//     } = req.body;
    
//     // Required field checks
//     if (!email || !displayName || !firebaseUID) {
//       console.error('Missing required fields:', req.body);
//       return res.status(400).json({ message: 'Missing required fields: email, displayName, firebaseUID' });
//     }
    
//     console.log('Received user data:', req.body);
//     console.log('Role received:', role, 'Type:', typeof role);
    
//     // Validate role
//     const validRoles = ['viewer', 'scorer', 'organiser','player'];
//     const validatedRole = validRoles.includes(role) ? role : 'viewer';
//     console.log('Validated role:', validatedRole, '(original was:', role, ')');

//     // Check if user already exists
//     let user = await User.findOne({ firebaseUID });

//     if (user) {
//       // Update existing user
//       console.log('Updating existing user with role:', validatedRole);
//       user.email = email || user.email;
//       user.displayName = displayName || user.displayName;
//       user.role = validatedRole; // Use validated role
//       user.photoURL = photoURL || user.photoURL;
      
//       // Update player-specific fields if role is player
//       if (validatedRole === 'player') {
//         user.battingStyle = battingStyle || user.battingStyle;
//         user.bowlingStyle = bowlingStyle || user.bowlingStyle;
//         user.bowlerType = bowlerType || user.bowlerType;
//         user.phoneNumber = phoneNumber || user.phoneNumber;
//         user.dateOfBirth = dateOfBirth || user.dateOfBirth;
//         user.height = height || user.height;
//         user.weight = weight || user.weight;
//         user.bio = bio || user.bio;
//         user.address = address || user.address;
//       }
      
//       await user.save();
//       return res.status(200).json(user);
//     }

//     // Create new user
//     console.log('Creating new user with validated role:', validatedRole);
    
//     const userData = {
//       email,
//       displayName,
//       role: validatedRole, // Use validated role
//       photoURL,
//       firebaseUID
//     };
    
//     // Add player-specific fields if role is player
//     if (validatedRole === 'player') {
//       userData.battingStyle = battingStyle;
//       userData.bowlingStyle = bowlingStyle;
//       userData.bowlerType = bowlerType;
//       userData.phoneNumber = phoneNumber;
//       userData.dateOfBirth = dateOfBirth;
//       userData.height = height;
//       userData.weight = weight;
//       userData.bio = bio;
//       userData.address = address;
//     }
    
//     const newUser = new User(userData);

//     await newUser.save();
//     console.log('New user created successfully with role:', newUser.role);
//     return res.status(201).json(newUser);
//   } catch (error) {
//     console.error('Error creating/updating user:', error);
//     console.error('Request body was:', req.body);
//     res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
//   }
// };

// // Get user by Firebase UID
// export const getUserByFirebaseUID = async (req, res) => {
//   try {
//     const { firebaseUID } = req.params;
//     console.log('Getting user by Firebase UID:', firebaseUID);
    
//     // Note: req.user might not be available since we removed verifyToken middleware
//     if (req.user) {
//       console.log('Authenticated user UID from token:', req.user.uid);
      
//       // Check if the requested UID matches the authenticated user's UID
//       if (req.user.uid !== firebaseUID) {
//         console.warn('UID mismatch: Requested UID does not match authenticated user');
//         console.warn('Requested:', firebaseUID, 'Authenticated:', req.user.uid);
//       }
//     } else {
//       console.log('No authenticated user in request (verifyToken middleware removed)');
//     }
    
//     const user = await User.findOne({ firebaseUID });
//     console.log('User found in database:', user ? 'Yes' : 'No');
    
//     if (user) {
//       console.log('User role from database:', user.role);
//     }

//     if (!user) {
//       console.log('User not found in database');
//       return res.status(404).json({ message: 'User not found' });
//     }

//     console.log('Returning user data with role:', user.role);
//     res.status(200).json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

import User from '../models/User.js';
import Match from '../models/Match.js';
import Tournament from '../models/Tournament.js';

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validate role
    const validRoles = ['viewer', 'scorer', 'organiser', 'player'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    const users = await User.find({ role }).select('_id displayName email photoURL');
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign captain role to a player
export const assignCaptain = async (req, res) => {
  try {
    const { userId, matchId, team } = req.body;

    // Validate input
    if (!userId || !matchId || !['team1', 'team2'].includes(team)) {
      return res.status(400).json({ message: 'Missing required fields or invalid team' });
    }

    // Check if user exists and is a player
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'player') {
      return res.status(400).json({ message: 'Only players can be assigned as captains' });
    }

    // Update match with captain details
    const update = { 
      [`${team}_captain`]: {
        userId: user._id,
        name: user.displayName,
        photoURL: user.photoURL,
        contact: user.phoneNumber || ''
      }
    };

    const match = await Match.findByIdAndUpdate(matchId, update, { new: true });
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Update player's isCaptain status in the team
    const teamKey = `${team}_players`;
    const playerIndex = match[teamKey].findIndex(p => p.userId.equals(userId));
    
    if (playerIndex !== -1) {
      match[teamKey][playerIndex].isCaptain = true;
      await match.save();
    }

    res.status(200).json({ 
      message: 'Captain assigned successfully',
      match
    });

  } catch (error) {
    console.error('Error assigning captain:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get captain details
export const getCaptainDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      '_id displayName email photoURL battingStyle bowlingStyle phoneNumber'
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get matches where user is captain
    const matches = await Match.find({
      $or: [
        { 'team1_captain.userId': userId },
        { 'team2_captain.userId': userId }
      ]
    }).select('match_name date venue team1_name team2_name');

    // Get tournaments where user is captain (if you have tournament captain functionality)
    const tournaments = await Tournament.find({
      'teams.captains': userId
    }).select('name startDate endDate');

    res.status(200).json({
      ...user.toObject(),
      isCaptain: matches.length > 0 || tournaments.length > 0,
      matchesAsCaptain: matches,
      tournamentsAsCaptain: tournaments
    });

  } catch (error) {
    console.error('Error fetching captain details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update user after Firebase authentication
export const createOrUpdateUser = async (req, res) => {
  try {
    const { 
      email, 
      displayName, 
      role, 
      photoURL, 
      firebaseUID, 
      battingStyle, 
      bowlingStyle, 
      bowlerType, 
      phoneNumber,
      dateOfBirth,
      height,
      weight,
      bio,
      address
    } = req.body;
    
    // Required field checks
    if (!email || !displayName || !firebaseUID) {
      return res.status(400).json({ message: 'Missing required fields: email, displayName, firebaseUID' });
    }
    
    // Validate role
    const validRoles = ['viewer', 'scorer', 'organiser', 'player'];
    const validatedRole = validRoles.includes(role) ? role : 'viewer';

    // Check if user already exists
    let user = await User.findOne({ firebaseUID });

    if (user) {
      // Update existing user
      user.email = email || user.email;
      user.displayName = displayName || user.displayName;
      user.role = validatedRole;
      user.photoURL = photoURL || user.photoURL;
      
      // Update player-specific fields if role is player
      if (validatedRole === 'player') {
        user.battingStyle = battingStyle || user.battingStyle;
        user.bowlingStyle = bowlingStyle || user.bowlingStyle;
        user.bowlerType = bowlerType || user.bowlerType;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        user.bio = bio || user.bio;
        user.address = address || user.address;
      }
      
      await user.save();
      return res.status(200).json(user);
    }

    // Create new user
    const userData = {
      email,
      displayName,
      role: validatedRole,
      photoURL,
      firebaseUID
    };
    
    // Add player-specific fields if role is player
    if (validatedRole === 'player') {
      userData.battingStyle = battingStyle;
      userData.bowlingStyle = bowlingStyle;
      userData.bowlerType = bowlerType;
      userData.phoneNumber = phoneNumber;
      userData.dateOfBirth = dateOfBirth;
      userData.height = height;
      userData.weight = weight;
      userData.bio = bio;
      userData.address = address;
    }
    
    const newUser = new User(userData);
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by Firebase UID
export const getUserByFirebaseUID = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const user = await User.findOne({ firebaseUID });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a captain in any matches or tournaments
    const [matchesAsCaptain, tournamentsAsCaptain] = await Promise.all([
      Match.find({
        $or: [
          { 'team1_captain.userId': user._id },
          { 'team2_captain.userId': user._id }
        ]
      }).select('match_name date'),
      Tournament.find({
        'teams.captains': user._id
      }).select('name startDate')
    ]);

    const userWithCaptainStatus = {
      ...user.toObject(),
      isCaptain: matchesAsCaptain.length > 0 || tournamentsAsCaptain.length > 0,
      matchesAsCaptain,
      tournamentsAsCaptain
    };

    res.status(200).json(userWithCaptainStatus);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};