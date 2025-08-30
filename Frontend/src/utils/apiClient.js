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
        
      }
    } catch (error) {
      // Silently fail and continue with default headers
    }
    
    return config;
  },
  error => {
    // Request setup error
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
      
      // Handle error based on status code
      
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
          // Skip toast for 404 errors
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
      // Handle network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Handle request setup error
      toast.error('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
