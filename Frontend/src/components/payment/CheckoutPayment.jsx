import React, { Suspense } from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';
import StripeProvider from './StripeProvider';
import StripePaymentForm from './StripePaymentForm';

const LoadingPaymentForm = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-40 bg-gray-200 rounded"></div>
  </div>
);

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
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <div className="ml-3">
              <span className="flex items-center text-sm font-medium text-gray-900">
                <CreditCard className="w-5 h-5 mr-2" />
                Credit/Debit Card
              </span>
            </div>
          </label>
          
          <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <div className="ml-3">
              <span className="flex items-center text-sm font-medium text-gray-900">
                Cash on Delivery (COD)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Payment Form */}
      {paymentMethod === 'card' && (
        <Suspense fallback={<LoadingPaymentForm />}>
          <StripeProvider>
            <StripePaymentForm
              amount={calculateTotal() * 100} // Convert to cents
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              metadata={{
                shipping_name: shippingData?.name,
                shipping_email: shippingData?.email,
              }}
            />
          </StripeProvider>
        </Suspense>
      )}

      {/* Error Display */}
      {paymentError && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{paymentError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPayment;
