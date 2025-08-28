const Coupon = require('../models/coupon');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/product');

// Create a new coupon
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
    const {
        code, description, discountType, discountValue, 
        minPurchase, maxDiscount, validFrom, validUntil, 
        usageLimit, applicableProducts, applicableCategories, isActive
    } = req.body;

    // Validation
    if (!code || !description || !discountType || !discountValue) {
        return next(new ErrorHandler('Please provide all required coupon details', 400));
    }

    // Check for duplicate coupon code
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
        return next(new ErrorHandler('A coupon with this code already exists', 400));
    }

    // Create coupon
    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minPurchase: minPurchase || 0,
        maxDiscount: maxDiscount || null,
        validFrom: validFrom || Date.now(),
        validUntil,
        usageLimit: usageLimit || null,
        applicableProducts: applicableProducts || [],
        applicableCategories: applicableCategories || [],
        isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
        success: true,
        coupon
    });
});

// Get all coupons
exports.getAllCoupons = catchAsyncErrors(async (req, res, next) => {
    const coupons = await Coupon.find();

    res.status(200).json({
        success: true,
        count: coupons.length,
        coupons
    });
});

// Get single coupon by ID
exports.getCouponById = catchAsyncErrors(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        return next(new ErrorHandler('Coupon not found', 404));
    }

    res.status(200).json({
        success: true,
        coupon
    });
});

// Get coupon by code
exports.getCouponByCode = catchAsyncErrors(async (req, res, next) => {
    const { code } = req.params;
    
    const coupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
    });

    if (!coupon) {
        return next(new ErrorHandler('Invalid or expired coupon code', 404));
    }

    // Check if usage limit is reached
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
        return next(new ErrorHandler('This coupon has reached its usage limit', 400));
    }

    res.status(200).json({
        success: true,
        coupon
    });
});

// Update coupon
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {
    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        return next(new ErrorHandler('Coupon not found', 404));
    }

    // Prevent updating the coupon code
    if (req.body.code && req.body.code.toUpperCase() !== coupon.code) {
        return next(new ErrorHandler('Coupon code cannot be updated', 400));
    }

    coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        coupon
    });
});

// Delete coupon
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        return next(new ErrorHandler('Coupon not found', 404));
    }

    await coupon.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });
});

// Apply coupon to cart
exports.applyCoupon = catchAsyncErrors(async (req, res, next) => {
    const { code, cartItems, cartTotal } = req.body;
    
    if (!code || !cartItems || cartTotal === undefined) {
        return next(new ErrorHandler('Please provide coupon code, cart items and cart total', 400));
    }

    // Find valid coupon
    const coupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
    });

    if (!coupon) {
        return next(new ErrorHandler('Invalid or expired coupon code', 404));
    }

    // Check if usage limit is reached
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
        return next(new ErrorHandler('This coupon has reached its usage limit', 400));
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
        return next(new ErrorHandler(`Minimum purchase of ₹${coupon.minPurchase} required for this coupon`, 400));
    }

    // Calculate discount
    let discountAmount = 0;
    const GST_RATE = 0.18; // 18% GST
    
    if (coupon.discountType === 'percentage') {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        // Apply max discount if set
        if (coupon.maxDiscount !== null && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
        
        // For 100% discount, ensure everything is 0
        if (coupon.discountValue >= 100) {
            discountAmount = cartTotal;
        }
    } else {
        discountAmount = coupon.discountValue;
        // Ensure discount doesn't exceed cart total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;
    const discountedSubtotal = cartTotal - discountAmount;
    
    // Calculate GST on discounted amount (0 if full discount)
    const gstAmount = discountedSubtotal === 0 ? 0 : Math.round(discountedSubtotal * GST_RATE * 100) / 100;
    const finalTotal = discountedSubtotal + gstAmount;

    // Calculate discount percentage for display
    const effectiveDiscountPercentage = Math.round((discountAmount / cartTotal) * 100);

    res.status(200).json({
        success: true,
        couponApplied: true,
        couponCode: coupon.code,
        discountAmount,
        originalTotal: cartTotal,
        discountedSubtotal,
        gstAmount,
        finalTotal,
        effectiveDiscountPercentage,
        couponDetails: {
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        }
    });
});

// Record coupon usage
exports.recordCouponUsage = catchAsyncErrors(async (req, res, next) => {
    const { code } = req.body;
    
    if (!code) {
        return next(new ErrorHandler('Please provide coupon code', 400));
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
        return next(new ErrorHandler('Coupon not found', 404));
    }

    // Increment usage count
    coupon.usageCount += 1;
    await coupon.save();

    res.status(200).json({
        success: true,
        message: 'Coupon usage recorded successfully'
    });
});
