import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import { logger } from '../utils/logger';

/**
 * PaymentStatus component to check and display the status of a payment after returning from PhonePe
 */
const PaymentStatus = () => {
  const { orderId } = useParams();
  const [status, setStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check payment status
    const checkPaymentStatus = async () => {
      try {
        logger.debug('Starting payment status check for order ID:', orderId);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          logger.error('No auth token found in localStorage');
          setStatus('failed');
          setError('Authentication error. Please log in and check your order status.');
          toast.error('Authentication error. Please log in and check your order status.');
          return;
        }
        
        // Check the payment status
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.PAYMENTS}/status/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

            if (response.data.success) {
              setPaymentData(response.data.paymentStatus);
              
              logger.debug('Payment status response:', response.data.paymentStatus);
              
              // Set status based on payment state
              if (response.data.paymentStatus.status === 'COMPLETED') {
                setStatus('success');            // After successful payment, save the order in the database
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
            const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}');
            
            // Check if we have shipping information
            if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
              logger.error('No shipping information found in localStorage');
              setError('Missing shipping information. Please contact customer support.');
              setStatus('failed');
              return;
            }
            
            logger.debug('Shipping info from localStorage:', shippingInfo);
            
              try {
              // Ensure orderId is valid
              if (!orderId) {
                setError('Missing order reference ID. Please contact support.');
                return;
              }

              // Use the transaction ID from payment response if available, otherwise use orderId
              const transactionId = response.data.paymentStatus.transactionId || orderId;
              logger.debug('Saving order with transaction ID:', transactionId);

              // If cartItems is empty, avoid calling save-order (server requires items) and surface a helpful message
              if (!cartItems || cartItems.length === 0) {
                logger.warn('No cart items found in localStorage; skipping order save to avoid server 400');
                const displayError = 'Payment completed but no cart information was found to create the order. Please contact customer support with your order reference.';
                setError(displayError);
                toast.error(displayError);
                // Still treat payment as successful since PhonePe returned COMPLETED
                setStatus('success');
                // Persist pending order info so support can reconcile if needed
                localStorage.setItem('pendingOrderId', orderId);
                localStorage.setItem('pendingOrderAmount', response.data.paymentStatus.amount);
              } else {
                const saveOrderResponse = await axios.post(
                  `${API_BASE_URL}${API_ENDPOINTS.PAYMENTS}/save-order`,
                  {
                    merchantTransactionId: transactionId, // Use the transaction ID from payment response or fallback to orderId
                    cartItems,
                    totalAmount: response.data.paymentStatus.amount,
                    shippingInfo,
                    paymentMethod: 'phonepe' // Explicitly set payment method to phonepe
                  },
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );

                logger.debug('Order saved successfully:', saveOrderResponse.data);
                toast.success('Order placed successfully!');

                // Clear cart after successful order
                localStorage.removeItem('cart');
              }
            } catch (saveOrderError) {
              logger.error('Failed to save order:', saveOrderError);
              
              // Get more detailed error information
              const errorMessage = saveOrderError.response?.data?.message || 
                saveOrderError.message || 
                'An unknown error occurred';
              
              logger.error('Error details:', errorMessage);
              
              // Check for specific errors
              if (saveOrderError.response?.status === 401) {
                // If authentication error, prompt for login
                setError('Authentication failed. Please log in again to save your order.');
                toast.error('Authentication failed. Please log in again.');
                
                // Store order ID in localStorage to try saving again after login
                localStorage.setItem('pendingOrderId', orderId);
                localStorage.setItem('pendingOrderAmount', response.data.paymentStatus.amount);
              } else if (errorMessage.includes('Payment verification failed')) {
                // Handle payment verification errors
                logger.debug('Payment verification failed, but transaction might still be successful');
                
                // Retry with the transaction ID from the PhonePe response if available
                if (response.data.paymentStatus.transactionId) {
                  logger.debug('Retrying with PhonePe transaction ID:', response.data.paymentStatus.transactionId);
                  
                  try {
                    const retryResponse = await axios.post(
                      `${API_BASE_URL}${API_ENDPOINTS.PAYMENTS}/save-order`,
                      {
                        merchantTransactionId: response.data.paymentStatus.transactionId,
                        cartItems,
                        totalAmount: response.data.paymentStatus.amount,
                        shippingInfo,
                        paymentMethod: 'phonepe' // Explicitly set payment method to phonepe
                      },
                      {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      }
                    );
                    
                    logger.debug('Retry successful:', retryResponse.data);
                    toast.success('Order placed successfully!');
                    localStorage.removeItem('cart');
                  } catch (retryError) {
                    logger.error('Retry also failed:', retryError);
                    const displayError = `Your payment was successful, but we encountered an issue saving your order. Please contact customer support with your order reference: ${orderId}`;
                    setError(displayError);
                    toast.error(displayError);
                  }
                } else {
                  const displayError = `Your payment was successful, but we encountered an issue saving your order. Please contact customer support with your order reference: ${orderId}`;
                  setError(displayError);
                  toast.error(displayError);
                }
                
                // Still set status as success since payment went through
                setStatus('success');
              } else {
                // For other errors, just show a warning but continue with success flow
                const displayError = `Your payment was successful, but we encountered an issue saving your order: ${errorMessage}`;
                setError(displayError);
                toast.error(displayError);
                // Still set status as success since payment went through
                setStatus('success');
              }
            }
            
            // Clear cart after successful order
            localStorage.removeItem('cart');
          } else {
            setStatus('failed');
          }
        } else {
          setStatus('failed');
          setError('Failed to verify payment status');
        }
      } catch (error) {
        logger.error('Error checking payment status:', error);
        setStatus('failed');
        
        // Handle different error scenarios
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logger.error('Response error data:', error.response.data);
          logger.error('Response error status:', error.response.status);
          
          if (error.response.status === 401) {
            setError('Authentication error. Please log in again.');
          } else if (error.response.status === 500) {
            setError('Server error. Our team has been notified.');
          } else {
            setError(error.response.data?.message || 'Payment verification failed');
          }
        } else if (error.request) {
          // The request was made but no response was received
          logger.error('No response received:', error.request);
          setError('No response from server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          logger.error('Error message:', error.message);
          setError(error.message || 'An unexpected error occurred');
        }
      }
    };

    if (orderId) {
      checkPaymentStatus();
    } else {
      setStatus('failed');
      setError('Invalid order reference');
    }
  }, [orderId, navigate]);

  // Handler for Continue Shopping button
  const handleContinueShopping = () => {
    navigate('/');
  };

  // Handler for View Orders button
  const handleViewOrders = () => {
    navigate('/profile/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center text-center py-6">
            <Loader className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Verifying Payment</h2>
            <p className="text-gray-500 mt-2">Please wait while we verify your payment status...</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600 mt-2 mb-4">
              {error 
                ? "Your payment was processed successfully, but we encountered an issue saving your order. Our team has been notified."
                : "Your order has been successfully placed. You will receive a confirmation email shortly."}
            </p>
            <div className="bg-gray-50 p-4 rounded-md w-full mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 text-sm">Order ID:</span>
                <span className="font-medium text-sm">{orderId}</span>
              </div>
              {paymentData && (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Amount:</span>
                    <span className="font-medium text-sm">₹{paymentData.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Transaction ID:</span>
                    <span className="font-medium text-sm">{paymentData.transactionId}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleViewOrders}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                View My Orders
              </button>
              <button
                onClick={handleContinueShopping}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <div className="flex flex-col items-center text-center py-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Payment Failed</h2>
            <p className="text-gray-600 mt-2 mb-6">
              {error || "We couldn't process your payment. Please try again or use a different payment method."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={handleContinueShopping}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
