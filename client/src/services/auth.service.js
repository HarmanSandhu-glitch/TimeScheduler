/**
 * Auth API Service
 * All authentication-related API calls
 */
import { post } from './api.service';
import API_ENDPOINTS from '../config/api.config';

/**
 * Sign up a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Promise} API response
 */
export const signupUser = async (userData) => {
  return await post(API_ENDPOINTS.AUTH.SIGNUP, userData);
};

/**
 * Verify OTP
 * @param {Object} otpData - OTP data (email, otp)
 * @returns {Promise} API response
 */
export const verifyOTP = async (otpData) => {
  return await post(API_ENDPOINTS.AUTH.VERIFY_OTP, otpData);
};

/**
 * Sign in user
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Promise} API response
 */
export const signinUser = async (credentials) => {
  return await post(API_ENDPOINTS.AUTH.SIGNIN, credentials);
};

/**
 * Logout user
 * @returns {Promise} API response
 */
export const logoutUser = async () => {
  return await post(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} API response
 */
export const updateProfile = async (profileData) => {
  return await post(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
};

export default {
  signupUser,
  verifyOTP,
  signinUser,
  logoutUser,
  updateProfile,
};
