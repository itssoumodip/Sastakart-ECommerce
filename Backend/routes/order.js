const express = require('express');
const router = express.Router();
const { 
  newOrder, 
  getSingleOrder, 
  myOrders, 
  getAllOrders, 
  updateOrder, 
  deleteOrder,
  collectCOD,
  getCODAnalytics,
  getAdminOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route('/').post(isAuthenticatedUser, newOrder);
router.route('/me').get(isAuthenticatedUser, myOrders);
router.route('/:id').get(isAuthenticatedUser, getSingleOrder)
router.route('/:id/cancel').put(isAuthenticatedUser, cancelOrder);

// Admin routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/orders/cod-analytics').get(isAuthenticatedUser, authorizeRoles('admin'), getCODAnalytics);
router.route('/admin/order/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminOrder)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);
router.route('/admin/order/:id/status').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);
router.route('/admin/order/:id/collect-cod').put(isAuthenticatedUser, authorizeRoles('admin'), collectCOD);

module.exports = router;
