import express from 'express';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();


router.post('/signup', registerUser);

router.post('/login', loginUser);

router.post('/refresh-token', refreshToken);

router.post('/logout', authenticate, logoutUser);

export default router; 