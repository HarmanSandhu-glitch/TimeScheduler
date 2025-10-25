/**
 * Session API Service
 * All session-related API calls
 */
import { get, post, put } from './api.service';
import API_ENDPOINTS from '../config/api.config';

/**
 * Create daily sessions
 * @param {Object} sessionData - Session data (sessionDate)
 * @returns {Promise} API response
 */
export const createDailySessions = async (sessionData) => {
  return await post(API_ENDPOINTS.SESSIONS.CREATE_DAILY, sessionData);
};

/**
 * Get sessions by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} API response
 */
export const getSessionsByDate = async (date) => {
  return await get(API_ENDPOINTS.SESSIONS.BY_DATE(date));
};

/**
 * Get sessions by date range
 * @param {Object} dateRange - { startDate, endDate }
 * @returns {Promise} API response
 */
export const getSessionsByRange = async (dateRange) => {
  return await post(API_ENDPOINTS.SESSIONS.BY_RANGE, dateRange);
};

/**
 * Update session status
 * @param {string} sessionId - Session ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateSessionStatus = async (sessionId, status) => {
  return await put(API_ENDPOINTS.SESSIONS.UPDATE_STATUS(sessionId), { status });
};

/**
 * Update session task
 * @param {string} sessionId - Session ID
 * @param {string} taskId - Task ID (null to unassign)
 * @returns {Promise} API response
 */
export const updateSessionTask = async (sessionId, taskId) => {
  return await put(API_ENDPOINTS.SESSIONS.UPDATE_TASK(sessionId), { taskId });
};

/**
 * Update session note
 * @param {string} sessionId - Session ID
 * @param {string} note - Special note
 * @returns {Promise} API response
 */
export const updateSessionNote = async (sessionId, note) => {
  return await put(API_ENDPOINTS.SESSIONS.UPDATE_NOTE(sessionId), { note });
};

export default {
  createDailySessions,
  getSessionsByDate,
  getSessionsByRange,
  updateSessionStatus,
  updateSessionTask,
  updateSessionNote,
};
