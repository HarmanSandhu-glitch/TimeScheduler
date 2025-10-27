import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import connectDB from './utils/db.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import sessionRouter from './routes/sessionRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';

// Initialize Express app
const app = express();
const PORT = config.PORT;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (only in development)
if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'TimeScheduler API Server',
        version: '1.0.0',
        status: 'running',
    });
});

// API Routes
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/sessions', sessionRouter);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${config.NODE_ENV}`);
    console.log(`🌐 CORS Origin: ${config.CORS_ORIGIN}`);
});

export default app;