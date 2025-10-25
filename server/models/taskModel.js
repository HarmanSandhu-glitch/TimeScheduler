import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    taskName: {
        type: String,
        required: true,
        trim: true,
    },
    taskDescription: {
        type: String,
        required: false,
        trim: true,
    },
    taskPriority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    // --- ADD THIS ---
    taskStatus: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    // --- END ADD ---
    taskUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;