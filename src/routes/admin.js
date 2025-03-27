import express from 'express';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { getUsers, updateUserRole } from '../controllers/adminController.js';

const router = express.Router();


router.get('/users', authenticate, authorize('farm_admin'), getUsers);


router.put('/users/:id', authenticate, authorize('farm_admin'), updateUserRole);

export default router; 