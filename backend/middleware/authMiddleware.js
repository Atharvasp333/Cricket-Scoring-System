import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get the directory name using ESM compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    // Use the service account JSON file directly
    const serviceAccountPath = path.join(__dirname, '..', 'cricket-scoring-system-33fd6-firebase-adminsdk-fbsvc-d00b4733dd.json');
    
    console.log('Initializing Firebase Admin with service account from:', serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error; // Fail fast if Firebase can't be initialized
  }
}

// Middleware to verify Firebase ID token
export const verifyToken = async (req, res, next) => {
  console.log('verifyToken middleware called for path:', req.path);
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No authorization header or not Bearer token');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (!token) {
    console.log('No token found after Bearer');
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  try {
    console.log('Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully for UID:', decodedToken.uid);
    
    // Get the user from the database to ensure they exist
    const User = (await import('../models/User.js')).default;
    const user = await User.findOne({ firebaseUID: decodedToken.uid });
    
    if (!user) {
      console.log('No user found with firebaseUID:', decodedToken.uid);
      return res.status(404).json({ message: 'User not found in database' });
    }
    
    // Attach both the Firebase token and user to the request
    req.user = {
      ...decodedToken,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Error in verifyToken:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ 
        message: 'Unauthorized: Invalid token format',
        code: error.code
      });
    }
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        message: 'Unauthorized: Token has expired',
        code: error.code
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error during authentication',
      error: error.message,
      code: error.code
    });
  }
};

// Middleware to check user role
export const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      if (roles.includes(req.user.role)) {
        next();
      } else {
        console.log(`Access denied for role ${req.user.role}. Required roles:`, roles);
        res.status(403).json({ 
          message: 'Forbidden: Insufficient permissions',
          requiredRoles: roles,
          userRole: req.user.role
        });
      }
    } catch (error) {
      console.error('Error in checkRole middleware:', error);
      res.status(500).json({ 
        message: 'Server error during authorization',
        error: error.message 
      });
    }
  };
};