import React, { Suspense } from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';
import PhonePePayment from './PhonePePayment';

const LoadingPaymentForm = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-40 bg-gray-200 rounded"></div>
  </div>
);

const CheckoutPayment = ({ 
  paymentMethod, 
  paymentError, 
  calculateTotal, 
  handlePaymentSuccess, 
  handlePaymentError,
  shippingData,
  authToken // Add authToken parameter
}) => {  
  // Format total amount for display
  const formattedTotal = typeof calculateTotal === 'function' ? 
    calculateTotal().toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) : '0.00';
    

    
  return (
    <div>
      {/* No duplicate payment method selection here */}

      {/* Payment Form */}
      {paymentMethod === 'phonepe' && (
        <Suspense fallback={<LoadingPaymentForm />}>
          <PhonePePayment
            amount={calculateTotal()} // Total amount in rupees
            onPaymentInitiated={(orderId) => {

              // You can store orderId in localStorage/sessionStorage here if needed
            }}
            onPaymentError={handlePaymentError}
            metadata={{
              shipping_name: `${shippingData?.firstName} ${shippingData?.lastName}`,
              shipping_email: shippingData?.email,
            }}
            shippingData={shippingData}
            authToken={authToken} // Pass down the auth token directly
          />
        </Suspense>
      )}

      {/* COD option */}
      {paymentMethod === 'cod' && (
        <div className="mt-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center mb-2">
            <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium">Cash on Delivery</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Pay with cash when your order is delivered.
          </p>
          <button
            onClick={() => handlePaymentSuccess({ paymentMethod: 'cod' })}
            className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Place Order - ₹{formattedTotal}
          </button>
        </div>
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
