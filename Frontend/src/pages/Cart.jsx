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
  ShoppingCart
} from 'lucide-react';

// Custom styling - simplified and modern UI
const ModernStyle = `
  /* Subtle background texture */
  .bg-texture {
    background-color: #111;
    background-image: radial-gradient(#333 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: -19px -19px;
  }
  
  /* Clean borders */
  .border-clean {
    border: 2px solid rgba(255, 255, 255, 0.7);
    transition: border-color 0.3s ease;
  }
  
  .border-clean:hover {
    border-color: white;
  }

  /* Subtle hover effects */
  .hover-glow:hover {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  }
  
  /* Modern transitions */
  .transition-smooth {
    transition: all 0.3s ease;
  }
  
  /* Clean corners */
  .rounded-modern {
    border-radius: 8px;
  }
  
  /* Button styling */
  .btn-modern {
    background: linear-gradient(145deg, #1a1a1a, #222);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .btn-modern:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  /* Input styling */
  .input-modern {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }
  
  .input-modern:focus {
    border-color: white;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
    outline: none;
  }
`;

const Cart = () => {
  const { items: cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState({});

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleRemoveItem = (id, name) => {
    removeFromCart(id);
    toast.success(name + " removed from cart");
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };
  
  // Promo code handler function
  const handleApplyPromo = () => {
    // Sample promo codes
    const promoCodes = {
      'RETRO25': { discount: 0.25, description: '25% OFF EVERYTHING' },
      'FREESHIP': { freeShipping: true, description: 'FREE SHIPPING' },
      'CLASSIC': { discount: 0.15, description: '15% OFF VINTAGE ITEMS' }
    };

    if (promoCode.trim() === '') {
      toast.error('Please enter a promo code');
      return;
    }

    const promo = promoCodes[promoCode.toUpperCase()];    
    if (promo) {
      setAppliedPromo(promo);
      toast.success("Promo code applied: " + promo.description);
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const toggleWishlist = (id) => {
    setIsWishlisted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    toast.success(isWishlisted[id] ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Calculate order summary
  const subtotal = getCartTotal();
  const shipping = appliedPromo?.freeShipping ? 0 : subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const discount = appliedPromo?.discount ? subtotal * appliedPromo.discount : 0;
  const total = subtotal + shipping + tax - discount;

  if (cart.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart - RETRO-SHOP</title>
          <meta name="description" content="View and manage your shopping cart" />
          <style>{ModernStyle}</style>
        </Helmet>
        
        <div className="min-h-screen bg-texture text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="border-b-2 border-white/60 pb-6 mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                  Your Cart
                </h1>
              </div>
              
              <motion.div 
                className="bg-black/50 rounded-modern border-clean p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 hover-glow">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet.
                  Browse our products to find something you'll love.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/products" className="btn-modern px-6 py-3 rounded-modern font-medium text-white hover:text-white flex items-center gap-2">
                    <span>Start Shopping</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                  
                  <Link to="/wishlist" className="btn-modern px-6 py-3 rounded-modern font-medium text-white hover:text-white">
                    View Wishlist
                  </Link>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20">
                <div className="rounded-modern bg-white/5 p-6 hover-glow transition-smooth">
                  <div className="flex items-center space-x-3 mb-2">
                    <Truck className="h-5 w-5 text-white/80" />
                    <h3 className="font-medium">Free Shipping</h3>
                  </div>
                  <p className="text-sm text-gray-400">On orders over $50</p>
                </div>
                
                <div className="rounded-modern bg-white/5 p-6 hover-glow transition-smooth">
                  <div className="flex items-center space-x-3 mb-2">
                    <RefreshCw className="h-5 w-5 text-white/80" />
                    <h3 className="font-medium">Easy Returns</h3>
                  </div>
                  <p className="text-sm text-gray-400">30-day return policy</p>
                </div>
                
                <div className="rounded-modern bg-white/5 p-6 hover-glow transition-smooth">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="h-5 w-5 text-white/80" />
                    <h3 className="font-medium">Secure Checkout</h3>
                  </div>
                  <p className="text-sm text-gray-400">Encrypted payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Cart - RETRO-SHOP</title>
        <meta name="description" content="View and manage your shopping cart" />
        <style>{ModernStyle}</style>
      </Helmet>

      <div className="min-h-screen bg-texture text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="border-b-2 border-white/60 pb-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Your Cart
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">              
              <button 
                onClick={() => navigate('/products')}
                className="btn-modern rounded-modern px-4 py-2 flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </button>
              
              <button 
                onClick={handleClearCart}
                className="btn-modern rounded-modern px-4 py-2 text-sm text-white/80 hover:text-white"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}            
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="text-sm border-b border-white/30 pb-2 mb-4 hidden md:flex text-white/70">
                <div className="w-1/3">Product</div>
                <div className="w-2/3 grid grid-cols-3 gap-4">
                  <div>Details</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total</div>
                </div>
              </div>

              <AnimatePresence>
                {cart.map(item => (
                  <motion.div 
                    key={item.id}
                    className="bg-white/5 rounded-modern overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Item Image */}
                      <div className="relative w-full md:w-1/3 bg-black/30">
                        <div className="absolute top-3 left-3 text-xs text-white/60 bg-black/50 px-2 py-1 rounded">
                          ID: {item.id.substring(0, 8)}
                        </div>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-48 md:h-auto object-cover"
                        />
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full hover-glow transition-smooth"
                        >
                          <Heart 
                            className={`h-5 w-5 ${isWishlisted[item.id] ? 'fill-white text-black' : ''}`}
                          />
                        </button>
                      </div>
                      
                      {/* Item Details */}
                      <div className="p-6 flex-grow flex flex-col justify-between relative">
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full hover-glow transition-smooth"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        
                        <div className="mb-6">
                          <h3 className="text-xl font-medium mb-2">{item.name}</h3>
                          <p className="text-lg text-white/80 my-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-white/30 rounded-modern overflow-hidden">
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-2 text-white/70 hover:bg-white/10 transition-smooth"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            
                            <span className="px-4 py-1 font-medium text-center min-w-[40px]">
                              {item.quantity}
                            </span>
                            
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 text-white/70 hover:bg-white/10 transition-smooth"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Total Price */}
                          <div className="font-bold text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-modern sticky top-6">
                {/* Title Bar */}
                <div className="border-b border-white/20 p-4">
                  <h2 className="font-bold text-xl">
                    Order Summary
                  </h2>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-5">
                  <div className="space-y-3 border-b border-white/20 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {appliedPromo?.discount && (
                      <div className="flex items-center justify-between text-green-400">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span>Discount</span>
                        </div>
                        <span className="font-medium">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-white/70" />
                        <span className="text-white/70">Shipping</span>
                      </div>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-400">FREE</span>
                        ) : (
                          "$" + shipping.toFixed(2)
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-2xl font-bold">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Free shipping progress */}
                  {!appliedPromo?.freeShipping && subtotal < 50 && (
                    <motion.div 
                      className="bg-white/5 rounded-modern p-4 my-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Truck className="w-4 h-4 text-white/70" />
                        <span className="text-sm">
                          Add ${(50 - subtotal).toFixed(2)} for free shipping
                        </span>
                      </div>
                      
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="bg-white h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                          transition={{ duration: 0.7 }}
                        />
                      </div>
                      
                      <div className="flex justify-between mt-1 text-xs text-white/60">
                        <span>$0</span>
                        <span>$50</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Promo Code */}
                  <div className="space-y-3 my-4">
                    <label className="block text-sm text-white/70">
                      Promo Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 bg-black/30 border border-white/20 rounded-l-md py-2 px-4 input-modern"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-white text-black py-2 px-6 font-medium transition-smooth rounded-r-md hover:bg-gray-200"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Check className="h-4 w-4" />
                        <span>{appliedPromo.description} applied</span>
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full bg-white text-black rounded-md py-3 px-6 font-medium transition-smooth mt-6 hover:bg-opacity-90"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Proceed to Checkout
                  </motion.button>
                  
                  {/* Security Notes */}
                  <div className="grid grid-cols-3 gap-2 mt-6">
                    <div className="text-center p-3 bg-white/5 rounded-md">
                      <Shield className="h-5 w-5 mx-auto mb-1 text-white/60" />
                      <span className="text-xs text-white/60">Secure Payment</span>
                    </div>
                    
                    <div className="text-center p-3 bg-white/5 rounded-md">
                      <Truck className="h-5 w-5 mx-auto mb-1 text-white/60" />
                      <span className="text-xs text-white/60">Fast Delivery</span>
                    </div>
                    
                    <div className="text-center p-3 bg-white/5 rounded-md">
                      <RefreshCw className="h-5 w-5 mx-auto mb-1 text-white/60" />
                      <span className="text-xs text-white/60">Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* You may also like section */}
          <div className="mt-16 border-t border-white/20 pt-12">
            <h2 className="text-2xl font-bold mb-8">
              Recommended For You
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <motion.div 
                  key={i} 
                  className="bg-white/5 rounded-modern overflow-hidden hover-glow"
                  whileHover={{ translateY: -5 }}
                >
                  <div className="relative">
                    <img 
                      src={`https://placehold.co/300x300/111111/FFFFFF?text=Item-${i}`} 
                      alt={`Suggested item ${i}`}
                      className="w-full h-52 object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <button className="bg-white/10 backdrop-blur-sm text-white rounded-md px-4 py-2 text-sm transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Product {i}</h3>
                      <div className="flex">
                        <Star className="h-3 w-3 fill-white text-white" />
                        <Star className="h-3 w-3 fill-white text-white" />
                        <Star className="h-3 w-3 fill-white text-white" />
                        <Star className="h-3 w-3 text-white/30" />
                        <Star className="h-3 w-3 text-white/30" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold">${(19.99 + i * 10).toFixed(2)}</p>
                      <button className="p-2 text-white/70 hover:text-white transition-colors">
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <button className="btn-modern rounded-md px-6 py-3 text-sm inline-flex items-center gap-2">
                <span>View all products</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
