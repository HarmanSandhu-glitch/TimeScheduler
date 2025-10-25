/**
 * Session Utility Functions
 */
import { TASK_PRIORITY, PRIORITY_COLORS } from '../constants/app.constants';

/**
 * Get priority color classes for a task
 * @param {Object} task - Task object with priority
 * @returns {Object} Color classes for the priority
 */
export const getPriorityColors = (task) => {
  if (!task || !task.taskPriority) {
    return PRIORITY_COLORS.None;
  }
  
  return PRIORITY_COLORS[task.taskPriority] || PRIORITY_COLORS.Medium;
};

/**
 * Group sessions by hour
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Sessions grouped by hour
 */
export const groupSessionsByHour = (sessions) => {
  if (!Array.isArray(sessions)) return {};
  
  return sessions.reduce((acc, session) => {
    const hour = session.sessionStartTime?.substring(0, 2);
    if (!hour) return acc;
    
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(session);
    return acc;
  }, {});
};

/**
 * Get unique time slot minutes from sessions
 * @param {Array} sessions - Array of session objects
 * @returns {Array} Sorted array of unique minutes
 */
export const getUniqueTimeSlots = (sessions) => {
  if (!Array.isArray(sessions)) return [];
  
  const minutesSet = new Set();
  sessions.forEach(session => {
    const minutes = session.sessionStartTime?.substring(3, 5);
    if (minutes) {
      minutesSet.add(minutes);
    }
  });
  
  return Array.from(minutesSet).sort();
};

/**
 * Create a map of sessions by start time
 * @param {Array} sessions - Array of session objects
 * @returns {Map} Map with time as key and session as value
 */
export const createSessionsMap = (sessions) => {
  if (!Array.isArray(sessions)) return new Map();
  
  const map = new Map();
  sessions.forEach(session => {
    if (session.sessionStartTime) {
      map.set(session.sessionStartTime, session);
    }
  });
  
  return map;
};

/**
 * Calculate session statistics
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Statistics about sessions
 */
export const calculateSessionStats = (sessions) => {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {
      total: 0,
      completed: 0,
      pending: 0,
      assigned: 0,
      unassigned: 0,
      completionRate: 0,
      assignmentRate: 0,
    };
  }
  
  const stats = sessions.reduce((acc, session) => {
    acc.total++;
    
    if (session.sessionStatus === 'Completed') {
      acc.completed++;
    } else {
      acc.pending++;
    }
    
    if (session.sessionTask) {
      acc.assigned++;
    } else {
      acc.unassigned++;
    }
    
    return acc;
  }, {
    total: 0,
    completed: 0,
    pending: 0,
    assigned: 0,
    unassigned: 0,
  });
  
  stats.completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;
    
  stats.assignmentRate = stats.total > 0 
    ? Math.round((stats.assigned / stats.total) * 100) 
    : 0;
  
  return stats;
};

export default {
  getPriorityColors,
  groupSessionsByHour,
  getUniqueTimeSlots,
  createSessionsMap,
  calculateSessionStats,
};
