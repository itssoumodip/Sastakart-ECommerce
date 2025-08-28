const express = require('express');
const router = express.Router();

// Route to check the path mapping
router.get('/routes', (req, res) => {
  res.json({
    success: true,
    message: 'Debug routes are working',
    routes: {
      coupons: {
        admin: '/api/coupons/admin/coupons',
        apply: '/api/coupons/apply',
        verify: '/api/coupons/code/:code',
      },
      gst: {
        settings: '/api/gst/settings',
        analytics: '/api/gst/analytics',
      }
    }
  });
});

// Route to check coupon model
router.get('/coupons', async (req, res) => {
  try {
    const Coupon = require('../models/coupon');
    const count = await Coupon.countDocuments();
    
    res.json({
      success: true,
      message: 'Coupon model is working',
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accessing coupon model',
      error: error.message,
    });
  }
});

// Route to check authentication
router.get('/auth', (req, res) => {
  res.json({
    success: true,
    message: 'Auth debug route is working',
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      cookie: req.headers.cookie ? 'Present' : 'Missing',
    },
    cookies: req.cookies || {},
  });
});

module.exports = router;
