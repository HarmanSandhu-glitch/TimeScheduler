/**
 * Base API Service
 * Centralized axios configuration and error handling
 */
import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';
import { getToken } from '../utils/storage.utils';

/**
 * Create axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      message,
      status: error.response?.status,
    });
    
    return Promise.reject(message);
  }
);

/**
 * Generic GET request
 */
export const get = async (url, config = {}) => {
  const response = await apiClient.get(url, config);
  return response.data;
};

/**
 * Generic POST request
 */
export const post = async (url, data = {}, config = {}) => {
  const response = await apiClient.post(url, data, config);
  return response.data;
};

/**
 * Generic PUT request
 */
export const put = async (url, data = {}, config = {}) => {
  const response = await apiClient.put(url, data, config);
  return response.data;
};

/**
 * Generic DELETE request
 */
export const del = async (url, config = {}) => {
  const response = await apiClient.delete(url, config);
  return response.data;
};

/**
 * Generic PATCH request
 */
export const patch = async (url, data = {}, config = {}) => {
  const response = await apiClient.patch(url, data, config);
  return response.data;
};

export default {
  get,
  post,
  put,
  delete: del,
  patch,
  apiClient,
};
