import axios from 'axios';
import { getAuthHeaders } from './auth';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default configurations
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Import necessary functions for token management
import { getAuthToken } from './auth';

// Add a request interceptor with improved token handling
apiClient.interceptors.request.use(
  config => {
    try {
      // Get the current token and ensure it's synchronized across storage
      const token = getAuthToken();
      
      if (token) {
        // Add Authorization header
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
        
        // For debugging only
        if (!config.url.includes('/api/auth/me')) { // Avoid logging auth check requests
          console.log(`API Request with auth token to: ${config.url}`);
        }
      } else if (!config.url.includes('/api/auth')) {
        // If not an auth endpoint and we have no token, log a warning
        console.warn(`API Request without auth token to: ${config.url}`);
      }
    } catch (error) {
      console.error('Auth header setup error:', error);
    }
    
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle specific status codes
    if (error.response) {
      const { status, data } = error.response;
      
      // Log the error for debugging
      console.error(`API Error ${status}:`, data);
      
      switch (status) {
        case 401:
          // Unauthorized - user isn't logged in or token expired
          toast.error('Please log in to continue');
          // Could redirect to login page here
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          toast.error('You don\'t have permission to perform this action');
          break;
          
        case 404:
          // Not Found - resource doesn't exist
          console.error(`Resource not found at: ${error.config.url}`);
          // Don't show toast for 404s to avoid spamming the user
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          if (data && data.message) {
            toast.error(data.message);
          } else {
            toast.error('Something went wrong. Please try again.');
          }
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error - no response received:', error.request);
      toast.error('Network error. Please check your connection.');
    } else {
      // Error setting up request
      console.error('Error:', error.message);
      toast.error('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
