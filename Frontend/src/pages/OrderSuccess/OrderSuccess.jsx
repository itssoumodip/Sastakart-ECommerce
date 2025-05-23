import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/cartSlice';
import { FiCheckCircle } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract order details from location state or use placeholder
  const orderDetails = location.state?.orderDetails || {
    orderId: 'ORD' + Math.floor(Math.random() * 1000000),
    total: 0,
    items: [],
    shippingAddress: {},
  };
  
  useEffect(() => {
    // Fire confetti effect when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Clear the cart after successful order
    dispatch(clearCart());
  }, [dispatch]);
  
  // If no order details and not in development, redirect to home
  useEffect(() => {
    if (!location.state?.orderDetails && process.env.NODE_ENV === 'production') {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <FiCheckCircle className="w-24 h-24 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Your Order was Successful!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for your purchase. Your order has been received.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="flex justify-between border-b pb-4 mb-4">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderDetails.orderId}</span>
          </div>
          
          <div className="flex justify-between border-b pb-4 mb-4">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="flex justify-between border-b pb-4 mb-4">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{orderDetails.email || 'customer@example.com'}</span>
          </div>
          
          <div className="flex justify-between border-b pb-4 mb-4">
            <span className="text-gray-600">Shipping Address:</span>
            <span className="font-medium text-right">
              {orderDetails.shippingAddress.street || '123 Main St'}<br />
              {orderDetails.shippingAddress.city || 'Anytown'}, 
              {orderDetails.shippingAddress.state || 'ST'} 
              {orderDetails.shippingAddress.zipCode || '12345'}
            </span>
          </div>
          
          <div className="flex justify-between border-b pb-4 mb-4">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{orderDetails.paymentMethod || 'Credit Card'}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${orderDetails.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/profile">
            <Button variant="outline" className="w-full sm:w-auto">
              View Order History
            </Button>
          </Link>
          
          <Link to="/products">
            <Button variant="primary" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
