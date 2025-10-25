/**
 * Task API Service
 * All task-related API calls
 */
import { get, post, put, del } from './api.service';
import API_ENDPOINTS from '../config/api.config';

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise} API response
 */
export const createTask = async (taskData) => {
  return await post(API_ENDPOINTS.TASKS.BASE, taskData);
};

/**
 * Get all tasks for a user
 * @param {string} userId - User ID
 * @returns {Promise} API response
 */
export const getUserTasks = async (userId) => {
  return await get(API_ENDPOINTS.TASKS.BY_USER(userId));
};

/**
 * Update a task
 * @param {string} taskId - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise} API response
 */
export const updateTask = async (taskId, taskData) => {
  return await put(API_ENDPOINTS.TASKS.BY_ID(taskId), taskData);
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise} API response
 */
export const deleteTask = async (taskId) => {
  return await del(API_ENDPOINTS.TASKS.BY_ID(taskId));
};

export default {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
};
