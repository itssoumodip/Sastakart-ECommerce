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

// Import RetroPatterns for styling consistency
import RetroPatterns from '../components/layout/RetroPatterns';

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
  };
  return (
    <>
      <Helmet>
        <title>ORDER CONFIRMED - RETRO-SHOP</title>
        <meta name="description" content="Your order has been successfully placed and confirmed." />
      </Helmet>

      <RetroPatterns />
      <div className="min-h-screen bg-black pattern-grid-sm">
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
                <div className="w-32 h-32 bg-black border-4 border-white pixel-corners crt-effect flex items-center justify-center mx-auto vintage-border">
                  <div className="scanline"></div>
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-black flex items-center justify-center pixel-corners"
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
                  <Star className="w-4 h-4 text-black" />
                </motion.div>
              </motion.div>
              
              <motion.h1 
                className="text-5xl font-bold text-white mb-4 font-mono uppercase tracking-wider"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                [ ORDER CONFIRMED! ]
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 max-w-2xl mx-auto font-mono uppercase tracking-wide"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                THANK YOU FOR YOUR PURCHASE! YOUR ORDER HAS BEEN SUCCESSFULLY PLACED AND YOU'LL RECEIVE A CONFIRMATION EMAIL SHORTLY.
              </motion.p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Order Details Card */}
              <motion.div 
                className="bg-black border-4 border-white p-8 vintage-border pattern-grid-lg crt-effect"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="scanline"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white border-2 border-black text-black flex items-center justify-center mr-4 pixel-corners">
                    <Package className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">ORDER DETAILS</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-700">
                    <span className="text-gray-300 font-mono">ORDER NUMBER:</span>
                    <span className="font-semibold text-white bg-black border-2 border-white px-3 py-1 font-mono pixel-corners">{orderId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-700">
                    <span className="text-gray-300 font-mono">ORDER DATE:</span>
                    <span className="font-semibold text-white font-mono">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-700">
                    <span className="text-gray-300 font-mono">ESTIMATED DELIVERY:</span>
                    <span className="font-semibold text-white font-mono">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-300 font-mono">PAYMENT STATUS:</span>
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-white text-black border-2 border-black font-mono pixel-corners">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      PAID
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* What's Next Card */}
              <motion.div 
                className="bg-black border-4 border-white p-8 vintage-border pattern-stripes-horizontal"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white border-2 border-black text-black flex items-center justify-center mr-4 pixel-corners">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">WHAT'S NEXT?</h2>
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start space-x-3 p-3 bg-black border-2 border-white pixel-corners vintage-border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="w-8 h-8 bg-white border border-black flex items-center justify-center flex-shrink-0 pixel-corners">
                      <Mail className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-white font-mono uppercase">ORDER CONFIRMATION EMAIL</p>
                      <p className="text-sm text-gray-400 font-mono">
                        YOU'LL RECEIVE AN EMAIL CONFIRMATION WITH YOUR ORDER DETAILS SHORTLY.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3 p-3 bg-black border-2 border-white pixel-corners vintage-border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <div className="w-8 h-8 bg-white border border-black flex items-center justify-center flex-shrink-0 pixel-corners">
                      <Package className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-white font-mono uppercase">ORDER PROCESSING</p>
                      <p className="text-sm text-gray-400 font-mono">
                        WE'LL START PREPARING YOUR ORDER FOR SHIPMENT WITHIN 24 HOURS.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3 p-3 bg-black border-2 border-white pixel-corners vintage-border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    <div className="w-8 h-8 bg-white border border-black flex items-center justify-center flex-shrink-0 pixel-corners">
                      <Truck className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-white font-mono uppercase">SHIPPING UPDATES</p>
                      <p className="text-sm text-gray-400 font-mono">
                        YOU'LL RECEIVE TRACKING INFORMATION ONCE YOUR ORDER SHIPS.
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
                className="bg-white text-black border-4 border-black hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2 px-8 py-4 font-mono uppercase tracking-wider pixel-corners crt-effect"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="scanline"></div>
                <Package className="w-5 h-5" />
                <span>VIEW MY ORDERS</span>
              </motion.button>
              
              <motion.button
                onClick={handleContinueShopping}
                className="bg-black text-white border-4 border-white hover:bg-white hover:text-black transition-colors duration-300 flex items-center justify-center space-x-2 px-8 py-4 font-mono uppercase tracking-wider pixel-corners crt-effect"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="scanline"></div>
                <ShoppingBag className="w-5 h-5" />
                <span>CONTINUE SHOPPING</span>
              </motion.button>
              
              <motion.button
                onClick={handleGoHome}
                className="bg-black text-white border-4 border-white hover:bg-white hover:text-black transition-colors duration-300 flex items-center justify-center space-x-2 px-8 py-4 font-mono uppercase tracking-wider pixel-corners crt-effect"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="scanline"></div>
                <Home className="w-5 h-5" />
                <span>BACK TO HOME</span>
              </motion.button>
            </motion.div>

            {/* Help & Support Section */}
            <motion.div 
              className="bg-black border-4 border-white p-8 mb-8 vintage-border pattern-dots crt-effect"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <div className="scanline"></div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white border-2 border-black text-black flex items-center justify-center mx-auto mb-4 pixel-corners">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-mono uppercase tracking-wider">NEED HELP?</h3>
                <p className="text-gray-300 mb-6 font-mono">
                  IF YOU HAVE ANY QUESTIONS ABOUT YOUR ORDER, OUR CUSTOMER SUPPORT TEAM IS HERE TO HELP.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@retroshop.com"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 font-mono uppercase tracking-wider pixel-corners"
                  >
                    <Mail className="w-5 h-5" />
                    <span>EMAIL SUPPORT</span>
                  </a>
                  <a
                    href="tel:+1-555-123-4567"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-colors duration-300 font-mono uppercase tracking-wider pixel-corners"
                  >
                    <span>📞</span>
                    <span>CALL US: (555) 123-4567</span>
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
              <div className="bg-black border-4 border-white p-6 text-center vintage-border pattern-stripes">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mx-auto mb-3 pixel-corners">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-semibold text-white mb-2 font-mono uppercase tracking-wide">SECURE PAYMENT</h4>
                <p className="text-sm text-gray-400 font-mono">YOUR PAYMENT INFORMATION IS ENCRYPTED AND SECURE</p>
              </div>
              
              <div className="bg-black border-4 border-white p-6 text-center vintage-border pattern-grid-sm">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mx-auto mb-3 pixel-corners">
                  <Truck className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-semibold text-white mb-2 font-mono uppercase tracking-wide">FAST SHIPPING</h4>
                <p className="text-sm text-gray-400 font-mono">FREE SHIPPING ON ORDERS OVER $50</p>
              </div>
              
              <div className="bg-black border-4 border-white p-6 text-center vintage-border pattern-dots">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mx-auto mb-3 pixel-corners">
                  <Star className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-semibold text-white mb-2 font-mono uppercase tracking-wide">30-DAY RETURNS</h4>
                <p className="text-sm text-gray-400 font-mono">EASY RETURNS WITHIN 30 DAYS OF PURCHASE</p>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="noise-overlay"></div>
      </div>
    </>
  );
};

export default OrderSuccess;
