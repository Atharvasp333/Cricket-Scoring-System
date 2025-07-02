import User from '../models/User.js';

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validate role
    const validRoles = ['viewer', 'scorer', 'organiser', 'player'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    const users = await User.find({ role }).select('_id displayName email');
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update user after Firebase authentication
export const createOrUpdateUser = async (req, res) => {
  try {
    console.log('Request body received:', req.body);
    
    const { email, displayName, role, photoURL, firebaseUID } = req.body;
    
    // Required field checks
    if (!email || !displayName || !firebaseUID) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ message: 'Missing required fields: email, displayName, firebaseUID' });
    }
    
    console.log('Received user data:', req.body);
    console.log('Role received:', role, 'Type:', typeof role);
    
    // Validate role
    const validRoles = ['viewer', 'scorer', 'organiser','player'];
    const validatedRole = validRoles.includes(role) ? role : 'viewer';
    console.log('Validated role:', validatedRole, '(original was:', role, ')');

    // Check if user already exists
    let user = await User.findOne({ firebaseUID });

    if (user) {
      // Update existing user
      console.log('Updating existing user with role:', validatedRole);
      user.email = email || user.email;
      user.displayName = displayName || user.displayName;
      user.role = validatedRole; // Use validated role
      user.photoURL = photoURL || user.photoURL;
      await user.save();
      return res.status(200).json(user);
    }

    // Create new user
    console.log('Creating new user with validated role:', validatedRole);
    
    const newUser = new User({
      email,
      displayName,
      role: validatedRole, // Use validated role
      photoURL,
      firebaseUID
    });

    await newUser.save();
    console.log('New user created successfully with role:', newUser.role);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    console.error('Request body was:', req.body);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

// Get user by Firebase UID
export const getUserByFirebaseUID = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    console.log('Getting user by Firebase UID:', firebaseUID);
    
    // Note: req.user might not be available since we removed verifyToken middleware
    if (req.user) {
      console.log('Authenticated user UID from token:', req.user.uid);
      
      // Check if the requested UID matches the authenticated user's UID
      if (req.user.uid !== firebaseUID) {
        console.warn('UID mismatch: Requested UID does not match authenticated user');
        console.warn('Requested:', firebaseUID, 'Authenticated:', req.user.uid);
      }
    } else {
      console.log('No authenticated user in request (verifyToken middleware removed)');
    }
    
    const user = await User.findOne({ firebaseUID });
    console.log('User found in database:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('User role from database:', user.role);
    }

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Returning user data with role:', user.role);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};