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
  paymentError, 
  calculateTotal, 
  handlePaymentSuccess, 
  handlePaymentError,
  shippingData
}) => {  // Format total amount for display
  const formattedTotal = typeof calculateTotal === 'function' ? 
    calculateTotal().toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) : '0.00';
    
  return (
    <div>
      {/* No duplicate payment method selection here */}

      {/* Payment Form */}
      {paymentMethod === 'card' && (
        <Suspense fallback={<LoadingPaymentForm />}>
          <StripeProvider>          <StripePaymentForm
            amount={Math.round(calculateTotal() * 100)} // Convert to cents and round to avoid floating point issues
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
