import Cookies from 'js-cookie';
import axios from 'axios';

// Global token memory cache to improve token access reliability
let memoryToken = null;

/**
 * Synchronizes token across all storage mechanisms and memory
 * @param {string} token - The token to synchronize
 */
export const syncToken = (token) => {
  if (!token) return null;
  
  console.log('Syncing token across all storage mechanisms');
  
  // Store in memory cache
  memoryToken = token;
  
  // Store in cookie
  Cookies.set('token', token, { 
    expires: 7,
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax'
  });
  
  // Store in localStorage (both formats for compatibility)
  localStorage.setItem('authToken', token);
  localStorage.setItem('token', token);
  
  // Set in axios headers (global)
  if (typeof axios !== 'undefined') {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  return token;
};

/**
 * Gets the authentication token from any available source
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  // First check memory cache (most reliable and fast)
  if (memoryToken) {
    return memoryToken;
  }
  
  // Try all possible storage locations
  const cookieToken = Cookies.get('token');
  const localToken = localStorage.getItem('authToken');
  const oldLocalToken = localStorage.getItem('token');
  
  // Debug token sources
  console.log('Token sources:', {
    memory: !!memoryToken,
    cookie: !!cookieToken,
    localStorage: !!localToken,
    oldLocalStorage: !!oldLocalToken
  });
  
  // Use the first available token
  const foundToken = cookieToken || localToken || oldLocalToken;
  
  // If found anywhere, sync it across all storage mechanisms
  if (foundToken) {
    return syncToken(foundToken);
  }
  
  return null;
};

/**
 * Checks if the user is authenticated by verifying token existence
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Clears the authentication token from all storage mechanisms
 */
export const clearAuthToken = () => {
  memoryToken = null;
  Cookies.remove('token', { path: '/' });
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  
  // Clear axios header if available
  if (typeof axios !== 'undefined') {
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Gets the authentication headers for API requests
 * @returns {Object} The headers object with Authorization if available
 */
export const getAuthHeaders = () => {
  // Get token using our utility with synchronization
  const token = getAuthToken();
  
  // More detailed debug information
  console.log('Auth State:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenStart: token ? `${token.substring(0, 10)}...` : null,
    currentPage: window.location.pathname,
    isAdminPage: window.location.pathname.startsWith('/admin')
  });
  
  if (token) {
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('Auth Headers Set:', Object.keys(headers));
    return headers;
  } else {
    console.error('No authentication token found in any storage location');
    return {
      'Content-Type': 'application/json'
    };
  }
};
