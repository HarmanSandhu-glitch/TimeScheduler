/**
 * Error Handler Middleware
 * Centralized error handling for Express
 */
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/app.constants.js';
import { sendError } from '../utils/response.utils.js';

/**
 * Not Found Handler
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  sendError(res, HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`);
};

/**
 * Global Error Handler
 * Handles all errors thrown in the application
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: req.user?.id,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.VALIDATION_ERROR, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, HTTP_STATUS.CONFLICT, `${field} already exists`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_INVALID);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token has expired');
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
  }

  // Default error
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  sendError(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};

export default {
  notFoundHandler,
  errorHandler,
};
