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

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.route('/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.route('/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(isAuthenticatedUser, getProductReviews);
router.route('/reviews').delete(isAuthenticatedUser, deleteReview);

module.exports = router;
