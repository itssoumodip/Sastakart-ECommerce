import Cookies from 'js-cookie';

/**
 * Get the authentication token from cookies
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  return Cookies.get('token') || null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with Authorization if token exists
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 
    'Authorization': `Bearer ${token}`
  } : {};
};
