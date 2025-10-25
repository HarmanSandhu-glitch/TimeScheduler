import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskControllers.js';

const router = express.Router();

router.use(protect);

router.get('/:userId', getTasks);
router.post('/', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
