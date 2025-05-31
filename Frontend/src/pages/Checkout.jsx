import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);

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
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderPlaced]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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

  const handlePaymentSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step >= stepNumber 
                  ? 'bg-gray-900 border-gray-900 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {step > stepNumber ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step >= stepNumber ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {stepNumber === 1 && 'Shipping'}
                {stepNumber === 2 && 'Payment'}
                {stepNumber === 3 && 'Review'}
              </span>
            </div>
            {stepNumber < 3 && (
              <div className={`w-12 h-0.5 ${
                step > stepNumber ? 'bg-gray-900' : 'bg-gray-300'
              }`} />
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
            <input
              {...shippingForm.register('firstName', { required: 'First name is required' })}
              type="text"
              className="input w-full"
              placeholder="Enter first name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              {...shippingForm.register('lastName', { required: 'Last name is required' })}
              type="text"
              className="input w-full"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...shippingForm.register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="input w-full"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            {...shippingForm.register('phone', { required: 'Phone number is required' })}
            type="tel"
            className="input w-full"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            {...shippingForm.register('address', { required: 'Address is required' })}
            type="text"
            className="input w-full"
            placeholder="Enter street address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment, suite, etc. (optional)
          </label>
          <input
            {...shippingForm.register('apartment')}
            type="text"
            className="input w-full"
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              {...shippingForm.register('city', { required: 'City is required' })}
              type="text"
              className="input w-full"
              placeholder="Enter city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              {...shippingForm.register('state', { required: 'State is required' })}
              className="input w-full"
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
            <input
              {...shippingForm.register('postalCode', { required: 'ZIP code is required' })}
              type="text"
              className="input w-full"
              placeholder="Enter ZIP code"
            />
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="btn-outline flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </button>
          
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
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
      
      <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Payment Method
          </label>
          <div className="grid grid-cols-1 gap-3">
            <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded-full mr-3 ${
                paymentMethod === 'card' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
              }`}>
                {paymentMethod === 'card' && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                )}
              </div>
              <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
              <span className="font-medium">Credit Card</span>
            </label>
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <input
              {...paymentForm.register('cardNumber', { required: 'Card number is required' })}
              type="text"
              className="input w-full"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                {...paymentForm.register('expiryDate', { required: 'Expiry date is required' })}
                type="text"
                className="input w-full"
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV *
              </label>
              <input
                {...paymentForm.register('cvv', { required: 'CVV is required' })}
                type="text"
                className="input w-full"
                placeholder="123"
                maxLength="4"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name on Card *
            </label>
            <input
              {...paymentForm.register('nameOnCard', { required: 'Name on card is required' })}
              type="text"
              className="input w-full"
              placeholder="Enter name as it appears on card"
            />
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={handlePrevStep}
            className="btn-outline flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Shipping
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Place Order
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const OrderSummary = () => (
    <div className="card p-6 h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg bg-gray-100"
              />
              <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.brand}</p>
              <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Free returns within 30 days</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Secure payment processing</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Checkout - Your Store</title>
        <meta name="description" content="Complete your purchase securely with our checkout process." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <StepIndicator />
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card p-8">
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
