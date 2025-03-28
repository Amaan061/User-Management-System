import express from 'express';
import { authenticate} from '../middleware/authenticate.js';
import { checkRoles } from '../middleware/checkRoles.js';  
import { getUsers, updateUserRole } from '../controllers/adminController.js';

const router = express.Router();


router.get('/users', authenticate, checkRoles('farm_admin'), getUsers);


router.put('/users/:id', authenticate, checkRoles('farm_admin'), updateUserRole);

export default router; 