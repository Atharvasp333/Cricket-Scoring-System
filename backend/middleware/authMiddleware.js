import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

// Middleware to verify Firebase ID token
export const verifyToken = async (req, res, next) => {
  console.log('verifyToken middleware called');
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No authorization header or not Bearer token');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  console.log('Token received:', token.substring(0, 10) + '...');

  try {
    console.log('Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully for UID:', decodedToken.uid);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Middleware to check user role
export const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // Get user from database using Firebase UID
      const user = await import('../models/User.js')
        .then(module => module.default.findOne({ firebaseUID: req.user.uid }));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (roles.includes(user.role)) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
    } catch (error) {
      console.error('Error checking role:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
};