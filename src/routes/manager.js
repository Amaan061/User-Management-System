import express from 'express';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { createTask, getManagerTasks, getTechnicians } from '../controllers/managerController.js';

const router = express.Router();

//    Create a new task
router.post('/tasks', authenticate, authorize('farm_manager'), createTask);


//     Get all tasks assigned by manager
router.get('/tasks', authenticate, authorize('farm_manager'), getManagerTasks);


// @   Get all active technicians
router.get('/technicians', authenticate, authorize('farm_manager'), getTechnicians);

export default router; 