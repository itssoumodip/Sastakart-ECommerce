const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createProductReview, 
  getProductReviews, 
  deleteReview 
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Define specific routes before parameter routes
router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

// General and parameter routes
router.route('/').get(getProducts).post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.route('/:id').get(getProductById).put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;
