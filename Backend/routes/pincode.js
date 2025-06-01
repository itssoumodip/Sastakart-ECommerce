const express = require('express');
const router = express.Router();
const { 
  checkPincode, 
  getServiceablePincodes, 
  addServiceablePincode, 
  removeServiceablePincode,
  getPincodeAnalytics
} = require('../controllers/pincodeController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.route('/check/:pincode').get(checkPincode);

// Admin routes
router.route('/admin/pincodes').get(isAuthenticatedUser, authorizeRoles('admin'), getServiceablePincodes);
router.route('/admin/pincodes/add').post(isAuthenticatedUser, authorizeRoles('admin'), addServiceablePincode);
router.route('/admin/pincodes/remove').delete(isAuthenticatedUser, authorizeRoles('admin'), removeServiceablePincode);
router.route('/admin/pincodes/analytics').get(isAuthenticatedUser, authorizeRoles('admin'), getPincodeAnalytics);

module.exports = router;
