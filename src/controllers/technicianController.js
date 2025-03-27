import Task from '../models/Task.js';


export const getTechnicianTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('assignedBy', 'firstName lastName email')
            .sort({ deadline: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id,
            assignedTo: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = req.body.status;
        if (req.body.status === 'completed') {
            task.completedAt = Date.now();
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 