const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { 
    createCoupon, 
    getAllCoupons,
    getCouponById,
    getCouponByCode,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
    recordCouponUsage
} = require('../controllers/couponController');
const logger = require('../utils/logger');

// Log all requests to this router
router.use((req, res, next) => {
    logger.debug(`Coupon Route: ${req.method} ${req.originalUrl}`);
    next();
});

// Admin routes
router.route('/admin/coupons').get(isAuthenticatedUser, authorizeRoles('admin'), getAllCoupons);
router.route('/admin/coupons').post(isAuthenticatedUser, authorizeRoles('admin'), createCoupon);
router.route('/admin/coupons/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getCouponById);
router.route('/admin/coupons/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateCoupon);
router.route('/admin/coupons/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCoupon);

// Debug routes (no auth required)
router.route('/test/coupons').get(getAllCoupons);
router.route('/test/coupons').post(createCoupon);

// Public routes
router.route('/code/:code').get(isAuthenticatedUser, getCouponByCode);
router.route('/apply').post(isAuthenticatedUser, applyCoupon);
router.route('/record-usage').post(isAuthenticatedUser, recordCouponUsage);

module.exports = router;
