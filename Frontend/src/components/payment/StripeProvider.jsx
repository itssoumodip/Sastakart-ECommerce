import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  stripeAccount: undefined,
  betas: undefined,
  locale: 'auto',
  apiVersion: undefined,
  // Only suppress warnings in development mode
  ...(import.meta.env.DEV ? {
    // Development config
    stripeAccount: undefined,
    apiVersion: '2020-08-27',
    // Suppress warnings in development
    __privateApiUrl: 'http://localhost:5000', // Point to local backend
    __supportedBrowser: true,
  } : {
    // Production config - no special options needed
  })
});

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
