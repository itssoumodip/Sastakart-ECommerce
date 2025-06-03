import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeProvider = ({ children }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verify Stripe initialization
    stripePromise.catch(err => {
      console.error('Stripe initialization error:', err);
      setError(err.message);
    });
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        <p>Payment system error: {error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  const options = {
    locale: 'auto',
    appearance: {
      theme: 'stripe'
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
