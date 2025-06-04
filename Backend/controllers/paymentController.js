const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Order = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new payment => /api/payments/create
exports.createPaymentIntent = catchAsyncErrors(async (req, res, next) => {
  const { amount, currency = 'INR', metadata } = req.body;

  // Validate amount
  if (!amount || isNaN(amount) || amount <= 0) {
    return next(new ErrorHandler('Invalid payment amount', 400));
  }

  // Prevent unrealistically large amounts (set a reasonable maximum)
  if (amount > 10000000) { // 10 million in cents
    return next(new ErrorHandler('Payment amount exceeds maximum allowed', 400));
  }

  try {
    // Create a PaymentIntent with Stripe - amount should already be in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's a valid integer
      currency,
      metadata,
      payment_method_types: ['card'],
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Confirm payment => /api/payments/confirm
exports.confirmPayment = catchAsyncErrors(async (req, res, next) => {
  const { paymentIntentId, paymentMethod } = req.body;

  try {
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Check if payment intent exists and has succeeded
    if (!paymentIntent) {
      return next(new ErrorHandler('Payment not found', 404));
    }

    res.status(200).json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method,
        updated: new Date(paymentIntent.created * 1000)
      }
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Verify payment status => /api/payments/verify/:id
exports.verifyPayment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    // In a real application, this would verify the payment status with the payment gateway
    // Here we're just simulating a payment verification
    
    const paymentStatus = {
      id,
      status: 'succeeded',
      verified: true,
      verifiedAt: Date.now()
    };

    res.status(200).json({
      success: true,
      paymentStatus
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Process refund => /api/payments/refund
exports.processRefund = catchAsyncErrors(async (req, res, next) => {
  const { paymentIntentId, amount, reason } = req.body;

  try {
    // In a real application, this would process a refund with the payment gateway
    // Here we're just simulating a refund
    
    const refund = {
      id: 're_' + Math.random().toString(36).substr(2, 9),
      paymentIntent: paymentIntentId,
      amount,
      status: 'succeeded',
      reason,
      created: Date.now()
    };

    res.status(200).json({
      success: true,
      refund
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get payment methods for user => /api/payments/methods
exports.getPaymentMethods = catchAsyncErrors(async (req, res, next) => {
  try {
    // In a real application, this would fetch saved payment methods from the payment gateway
    // Here we're just returning mock data
    
    const paymentMethods = {
      data: [
        {
          id: 'pm_' + Math.random().toString(36).substr(2, 9),
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          },
          created: Date.now()
        }
      ]
    };

    res.status(200).json({
      success: true,
      paymentMethods: paymentMethods.data
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Handle Stripe webhook events => /api/payments/webhook
exports.stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you can update orders or trigger other actions based on successful payment
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

// Get payment status => /api/payments/:paymentId
exports.getPaymentStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentId);
    
    if (!paymentIntent) {
      return next(new ErrorHandler('Payment not found', 404));
    }

    res.status(200).json({
      success: true,
      status: paymentIntent.status
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
