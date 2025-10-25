/**
 * Application Constants
 */

// Session Status
export const SESSION_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

// Task Status
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_OTP: 'Invalid or expired OTP',
  UNAUTHORIZED: 'Not authorized, no token',
  TOKEN_INVALID: 'Not authorized, token failed',
  
  // Task
  TASK_NOT_FOUND: 'Task not found',
  TASK_CREATE_FAILED: 'Failed to create task',
  TASK_UPDATE_FAILED: 'Failed to update task',
  TASK_DELETE_FAILED: 'Failed to delete task',
  
  // Session
  SESSION_NOT_FOUND: 'Session not found',
  SESSION_CREATE_FAILED: 'Failed to create session',
  SESSION_UPDATE_FAILED: 'Failed to update session',
  SESSIONS_ALREADY_EXIST: 'Sessions already exist for this date',
  
  // General
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  MISSING_FIELDS: 'Please provide all required fields',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  // Auth
  USER_CREATED: 'User created successfully. Please verify your email.',
  OTP_VERIFIED: 'OTP verified successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  
  // Task
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  
  // Session
  SESSION_CREATED: 'Session created successfully',
  SESSIONS_CREATED: 'Daily sessions created successfully',
  SESSION_UPDATED: 'Session updated successfully',
};

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};

export default {
  SESSION_STATUS,
  TASK_PRIORITY,
  TASK_STATUS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  OTP_CONFIG,
  PAGINATION,
};
