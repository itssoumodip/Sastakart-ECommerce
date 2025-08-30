const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { 
    getGSTSettings, 
    updateGSTSettings, 
    getGSTAnalytics,
    initializeGSTRates 
} = require('../controllers/gstController');

// Log all requests to this router
router.use((req, res, next) => {
    logger.debug(`GST Route: ${req.method} ${req.originalUrl}`);
    next();
});

// Initialize route should be first to ensure it's accessible
router.route('/initialize')
  .post(isAuthenticatedUser, authorizeRoles('admin'), initializeGSTRates);

// Regular routes
router.route('/settings')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getGSTSettings)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateGSTSettings);

router.route('/analytics')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getGSTAnalytics);

// Debug routes
router.post('/test/initialize', initializeGSTRates);
router.get('/test/settings', getGSTSettings);
router.put('/test/settings', updateGSTSettings);
router.get('/test/analytics', getGSTAnalytics);

module.exports = router;
