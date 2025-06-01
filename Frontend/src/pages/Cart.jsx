import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  X, 
  ShoppingBag, 
  ArrowLeft,
  ArrowRight, 
  Heart,
  Star,
  Shield,
  Truck,
  RefreshCw,
  Gift,
  Tag,
  Check,
  Sparkles,
  ShoppingCart,
  Lock,
  CreditCard,
  Clock,
  MapPin,
  Trash2,
  Search,
  User,
  Menu
} from 'lucide-react';

const Cart = () => {
  const { items: cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [isAdmin, setIsAdmin] = useState(true); // Temporary admin state, replace with actual auth logic

  const promoCodes = {
    'SAVE10': 10,
    'WELCOME20': 20,
    'SUMMER15': 15,
    'NEWBIE25': 25
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    toast.success('Quantity updated');
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    toast.success('Item removed from cart');
  };

  const handleApplyPromo = () => {
    if (promoCodes[promoCode.toUpperCase()]) {
      setDiscount(promoCodes[promoCode.toUpperCase()]);
      setAppliedPromo(promoCode.toUpperCase());
      toast.success(`Promo code applied! ${promoCodes[promoCode.toUpperCase()]}% off`);
      setPromoCode('');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const removePromo = () => {
    setDiscount(0);
    setAppliedPromo('');
    toast.success('Promo code removed');
  };
  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 3500 ? 0 : 299;
  const total = subtotal - discountAmount + shipping;
  
  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate('/checkout');
      setIsLoading(false);
    }, 1000);
  };

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>My Bag - ClassyShop</title>
          <meta name="description" content="Your shopping bag is empty. Discover our latest fashion collections." />
        </Helmet>
        
        <div className="min-h-screen bg-gray-50">
          {/* Empty Bag Content */}
          <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Your bag is empty</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Start adding items to your bag and they will appear here. 
                  Discover our latest products and add them to your cart.
                </p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`My Bag (${getCartItemsCount() || 0}) - ClassyShop`}</title>
        <meta name="description" content={`${getCartItemsCount() || 0} items in your shopping bag.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          {/* Page Header */}
          <motion.div 
            className="mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-gray-800" />
                  My Shopping Bag
                  <span className="text-xl font-medium text-gray-500">
                    ({getCartItemsCount() || 0} {(getCartItemsCount() || 0) === 1 ? 'item' : 'items'})
                  </span>
                </h1>
                <p className="mt-2 text-gray-600">Review and manage your items before checkout</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  to="/products" 
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-medium text-gray-700">Cart Items</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 hover:bg-gray-50/50 transition-colors group"
                      >
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0 relative group overflow-hidden rounded-xl">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'}
                              alt={item.name || 'Product'}
                              className="w-32 h-40 object-cover bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-1 hover:text-black/70 transition-colors cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                                  {item.name || 'Product'}
                                </h3>
                                {item.brand && <p className="text-gray-500 text-sm mb-2">{item.brand}</p>}
                                <div className="flex gap-4 text-sm">
                                  {item.selectedSize && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                      Size: {item.selectedSize}
                                    </span>
                                  )}
                                  {item.selectedColor && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                      Color: {item.selectedColor}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <motion.button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                              {/* Quantity Controls */}
                              <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm">
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                  className="p-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full"
                                  disabled={(item.quantity || 1) <= 1}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                <span className="px-4 py-1.5 font-medium min-w-[50px] text-center">
                                  {item.quantity || 1}
                                </span>
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                  className="p-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full"
                                  disabled={item.stock && (item.quantity || 1) >= item.stock}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>
                              {/* Price */}
                              <div className="text-right">
                                <p className="text-xl font-semibold text-gray-900">
                                  ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-sm text-gray-500">
                                    ₹{(item.price || 0).toFixed(2)} each
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white p-6 lg:p-8 border border-gray-100 rounded-2xl shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  {/* Promo Code */}
                  <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-3">Promo Code</h3>
                    {appliedPromo ? (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium text-green-800">{appliedPromo}</span>
                        </div>
                        <motion.button
                          onClick={removePromo}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-green-600 hover:text-green-700 w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ) : (
                      <div className="flex rounded-xl overflow-hidden shadow-sm">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                        <motion.button 
                          onClick={handleApplyPromo}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-black text-white hover:bg-gray-800 font-medium transition-colors"
                        >
                          Apply
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600 items-center py-1">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex justify-between text-green-600 items-center py-1 bg-green-50 px-3 rounded-lg"
                      >
                        <span className="flex items-center gap-2">
                          <Tag className="w-4 h-4" /> 
                          Discount ({discount}%)
                        </span>
                        <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between text-gray-600 items-center py-1">
                      <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Shipping
                      </span>
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                        {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-2">
                      <div className="flex justify-between text-xl font-semibold text-gray-900">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-black text-white py-4 text-base font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 mb-4 rounded-xl shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                  
                  {/* Continue Shopping Link */}
                  <div className="text-center mb-6">
                    <Link
                      to="/products"
                      className="text-gray-600 hover:text-black text-sm font-medium inline-flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Continue Shopping
                    </Link>
                  </div>
                  
                  {/* Shipping Info */}
                  {subtotal < 3500 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-sm bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6"
                    >
                      <div className="flex items-center gap-2 mb-2 text-blue-700">
                        <Truck className="w-4 h-4" />
                        <span className="font-medium">Free shipping available!</span>
                      </div>
                      <p className="text-blue-600">
                        Add <span className="font-semibold">₹{(3500 - subtotal).toFixed(2)}</span> more to qualify for free shipping
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Trust Badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-6 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm"
                >
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-medium text-gray-900">Shop with Confidence</h3>
                    <div className="px-2 py-1 bg-green-50 rounded-full text-xs text-green-700 font-medium">TRUSTED</div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-600">Secure checkout</span>
                      </div>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-sm text-gray-600">30-day returns</span>
                      </div>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Admin Quick Access Panel - only visible for admin users */}
        {isAdmin && (
          <div className="max-w-6xl mx-auto px-4 py-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl text-white border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-blue-400" />
                  Admin Control Panel
                </h3>
                <div className="px-3 py-1 bg-blue-500 bg-opacity-20 rounded-full text-xs font-semibold text-blue-300">
                  ADMIN ACCESS
                </div>
              </div>
              
              <p className="text-gray-300 mb-8 max-w-2xl">
                Manage your store's products, orders, and settings from these quick access links. For more advanced options, visit the full admin dashboard.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/admin/products"
                  className="group flex flex-col justify-between bg-gray-800 hover:bg-gray-700 p-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 h-[180px]"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-500 bg-opacity-20 flex items-center justify-center mb-4">
                    <Tag className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Product Management</h4>
                    <p className="text-gray-400 text-sm mb-4">Add, edit, or remove products from your inventory</p>
                    <div className="flex items-center text-blue-400 font-medium">
                      <span>Manage Products</span>
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link
                  to="/admin/orders"
                  className="group flex flex-col justify-between bg-gray-800 hover:bg-gray-700 p-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-green-500 hover:shadow-lg hover:shadow-green-900/20 h-[180px]"
                >
                  <div className="w-12 h-12 rounded-lg bg-green-500 bg-opacity-20 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Order Management</h4>
                    <p className="text-gray-400 text-sm mb-4">View and process customer orders and shipments</p>
                    <div className="flex items-center text-green-400 font-medium">
                      <span>Manage Orders</span>
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link
                  to="/admin/dashboard"
                  className="group flex flex-col justify-between bg-gray-800 hover:bg-gray-700 p-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 h-[180px]"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-500 bg-opacity-20 flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Admin Dashboard</h4>
                    <p className="text-gray-400 text-sm mb-4">Access analytics, reports and store settings</p>
                    <div className="flex items-center text-purple-400 font-medium">
                      <span>Go to Dashboard</span>
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                <p className="text-gray-400 text-sm">
                  Logged in as <span className="text-white font-medium">Admin User</span>
                </p>
                <button className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-colors">
                  Exit Admin Mode
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
