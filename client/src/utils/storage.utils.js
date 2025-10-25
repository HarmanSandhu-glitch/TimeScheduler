/**
 * Storage Utility Functions
 * Wrapper around localStorage with error handling
 */
import { STORAGE_KEYS } from '../constants/app.constants';

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get user from localStorage
 */
export const getUser = () => getItem(STORAGE_KEYS.USER);

/**
 * Set user in localStorage
 */
export const setUser = (user) => setItem(STORAGE_KEYS.USER, user);

/**
 * Remove user from localStorage
 */
export const removeUser = () => removeItem(STORAGE_KEYS.USER);

/**
 * Get token from localStorage
 */
export const getToken = () => getItem(STORAGE_KEYS.TOKEN);

/**
 * Set token in localStorage
 */
export const setToken = (token) => setItem(STORAGE_KEYS.TOKEN, token);

/**
 * Remove token from localStorage
 */
export const removeToken = () => removeItem(STORAGE_KEYS.TOKEN);

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  getUser,
  setUser,
  removeUser,
  getToken,
  setToken,
  removeToken,
};
