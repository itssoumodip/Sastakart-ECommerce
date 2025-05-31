import React from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';
import StripeProvider from './StripeProvider';
import StripePaymentForm from './StripePaymentForm';

const CheckoutPayment = ({ 
  paymentMethod, 
  setPaymentMethod, 
  paymentError, 
  calculateTotal, 
  handlePaymentSuccess, 
  handlePaymentError,
  shippingData
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Information</h2>
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Payment Method
        </label>
        <div className="grid grid-cols-1 gap-3">
          <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className={`w-4 h-4 border-2 rounded-full mr-3 ${
              paymentMethod === 'card' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
            }`}>
              {paymentMethod === 'card' && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
              )}
            </div>
            <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
            <span className="font-medium">Credit Card</span>
          </label>
        </div>
      </div>

      {/* Payment Error Display */}
      {paymentError && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-600">{paymentError}</p>
          </div>
        </div>
      )}

      {/* Stripe Payment Form */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <StripeProvider>
          <StripePaymentForm 
            amount={calculateTotal()} 
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            metadata={{
              customerEmail: shippingData.email,
              customerName: `${shippingData.firstName} ${shippingData.lastName}`
            }}
          />
        </StripeProvider>
      </div>
    </div>
  );
};

export default CheckoutPayment;
