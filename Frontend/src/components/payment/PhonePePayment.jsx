import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import phonePeLogo from '../../assets/payment/phonepe-logo.svg';
import phonePeIcon from '../../assets/payment/phonepeicon.svg';
import { getAuthToken, syncToken } from '../../utils/auth';
import Cookies from 'js-cookie';

/**
 * PhonePePayment component for initiating payments through PhonePe
 * @param {Object} props Component props
 * @param {number} props.amount - Payment amount in rupees
 * @param {Function} props.onPaymentInitiated - Callback when payment is initiated
 * @param {Function} props.onPaymentError - Callback when payment encounters an error
 * @param {Object} props.metadata - Additional metadata for the payment
 * @param {Object} props.shippingData - Shipping information
 */
const PhonePePayment = ({ 
  amount, 
  onPaymentInitiated, 
  onPaymentError, 
  metadata = {},
  shippingData,
  authToken // Add authToken parameter
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const navigate = useNavigate();

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // First priority: use the authToken passed directly from parent components
      // This is the most reliable as it's passed directly from a component that has verified authentication
      let token = authToken;
      
      // If that's not available, try to get it from other sources as fallback
      if (!token) {
        // This will check all sources and synchronize tokens if found
        token = getAuthToken();
      }
      
      // Debug token presence
      if (!token) {
        throw new Error('Authentication required. Please log in again to complete your purchase.');
      }
      
      // Always ensure token is properly synchronized across all storage mechanisms
      syncToken(token);
      
      // Create an axios instance specifically for this request with proper auth
      const axiosWithAuth = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      // Prepare complete payment data including shipping information
      const paymentData = {
        totalAmount: amount,
        metadata,
        paymentInfo: {
          id: 'phonepe_' + Date.now(),
          status: 'pending'
        },
        shippingInfo: {
          firstName: shippingData?.firstName || '',
          lastName: shippingData?.lastName || '',
          email: shippingData?.email || '',
          address: shippingData?.address || '',
          city: shippingData?.city || '',
          state: shippingData?.state || '',
          country: shippingData?.country || 'India',
          postalCode: shippingData?.postalCode || '',
          phoneNo: shippingData?.phone || '',
        }
      };
      
      // Log complete shipping information for debugging

      
      // Store shipping info in localStorage for use during order completion
      try {
        // Ensure consistent field names with the backend Order model
        const formattedShippingInfo = {
          address: paymentData.shippingInfo.address,
          city: paymentData.shippingInfo.city,
          state: paymentData.shippingInfo.state,
          country: paymentData.shippingInfo.country || 'India',
          postalCode: paymentData.shippingInfo.postalCode,
          phoneNo: paymentData.shippingInfo.phoneNo || paymentData.shippingInfo.phone,
          // Store additional fields that might be needed
          firstName: paymentData.shippingInfo.firstName,
          lastName: paymentData.shippingInfo.lastName,
          email: paymentData.shippingInfo.email
        };
        localStorage.setItem('shippingInfo', JSON.stringify(formattedShippingInfo));
      } catch (storageError) {
      }
      
      // Make API request with our dedicated axios instance that has proper auth
      const response = await axiosWithAuth.post(
        API_ENDPOINTS.PROCESS_PAYMENT,
        paymentData
      );

      if (response.data.success && response.data.url) {
        // Store order ID in session storage for later verification
        sessionStorage.setItem('currentOrderId', response.data.orderId);
        
        // Notify parent component
        if (onPaymentInitiated) {
          onPaymentInitiated(response.data.orderId);
        }
        
        // Redirect to PhonePe payment page
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data.message || 'Failed to initiate payment');
      }
    } catch (error) {

      const errorMessage = error.response?.data?.message || error.message || 'Payment initiation failed';
      setPaymentError(errorMessage);
      
      if (onPaymentError) {
        onPaymentError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Error Display */}
      {paymentError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-xs md:text-sm">{paymentError}</p>
        </div>
      )}

      {/* PhonePe Payment Button */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <div className="flex items-center mb-4">
          <img src={phonePeIcon} alt="PhonePe Logo" className="h-8 w-6 mr-2" />
          <h3 className="text-sm font-medium text-purple-800">Pay securely with PhonePe</h3>
        </div>
        
        <div className="mb-4 bg-purple-50 p-3 rounded-md">
          <p className="text-xs text-purple-700">
            You'll be redirected to PhonePe to complete your payment securely. 
            You can use UPI, wallet, debit/credit cards or net banking.
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-600">Amount to pay:</span>
            <span className="text-gray-900">₹{amount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</span>
          </div>
          
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              <>
                {/* <img src={phonePeLogo} alt="PhonePe" className="h-5 w-auto mr-2" /> */}
                Proceed to Pay
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhonePePayment;
