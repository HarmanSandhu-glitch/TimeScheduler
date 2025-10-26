import Session from '../models/sessionModel.js';
import User from '../models/userModel.js';
import Task from '../models/taskModel.js';
const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
export const createCurrentDateSessions = async (req, res) => {
    const userId = req.user.id;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    try {
        const existingSession = await Session.findOne({
            sessionUser: userId,
            sessionDate: today,
        });

        if (existingSession) {
            return res.status(200).json({ success: true, message: 'Sessions for today already created.' });
        }
        const user = await User.findById(userId); 

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { userDayStartTime, userDayEndTime, userSessionSize } = user; 

        const startMinutes = timeToMinutes(userDayStartTime);
        const endMinutes = timeToMinutes(userDayEndTime);
        const sessionDuration = userSessionSize; 

        if (endMinutes <= startMinutes) {
            return res.status(400).json({ success: false, message: 'End time must be after start time' });
        }

        const totalDuration = endMinutes - startMinutes;
        const numberOfSessions = Math.floor(totalDuration / sessionDuration);

        if (numberOfSessions <= 0) {
            return res.status(400).json({ success: false, message: 'No sessions can be created with current settings' });
        }

        const sessionsToCreate = [];
        let currentSessionStart = startMinutes;

        for (let i = 0; i < numberOfSessions; i++) {
            const sessionStartTime = minutesToTime(currentSessionStart);
            const sessionEndTime = minutesToTime(currentSessionStart + sessionDuration);

            sessionsToCreate.push({
                sessionDate: today,
                sessionStartTime,
                sessionEndTime,
                sessionTask: null,
                sessionStatus: 'Pending',
                sessionSpecialNote: '',
                sessionUser: userId,
            });
            currentSessionStart += sessionDuration;
        }

        const createdSessions = await Session.insertMany(sessionsToCreate);
        res.status(201).json({ success: true, message: 'Sessions created successfully', sessions: createdSessions });

    } catch (error) {
        console.error('Error creating sessions:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSessionStatus = async (req, res) => {
    const { sessionId } = req.params;
    const { status } = req.body;
    console.log("Updating session status:", status, "with sessionId:", sessionId);
    if (!status || !['Pending', 'Completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    try {
        const session = await Session.findByIdAndUpdate(
            sessionId,
            { sessionStatus: status },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.status(200).json({ success: true, message: 'Session status updated', session });
    } catch (error) {
        console.error('Error updating session status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSessionTask = async (req, res) => {
    const { sessionId } = req.params;
    const { taskId } = req.body;
    try {
        if (taskId) {
            const taskExists = await Task.findById(taskId);
            if (!taskExists) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }
        }
        const session = await Session.findByIdAndUpdate(
            sessionId,
            { sessionTask: taskId || null },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.status(200).json({ success: true, message: 'Session task updated', session });
    } catch (error) {
        console.error('Error updating session task:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSpecialNote = async (req, res) => {
    const { sessionId } = req.params;
    const { note } = req.body; 

    try {
        const session = await Session.findByIdAndUpdate(
            sessionId,
            { sessionSpecialNote: note || '' },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.status(200).json({ success: true, message: 'Session special note updated', session });
    } catch (error) {
        console.error('Error updating special note:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSessionsByDate = async (req, res) => {
    const userId = req.user.id; 
    const { date } = req.params;
    try {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const sessions = await Session.find({
            sessionUser: userId,
            sessionDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        })
            .populate('sessionTask');
        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error('Error getting sessions by date:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getSessionsByRange = async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'Both startDate and endDate query parameters are required' });
    }

    try {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid startDate format. Use YYYY-MM-DD.' });
        }
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid endDate format. Use YYYY-MM-DD.' });
        }
        end.setUTCHours(23, 59, 59, 999);

        const sessions = await Session.find({
            sessionUser: userId,
            sessionDate: {
                $gte: start,
                $lte: end,
            },
        })
            .select('sessionDate sessionStatus')
            .sort({ sessionDate: 1 })
            .lean();

        res.status(200).json({ success: true, sessions });

    } catch (error) {
        console.error('Error getting sessions by range:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching sessions by range.' });
    }
};
