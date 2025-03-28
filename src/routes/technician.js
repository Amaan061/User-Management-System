import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {checkRoles} from '../middleware/checkRoles.js'
import { getTechnicianTasks, updateTaskStatus } from '../controllers/technicianController.js';

const router = express.Router();


//     Get all tasks assigned to technician
router.get('/tasks', authenticate, checkRoles('farm_technician'), getTechnicianTasks);


//     Update task status
router.put('/tasks/:id', authenticate, checkRoles('farm_technician'), updateTaskStatus);

export default router; 