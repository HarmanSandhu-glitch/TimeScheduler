export const SESSION_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

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
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_OTP: 'Invalid or expired OTP',
  UNAUTHORIZED: 'Not authorized, no token',
  TOKEN_INVALID: 'Not authorized, token failed',

  TASK_NOT_FOUND: 'Task not found',
  TASK_CREATE_FAILED: 'Failed to create task',
  TASK_UPDATE_FAILED: 'Failed to update task',
  TASK_DELETE_FAILED: 'Failed to delete task',
  
  SESSION_NOT_FOUND: 'Session not found',
  SESSION_CREATE_FAILED: 'Failed to create session',
  SESSION_UPDATE_FAILED: 'Failed to update session',
  SESSIONS_ALREADY_EXIST: 'Sessions already exist for this date',
  
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  MISSING_FIELDS: 'Please provide all required fields',
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully. Please verify your email.',
  OTP_VERIFIED: 'OTP verified successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  SESSION_CREATED: 'Session created successfully',
  SESSIONS_CREATED: 'Daily sessions created successfully',
  SESSION_UPDATED: 'Session updated successfully',
};
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
};

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
