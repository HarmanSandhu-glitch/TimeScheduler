/**
 * API Configuration
 * Centralized API endpoint configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: '/api/users/signup',
    VERIFY_OTP: '/api/users/verify-otp',
    SIGNIN: '/api/users/signin',
    LOGOUT: '/api/users/logout',
    UPDATE_PROFILE: '/api/users/update-profile',
  },
  
  // Task endpoints
  TASKS: {
    BASE: '/api/tasks',
    BY_USER: (userId) => `/api/tasks/${userId}`,
    BY_ID: (taskId) => `/api/tasks/${taskId}`,
  },
  
  // Session endpoints
  SESSIONS: {
    BASE: '/api/sessions',
    CREATE_DAILY: '/api/sessions/create-daily',
    BY_DATE: (date) => `/api/sessions/date/${date}`,
    BY_RANGE: '/api/sessions/range',
    BY_ID: (sessionId) => `/api/sessions/${sessionId}`,
    UPDATE_STATUS: (sessionId) => `/api/sessions/${sessionId}/status`,
    UPDATE_TASK: (sessionId) => `/api/sessions/${sessionId}/task`,
    UPDATE_NOTE: (sessionId) => `/api/sessions/${sessionId}/note`,
  },
};

export default API_ENDPOINTS;
