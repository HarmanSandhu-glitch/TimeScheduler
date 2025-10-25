/**
 * Application Constants
 * Centralized constants used throughout the application
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

// Time Slots (15-minute intervals)
export const TIME_SLOTS = {
  INTERVAL_MINUTES: 15,
  START_HOUR: 0,
  END_HOUR: 24,
};

// Chart Colors (Material You)
export const CHART_COLORS = {
  PRIMARY: '#6750A4',
  SECONDARY: '#625B71',
  TERTIARY: '#7D5260',
  ERROR: '#B3261E',
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  INFO: '#2196F3',
};

// Priority Colors for UI
export const PRIORITY_COLORS = {
  High: {
    bg: 'bg-error-container dark:bg-dark-error-container',
    text: 'text-on-error-container dark:text-dark-on-error-container',
    border: 'border-error/50 dark:border-dark-error/50',
    indicator: 'bg-error dark:bg-dark-error',
  },
  Medium: {
    bg: 'bg-secondary-container dark:bg-dark-secondary-container',
    text: 'text-on-secondary-container dark:text-dark-on-secondary-container',
    border: 'border-secondary/50 dark:border-dark-secondary/50',
    indicator: 'bg-secondary dark:bg-dark-secondary',
  },
  Low: {
    bg: 'bg-tertiary-container dark:bg-dark-tertiary-container',
    text: 'text-on-tertiary-container dark:text-dark-on-tertiary-container',
    border: 'border-tertiary/50 dark:border-dark-tertiary/50',
    indicator: 'bg-tertiary dark:bg-dark-tertiary',
  },
  None: {
    bg: 'bg-surface dark:bg-dark-surface',
    text: 'text-on-surface-variant dark:text-dark-on-surface-variant',
    border: 'border-outline/20 dark:border-dark-outline/20',
    indicator: 'bg-outline dark:bg-dark-outline',
  },
};

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  AUTH_TEST: '/authtest',
  TASK_TEST: '/tasktest',
  SESSION_TEST: '/sessiontest',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
};

// Date Formats
export const DATE_FORMATS = {
  API: 'yyyy-MM-dd',
  DISPLAY: 'MMM dd, yyyy',
  TIME: 'HH:mm',
  FULL: 'yyyy-MM-dd HH:mm:ss',
};

export default {
  SESSION_STATUS,
  TASK_PRIORITY,
  TASK_STATUS,
  TIME_SLOTS,
  CHART_COLORS,
  PRIORITY_COLORS,
  ROUTES,
  STORAGE_KEYS,
  DATE_FORMATS,
};
