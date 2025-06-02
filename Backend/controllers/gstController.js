const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/product');

// Get GST settings
exports.getGSTSettings = catchAsyncErrors(async (req, res, next) => {
    // Get GST rates from products
    const products = await Product.find();
    const gstRates = {};
    const exemptCategories = [];
    
    products.forEach(product => { 
        if (product.gstRate === 0) {
            exemptCategories.push(product.category);
        }
        gstRates[product.category] = product.gstRate || 0;
    });

    res.status(200).json({
        success: true,
        settings: {
            defaultRate: 18,
            exemptCategories: [...new Set(exemptCategories)],
            rates: gstRates
        }
    });
});

// Update GST settings
exports.updateGSTSettings = catchAsyncErrors(async (req, res, next) => {
    const { category, rate } = req.body;

    if (!category || rate === undefined) {
        return next(new ErrorHandler('Category and rate are required', 400));
    }

    // Update GST rate for all products in the category
    await Product.updateMany(
        { category: category },
        { $set: { gstRate: rate } }
    );

    res.status(200).json({
        success: true,
        message: `GST rate updated for category: ${category}`
    });
});

// Get GST analytics
exports.getGSTAnalytics = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    
    let totalGstCollected = 0;
    let monthlyGst = 0;
    let yearlyGst = 0;
    let exemptOrders = 0;

    // Calculate totals
    products.forEach(product => {
        const gstAmount = (product.price * (product.gstRate || 0)) / 100;
        totalGstCollected += gstAmount;

        // Monthly (assuming last 30 days)
        if (product.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
            monthlyGst += gstAmount;
        }

        // Yearly (assuming last 365 days)
        if (product.updatedAt > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) {
            yearlyGst += gstAmount;
        }

        // Exempt orders
        if (product.gstRate === 0) {
            exemptOrders++;
        }
    });

    res.status(200).json({
        success: true,
        analytics: {
            totalGstCollected,
            monthlyGst,
            yearlyGst,
            exemptOrders
        }
    });
});
