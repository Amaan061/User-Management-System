import express from 'express';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { getTechnicianTasks, updateTaskStatus } from '../controllers/technicianController.js';

const router = express.Router();


//     Get all tasks assigned to technician
router.get('/tasks', authenticate, authorize('farm_technician'), getTechnicianTasks);


//     Update task status
router.put('/tasks/:id', authenticate, authorize('farm_technician'), updateTaskStatus);

export default router; 