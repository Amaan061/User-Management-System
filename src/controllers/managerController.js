import Task from '../models/Task.js';
import User from '../models/User.js';


export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, deadline } = req.body;

        // Check if the assigned technician exists and is active
        const technician = await User.findOne({ 
            _id: assignedTo, 
            role: 'farm_technician',
            isActive: true 
        });

        if (!technician) {
            return res.status(404).json({ 
                success: false, 
                message: 'Active technician not found' 
            });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            deadline: new Date(deadline)
        });

        res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating task' 
        });
    }
};


export const getManagerTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedBy: req.user._id })
            .populate('assignedTo', 'firstName lastName email');
        
        res.json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching tasks' 
        });
    }
};


export const getTechnicians = async (req, res) => {
    try {
        const technicians = await User.find({ 
            role: 'farm_technician',
            isActive: true 
        }).select('firstName lastName email');

        res.json({
            success: true,
            technicians
        });
    } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching technicians' 
        });
    }
}; 