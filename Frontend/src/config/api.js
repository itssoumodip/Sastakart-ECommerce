// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Configure axios defaults
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

// Set default base URL
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add a request interceptor to add auth headers
axios.interceptors.request.use(
  (config) => {
    // Add auth headers to every request
    const headers = getAuthHeaders();
    config.headers = {
      ...config.headers,
      ...headers
    };
    
    // Ensure withCredentials is set for all requests
    config.withCredentials = true;
    
    // Log request for debugging (remove in production)
    console.log(`Request to ${config.url}:`, { 
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    
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
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/';
      }
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
};

export default API_BASE_URL;
