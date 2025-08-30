import React, { useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { toastConfig } from '../../utils/toastConfig';
import { isValidCouponFormat } from '../../utils/couponUtils';
import { logger } from '../../utils/logger';
import { Tag, X } from 'lucide-react';

const CouponForm = ({ cartTotal, onCouponApplied, cartItems }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, token, isAuthenticated } = useAuth();
  
  // Handle keyboard shortcut
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to focus coupon input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('coupon-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }
    
    // Validate coupon format
    if (!isValidCouponFormat(couponCode.trim())) {
      setError('Invalid coupon code format. Codes must be 4-16 alphanumeric characters.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Apply the coupon
      const response = await axios.post(
        API_ENDPOINTS.APPLY_COUPON,
        {
          code: couponCode,
          cartTotal,
          cartItems
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to apply coupon');
      }

      const { coupon } = response.data;
      
      const { 
        discountAmount, 
        finalTotal, 
        originalTotal,
        discountedSubtotal,
        gstAmount,
        effectiveDiscountPercentage,
        couponDetails 
      } = response.data;
      
      // Format discount text showing both percentage and amount
      const discountText = `₹${discountAmount.toFixed(2)} (${effectiveDiscountPercentage}% off)`;
      
      toast.success(
        `Coupon applied! Total discount: ${discountText}`,
        toastConfig.success
      );
      
      onCouponApplied({
        code: response.data.couponCode,
        discountAmount,
        discountType: couponDetails.discountType,
        discountValue: couponDetails.discountValue,
        effectiveDiscountPercentage,
        originalTotal,
        discountedSubtotal,
        gstAmount,
        finalTotal
      });
      
      setCouponCode('');
      setError('');
    } catch (error) {
      logger.error('Coupon error:', error);
      setError(
        error.response?.data?.message || error.message || 
        'Failed to apply coupon. Please check the code and try again.'
      );
      onCouponApplied(null); // Reset any previously applied coupon
    } finally {
      setLoading(false);
    }
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    setError('');
    onCouponApplied(null);
  };

  // Handle keyboard shortcut
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to focus coupon input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('coupon-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const loginRedirect = () => {
    // Store current URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/login';
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Apply Coupon</h3>
        </div>
      </div>
      
      <form onSubmit={handleCouponSubmit} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              id="coupon-input"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 
                ${error 
                  ? 'border-red-300 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200'}`}
              disabled={loading}
            />
            {couponCode && (
              <button
                type="button"
                onClick={() => setCouponCode('')}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={loginRedirect}
              className="btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium whitespace-nowrap"
            >
              Login to Apply
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium whitespace-nowrap
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800'
                }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </div>
              ) : (
                'Apply'
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 mt-2 text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg">
            <div className="mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm flex-1">{error}</p>
          </div>
        )}

        {!error && !isAuthenticated && (
          <div className="flex items-start gap-2 mt-2 text-blue-600 bg-blue-50 border border-blue-100 p-2 rounded-lg">
            <div className="mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm flex-1">Please log in to apply coupons and get exclusive discounts.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CouponForm;
