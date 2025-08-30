
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { toastConfig } from '../utils/toastConfig';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { getAuthToken, getAuthHeaders, syncToken } from '../utils/auth';
import CheckoutPayment from '../components/payment/CheckoutPayment';
import phonePeLogo from '../assets/payment/phonepe-logo.svg';
import phonePeIcon from '../assets/payment/phonepeicon.svg';
import { logger } from '../utils/logger';
import {
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Banknote,
  AlertTriangle
} from 'lucide-react';

const Checkout = () => {
  const { items: cartItems, getCartTotal, clearCart, getCartGstDetails } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const processingRef = useRef(false);
  const [gstDetails, setGstDetails] = useState({ totalGstAmount: 0, gstRates: [] });
  const [isLoadingGst, setIsLoadingGst] = useState(true);

  const shippingForm = useForm();

  useEffect(() => {
    const loadGstDetails = async () => {
      setIsLoadingGst(true);
      try {
        const details = await getCartGstDetails();
        setGstDetails(details || { totalGstAmount: 0, gstRates: [] });
      } catch (error) {
        logger.error('Failed to load GST details', error);
        setGstDetails({ totalGstAmount: 0, gstRates: [] });
      } finally {
        setIsLoadingGst(false);
      }
    };

    loadGstDetails();
  }, [cartItems, orderPlaced, getCartGstDetails, navigate]);
  
  // Effect to check authentication and store token for use in checkout
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Import auth utilities - using the imported functions from the top
        // First, check if the user is authenticated via AuthContext
        if (!isAuthenticated) {
          logger.warn('User is not authenticated according to AuthContext, redirecting to login');
          navigate('/login', { state: { from: '/checkout' } });
          return;
        }
        
        // Get token from all storage mechanisms with improved utility
        const token = getAuthToken();
        
        if (!token) {
          logger.error('No token found despite being "authenticated" in AuthContext');
          toast.error('Authentication required. Please log in again.');
          navigate('/login', { state: { from: '/checkout' } });
          return;
        }
        
        // Synchronize token across all storage mechanisms
        syncToken(token);
        
        // Store in component state for direct access to child components
        setAuthToken(token);
        
        // Mark authentication check as complete
        setAuthChecked(true);
        
        logger.debug('Authentication verified successfully for checkout');
      } catch (error) {
        logger.error('Error during authentication check:', error);
        toast.error('Authentication error. Please log in again.');
        navigate('/login', { state: { from: '/checkout' } });
      }
    };
    
    checkAuthentication();
  }, [isAuthenticated, navigate]);  // Calculate with proper parsing and formatting for all monetary values
  const subtotal = getCartTotal(); 
  const { coupon, discountAmount } = useCart();
  const shipping = subtotal > 3500 ? 0 : 299;
  
  const calculateTax = () => {
    return parseFloat(gstDetails.totalGstAmount || 0);
  };

  const calculateShipping = () => {
    return parseFloat(subtotal > 3500 ? 0 : 299);
  };
  
  const calculateDiscount = () => {
    return parseFloat(discountAmount || 0);
  };
  
  const calculateTotal = () => {
    const codCharge = paymentMethod === 'cod' ? 50 : 0;
    const gstAmount = isLoadingGst ? 0 : (gstDetails.totalGstAmount || 0);
    const total = subtotal - calculateDiscount() + calculateShipping() + gstAmount + codCharge;
    return parseFloat(total.toFixed(2));
  };

  // Business rule: COD not allowed for very large orders
  const COD_MAX_AMOUNT = 100000;
  const codAllowed = calculateTotal() <= COD_MAX_AMOUNT;


  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };  const handleShippingSubmit = (data) => {
    logger.debug('Shipping data:', data);
    handleNextStep();
  };  const handlePaymentError = (error) => {
    logger.error('Payment error:', error);
    setPaymentError(error.message || error?.response?.data?.message || 'Payment processing failed');
    setLoading(false);
    const errorMsg = error.message || error?.response?.data?.message;
    if (!errorMsg?.includes('failed')) {
      toast.error(`Payment failed: ${errorMsg || 'Please check your card details and try again'}`);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    // Prevent duplicate submissions
    if (processingRef.current) return;
    processingRef.current = true;

    setPaymentIntent(paymentData);
    setLoading(true);

    try {
      const shippingData = shippingForm.getValues();
      const res = await createOrder(shippingData, paymentData);
      // Only show success when createOrder confirms success
      if (res && res.success) {
        toast.success('Order confirmed! Preparing your items for shipping...');
      }
    } catch (error) {
      logger.error('Order creation failed:', error);
      handlePaymentError(error);
    } finally {
      setLoading(false);
      processingRef.current = false;
    }
  };

  const handleCODOrder = async () => {
    // Prevent duplicate submissions
    if (processingRef.current) return;
    processingRef.current = true;

    setLoading(true);
    setPaymentError(null);

    try {
      const shippingData = shippingForm.getValues();
      const codPaymentData = {
        id: 'COD_' + Date.now(),
        status: 'pending',
        method: 'cod'
      };
      const res = await createOrder(shippingData, codPaymentData);
      if (res && res.success) {
        toast.success('Your Cash on Delivery order has been placed successfully!');
      }
    } catch (error) {
      logger.error('COD order creation failed:', error);
      handlePaymentError(error);
    } finally {
      setLoading(false);
      processingRef.current = false;
    }
  };

  const createOrder = async (shippingData, paymentData) => {
  // Ensure values are properly formatted as numbers with two decimal places
    // Use parseFloat to convert string values and fix decimal places
    const total = parseFloat(calculateTotal().toFixed(2));
    const subtotalFormatted = parseFloat(getCartTotal().toFixed(2));
    const taxFormatted = parseFloat(calculateTax().toFixed(2));
    const shippingFormatted = parseFloat(calculateShipping().toFixed(2));
    const discountFormatted = parseFloat(calculateDiscount().toFixed(2));
  // Determine effective payment method (paymentData may come from a direct COD flow)
  const effectivePaymentMethod = (paymentData && (paymentData.method || paymentData.paymentMethod)) || paymentMethod;
    
    // Validate amounts to prevent unrealistic values for non-PhonePe methods
    // PhonePe supports higher amounts, so only block for other methods
  if (effectivePaymentMethod !== 'phonepe' && (total > 100000 || subtotalFormatted > 100000)) {
      // Throw and let callers handle the error to avoid duplicate success/error toasts
      throw new Error('Order total exceeds maximum allowed amount');
    }
    
    const orderData = {
      orderItems: (cartItems || []).map(item => {
        const itemGstRate = gstDetails.gstRates?.find(rate => rate.itemId === item.id)?.rate || 18;
        const basePrice = parseFloat((parseFloat(item.price) || 0).toFixed(2));
        const itemGstAmount = (basePrice * itemGstRate) / 100;
        
        return {
          product: item.id,
          name: item.name,
          quantity: parseInt(item.quantity) || 1,
          image: item.image,
          price: basePrice,
          gstRate: itemGstRate,
          gstAmount: itemGstAmount
        };
      }),
      shippingInfo: {
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        country: shippingData.country,
        postalCode: shippingData.postalCode,
        phoneNo: shippingData.phone // Make sure we use phoneNo as the backend expects
      },
      paymentInfo: {
        id: paymentData.id || 'GST-' + Date.now(), // Generate an ID if one isn't provided
        status: paymentData.status || 'pending'
      },
  paymentMethod: effectivePaymentMethod,
      itemsPrice: subtotalFormatted,
      taxPrice: taxFormatted,
      shippingPrice: shippingFormatted,
      discountPrice: discountFormatted,
      totalPrice: total,
      couponInfo: coupon ? {
        code: coupon.code,
        discountAmount: discountFormatted,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      } : null,
      gstSummary: {
        totalGstAmount: gstDetails.totalGstAmount,
        gstRates: gstDetails.gstRates || [],
        invoiceNumber: 'INV-' + Date.now() // Generate an invoice number
      }
    };

    // Get token with improved utility (checks all sources and synchronizes)
    const token = authToken || getAuthToken();
    
    if (!token) {
      logger.error('No authentication token found before order submission');
      toast.error('Authentication required. Please log in again to complete your purchase.');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Ensure token is properly synchronized across all storage mechanisms
    syncToken(token);
    
    // Log order preparation
    logger.debug('Preparing to submit order with authentication token');
    
    // Create axios instance specifically for this critical request
    const secureAxios = axios.create({
      baseURL: axios.defaults.baseURL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    // Log the data we're submitting (basic info only, for privacy)
    logger.debug('Submitting order with data:', {
      orderItems: orderData.orderItems.length,
      shippingInfo: 'present',
      paymentMethod: orderData.paymentMethod,
      totalAmount: orderData.totalPrice
    });
    
    // Submit order with our secure axios instance
    const response = await secureAxios.post('/api/orders', orderData);

    if (response.data && response.data.success) {
      // If coupon was applied, record its usage
      if (coupon && coupon.code) {
        try {
          await secureAxios.post(API_ENDPOINTS.RECORD_COUPON_USAGE, { 
            code: coupon.code 
          });
          logger.debug('Coupon usage recorded successfully');
        } catch (error) {
          logger.error('Failed to record coupon usage:', error);
          // Continue with order success flow even if coupon recording fails
        }
      }
      
      clearCart();
      setOrderPlaced(true);
      // navigate with the actual payment method used in the order
      navigate('/order-success', { 
        state: { 
          orderId: response.data.order._id,
          total: calculateTotal(),
          paymentMethod: orderData.paymentMethod,
          couponApplied: coupon ? coupon.code : null
        } 
      });
      // return the response so callers can decide on showing success
      return response.data;
    }
    // If not successful, throw so callers can handle the error path
    throw new Error(response.data?.message || 'Order creation failed');
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-4 md:space-x-8">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col md:flex-row md:items-center group">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                  step >= stepNumber 
                    ? 'bg-gray-900 border-gray-900 text-white' 
                    : 'border-gray-300 text-gray-400 group-hover:border-gray-400'
                }`}
              >                {step > stepNumber ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-base font-medium">{stepNumber}</span>
                )}
              </div>
              <span className={`md:ml-3 text-sm md:text-base font-medium mt-2 md:mt-0 text-center md:text-left ${
                step >= stepNumber ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
              }`}>
                {stepNumber === 1 && 'Shipping'}
                {stepNumber === 2 && 'Payment'}
                {stepNumber === 3 && 'Review'}
              </span>
            </div>
            {stepNumber < 3 && (
              <div className="hidden md:block">
                <div className={`w-16 h-0.5 transition-all duration-300 ${
                  step > stepNumber ? 'bg-gray-900' : 'bg-gray-300'
                }`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const ShippingStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
      
      <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input              {...shippingForm.register('firstName', { required: 'First name is required' })}
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              placeholder="Enter first name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input              {...shippingForm.register('lastName', { required: 'Last name is required' })}
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input            {...shippingForm.register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input            {...shippingForm.register('phone', { required: 'Phone number is required' })}
            type="tel"
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input            {...shippingForm.register('address', { required: 'Address is required' })}
            type="text"
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            placeholder="Enter street address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment, suite, etc. (optional)
          </label>
          <input            {...shippingForm.register('apartment')}
            type="text"
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input              {...shippingForm.register('city', { required: 'City is required' })}
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              placeholder="Enter city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>            <select              {...shippingForm.register('state', { required: 'State is required' })}
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select state</option>
              <option value="AN">Andaman and Nicobar Islands</option>
              <option value="AP">Andhra Pradesh</option>
              <option value="AR">Arunachal Pradesh</option>
              <option value="AS">Assam</option>
              <option value="BR">Bihar</option>
              <option value="CH">Chandigarh</option>
              <option value="CT">Chhattisgarh</option>
              <option value="DN">Dadra and Nagar Haveli</option>
              <option value="DD">Daman and Diu</option>
              <option value="DL">Delhi</option>
              <option value="GA">Goa</option>
              <option value="GJ">Gujarat</option>
              <option value="HR">Haryana</option>
              <option value="HP">Himachal Pradesh</option>
              <option value="JK">Jammu and Kashmir</option>
              <option value="JH">Jharkhand</option>
              <option value="KA">Karnataka</option>
              <option value="KL">Kerala</option>
              <option value="LA">Ladakh</option>
              <option value="LD">Lakshadweep</option>
              <option value="MP">Madhya Pradesh</option>
              <option value="MH">Maharashtra</option>
              <option value="MN">Manipur</option>
              <option value="ML">Meghalaya</option>
              <option value="MZ">Mizoram</option>
              <option value="NL">Nagaland</option>
              <option value="OR">Odisha</option>
              <option value="PY">Puducherry</option>
              <option value="PB">Punjab</option>
              <option value="RJ">Rajasthan</option>
              <option value="SK">Sikkim</option>
              <option value="TN">Tamil Nadu</option>
              <option value="TG">Telangana</option>
              <option value="TR">Tripura</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="UT">Uttarakhand</option>
              <option value="WB">West Bengal</option>
              {/* Add more states */}
            </select>
          </div>            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">              Postal Code *
            </label>
            <div className="relative">
              <input              {...shippingForm.register('postalCode', { 
                  required: 'Postal code is required',
                  pattern: {
                    value: /^[1-9][0-9]{5}$/,
                    message: 'Please enter a valid 6-digit postal code'
                  }
                })}
                type="text"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Enter Postal Code"              />
            </div>
          </div>
        </div>

        <div className="flex sm:flex-row items-center flex-col gap-5 justify-between pt-6">          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="bg-white text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </button>
          
          <button
            type="submit"
            className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 flex items-center gap-2 shadow-md"
          >
            Continue to Payment
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );  const PaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Payment Information</h2>
      
      {/* Payment Method Selection */}
      <div className="mb-4 md:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>        <div className="grid grid-cols-1 gap-3">
          <label className="relative flex items-center p-3 md:p-4 border border-gray-200 bg-white rounded-lg md:rounded-xl cursor-pointer hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
            <input
              type="radio"
              name="paymentMethod"
              value="phonepe"
              checked={paymentMethod === 'phonepe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className={`w-4 h-4 md:w-5 md:h-5 border-2 rounded-full mr-2 md:mr-3 flex items-center justify-center ${
              paymentMethod === 'phonepe' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
            }`}>
              {paymentMethod === 'phonepe' && (
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center">
              <img 
                src={phonePeLogo} 
                alt="PhonePe Logo" 
                className="w-40 h-8 -ml-7 md:w-40 md:h-7 md:-ml-8 mr-2 md:mr-3" 
              />
            </div>
            <div className="ml-auto text-xs md:text-sm text-purple-700 font-medium">
              Recommended
            </div>
          </label>
          
          <label className="relative flex items-center p-3 md:p-4 border border-gray-200 bg-white rounded-lg md:rounded-xl cursor-pointer hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!codAllowed}
              title={!codAllowed ? 'COD unavailable for orders above ₹100,000. Please choose PhonePe.' : 'Cash on Delivery'}
              className="sr-only"
            />
            <div className={`w-4 h-4 ml-1 md:w-5 md:h-5 border-2 rounded-full mr-2 md:mr-3 md:ml-1 flex items-center justify-center ${
              paymentMethod === 'cod' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
            }`}>
              {paymentMethod === 'cod' && (
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center">
              <Banknote className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-gray-700" />
              <span className="font-medium text-sm md:text-base">Cash on Delivery</span>
            </div>
            <div className="ml-auto">
              <span className="text-xs md:text-sm text-gray-500">₹50 charge</span>
            </div>
          </label>
          {!codAllowed && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
              Cash on Delivery is not available for orders above ₹{COD_MAX_AMOUNT.toLocaleString('en-IN')}. Please use PhonePe or another supported payment method.
            </div>
          )}
        </div>
      </div>{/* Payment Error Display */}
      {paymentError && (
        <div className="mb-4 md:mb-6 bg-red-50 border border-red-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
            </div>
            <div>
              <h4 className="font-medium text-red-700 text-sm md:text-base">Payment Failed</h4>
              <p className="text-xs md:text-sm text-red-600">{paymentError}</p>
            </div>
          </div>
        </div>
      )}{/* Checkout Payment Component */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm">
        <div className="mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Lock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Secure Payment</h4>
              <p className="text-xs text-gray-500">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
          {/* Conditional Payment Processing */}
        {paymentMethod === 'phonepe' ? (
          <div className="p-4 md:p-5 bg-purple-50 rounded-lg md:rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 flex items-center justify-center mr-2">
                <img src={phonePeIcon} alt="PhonePe Logo" className="h-5 -ml-2 w-5" />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-medium text-purple-800">PhonePe Secure Gateway</h4>
                <p className="text-xs text-purple-600">End-to-end encryption with RBI compliance</p>
              </div>
            </div>
            <div>
              <div className="flex items-center mt-2">
                <Lock className="w-3 h-3 mr-2 text-green-600" />
                <span className="text-xs">Military-grade AES-256 encryption</span>
              </div>
              <div className="flex items-center mt-1">
                <Shield className="w-3 h-3 mr-2 text-green-600" />
                <span className="text-xs">RBI & NPCI certified payment gateway</span>
              </div>
              <div className="flex items-center mt-1">
                <Check className="w-3 h-3 mr-2 text-green-600" />
                <span className="text-xs">Bank-level fraud protection system</span>
              </div>
            </div>
          </div>
        ) : paymentMethod === 'cod' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg md:rounded-xl p-3 md:p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Banknote className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 text-sm md:text-base">Cash on Delivery Selected</h4>
                <p className="text-xs text-green-600">Pay when your order is delivered</p>
              </div>
            </div>
            <div className="text-xs md:text-sm text-green-700 bg-green-100 p-2 md:p-3 rounded-lg">
              <strong>COD Terms:</strong>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li>• ₹50 additional charge for COD orders</li>
                <li>• Payment to be made in cash to delivery agent</li>
                <li>• Please keep exact change ready</li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex sm:flex-row items-center flex-col gap-3 justify-between pt-4 md:pt-6">
        <button
          type="button"
          onClick={handlePrevStep}
          className="bg-white text-gray-700 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-1.5 shadow-sm w-full sm:w-auto"
        >
          <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Back to Shipping
        </button>

        <button
          type="button"
          onClick={paymentMethod === 'cod' ? handleCODOrder : handleNextStep}
          disabled={loading || (paymentMethod === 'cod' && !codAllowed)}
          className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-1.5 shadow-md w-full sm:w-auto ${
            paymentMethod === 'cod'
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              : paymentMethod === 'phonepe'
              ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
              : 'bg-gray-500 text-white focus:ring-gray-500'
          } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : paymentMethod === 'cod' ? (
            <>
              <Banknote className="w-4 h-4 md:w-5 md:h-5" />
              Place COD Order
            </>
          ) : paymentMethod === 'phonepe' ? (
            <>
              <img
                src={phonePeIcon}
                alt="PhonePe"
                className="w-4 h-4 md:w-5 md:h-5 mr-1.5"
              />

              Continue with PhonePe
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 md:w-5 md:h-5" />
              Continue
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  // Review step component moved here to fix the initialization error
  const ReviewStep = () => {
    // Ensure token is refreshed before rendering
    useEffect(() => {
      const refreshToken = () => {
        const token = getAuthToken();
        if (token) {
          logger.debug('ReviewStep: Refreshing token storage');
          Cookies.set('token', token, { 
            expires: 7, 
            path: '/',
            secure: window.location.protocol === 'https:',
            sameSite: 'Lax' 
          });
          localStorage.setItem('authToken', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          logger.warn('ReviewStep: No token found for refresh');
        }
      };
      
      refreshToken();
    }, []);
    
    return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">Complete Your Order</h2>
      
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Order Details</h3>
        </div>
        
        <div className="space-y-3">
          {/* Shipping Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Shipping Address</h4>
              <button 
                onClick={() => setStep(1)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>{shippingForm.getValues('firstName')} {shippingForm.getValues('lastName')}</p>
              <p>{shippingForm.getValues('address')}</p>
              <p>{shippingForm.getValues('city')}, {shippingForm.getValues('state')} {shippingForm.getValues('postalCode')}</p>
              <p>Phone: {shippingForm.getValues('phone')}</p>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Payment Method</h4>
              <button 
                onClick={() => setStep(2)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Change
              </button>
            </div>
            <div className="flex items-center">
              {paymentMethod === 'phonepe' ? (
                <>
                  <img src={phonePeIcon} alt="PhonePe" className="h-5 w-5 mr-2" />
                  <span className="text-sm text-purple-800 font-bold">PhonePe</span>
                </>
              ) : (
                <>
                  <Banknote className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm text-gray-600">Cash on Delivery (+ ₹50 charge)</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Final Payment Processing */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {paymentMethod === 'phonepe' ? (
          <CheckoutPayment 
            paymentMethod={paymentMethod}
            paymentError={paymentError}
            calculateTotal={calculateTotal}
            handlePaymentSuccess={handlePaymentSuccess}
            handlePaymentError={handlePaymentError}
            authToken={authToken} // Pass authToken directly from state
            shippingData={{
              email: shippingForm.getValues('email'),
              firstName: shippingForm.getValues('firstName'),
              lastName: shippingForm.getValues('lastName'),
              address: shippingForm.getValues('address'),
              city: shippingForm.getValues('city'),
              state: shippingForm.getValues('state'),
              country: shippingForm.getValues('country'),
              postalCode: shippingForm.getValues('postalCode'),
              phone: shippingForm.getValues('phone')
            }}
          />
        ) : (
          <div className="p-6 bg-white">
            <div className="bg-green-50 border border-green-100 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 font-medium">Your order is ready for placement</span>
              </div>
              <p className="text-sm text-green-600 mt-1">You will pay ₹{calculateTotal().toFixed(2)} upon delivery</p>
            </div>
            
            <button
              onClick={handleCODOrder}
              disabled={loading || !codAllowed}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <Banknote className="w-4 h-4 mr-2" />
                  Place COD Order - ₹{calculateTotal().toFixed(2)}
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="bg-white text-gray-700 px-6 py-3 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Payment
        </button>
      </div>
    </motion.div>
  );
  };
  
  const OrderSummary = ({ 
    gstDetails, 
    isLoadingGst, 
    calculateTotal,
    subtotal,
    discountAmount,
    shipping,
    coupon,
    paymentMethod 
  }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
          Secure
        </span>
      </div>
      
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
        {(cartItems || []).map((item) => (
          <div key={item.id} className="flex gap-3 group p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl bg-gray-50 shadow-sm group-hover:shadow-md transition-all duration-300"
              />
              <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                {item.quantity}
              </div>
            </div>            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.brand}</p>
              {item.category && (
                <p className="text-xs text-gray-500">
                  {item.category}
                  {item.subcategory && ` › ${item.subcategory}`}
                  {item.productType && ` › ${item.productType}`}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                {item.selectedSize && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.selectedSize}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>      <div className="border-t border-gray-200 pt-4 space-y-3">
        {isLoadingGst && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 mb-4">
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-2"></div>
              <p className="text-sm text-yellow-700">Calculating GST...</p>
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        
        {coupon && discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center">
              <span>Coupon ({coupon.code})</span>
            </span>
            <span className="font-medium text-green-600">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${shipping.toFixed(2)}`
            )}
          </span>
        </div>        {/* GST Details */}
        <div className="space-y-2">
          {isLoadingGst ? (
            <div className="w-full h-6 bg-gray-100 rounded animate-pulse"></div>
          ) : (
            <>
              {cartItems.map(item => {
                const itemGstRate = gstDetails.gstRates?.find(rate => rate.itemId === item.id)?.rate || 0;
                const basePrice = item.price * item.quantity;
                const discountedPrice = discountAmount ? 
                  basePrice * (1 - (discountAmount / subtotal)) : 
                  basePrice;
                const itemGstAmount = (discountedPrice * itemGstRate) / 100;
                
                return itemGstAmount > 0 ? (
                  <div key={item.id} className="flex justify-between text-xs text-gray-500">
                    <span>GST ({itemGstRate}%) - {item.name}</span>
                    <span>₹{itemGstAmount.toFixed(2)}</span>
                  </div>
                ) : null;
              })}
              <div className="flex justify-between text-sm font-medium border-t border-gray-100 pt-2 mt-2">
                <span className="text-gray-600">Total GST</span>
                <span>₹{gstDetails.totalGstAmount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
        
        {paymentMethod === 'cod' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">COD Charges</span>
            <span className="font-medium">₹50.00</span>
          </div>
        )}
        
        <div className="border-t border-dashed border-gray-200 my-4 pt-4"></div>
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Enhanced Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Our Sastakart Promise</h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <span className="text-sm font-medium text-green-800">Secure Shopping Guarantee</span>
              <p className="text-xs text-green-700 mt-0.5">Advanced encryption protects your personal data</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-medium text-blue-800">Hassle-free Returns</span>
              <p className="text-xs text-blue-700 mt-0.5">No questions asked returns within 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <span className="text-sm font-medium text-purple-800">Premium Customer Support</span>
              <p className="text-xs text-purple-700 mt-0.5">Available 24/7 for any questions or concerns</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-500">By completing your purchase, you agree to our <span className="text-indigo-600 font-medium">Terms of Service</span> and acknowledge our <span className="text-indigo-600 font-medium">Privacy Policy</span></p>
        </div>
      </div>
    </div>
  );

  // Render loading state until auth is checked
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Preparing Your Checkout...</h2>
          <p className="text-gray-500">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }
  
  return (
    <>      
      <Helmet>
        <title>Checkout - Sastakart</title>
        <meta name="description" content="Complete your purchase securely with our checkout process." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Page Heading */}
          <div className="text-center mb-8">
            <div className="inline-block mb-2 px-3 py-1 bg-black bg-opacity-5 rounded-full text-xs font-medium text-gray-900">SECURE CHECKOUT</div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
          </div>
          
          <StepIndicator />
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <AnimatePresence mode="wait">
                  {step === 1 && <ShippingStep key="shipping" />}
                  {step === 2 && <PaymentStep key="payment" />}
                  {step === 3 && <ReviewStep key="review" />}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <OrderSummary 
                gstDetails={gstDetails}
                isLoadingGst={isLoadingGst}
                calculateTotal={calculateTotal}
                subtotal={subtotal}
                discountAmount={discountAmount}
                shipping={shipping}
                coupon={coupon}
                paymentMethod={paymentMethod}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default Checkout;
