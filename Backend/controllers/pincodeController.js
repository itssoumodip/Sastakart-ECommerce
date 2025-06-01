const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Mock pincode data - In production, this would be from a database
const serviceablePincodes = new Set([
  // Major Indian cities and their pincodes
  '110001', '110002', '110003', '110004', '110005', // Delhi
  '400001', '400002', '400003', '400004', '400005', // Mumbai
  '560001', '560002', '560003', '560004', '560005', // Bangalore
  '600001', '600002', '600003', '600004', '600005', // Chennai
  '700001', '700002', '700003', '700004', '700005', // Kolkata
  '500001', '500002', '500003', '500004', '500005', // Hyderabad
  '411001', '411002', '411003', '411004', '411005', // Pune
  '380001', '380002', '380003', '380004', '380005', // Ahmedabad
  '302001', '302002', '302003', '302004', '302005', // Jaipur
  '226001', '226002', '226003', '226004', '226005', // Lucknow
  // Add more pincodes as needed
]);

// Check pincode serviceability => /api/pincode/check/:pincode
exports.checkPincode = catchAsyncErrors(async (req, res, next) => {
  const { pincode } = req.params;
  
  if (!pincode || pincode.length !== 6) {
    return next(new ErrorHandler('Please provide a valid 6-digit pincode', 400));
  }
  
  const isServiceable = serviceablePincodes.has(pincode);
  
  const estimatedDelivery = isServiceable ? 
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : // 3 days for serviceable areas
    null;
  
  res.status(200).json({
    success: true,
    pincode,
    isServiceable,
    estimatedDelivery,
    message: isServiceable ? 
      'Delivery available in your area!' : 
      'Sorry, we don\'t deliver to this pincode yet.'
  });
});

// Get all serviceable pincodes - ADMIN => /api/admin/pincodes
exports.getServiceablePincodes = catchAsyncErrors(async (req, res, next) => {
  const pincodes = Array.from(serviceablePincodes);
  
  res.status(200).json({
    success: true,
    total: pincodes.length,
    pincodes
  });
});

// Add pincode to serviceable list - ADMIN => /api/admin/pincodes/add
exports.addServiceablePincode = catchAsyncErrors(async (req, res, next) => {
  const { pincode } = req.body;
  
  if (!pincode || pincode.length !== 6) {
    return next(new ErrorHandler('Please provide a valid 6-digit pincode', 400));
  }
  
  if (serviceablePincodes.has(pincode)) {
    return next(new ErrorHandler('Pincode is already serviceable', 400));
  }
  
  serviceablePincodes.add(pincode);
  
  res.status(200).json({
    success: true,
    message: `Pincode ${pincode} added to serviceable areas`
  });
});

// Remove pincode from serviceable list - ADMIN => /api/admin/pincodes/remove
exports.removeServiceablePincode = catchAsyncErrors(async (req, res, next) => {
  const { pincode } = req.body;
  
  if (!pincode || pincode.length !== 6) {
    return next(new ErrorHandler('Please provide a valid 6-digit pincode', 400));
  }
  
  if (!serviceablePincodes.has(pincode)) {
    return next(new ErrorHandler('Pincode is not in serviceable areas', 400));
  }
  
  serviceablePincodes.delete(pincode);
  
  res.status(200).json({
    success: true,
    message: `Pincode ${pincode} removed from serviceable areas`
  });
});

// Get pincode analytics - ADMIN => /api/admin/pincodes/analytics
exports.getPincodeAnalytics = catchAsyncErrors(async (req, res, next) => {
  // In production, this would analyze actual order data
  const analytics = {
    totalServiceablePincodes: serviceablePincodes.size,
    topServiceableCities: [
      { city: 'Delhi', pincodes: 5, orders: 150 },
      { city: 'Mumbai', pincodes: 5, orders: 120 },
      { city: 'Bangalore', pincodes: 5, orders: 100 },
      { city: 'Chennai', pincodes: 5, orders: 80 },
      { city: 'Kolkata', pincodes: 5, orders: 70 }
    ],
    coveragePercentage: 75.5,
    newPincodesThisMonth: 12
  };
  
  res.status(200).json({
    success: true,
    analytics
  });
});
