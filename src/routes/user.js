import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();


//     Get user profile
router.get('/profile', authenticate, getUserProfile);


//    Update user profile
router.put('/profile', authenticate, updateUserProfile);

export default router; 