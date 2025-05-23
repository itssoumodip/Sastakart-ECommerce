const express = require('express');
const router = express.Router();

const {
  createPaymentIntent,
  confirmPayment,
  verifyPayment,
  processRefund,
  getPaymentMethods
} = require('../controllers/paymentController');

const { isAuthenticatedUser } = require('../middleware/auth');

// Payment routes
router.route('/create').post(isAuthenticatedUser, createPaymentIntent);
router.route('/confirm').post(isAuthenticatedUser, confirmPayment);
router.route('/verify/:id').get(isAuthenticatedUser, verifyPayment);
router.route('/refund').post(isAuthenticatedUser, processRefund);
router.route('/methods').get(isAuthenticatedUser, getPaymentMethods);

module.exports = router;
