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
  ChevronRight,
  DollarSign,
  AlertTriangle
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
      country: 'United States',
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
  }, [orderPlaced]);
  const subtotal = getCartTotal();
  const shipping = subtotal > 3500 ? 0 : 299;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  const calculateTax = () => {
    return subtotal * 0.18;
  };

  const calculateShipping = () => {
    return subtotal > 3500 ? 0 : 299;
  };

  const calculateTotal = () => {
    return subtotal + calculateShipping() + calculateTax();
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
  };

  const handleShippingSubmit = (data) => {
    console.log('Shipping data:', data);
    handleNextStep();
  };

  const handlePaymentSuccess = async (paymentData) => {
    setPaymentIntent(paymentData);
    setLoading(true);
    
    try {
      const shippingData = shippingForm.getValues();
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
          phone: shippingData.phone,
        },
        paymentInfo: {
          id: paymentData.id,
          status: paymentData.status,
          method: paymentMethod
        },
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
            total: calculateTotal()
          } 
        });
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setPaymentError(error.message || 'Failed to create order. Please contact support.');
      toast.error('Order processing failed. Your payment may have been processed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    setPaymentError(error.message || 'Payment processing failed');
    setLoading(false);
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
            </label>
            <select              {...shippingForm.register('state', { required: 'State is required' })}
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select state</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              {/* Add more states */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input              {...shippingForm.register('postalCode', { required: 'ZIP code is required' })}
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              placeholder="Enter ZIP code"
            />
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
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <span className="w-8 h-5 bg-blue-600 rounded"></span>
              <span className="w-8 h-5 bg-yellow-500 rounded"></span>
              <span className="w-8 h-5 bg-red-500 rounded"></span>
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
          disabled={loading}
          className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 flex items-center gap-2 shadow-md"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Continue
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
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.brand}</p>              <div className="flex items-center justify-between mt-1">
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
        </div>
          <div className="flex justify-between text-sm">
          <span className="text-gray-600">GST (18%)</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-dashed border-gray-200 my-4 pt-4"></div>
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
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
