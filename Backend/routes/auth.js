const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  forgotPassword, 
  resetPassword, 
  getUserProfile, 
  updatePassword, 
  updateProfile,
  googleCallback,
  verifyGoogleToken
} = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

// Google Auth routes
router.route('/google/login').get(
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.route('/google/callback').get(
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

// Handle Google token verification from frontend
router.route('/google/verify-token').post(verifyGoogleToken);

module.exports = router;
