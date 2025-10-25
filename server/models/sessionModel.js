import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    sessionDate: {
        type: Date,
        required: true
    },
    sessionStartTime: {
        type: String,
        required: true
    },
    sessionEndTime: {
        type: String,
        required: true
    },
    sessionTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: null
    },
    sessionStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    sessionSpecialNote: {
        type: String,
        default: ''
    },
    sessionUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;