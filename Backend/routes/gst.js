const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { getGSTSettings, updateGSTSettings, getGSTAnalytics } = require('../controllers/gstController');

// GST Management Routes
router.route('/settings').get(isAuthenticatedUser, authorizeRoles('admin'), getGSTSettings);
router.route('/settings').put(isAuthenticatedUser, authorizeRoles('admin'), updateGSTSettings);
router.route('/analytics').get(isAuthenticatedUser, authorizeRoles('admin'), getGSTAnalytics);

module.exports = router;
