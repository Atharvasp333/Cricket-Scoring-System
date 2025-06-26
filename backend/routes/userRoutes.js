import express from 'express';
import { createOrUpdateUser, getUserByFirebaseUID } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create or update user - no auth required for initial creation
router.post('/', createOrUpdateUser);

// Get user by Firebase UID - temporarily removing auth requirement to fix role issue
// TODO: Re-add verifyToken middleware once authentication issues are resolved
router.get('/:firebaseUID', getUserByFirebaseUID);
  
export default router;