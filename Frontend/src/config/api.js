// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure axios defaults
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

// Set default base URL
axios.defaults.baseURL = API_BASE_URL;

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Import the auth utility functions
import { getAuthToken } from '../utils/auth';

// Add a request interceptor with improved token management
axios.interceptors.request.use(
  (config) => {
    try {
      // First get the current token (this will also ensure it's synchronized)
      const token = getAuthToken();
      
      if (token) {
        // Set authorization header with token
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Always ensure withCredentials is set for all requests
      config.withCredentials = true;
      
    } catch (error) {
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/checkout')) {
      window.location.href = '/login';
    } else if (error.response?.status === 403 && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  FORGOT_PASSWORD: '/api/auth/password/forgot',
  RESET_PASSWORD: '/api/auth/password/reset',
  GOOGLE_AUTH: '/api/auth/google/login',
  GOOGLE_VERIFY: '/api/auth/google/verify-token',
  
  // User endpoints
  USERS: '/api/users',
  UPDATE_PROFILE: '/api/users/profile',
  UPDATE_PASSWORD: '/api/users/password',
  UPDATE_AVATAR: '/api/users/profile/avatar',
  
  // Admin User endpoints
  ADMIN_USERS: '/api/users/admin/users',
  ADMIN_USER_DETAILS: (id) => `/api/users/admin/user/${id}`,
  ADMIN_CREATE_USER: '/api/auth/register',
  ADMIN_UPDATE_USER: (id) => `/api/users/admin/user/${id}`,
  ADMIN_DELETE_USER: (id) => `/api/users/admin/user/${id}`,

  // Product endpoints
  PRODUCTS: '/api/products',
  PRODUCT_DETAILS: (id) => `/api/products/${id}`,
  UPLOAD_PRODUCT_IMAGES: '/api/upload/products/upload',
  
  // Order endpoints
  ORDERS: '/api/orders',
  ORDER_DETAILS: (id) => `/api/orders/${id}`,
  MY_ORDERS: '/api/orders/me',
  
  // Dashboard endpoints
  DASHBOARD_STATS: '/api/dashboard/stats',
    
  // Payment endpoints
  PAYMENTS: '/api/payment',
  PROCESS_PAYMENT: '/api/payment/create',
  
  // GST endpoints
  GST_SETTINGS: '/api/gst/test/settings', // Temporarily use the test endpoint
  GST_ANALYTICS: '/api/gst/test/analytics', // Temporarily use the test endpoint
  
  // Coupon endpoints
  COUPONS: '/api/coupons/test/coupons', // Temporarily use the test endpoint
  COUPON_DETAILS: (id) => `/api/coupons/admin/coupons/${id}`,
  APPLY_COUPON: '/api/coupons/apply',
  VALIDATE_COUPON: '/api/coupons/validate',
  VERIFY_COUPON: (code) => `/api/coupons/code/${code}`,
  RECORD_COUPON_USAGE: '/api/coupons/record-usage',
  
  // Travel Destinations endpoints
  DESTINATIONS: '/api/travel/destinations',
  POPULAR_DESTINATIONS: '/api/travel/destinations/popular',
  DESTINATIONS_BY_CATEGORY: (category) => `/api/travel/destinations/category/${category}`,
  DESTINATION_DETAILS: (id) => `/api/travel/destinations/${id}`,
  DESTINATION_REVIEWS: (id) => `/api/travel/destinations/${id}/reviews`,
  
  // Travel Destinations test endpoints
  TEST_DESTINATIONS: '/api/travel/test/destinations',
  TEST_POPULAR_DESTINATIONS: '/api/travel/test/destinations/popular'
};

export default API_BASE_URL;
