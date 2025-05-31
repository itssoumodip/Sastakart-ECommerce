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
 * Create a payment intent with Stripe
 * @param {number} amount - The payment amount
 * @param {string} currency - The currency code (default: USD)
 * @param {object} metadata - Additional metadata for the payment
 * @returns {Promise<{clientSecret: string, paymentIntentId: string}>} - Client secret and payment intent ID
 */
export const createPaymentIntent = async (amount, currency = 'USD', metadata = {}) => {
  try {
    const response = await api.post(API_ENDPOINTS.PROCESS_PAYMENT, {
      amount,
      currency,
      metadata
    });
    return response.data;
  } catch (error) {
    console.error("Payment intent creation error:", error);
    throw error;
  }
};

/**
 * Confirm a payment intent after successful card processing
 * @param {string} paymentIntentId - The Stripe payment intent ID
 * @param {string} paymentMethod - The payment method ID
 * @returns {Promise<object>} - The confirmed payment intent
 */
export const confirmPayment = async (paymentIntentId, paymentMethod) => {
  try {
    const response = await api.post(`${API_ENDPOINTS.PAYMENTS}/confirm`, {
      paymentIntentId,
      paymentMethod
    });
    return response.data;
  } catch (error) {
    console.error("Payment confirmation error:", error);
    throw error;
  }
};

/**
 * Get the status of a payment
 * @param {string} paymentId - The payment ID
 * @returns {Promise<{status: string}>} - The payment status
 */
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.PAYMENTS}/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Payment status fetch error:", error);
    throw error;
  }
};

export default {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus
};
