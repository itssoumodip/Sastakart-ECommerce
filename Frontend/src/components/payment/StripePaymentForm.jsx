import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { Lock, CreditCard, AlertTriangle } from 'lucide-react';

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError, metadata = {} }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState(null);
  
  // Create payment intent when component loads
  useEffect(() => {
    const createIntent = async () => {
      try {
        const response = await fetch('/api/payments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ 
            amount, 
            currency: 'INR',
            metadata
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create payment intent');
        }
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setPaymentError(error.message);
        onPaymentError && onPaymentError(error);
        toast.error('Could not initialize payment system. Please try again later.');
      }
    };
    
    if (amount > 0) {
      createIntent();
    }
  }, [amount, metadata]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      
      if (error) {
        setPaymentError(error.message);
        onPaymentError && onPaymentError(error);
        toast.error(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess && onPaymentSuccess(paymentIntent);
        toast.success('Payment successful!');
      } else {
        // Handle other payment intent statuses
        setPaymentError(`Payment status: ${paymentIntent.status}. Please try again.`);
        onPaymentError && onPaymentError(new Error(`Payment status: ${paymentIntent.status}`));
        toast.error(`Payment issue: ${paymentIntent.status}`);
      }
    } catch (error) {
      setPaymentError(error.message);
      onPaymentError && onPaymentError(error);
      toast.error('Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center">
        <Lock className="w-5 h-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Secure Payment</h3>
      </div>
      
      {paymentError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{paymentError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-2">
              <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Enter your card information</span>
            </div>
            <CardElement options={cardElementOptions} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your card information is securely processed by Stripe. We do not store your card details.
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isProcessing || !stripe || !clientSecret}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            `Pay ₹${amount.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default StripePaymentForm;
