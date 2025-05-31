const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route('/stats').get(isAuthenticatedUser, authorizeRoles('admin'), getDashboardStats);

module.exports = router;
