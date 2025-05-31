const express = require('express');
const router = express.Router();

const {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
  getPaymentStatus
} = require('../controllers/paymentController');

const { isAuthenticatedUser } = require('../middleware/auth');

// Payment routes
router.route('/create').post(isAuthenticatedUser, createPaymentIntent);
router.route('/confirm').post(isAuthenticatedUser, confirmPayment);
router.route('/webhook').post(express.raw({ type: 'application/json' }), stripeWebhook);
router.route('/:paymentId').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;
