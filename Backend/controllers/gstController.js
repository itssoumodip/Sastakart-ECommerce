const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/product');
const GSTRate = require('../models/gstRate');

// Initialize GST rates for all categories
exports.initializeGSTRates = catchAsyncErrors(async (req, res, next) => {
    const categories = [
        'Electronics',
        'Clothing',
        'Home & Kitchen',
        'Beauty & Personal Care',
        'Books',
        'Sports & Outdoors',
        'Toys & Games',
        'Health & Wellness',
        'Jewelry',
        'Automotive',
        'Others'
    ];

    // Create default GST rates for all categories if they don't exist
    for (const category of categories) {
        await GSTRate.findOneAndUpdate(
            { category },
            { category, rate: 18 }, // Default 18% GST
            { upsert: true, new: true }
        );
    }

    res.status(200).json({
        success: true,
        message: 'GST rates initialized for all categories'
    });
});

// Get GST settings
exports.getGSTSettings = catchAsyncErrors(async (req, res, next) => {
    const gstRates = await GSTRate.find();
    
    const ratesByCategory = {};
    const exemptCategories = [];
    
    gstRates.forEach(rate => {
        ratesByCategory[rate.category] = rate.rate;
        if (rate.rate === 0) {
            exemptCategories.push(rate.category);
        }
    });

    res.status(200).json({
        success: true,
        settings: {
            defaultRate: 18,
            exemptCategories,
            rates: ratesByCategory
        }
    });
});

// Update GST settings
exports.updateGSTSettings = catchAsyncErrors(async (req, res, next) => {
    console.log('Updating GST Settings:', req.body);
    const { category, rate } = req.body;

    if (!category || rate === undefined) {
        console.error('Missing required fields:', { category, rate });
        return next(new ErrorHandler('Category and rate are required', 400));
    }

    try {
        // Update GST rate in GSTRate collection
        const gstRate = await GSTRate.findOneAndUpdate(
            { category },
            { rate, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

        // Update products with new GST rate
        await Product.updateMany(
            { category },
            { $set: { gstRate: rate } }
        );

        res.status(200).json({
            success: true,
            message: `GST rate updated for category: ${category}`,
            gstRate
        });
    } catch (error) {
        console.error('Error updating GST rate:', error);
        return next(new ErrorHandler('Error updating GST rate', 500));
    }
});

// Get GST analytics
exports.getGSTAnalytics = catchAsyncErrors(async (req, res, next) => {
    const gstRates = await GSTRate.find();
    const products = await Product.find();
    
    let totalGstCollected = 0;
    let monthlyGst = 0;
    let yearlyGst = 0;
    let exemptCategories = 0;

    // Count exempt categories
    gstRates.forEach(rate => {
        if (rate.rate === 0) {
            exemptCategories++;
        }
    });

    // Calculate GST amounts
    products.forEach(product => {
        const gstRate = gstRates.find(rate => rate.category === product.category)?.rate || 18;
        const gstAmount = (product.price * gstRate) / 100;
        
        totalGstCollected += gstAmount;

        // Monthly (last 30 days)
        if (product.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
            monthlyGst += gstAmount;
        }

        // Yearly (last 365 days)
        if (product.updatedAt > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) {
            yearlyGst += gstAmount;
        }
    });

    res.status(200).json({
        success: true,
        analytics: {
            totalGstCollected,
            monthlyGst,
            yearlyGst,
            exemptCategories,
            totalCategories: gstRates.length
        }
    });
});
