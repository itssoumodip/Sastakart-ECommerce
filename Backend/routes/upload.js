const express = require('express');
const router = express.Router();

const { uploadProductImages, testAuth } = require('../controllers/imageUploadController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Test route for authentication
router.get('/test', isAuthenticatedUser, testAuth);

// Product image upload route
router.post(
  '/products/upload',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  uploadProductImages
);

module.exports = router;
