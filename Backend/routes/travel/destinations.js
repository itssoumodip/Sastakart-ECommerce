const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');
const {
  getAllDestinations,
  getPopularDestinations,
  getDestinationsByCategory,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  addReview,
  updateReview,
  deleteReview
} = require('../../controllers/travel/destinationController');

// Public routes
router.route('/destinations').get(getAllDestinations);
router.route('/destinations/popular').get(getPopularDestinations);
router.route('/destinations/category/:category').get(getDestinationsByCategory);
router.route('/destinations/:id').get(getDestination);

// Protected routes
router.route('/destinations').post(isAuthenticatedUser, authorizeRoles('admin'), createDestination);
router.route('/destinations/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateDestination)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteDestination);

// Review routes
router.route('/destinations/:id/reviews')
  .post(isAuthenticatedUser, addReview)
  .put(isAuthenticatedUser, updateReview)
  .delete(isAuthenticatedUser, deleteReview);

// Test routes (no authentication for development)
router.route('/test/destinations').get(getAllDestinations);
router.route('/test/destinations/popular').get(getPopularDestinations);
router.route('/test/destinations').post(createDestination);

module.exports = router;
