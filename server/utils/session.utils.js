/**
 * Session Utility Functions
 */
import { config } from '../config/config.js';

/**
 * Generate time slots for a day
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @param {number} interval - Interval in minutes
 * @returns {Array} Array of time slots
 */
export const generateTimeSlots = (
  startTime = config.SESSION_START_TIME,
  endTime = config.SESSION_END_TIME,
  interval = config.SESSION_INTERVAL
) => {
  const timeSlots = [];
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  for (let minutes = startTotalMinutes; minutes <= endTotalMinutes; minutes += interval) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    
    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    timeSlots.push(timeString);
  }
  
  return timeSlots;
};

/**
 * Calculate session size (duration) in minutes
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @returns {number} Duration in minutes
 */
export const calculateSessionSize = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  return endTotalMinutes - startTotalMinutes;
};

/**
 * Calculate end time based on start time and duration
 * @param {string} startTime - Start time (HH:MM)
 * @param {number} duration - Duration in minutes
 * @returns {string} End time (HH:MM)
 */
export const calculateEndTime = (startTime, duration) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = startTotalMinutes + duration;
  
  const hour = Math.floor(endTotalMinutes / 60) % 24;
  const minute = endTotalMinutes % 60;
  
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

/**
 * Validate time format (HH:MM)
 * @param {string} time - Time string
 * @returns {boolean} Is valid
 */
export const isValidTimeFormat = (time) => {
  if (!time || typeof time !== 'string') return false;
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} date - Date string
 * @returns {boolean} Is valid
 */
export const isValidDateFormat = (date) => {
  if (!date || typeof date !== 'string') return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export default {
  generateTimeSlots,
  calculateSessionSize,
  calculateEndTime,
  isValidTimeFormat,
  isValidDateFormat,
};
