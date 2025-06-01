// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure axios defaults
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

// Set default base URL and remove any trailing slashes
axios.defaults.baseURL = API_BASE_URL.replace(/\/+$/, '');
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
    return config;
  },
  (error) => {
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
  PAYMENTS: '/api/payments',
  PROCESS_PAYMENT: '/api/payments/process',
};

export default API_BASE_URL;
