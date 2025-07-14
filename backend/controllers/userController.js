// import User from '../models/User.js';
// import Player from '../models/Player.js';

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
//     console.log('Role received:', role);
    
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

//     // If role is player, also create a Player document
//     if (validatedRole === 'player') {
//       const playerData = {
//         name: displayName,
//         role: 'player',
//         photoURL: photoURL,
//         battingStyle: battingStyle,
//         bowlingStyle: bowlingStyle,
//         bowlerType: bowlerType,
//         phoneNumber: phoneNumber,
//         dateOfBirth: dateOfBirth,
//         height: height,
//         weight: weight,
//         bio: bio,
//         address: address
//       };
//       try {
//         await Player.create(playerData);
//         console.log('Player document created for user:', displayName);
//       } catch (err) {
//         console.error('Error creating Player document:', err);
//       }
//     }

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
import Player from '../models/Player.js';

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validate role
    const validRoles = ['viewer', 'scorer', 'organiser', 'player'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role specified',
        validRoles
      });
    }
    
    const users = await User.find({ role })
      .select('_id displayName email role createdAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Create or update user after Firebase authentication
export const createOrUpdateUser = async (req, res) => {
  try {
    const { 
      email, 
      displayName, 
      role = 'viewer', 
      photoURL = '', 
      firebaseUID, 
      // Player-specific fields
      battingStyle = 'Right-handed',
      bowlingStyle = 'Right-arm',
      bowlerType = 'Medium',
      phoneNumber = '',
      dateOfBirth = '',
      height = '',
      weight = '',
      bio = '',
      address = ''
    } = req.body;
    
    // Validate required fields
    if (!email || !displayName || !firebaseUID) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, displayName, firebaseUID'
      });
    }
    
    // Validate role
    const validRoles = ['viewer', 'scorer', 'organiser', 'player'];
    const validatedRole = validRoles.includes(role) ? role : 'viewer';

    // Check if user exists
    let user = await User.findOne({ firebaseUID });

    if (user) {
      // Update existing user
      user.email = email;
      user.displayName = displayName;
      user.role = validatedRole;
      user.photoURL = photoURL;
      
      // Update player-specific fields if role is player
      if (validatedRole === 'player') {
        user.battingStyle = battingStyle;
        user.bowlingStyle = bowlingStyle;
        user.bowlerType = bowlerType;
        user.phoneNumber = phoneNumber;
        user.dateOfBirth = dateOfBirth;
        user.height = height;
        user.weight = weight;
        user.bio = bio;
        user.address = address;
      }
      
      await user.save();
      
      // Update Player document if role is player
      if (validatedRole === 'player') {
        await Player.findOneAndUpdate(
          { user: user._id },
          {
            name: displayName,
            photoURL,
            battingStyle,
            bowlingStyle,
            bowlerType,
            phoneNumber,
            dateOfBirth,
            height,
            weight,
            bio,
            address
          },
          { upsert: true, new: true }
        );
      }
      
      return res.status(200).json({
        success: true,
        data: user
      });
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
      Object.assign(userData, {
        battingStyle,
        bowlingStyle,
        bowlerType,
        phoneNumber,
        dateOfBirth,
        height,
        weight,
        bio,
        address
      });
    }
    
    const newUser = await User.create(userData);

    // Create Player document if role is player
    if (validatedRole === 'player') {
      await Player.create({
        user: newUser._id,
        name: displayName,
        email,
        photoURL,
        battingStyle,
        bowlingStyle,
        bowlerType,
        phoneNumber,
        dateOfBirth,
        height,
        weight,
        bio,
        address,
        firebaseUID
      });
    }

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating user',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get user by Firebase UID
export const getUserByFirebaseUID = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    
    const user = await User.findOne({ firebaseUID });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // If user is a player, get player data too
    if (user.role === 'player') {
      const player = await Player.findOne({ firebaseUID });
      return res.status(200).json({
        success: true,
        data: {
          user,
          player
        }
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};