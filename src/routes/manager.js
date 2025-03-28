import express from 'express';
import { authenticate} from '../middleware/authenticate.js';
import {checkRoles} from '../middleware/checkRoles.js'
import { createTask, getManagerTasks, getTechnicians } from '../controllers/managerController.js';

const router = express.Router();

//    Create a new task
router.post('/tasks', authenticate, checkRoles('farm_manager'), createTask);


//     Get all tasks assigned by manager
router.get('/tasks', authenticate, checkRoles('farm_manager'), getManagerTasks);


// @   Get all active technicians
router.get('/technicians', authenticate, checkRoles('farm_manager'), getTechnicians);

export default router; 