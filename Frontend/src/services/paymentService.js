import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

// Configure axios with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Create a payment order with PhonePe
 * @param {number} totalAmount - The payment amount in rupees
 * @param {object} metadata - Additional metadata for the payment
 * @returns {Promise<{url: string, orderId: string}>} - PhonePe redirect URL and order ID
 */
export const createPaymentOrder = async (totalAmount, metadata = {}) => {
  try {
    const response = await api.post(API_ENDPOINTS.PROCESS_PAYMENT, {
      totalAmount,
      metadata
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get the status of a payment
 * @param {string} merchantTransactionId - The merchant transaction ID (order ID)
 * @returns {Promise<{paymentStatus: {id: string, status: string, amount: number, transactionId: string}}>} 
 */
export const checkPaymentStatus = async (merchantTransactionId) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.PAYMENTS}/status/${merchantTransactionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Save order details after successful payment
 * @param {string} merchantTransactionId - The merchant transaction ID
 * @param {Array} cartItems - Cart items
 * @param {number} totalAmount - Total amount
 * @param {Object} shippingInfo - Shipping information
 * @returns {Promise<{order: Object}>} - The saved order
 */
export const saveOrder = async (merchantTransactionId, cartItems, totalAmount, shippingInfo) => {
  try {
    const response = await api.post(`${API_ENDPOINTS.PAYMENTS}/save-order`, {
      merchantTransactionId,
      cartItems,
      totalAmount,
      shippingInfo
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get available payment methods
 * @returns {Promise<{paymentMethods: Array}>} - Available payment methods
 */
export const getPaymentMethods = async () => {
  try {
    const response = await api.get(`${API_ENDPOINTS.PAYMENTS}/methods`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  createPaymentOrder,
  checkPaymentStatus,
  saveOrder,
  getPaymentMethods
};
