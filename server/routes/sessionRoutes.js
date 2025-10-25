import express from 'express';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware to protect routes
import {
    createCurrentDateSessions,
    updateSessionStatus,
    updateSessionTask,
    updateSpecialNote,
    getSessionsByDate,
    getSessionsByRange, // Import the new controller function
} from '../controllers/sessionControllers.js'; // Import controllers

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Existing routes
router.post('/create-daily', createCurrentDateSessions);
router.put('/:sessionId/status', updateSessionStatus);
router.put('/:sessionId/task', updateSessionTask);
router.put('/:sessionId/note', updateSpecialNote);
router.get('/date/:date', getSessionsByDate);

// --- ADD THIS LINE ---
// Defines the GET route for fetching sessions within a date range
router.get('/range', getSessionsByRange);
// --- END ADD ---

export default router;