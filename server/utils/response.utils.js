/**
 * Response Utility Functions
 * Standardized API response formats
 */
import { HTTP_STATUS } from '../constants/app.constants.js';

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 */
export const sendSuccess = (res, statusCode = HTTP_STATUS.OK, message = 'Success', data = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Additional error details
 */
export const sendError = (res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Error occurred', errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 */
export const sendValidationError = (res, errors) => {
  sendError(res, HTTP_STATUS.BAD_REQUEST, 'Validation error', errors);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
export const sendNotFound = (res, message = 'Resource not found') => {
  sendError(res, HTTP_STATUS.NOT_FOUND, message);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
  sendError(res, HTTP_STATUS.UNAUTHORIZED, message);
};

export default {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
};
