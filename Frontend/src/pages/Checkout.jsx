import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CheckoutPayment from '../components/payment/CheckoutPayment';
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  Lock,
  ChevronLeft,
  Check,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Package,
  Clock,
  Heart,
  ChevronRight,  DollarSign,
  AlertTriangle,
  Banknote
} from 'lucide-react';

const Checkout = () => {
  const { items: cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);

  const shippingForm = useForm({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      country: 'India',
      state: '',
      postalCode: '',
      phone: ''
    }
  });

  const paymentForm = useForm({
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      billingAddress: 'same'
    }
  });
  useEffect(() => {
    if ((!cartItems || cartItems.length === 0) && !orderPlaced) {
      navigate('/cart');
      toast.error('Your cart is empty');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPlaced]);  const subtotal = getCartTotal();
  const { totalGstAmount, categoryWiseGst } = useCart().getCartGstDetails();
  const shipping = subtotal > 3500 ? 0 : 299;
  const calculateTax = () => {
    return totalGstAmount;
  };

  const calculateShipping = () => {
    return subtotal > 3500 ? 0 : 299;
  };  
  
  const calculateTotal = () => {
    const codCharge = paymentMethod === 'cod' ? 50 : 0;
    return subtotal + calculateShipping() + calculateTax() + codCharge;
  };


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
    console.log('Shipping data:', data);
    handleNextStep();
  };  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPaymentError(error.message || error?.response?.data?.message || 'Payment processing failed');
    setLoading(false);
    const errorMsg = error.message || error?.response?.data?.message;
    if (!errorMsg?.includes('failed')) {
      toast.error(`Payment failed: ${errorMsg || 'Please check your card details and try again'}`);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setPaymentIntent(paymentData);
    setLoading(true);
    
    try {
      const shippingData = shippingForm.getValues();
      await createOrder(shippingData, paymentData);
      toast.success('Order confirmed! Preparing your items for shipping...');
    } catch (error) {
      console.error('Order creation failed:', error);
      handlePaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    setPaymentError(null);
    
    try {
      const shippingData = shippingForm.getValues();
      const codPaymentData = {
        id: 'COD_' + Date.now(),
        status: 'pending',
        method: 'cod'
      };
      await createOrder(shippingData, codPaymentData);
      toast.success('Your Cash on Delivery order has been placed successfully!');
    } catch (error) {
      console.error('COD order creation failed:', error);
      handlePaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (shippingData, paymentData) => {
    const orderData = {
      orderItems: (cartItems || []).map(item => ({
        product: item.id,
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price
      })),
      shippingInfo: {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        country: shippingData.country,
        postalCode: shippingData.postalCode,
        phoneNo: shippingData.phone, // Changed from phone to phoneNo to match backend schema
      },
      paymentInfo: {
        ...paymentData
      },
      paymentMethod: paymentMethod,
      itemsPrice: getCartTotal(),
      taxPrice: calculateTax(),
      shippingPrice: calculateShipping(),
      totalPrice: calculateTotal()
    };

    const response = await axios.post('/api/orders', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      clearCart();
      setOrderPlaced(true);
      navigate('/order-success', { 
        state: { 
          orderId: response.data.order._id,
          total: calculateTotal(),
          paymentMethod: paymentMethod
        } 
      });
    }
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

        <div className="flex justify-between pt-6">          <button
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
  );
  const PaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Information</h2>
      
      {/* Payment Method Selection */}      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Payment Method
        </label>
        <div className="grid grid-cols-1 gap-4">
          <label className="relative flex items-center p-4 border border-gray-200 bg-white rounded-xl cursor-pointer hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
              paymentMethod === 'card' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
            }`}>
              {paymentMethod === 'card' && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-3 text-gray-700" />
              <span className="font-medium">Credit Card</span>
            </div>            <div className="ml-auto flex items-center space-x-2">
              <span className="w-8 h-5 bg-blue-600 rounded"></span>
              <span className="w-8 h-5 bg-yellow-500 rounded"></span>
              <span className="w-8 h-5 bg-red-500 rounded"></span>
            </div>
          </label>
          
          <label className="relative flex items-center p-4 border border-gray-200 bg-white rounded-xl cursor-pointer hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
              paymentMethod === 'cod' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
            }`}>
              {paymentMethod === 'cod' && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center">
              <Banknote className="w-5 h-5 mr-3 text-gray-700" />
              <span className="font-medium">Cash on Delivery (COD)</span>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-gray-500">₹50 extra charge</span>
            </div>
          </label>
        </div>
      </div>      {/* Payment Error Display */}
      {paymentError && (
        <div className="mb-8 bg-red-50 border border-red-100 p-5 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h4 className="font-medium text-red-700 mb-1">Payment Failed</h4>
              <p className="text-sm text-red-600">{paymentError}</p>
            </div>
          </div>
        </div>
      )}      {/* Checkout Payment Component */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Secure Payment</h4>
              <p className="text-sm text-gray-500">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
          {/* Conditional Payment Processing */}
        {paymentMethod === 'card' ? (
          <CheckoutPayment 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentError={paymentError}
            calculateTotal={calculateTotal}
            handlePaymentSuccess={handlePaymentSuccess}
            handlePaymentError={handlePaymentError}
            shippingData={{
              email: shippingForm.getValues('email'),
              firstName: shippingForm.getValues('firstName'),
              lastName: shippingForm.getValues('lastName')
            }}
          />
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Cash on Delivery Selected</h4>
                <p className="text-sm text-green-600">Pay when your order is delivered to your doorstep</p>
              </div>
            </div>
            <div className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
              <strong>COD Terms:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• ₹50 additional charge for COD orders</li>
                <li>• Payment to be made in cash to delivery agent</li>
                <li>• Please keep exact change ready</li>
                <li>• Order will be packed and shipped after confirmation</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-6">        <button
          type="button"
          onClick={handlePrevStep}
          className="bg-white text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shipping
        </button>
          <button
          type="button"
          onClick={paymentMethod === 'cod' ? handleCODOrder : undefined}
          disabled={loading || (paymentMethod === 'card')}
          className={`px-8 py-3 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 shadow-md ${
            paymentMethod === 'cod' 
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' 
              : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'
          } ${(paymentMethod === 'card') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : paymentMethod === 'cod' ? (
            <>
              <Banknote className="w-5 h-5" />
              Place COD Order
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              {paymentMethod === 'card' ? 'Complete Payment Above' : 'Continue'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  const OrderSummary = () => (
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
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${shipping.toFixed(2)}`
            )}
          </span>
        </div>        <div className="flex justify-between text-sm">
          <span className="text-gray-600">GST</span>
          <span className="font-medium">₹{totalGstAmount.toFixed(2)}</span>
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

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-green-800">256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-blue-800">Free returns within 30 days</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-purple-800">Secure payment processing</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>      
      <Helmet>
        <title>Checkout - ClassyShop</title>
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
                </AnimatePresence>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
