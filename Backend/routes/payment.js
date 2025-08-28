const express = require('express');
const router = express.Router();

const {
  createOrderPayment,
  paymentCallback,
  checkOrderPaymentStatus,
  processRefund,
  saveOrder,
  getPaymentMethods
} = require('../controllers/paymentController');

const { isAuthenticatedUser } = require('../middleware/auth');

// PhonePe Payment routes
router.route('/create').post(isAuthenticatedUser, createOrderPayment);
router.route('/callback').post(paymentCallback);
router.route('/status/:merchantTransactionId').get(isAuthenticatedUser, checkOrderPaymentStatus);
router.route('/refund').post(isAuthenticatedUser, processRefund);
router.route('/save-order').post(isAuthenticatedUser, saveOrder);
router.route('/methods').get(isAuthenticatedUser, getPaymentMethods);

module.exports = router;
