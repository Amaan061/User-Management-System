import Task from '../models/Task.js';
import User from '../models/User.js';


export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, deadline, priority } = req.body;

        // Verifying that the  technician exists...
        const technician = await User.findOne({ _id: assignedTo, role: 'farm_technician' });
        if (!technician) {
            return res.status(400).json({ message: 'Invalid technician' });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            deadline,
            priority
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getManagerTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedBy: req.user._id })
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getTechnicians = async (req, res) => {
    try {
        const technicians = await User.find({ role: 'farm_technician' })
            .select('-password');
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 