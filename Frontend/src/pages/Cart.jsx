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
  const shipping = subtotal > 50 ? 0 : 10;
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
        
        <div className="min-h-screen bg-white">
          {/* Empty Bag Content */}
          <div className="max-w-6xl mx-auto px-4 py-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-40 h-40 mx-auto mb-8 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-gray-300" />
                </div>
                <h1 className="text-4xl font-light text-black mb-4 tracking-tight">Your bag is empty</h1>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  Start adding items to your bag and they will appear here.
                </p>
                <Link 
                  to="/products" 
                  className="inline-block bg-black text-white px-8 py-4 text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
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
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Page Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-block mb-2 px-3 py-1 bg-black bg-opacity-5 rounded-full text-xs font-medium text-gray-900">
              SHOPPING CART
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">My Bag</h1>
            <p className="text-gray-600">
              {getCartItemsCount() || 0} {(getCartItemsCount() || 0) === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

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
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0 relative group">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'}
                              alt={item.name || 'Product'}
                              className="w-32 h-40 object-cover bg-gray-50 rounded-md shadow-sm group-hover:shadow-md transition-all duration-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-md"></div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-medium text-black mb-1 hover:text-gray-700 transition-colors cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                                  {item.name || 'Product'}
                                </h3>
                                {item.brand && <p className="text-gray-500 text-sm mb-2">{item.brand}</p>}
                                <div className="flex gap-4 text-sm text-gray-500">
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
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-200 rounded-full shadow-sm">
                                <button
                                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                  className="p-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full"
                                  disabled={(item.quantity || 1) <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-1.5 font-medium min-w-[50px] text-center">
                                  {item.quantity || 1}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                  className="p-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full"
                                  disabled={item.stock && (item.quantity || 1) >= item.stock}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              {/* Price */}
                              <div className="text-right">
                                <p className="text-xl font-semibold text-black">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-sm text-gray-500">
                                    ${(item.price || 0).toFixed(2)} each
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
                <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-semibold text-black mb-6 tracking-tight">Order Summary</h2>
                  
                  {/* Promo Code */}
                  <div className="mb-8">
                    <h3 className="font-medium text-black mb-3">Promo Code</h3>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium text-green-800">{appliedPromo}</span>
                        </div>
                        <button
                          onClick={removePromo}
                          className="text-green-600 hover:text-green-700 w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex rounded-xl overflow-hidden shadow-sm">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                        <button 
                          onClick={handleApplyPromo}
                          className="px-6 py-3 bg-black text-white hover:bg-gray-800 font-medium transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600 items-center py-1">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 items-center py-1 bg-green-50 px-3 rounded-lg">
                        <span className="flex items-center gap-2">
                          <Tag className="w-4 h-4" /> 
                          Discount ({discount}%)
                        </span>
                        <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600 items-center py-1">
                      <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Shipping
                      </span>
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-2">
                      <div className="flex justify-between text-xl font-semibold text-black">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-black text-white py-4 text-base font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 mb-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                  
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
                  {subtotal < 50 && (
                    <div className="text-sm bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2 text-blue-700">
                        <Truck className="w-4 h-4" />
                        <span className="font-medium">Free shipping available!</span>
                      </div>
                      <p className="text-blue-600">Add <span className="font-semibold">${(50 - subtotal).toFixed(2)}</span> more to qualify for free shipping</p>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-8 space-y-4 text-sm text-gray-600 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-4">Shop with Confidence</h3>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>Secure & encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-green-500" />
                    </div>
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-purple-500" />
                    </div>
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart; 
