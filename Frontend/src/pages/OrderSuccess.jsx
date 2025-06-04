import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Package,
  Mail,
  ArrowRight,
  Home,
  ShoppingBag,
  Clock,
  Truck,
  Star,
  Gift,
  Shield
} from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || 'ORD-' + Date.now();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/profile/orders');
  };

  const handleGoHome = () => {
    navigate('/');
  };  return (
    <>
      <Helmet>
        <title>Order Confirmed - Modern Shop</title>
        <meta name="description" content="Your order has been successfully placed and confirmed." />
      </Helmet>      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Success Animation */}
            <motion.div 
              className="text-center mb-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200 
                }}
                className="relative mb-6"
              >
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 border-2 border-white rounded-full flex items-center justify-center shadow-md"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Star className="w-4 h-4 text-white fill-current" />
                </motion.div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Order Confirmed!
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}              >
                Thank you for your purchase! Your order has been successfully placed and you'll receive a confirmation email shortly.
              </motion.p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 sm:text-md text-sm -ml-4 gap-8 mb-12">
              {/* Order Details Card */}
              <motion.div 
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mr-4">
                    <Package className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Order Number:</span>
                    <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{orderId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Order Date:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Estimated Delivery:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                    <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">Payment Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      location.state?.paymentMethod === 'cod' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {location.state?.paymentMethod === 'cod' ? (
                        <>
                          <Clock className="w-4 h-4 mr-1" />
                          Cash on Delivery
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Paid
                        </>
                      )}
                    </span>
                  </div>
                </div>              </motion.div>

              {/* What's Next Card */}
              <motion.div 
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">What's Next?</h2>
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Order Confirmation Email</p>
                      <p className="text-sm text-gray-600">
                        You'll receive an email confirmation with your order details shortly.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Order Processing</p>
                      <p className="text-sm text-gray-600">
                        We'll start preparing your order for shipment within 24 hours.
                      </p>
                    </div>                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Shipping Updates</p>
                      <p className="text-sm text-gray-600">
                        You'll receive tracking information once your order ships.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <motion.button
                onClick={handleViewOrders}
                className="btn-primary flex items-center justify-center space-x-2 px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="w-5 h-5" />
                <span>View My Orders</span>
              </motion.button>
              
              <motion.button
                onClick={handleContinueShopping}
                className="btn-outline flex items-center justify-center space-x-2 px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Continue Shopping</span>
              </motion.button>
              
              <motion.button
                onClick={handleGoHome}
                className="btn-outline flex items-center justify-center space-x-2 px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </motion.button>
            </motion.div>

            {/* Help & Support Section */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-lg"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  If you have any questions about your order, our customer support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@modernshop.com"
                    className="btn-primary inline-flex items-center justify-center space-x-2"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email Support</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Payment</h4>
                <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Shipping</h4>
                <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">30-Day Returns</h4>
                <p className="text-sm text-gray-600">Easy returns within 30 days of purchase</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
