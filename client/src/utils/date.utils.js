/**
 * Date Utility Functions
 */
import { format, parse, isValid } from 'date-fns';
import { DATE_FORMATS } from '../constants/app.constants';

/**
 * Get today's date in API format (yyyy-MM-dd)
 */
export const getTodayDate = () => {
  return format(new Date(), DATE_FORMATS.API);
};

/**
 * Format date for display
 * @param {Date|string} date - Date object or string
 * @param {string} formatStr - Format string (defaults to display format)
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(dateObj)) {
    console.error('Invalid date:', date);
    return '';
  }
  
  return format(dateObj, formatStr);
};

/**
 * Format time (HH:mm)
 * @param {string} timeString - Time string in format "HH:MM"
 */
export const formatTime = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return '';
  
  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return timeString;
  
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

/**
 * Get date range (start and end dates)
 * @param {number} days - Number of days back from today
 */
export const getDateRange = (days = 7) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    startDate: format(startDate, DATE_FORMATS.API),
    endDate: format(endDate, DATE_FORMATS.API),
  };
};

/**
 * Parse API date string to Date object
 * @param {string} dateString - Date string from API
 */
export const parseApiDate = (dateString) => {
  if (!dateString) return null;
  
  const parsed = parse(dateString, DATE_FORMATS.API, new Date());
  return isValid(parsed) ? parsed : null;
};

/**
 * Check if date is today
 * @param {Date|string} date 
 */
export const isToday = (date) => {
  const today = getTodayDate();
  const checkDate = typeof date === 'string' ? date : format(date, DATE_FORMATS.API);
  return today === checkDate;
};

export default {
  getTodayDate,
  formatDate,
  formatTime,
  getDateRange,
  parseApiDate,
  isToday,
};
