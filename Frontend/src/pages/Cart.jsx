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
  };  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <>        <Helmet>
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
    <>      <Helmet>
        <title>My Bag ({getCartItemsCount()}) - ClassyShop</title>
        <meta name="description" content={`${getCartItemsCount()} items in your shopping bag.`} />
      </Helmet>

      <div className="min-h-screen bg-white">

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-light text-black mb-2 tracking-tight">My Bag</h1>
            <p className="text-gray-500">
              {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-100 pb-8"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-40 object-cover bg-gray-50"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-medium text-black mb-1">{item.name}</h3>
                              <p className="text-gray-500 text-sm mb-2">{item.brand}</p>
                              <div className="flex gap-4 text-sm text-gray-500">
                                {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-3 hover:bg-gray-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-3 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-xl font-medium text-black">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-gray-500">
                                  ${item.price.toFixed(2)} each
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

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-gray-50 p-8">
                  <h2 className="text-2xl font-light text-black mb-8 tracking-tight">Order Summary</h2>
                  
                  {/* Promo Code */}
                  <div className="mb-8">
                    <h3 className="font-medium text-black mb-4">Promo Code</h3>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">{appliedPromo}</span>
                        </div>
                        <button
                          onClick={removePromo}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-black"
                        />
                        <button 
                          onClick={handleApplyPromo}
                          className="px-6 py-3 border border-l-0 border-gray-200 bg-white hover:bg-gray-50 font-medium"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-xl font-medium text-black">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-black text-white py-4 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 mb-6"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Checkout
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>

                  {/* Shipping Info */}
                  {subtotal < 50 && (
                    <div className="text-sm text-gray-600 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Truck className="w-4 h-4" />
                        <span className="font-medium">Free shipping over $50</span>
                      </div>
                      <p>Add ${(50 - subtotal).toFixed(2)} more to qualify</p>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-8 space-y-4 text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <span>Secure & encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>        </div>
      </div>
    </>
  );
};

export default Cart;
