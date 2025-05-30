const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserDetails, 
  updateUser, 
  deleteUser,
  getUserProfile,
  updateProfile,
  updatePassword
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// User profile routes
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/profile').put(isAuthenticatedUser, updateProfile);
router.route('/password').put(isAuthenticatedUser, updatePassword);

// Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
