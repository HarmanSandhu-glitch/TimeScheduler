/**
 * Task Utility Functions
 */
import { TASK_STATUS, TASK_PRIORITY } from '../constants/app.constants';

/**
 * Calculate task statistics by status
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Task counts by status
 */
export const calculateTaskStats = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return {
      total: 0,
      pending: 0,
      'in-progress': 0,
      completed: 0,
    };
  }
  
  return tasks.reduce((acc, task) => {
    acc.total++;
    const status = task.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
  });
};

/**
 * Calculate task statistics by priority
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Task counts by priority
 */
export const calculatePriorityStats = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return {
      [TASK_PRIORITY.LOW]: 0,
      [TASK_PRIORITY.MEDIUM]: 0,
      [TASK_PRIORITY.HIGH]: 0,
    };
  }
  
  return tasks.reduce((acc, task) => {
    const priority = task.taskPriority || TASK_PRIORITY.MEDIUM;
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {
    [TASK_PRIORITY.LOW]: 0,
    [TASK_PRIORITY.MEDIUM]: 0,
    [TASK_PRIORITY.HIGH]: 0,
  });
};

/**
 * Sort tasks by priority (High -> Medium -> Low)
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Sorted tasks
 */
export const sortTasksByPriority = (tasks) => {
  if (!Array.isArray(tasks)) return [];
  
  const priorityOrder = {
    [TASK_PRIORITY.HIGH]: 1,
    [TASK_PRIORITY.MEDIUM]: 2,
    [TASK_PRIORITY.LOW]: 3,
  };
  
  return [...tasks].sort((a, b) => {
    const aPriority = priorityOrder[a.taskPriority] || 2;
    const bPriority = priorityOrder[b.taskPriority] || 2;
    return aPriority - bPriority;
  });
};

/**
 * Filter tasks by status
 * @param {Array} tasks - Array of task objects
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered tasks
 */
export const filterTasksByStatus = (tasks, status) => {
  if (!Array.isArray(tasks)) return [];
  if (!status) return tasks;
  
  return tasks.filter(task => task.status === status);
};

/**
 * Find task by ID
 * @param {Array} tasks - Array of task objects
 * @param {string} taskId - Task ID to find
 * @returns {Object|null} Task object or null
 */
export const findTaskById = (tasks, taskId) => {
  if (!Array.isArray(tasks) || !taskId) return null;
  
  return tasks.find(task => task._id === taskId) || null;
};

/**
 * Validate task data
 * @param {Object} task - Task object to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTask = (task) => {
  const errors = [];
  
  if (!task.taskName || task.taskName.trim().length === 0) {
    errors.push('Task name is required');
  }
  
  if (task.taskName && task.taskName.length > 100) {
    errors.push('Task name must be less than 100 characters');
  }
  
  if (task.taskPriority && !Object.values(TASK_PRIORITY).includes(task.taskPriority)) {
    errors.push('Invalid task priority');
  }
  
  if (task.status && !Object.values(TASK_STATUS).includes(task.status)) {
    errors.push('Invalid task status');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  calculateTaskStats,
  calculatePriorityStats,
  sortTasksByPriority,
  filterTasksByStatus,
  findTaskById,
  validateTask,
};
