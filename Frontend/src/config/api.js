// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  
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
  
  // Order endpoints
  ORDERS: '/api/orders',
  ORDER_DETAILS: (id) => `/api/orders/${id}`,
  MY_ORDERS: '/api/orders/me',
  
  // Payment endpoints
  PAYMENTS: '/api/payments',
  PROCESS_PAYMENT: '/api/payments/process',
};

export default API_BASE_URL;
