const express = require('express');
const router = express.Router();

const { uploadProductImages } = require('../controllers/imageUploadController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.post(
  '/products/upload',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  uploadProductImages
);

module.exports = router;
