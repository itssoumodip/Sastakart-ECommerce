const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { getGSTSettings, updateGSTSettings, getGSTAnalytics } = require('../controllers/gstController');

// Log all requests to this router
router.use((req, res, next) => {
    console.log(`GST Route: ${req.method} ${req.originalUrl}`);
    next();
});

// Debug routes (no auth required) - must be defined BEFORE authenticated routes
router.route('/test/settings').get(getGSTSettings).put(updateGSTSettings);
router.route('/test/analytics').get(getGSTAnalytics);

// GST Management Routes
router.route('/settings').get(isAuthenticatedUser, authorizeRoles('admin'), getGSTSettings);
router.route('/settings').put(isAuthenticatedUser, authorizeRoles('admin'), updateGSTSettings);
router.route('/analytics').get(isAuthenticatedUser, authorizeRoles('admin'), getGSTAnalytics);

module.exports = router;
