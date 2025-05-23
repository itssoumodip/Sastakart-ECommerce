import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { updateQuantity, removeFromCart, clearCart } from '../../store/cartSlice';
import Button from '../../components/ui/Button';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((state) => state.cart);
  
  const [cartUpdated, setCartUpdated] = useState(false);
  
  // Handle quantity increase
  const handleIncreaseQuantity = (id) => {
    const item = items.find(item => item.id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.quantity + 1 }));
      setCartUpdated(true);
    }
  };
  
  // Handle quantity decrease
  const handleDecreaseQuantity = (id) => {
    const item = items.find(item => item.id === id);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id, quantity: item.quantity - 1 }));
      setCartUpdated(true);
    }
  };
  
  // Handle remove item
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    setCartUpdated(true);
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  // Reset cart updated flag after animation
  useEffect(() => {
    if (cartUpdated) {
      const timer = setTimeout(() => {
        setCartUpdated(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [cartUpdated]);
  
  // Calculate shipping cost
  const shippingCost = total > 100 ? 0 : 10;
  
  // Calculate tax
  const taxRate = 0.1; // 10%
  const taxAmount = total * taxRate;
  
  // Calculate grand total
  const grandTotal = total + shippingCost + taxAmount;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <FiShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center ${
                      cartUpdated ? 'bg-gray-50 transition-colors duration-500' : ''
                    }`}
                  >
                    {/* Product Info - Mobile */}
                    <div className="md:hidden flex">
                      <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <Link 
                          to={`/product/${item.id}`}
                          className="text-lg font-medium hover:text-gray-600"
                        >
                          {item.title}
                        </Link>
                        <div className="text-gray-500 mb-2">${item.price.toFixed(2)}</div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="px-3 py-1 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.id)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="mt-2 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Info - Desktop */}
                    <div className="hidden md:col-span-6 md:flex items-center">
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <Link 
                          to={`/product/${item.id}`}
                          className="text-lg font-medium hover:text-gray-600"
                        >
                          {item.title}
                        </Link>
                        <div className="text-gray-500 text-sm mt-1">
                          {item.category}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center mt-1"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={14} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Price - Desktop */}
                    <div className="hidden md:block md:col-span-2 text-center">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    {/* Quantity - Desktop */}
                    <div className="hidden md:flex md:col-span-2 justify-center">
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Total - Desktop */}
                    <div className="hidden md:block md:col-span-2 text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/products')}
                icon={<FiArrowLeft />}
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleClearCart}
                icon={<FiTrash2 />}
              >
                Clear Cart
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="text-sm text-gray-500 italic">
                    Add ${(100 - total).toFixed(2)} more to qualify for free shipping
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/checkout')}
                fullWidth
                size="large"
              >
                Proceed to Checkout
              </Button>
              
              {/* Secure Checkout Note */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <div className="flex justify-center items-center gap-1 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
                <p>
                  Your payment information is processed securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
