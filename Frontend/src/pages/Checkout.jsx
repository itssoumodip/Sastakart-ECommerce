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

// Import RetroPatterns for styling consistency
import RetroPatterns from '../components/layout/RetroPatterns';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

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
      phone: user?.phone || ''
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
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleShippingSubmit = (data) => {
    setStep(2);
  };

  const handlePaymentSubmit = (data) => {
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        items: cart,
        shipping: shippingForm.getValues(),
        payment: paymentForm.getValues(),
        total: getCartTotal() + (getCartTotal() >= 50 ? 0 : 5.99) + (getCartTotal() * 0.08)
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        clearCart();
        navigate('/order-success', { state: { orderId: order.orderId } });
        toast.success('Order placed successfully!');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { number: 1, title: 'SHIPPING', icon: MapPin },
    { number: 2, title: 'PAYMENT', icon: CreditCard },
    { number: 3, title: 'REVIEW', icon: Check }
  ];

  return (
    <>
      <Helmet>
        <title>CHECKOUT - RETRO-SHOP</title>
        <meta name="description" content="Complete your purchase securely with our checkout process." />
      </Helmet>
      
      <RetroPatterns />
      <div className="min-h-screen bg-black pattern-grid-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/cart')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors group font-mono uppercase"
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">BACK TO CART</span>
            </motion.button>
            
            <div className="flex items-center justify-between border-b-2 border-white border-dashed pb-4">
              <div>
                <h1 className="text-4xl font-bold text-white font-mono uppercase tracking-wider">
                  [ SECURE CHECKOUT ]
                </h1>
                <p className="text-gray-400 mt-2 font-mono">COMPLETE YOUR PURCHASE WITH CONFIDENCE</p>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-400 font-mono uppercase">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-white" />
                  <span>SSL SECURED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-white" />
                  <span>256-BIT ENCRYPTION</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black border-4 border-white p-8 vintage-border pattern-dots">
              <div className="flex items-center justify-center space-x-8">
                {steps.map((stepItem, index) => {
                  const Icon = stepItem.icon;
                  const isActive = step === stepItem.number;
                  const isCompleted = step > stepItem.number;
                  
                  return (
                    <div key={stepItem.number} className="flex items-center">
                      <motion.div 
                        className="flex items-center space-x-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`relative w-12 h-12 flex items-center justify-center border-2 transition-all duration-300 pixel-corners ${
                          isActive 
                            ? 'border-white bg-white text-black' 
                            : isCompleted 
                              ? 'border-white bg-black text-white pattern-grid-lg' 
                              : 'border-gray-600 bg-black text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check className="w-6 h-6" />
                            </motion.div>
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className={`font-semibold ${isActive ? 'text-white' : isCompleted ? 'text-white' : 'text-gray-600'} font-mono uppercase tracking-wider`}>
                            {stepItem.title}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">STEP {stepItem.number}</div>
                        </div>
                      </motion.div>
                      
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-1 mx-6 transition-colors duration-300 ${
                          step > stepItem.number ? 'bg-white pattern-stripes' : 'bg-gray-700'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black border-4 border-white p-8 vintage-border pattern-grid-sm crt-effect"
                  >
                    <div className="scanline"></div>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3 font-mono uppercase tracking-wider">
                      <MapPin className="w-6 h-6 text-white" />
                      <span>SHIPPING INFORMATION</span>
                    </h2>

                    <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-6">
                      {/* Contact Information */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="border-2 border-white p-6 vintage-border"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2 font-mono uppercase tracking-wide">
                          <Mail className="w-5 h-5 text-white" />
                          <span>CONTACT INFORMATION</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              EMAIL ADDRESS *
                            </label>
                            <input
                              {...shippingForm.register('email', { required: 'Email is required' })}
                              type="email"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Shipping Address */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="border-2 border-white p-6 vintage-border"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2 font-mono uppercase tracking-wide">
                          <User className="w-5 h-5 text-white" />
                          <span>SHIPPING ADDRESS</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              FIRST NAME *
                            </label>
                            <input
                              {...shippingForm.register('firstName', { required: 'First name is required' })}
                              type="text"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="JOHN"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              LAST NAME *
                            </label>
                            <input
                              {...shippingForm.register('lastName', { required: 'Last name is required' })}
                              type="text"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="DOE"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              COMPANY (OPTIONAL)
                            </label>
                            <input
                              {...shippingForm.register('company')}
                              type="text"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="COMPANY NAME"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              ADDRESS *
                            </label>
                            <input
                              {...shippingForm.register('address', { required: 'Address is required' })}
                              type="text"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="123 MAIN STREET"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              APARTMENT, SUITE, ETC. (OPTIONAL)
                            </label>
                            <input
                              {...shippingForm.register('apartment')}
                              type="text"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="APARTMENT, SUITE, ETC."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              CITY *
                            </label>
                            <input
                              {...shippingForm.register('city', { required: 'City is required' })}
                              type="text"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="NEW YORK"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              STATE *
                            </label>
                            <select
                              {...shippingForm.register('state', { required: 'State is required' })}
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                            >
                              <option value="">SELECT STATE</option>
                              <option value="AL">ALABAMA</option>
                              <option value="CA">CALIFORNIA</option>
                              <option value="NY">NEW YORK</option>
                              <option value="TX">TEXAS</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              ZIP CODE *
                            </label>
                            <input
                              {...shippingForm.register('postalCode', { required: 'ZIP code is required' })}
                              type="text"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="10001"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2 font-mono">
                              PHONE *
                            </label>
                            <input
                              {...shippingForm.register('phone', { required: 'Phone is required' })}
                              type="tel"
                              className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.button
                        type="submit"
                        className="w-full bg-white text-black py-4 border-2 border-white font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 font-mono uppercase tracking-wider crt-effect"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="scanline"></div>
                        <div className="flex items-center justify-center space-x-2">
                          <span>CONTINUE TO PAYMENT</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black border-4 border-white p-8 vintage-border pattern-grid-sm crt-effect"
                  >
                    <div className="scanline"></div>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3 font-mono uppercase tracking-wider">
                      <CreditCard className="w-6 h-6 text-white" />
                      <span>PAYMENT METHOD</span>
                    </h2>
                    
                    <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 border-2 ${
                              paymentMethod === 'card'
                                ? 'border-white bg-white text-black'
                                : 'border-white text-white'
                            } cursor-pointer transition-colors duration-300 flex flex-col items-center space-y-3 vintage-border`}
                            onClick={() => setPaymentMethod('card')}
                          >
                            <CreditCard className="w-8 h-8" />
                            <span className="font-mono font-medium tracking-wide">CREDIT CARD</span>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 border-2 ${
                              paymentMethod === 'paypal'
                                ? 'border-white bg-white text-black'
                                : 'border-white text-white'
                            } cursor-pointer transition-colors duration-300 flex flex-col items-center space-y-3 vintage-border`}
                            onClick={() => setPaymentMethod('paypal')}
                          >
                            <span className="text-2xl font-bold">P</span>
                            <span className="font-mono font-medium tracking-wide">PAYPAL</span>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 border-2 ${
                              paymentMethod === 'apple'
                                ? 'border-white bg-white text-black'
                                : 'border-white text-white'
                            } cursor-pointer transition-colors duration-300 flex flex-col items-center space-y-3 vintage-border`}
                            onClick={() => setPaymentMethod('apple')}
                          >
                            <span className="text-2xl font-bold">A</span>
                            <span className="font-mono font-medium tracking-wide">APPLE PAY</span>
                          </motion.div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {paymentMethod === 'card' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 overflow-hidden border-2 border-white p-6 pattern-dots"
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-white mb-2 font-mono">
                                  CARD NUMBER *
                                </label>
                                <input
                                  {...paymentForm.register('cardNumber', { required: 'Card number is required' })}
                                  type="text"
                                  className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                                  placeholder="1234 5678 9012 3456"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-white mb-2 font-mono">
                                    EXPIRY DATE *
                                  </label>
                                  <input
                                    {...paymentForm.register('expiryDate', { required: 'Expiry date is required' })}
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                                    placeholder="MM/YY"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-semibold text-white mb-2 font-mono">
                                    CVV *
                                  </label>
                                  <input
                                    {...paymentForm.register('cvv', { required: 'CVV is required' })}
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                                    placeholder="123"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-semibold text-white mb-2 font-mono">
                                  NAME ON CARD *
                                </label>
                                <input
                                  {...paymentForm.register('nameOnCard', { required: 'Name on card is required' })}
                                  type="text"
                                  className="w-full px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono pixel-corners"
                                  placeholder="JOHN DOE"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-white mb-2 font-mono">
                                BILLING ADDRESS
                              </label>
                              
                              <div className="space-y-2">
                                <div className="flex items-center space-x-3 text-white">
                                  <input
                                    type="radio"
                                    id="same-address"
                                    value="same"
                                    checked={paymentForm.watch('billingAddress') === 'same'}
                                    onChange={() => paymentForm.setValue('billingAddress', 'same')}
                                    className="w-4 h-4 border-2 border-white focus:ring-2 focus:ring-white accent-white"
                                  />
                                  <label htmlFor="same-address" className="font-mono">
                                    SAME AS SHIPPING ADDRESS
                                  </label>
                                </div>
                                
                                <div className="flex items-center space-x-3 text-white">
                                  <input
                                    type="radio"
                                    id="different-address"
                                    value="different"
                                    checked={paymentForm.watch('billingAddress') === 'different'}
                                    onChange={() => paymentForm.setValue('billingAddress', 'different')}
                                    className="w-4 h-4 border-2 border-white focus:ring-2 focus:ring-white accent-white"
                                  />
                                  <label htmlFor="different-address" className="font-mono">
                                    USE A DIFFERENT BILLING ADDRESS
                                  </label>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {paymentMethod === 'paypal' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-2 border-white p-6"
                          >
                            <p className="text-white mb-3 font-mono text-center">
                              YOU'LL BE REDIRECTED TO PAYPAL TO COMPLETE YOUR PURCHASE.
                            </p>
                          </motion.div>
                        )}
                        
                        {paymentMethod === 'apple' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-2 border-white p-6"
                          >
                            <p className="text-white mb-3 font-mono text-center">
                              YOU'LL BE REDIRECTED TO APPLE PAY TO COMPLETE YOUR PURCHASE.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="flex space-x-4">
                        <motion.button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 bg-black text-white py-4 border-2 border-white font-semibold text-lg hover:bg-white hover:text-black transition-colors duration-300 font-mono uppercase tracking-wider crt-effect"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <ChevronLeft className="w-5 h-5" />
                            <span>BACK</span>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          type="submit"
                          className="flex-1 bg-white text-black py-4 border-2 border-white font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 font-mono uppercase tracking-wider crt-effect"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span>REVIEW ORDER</span>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="review"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black border-4 border-white p-8 vintage-border crt-effect"
                  >
                    <div className="scanline"></div>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3 font-mono uppercase tracking-wider">
                      <Check className="w-6 h-6 text-white" />
                      <span>REVIEW YOUR ORDER</span>
                    </h2>
                    
                    <div className="space-y-8">
                      <div className="border-2 border-white p-6 vintage-border pattern-grid-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-white font-mono uppercase">SHIPPING DETAILS</h3>
                          <motion.button
                            onClick={() => setStep(1)}
                            className="flex items-center text-sm text-white hover:text-gray-300 transition-colors font-mono uppercase"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>EDIT</span>
                          </motion.button>
                        </div>
                        <div className="space-y-2 text-gray-300 font-mono">
                          <p className="text-white font-medium">{shippingForm.getValues().firstName} {shippingForm.getValues().lastName}</p>
                          <p>{shippingForm.getValues().address}</p>
                          {shippingForm.getValues().apartment && <p>{shippingForm.getValues().apartment}</p>}
                          <p>{shippingForm.getValues().city}, {shippingForm.getValues().state} {shippingForm.getValues().postalCode}</p>
                          <p>{shippingForm.getValues().country}</p>
                          <p>{shippingForm.getValues().phone}</p>
                          <p>{shippingForm.getValues().email}</p>
                        </div>
                      </div>
                      
                      <div className="border-2 border-white p-6 vintage-border pattern-dots">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-white font-mono uppercase">PAYMENT METHOD</h3>
                          <motion.button
                            onClick={() => setStep(2)}
                            className="flex items-center text-sm text-white hover:text-gray-300 transition-colors font-mono uppercase"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>EDIT</span>
                          </motion.button>
                        </div>
                        <div className="space-y-2 text-gray-300 font-mono">
                          {paymentMethod === 'card' && (
                            <>
                              <p className="text-white font-medium">CREDIT CARD</p>
                              <p>**** **** **** {paymentForm.getValues().cardNumber?.slice(-4) || '1234'}</p>
                              <p>EXPIRES: {paymentForm.getValues().expiryDate || '12/25'}</p>
                            </>
                          )}
                          {paymentMethod === 'paypal' && <p className="text-white font-medium">PAYPAL</p>}
                          {paymentMethod === 'apple' && <p className="text-white font-medium">APPLE PAY</p>}
                        </div>
                      </div>
                      
                      <div className="border-2 border-white p-6 vintage-border pattern-stripes">
                        <h3 className="text-lg font-bold text-white mb-4 font-mono uppercase">ORDER SUMMARY</h3>
                        
                        <div className="space-y-4">
                          {cart.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 border border-gray-700">
                              <div className="h-16 w-16 border border-white flex-shrink-0 overflow-hidden pixel-corners">
                                <img
                                  src={item.image || item.images?.[0] || 'https://placehold.co/200x200?text=Product'}
                                  alt={item.name || item.title}
                                  className="h-full w-full object-cover mix-blend-luminosity"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-mono">{item.name || item.title}</h4>
                                <p className="text-sm text-gray-400 font-mono">
                                  QTY: {item.quantity} {item.selectedSize && `• ${item.selectedSize}`} {item.selectedColor && `• ${item.selectedColor}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-mono">${(item.discountPrice || item.price) * item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 border-t-2 border-dashed border-white pt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-gray-300 font-mono">
                          <span>SUBTOTAL:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300 font-mono">
                          <span>SHIPPING:</span>
                          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-gray-300 font-mono">
                          <span>TAX:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold text-xl border-t border-dashed border-white pt-3 font-mono">
                          <span>TOTAL:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-8 space-y-4">
                        <div className="text-sm text-gray-400 font-mono">
                          <p>BY PLACING YOUR ORDER, YOU AGREE TO OUR <a href="#" className="underline text-white">TERMS OF SERVICE</a> AND <a href="#" className="underline text-white">PRIVACY POLICY</a>.</p>
                        </div>
                        
                        <div className="flex space-x-4">
                          <motion.button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex-1 bg-black text-white py-4 border-2 border-white font-semibold text-lg hover:bg-white hover:text-black transition-colors duration-300 font-mono uppercase tracking-wider"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <ChevronLeft className="w-5 h-5" />
                              <span>BACK</span>
                            </div>
                          </motion.button>
                          
                          <motion.button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="flex-1 bg-white text-black py-4 border-2 border-white font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 font-mono uppercase tracking-wider crt-effect disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                          >
                            <div className="scanline"></div>
                            <div className="flex items-center justify-center space-x-2">
                              {loading ? (
                                <span>PROCESSING...</span>
                              ) : (
                                <>
                                  <span>PLACE ORDER</span>
                                  <Check className="w-5 h-5" />
                                </>
                              )}
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Order Summary */}
            <motion.div
              className="lg:sticky lg:top-8 h-fit"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-black border-4 border-white p-6 pattern-grid-sm crt-effect">
                <div className="scanline"></div>
                <h3 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider pb-3 border-b border-white border-dashed">
                  [ ORDER SUMMARY ]
                </h3>
                
                <div className="space-y-4 mb-6">
                  {cart.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="h-16 w-16 border border-white flex-shrink-0 overflow-hidden pixel-corners">
                        <img
                          src={item.image || item.images?.[0] || 'https://placehold.co/200x200?text=Product'}
                          alt={item.name || item.title}
                          className="h-full w-full object-cover mix-blend-luminosity"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-mono truncate">{item.name || item.title}</p>
                        <p className="text-xs text-gray-400 font-mono">QTY: {item.quantity}</p>
                      </div>
                      <p className="text-white font-mono">${(item.discountPrice || item.price) * item.quantity}</p>
                    </div>
                  ))}
                  
                  {cart.length > 2 && (
                    <p className="text-center text-gray-400 text-sm border-t border-gray-800 pt-2 font-mono">
                      +{cart.length - 2} MORE ITEM{cart.length - 2 !== 1 ? 'S' : ''}
                    </p>
                  )}
                </div>
                
                <div className="space-y-3 border-t border-b border-gray-800 py-4">
                  <div className="flex justify-between text-gray-300 font-mono">
                    <span>SUBTOTAL:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 font-mono">
                    <span>SHIPPING:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 font-mono">
                    <span>TAX:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-white font-bold text-xl mt-4 font-mono">
                  <span>TOTAL:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <motion.div 
                    className="flex items-center space-x-3 text-white border-2 border-white p-4 vintage-border hover:bg-white hover:text-black transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Shield className="w-6 h-6 flex-shrink-0" />
                    <span className="text-sm font-mono uppercase">SECURE PAYMENT PROCESSING</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3 text-white border-2 border-white p-4 vintage-border hover:bg-white hover:text-black transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Truck className="w-6 h-6 flex-shrink-0" />
                    <span className="text-sm font-mono uppercase">FREE SHIPPING ON ORDERS OVER $50</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3 text-white border-2 border-white p-4 vintage-border hover:bg-white hover:text-black transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Star className="w-6 h-6 flex-shrink-0" />
                    <span className="text-sm font-mono uppercase">30-DAY MONEY BACK GUARANTEE</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="noise-overlay"></div>
      </div>
    </>
  );
};

export default Checkout;
