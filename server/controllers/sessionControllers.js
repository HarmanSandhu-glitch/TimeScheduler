import Session from '../models/sessionModel.js';
import User from '../models/userModel.js';
import Task from '../models/taskModel.js'; // Keep Task import if needed elsewhere

// --- Helper Functions (keep these) ---
const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
// --- End Helper Functions ---

// --- Existing Controller Functions (keep these) ---
export const createCurrentDateSessions = async (req, res) => {
    // ... existing code ...
    const userId = req.user.id;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    try {
        const existingSession = await Session.findOne({
            sessionUser: userId,
            sessionDate: today,
        });

        if (existingSession) {
            // Check if sessions for today already exist using findOne
            return res.status(200).json({ success: true, message: 'Sessions for today already created.' });
        }

        const user = await User.findById(userId); // Fetch user details

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { userDayStartTime, userDayEndTime, userSessionSize } = user; // Get scheduling settings from user model

        const startMinutes = timeToMinutes(userDayStartTime);
        const endMinutes = timeToMinutes(userDayEndTime);
        const sessionDuration = userSessionSize; // in minutes

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

        // Loop to generate session time slots
        for (let i = 0; i < numberOfSessions; i++) {
            const sessionStartTime = minutesToTime(currentSessionStart);
            const sessionEndTime = minutesToTime(currentSessionStart + sessionDuration);

            sessionsToCreate.push({
                sessionDate: today,
                sessionStartTime,
                sessionEndTime,
                sessionTask: null, // Default task to null
                sessionStatus: 'Pending', // Default status
                sessionSpecialNote: '', // Default note
                sessionUser: userId, // Link session to user
            });
            currentSessionStart += sessionDuration;
        }

        const createdSessions = await Session.insertMany(sessionsToCreate); // Bulk insert sessions

        res.status(201).json({ success: true, message: 'Sessions created successfully', sessions: createdSessions });

    } catch (error) {
        console.error('Error creating sessions:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSessionStatus = async (req, res) => {
    // ... existing code ...
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
            { new: true } // Return the updated document
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
    // ... existing code ...
    const { sessionId } = req.params;
    const { taskId } = req.body;
    try {
        if (taskId) {
            // Check if the provided taskId corresponds to an existing task
            const taskExists = await Task.findById(taskId);
            if (!taskExists) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }
        }
        // Update the sessionTask field
        const session = await Session.findByIdAndUpdate(
            sessionId,
            // Allow setting taskId to null to unassign
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
    // ... existing code ...
    const { sessionId } = req.params;
    const { note } = req.body; // Expecting { "note": "new note content" }

    try {
        const session = await Session.findByIdAndUpdate(
            sessionId,
            // Update the sessionSpecialNote field, allow setting empty string
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
    // ... existing code ...
    const userId = req.user.id; // User ID from protect middleware
    const { date } = req.params;
    try {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Find sessions for the specific user and date range
        const sessions = await Session.find({
            sessionUser: userId,
            sessionDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        })
            .populate('sessionTask'); // Populate task details

        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error('Error getting sessions by date:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- NEW IMPLEMENTATION for getSessionsByRange ---
export const getSessionsByRange = async (req, res) => {
    const userId = req.user.id; // From protect middleware
    const { startDate, endDate } = req.query; // Expecting YYYY-MM-DD format

    // Validate input
    if (!startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'Both startDate and endDate query parameters are required' });
    }

    try {
        // Parse dates and set time boundaries
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid startDate format. Use YYYY-MM-DD.' });
        }
        start.setUTCHours(0, 0, 0, 0); // Start of the start day in UTC

        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid endDate format. Use YYYY-MM-DD.' });
        }
        end.setUTCHours(23, 59, 59, 999); // End of the end day in UTC

        // Query the database
        const sessions = await Session.find({
            sessionUser: userId, // Filter by the logged-in user
            sessionDate: { // Filter by date range
                $gte: start,
                $lte: end,
            },
        })
            .select('sessionDate sessionStatus') // Select only needed fields for the charts
            .sort({ sessionDate: 1 }) // Optional: sort by date
            .lean(); // Use lean() for better performance as we only read data

        res.status(200).json({ success: true, sessions });

    } catch (error) {
        console.error('Error getting sessions by range:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching sessions by range.' });
    }
};
// --- END IMPLEMENTATION ---