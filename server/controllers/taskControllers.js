import Task from '../models/taskModel.js';

export const createTask = async (req, res) => {
    const { taskName, taskDescription, taskPriority, userId } = req.body;

    if (!taskName || !userId) {
        return res.status(400).json({ success: false, message: 'Task name and userId are required' });
    }
    try {
        const task = new Task({
            taskName,
            taskDescription,
            taskPriority,
            taskUser: userId,
        });

        const createdTask = await task.save();
        res.status(201).json({ success: true, task: createdTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTasks = async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await Task.find({ taskUser: userId });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;

    try {
        const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
