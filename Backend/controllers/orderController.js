const Order = require('../models/order');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Create new order => /api/orders
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paymentMethod = 'card'
  } = req.body;

  // Calculate GST for each order item and create GST summary
  const categoryWiseGst = new Map();
  let totalGstAmount = 0;

  // Fetch product details to get actual GST rates
  const products = await Product.find({
    _id: { $in: orderItems.map(item => item.product) }
  });

  const enrichedOrderItems = orderItems.map(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    const gstRate = product.gstRate || 18; // Default 18% if not set
    const gstAmount = (item.price * item.quantity * gstRate) / 100;
    
    // Accumulate category-wise GST
    const currentCategoryGst = categoryWiseGst.get(product.category) || 0;
    categoryWiseGst.set(product.category, currentCategoryGst + gstAmount);
    totalGstAmount += gstAmount;

    return {
      ...item,
      gstRate,
      gstAmount
    };
  });
  // Generate a unique invoice number
  const invoiceNumber = `INV${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Handle COD orders differently
  const orderData = {
    orderItems: enrichedOrderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    user: req.user._id,
    gstSummary: {
      totalGstAmount,
      categoryWiseGst: Object.fromEntries(categoryWiseGst),
      invoiceNumber
    }
  };
  if (paymentMethod === 'cod') {
    orderData.paymentInfo = {
      id: 'COD_' + Date.now(),
      status: 'pending'
    };
    orderData.orderStatus = 'COD_Pending';
    orderData.codAmount = totalPrice;
    orderData.statusHistory = [{
      status: 'COD_Pending',
      note: 'Order placed with Cash on Delivery payment method',
      timestamp: new Date(),
      updatedBy: req.user._id
    }];
  } else {
    orderData.paymentInfo = paymentInfo;
    orderData.paidAt = Date.now();
    orderData.orderStatus = 'Processing';
    orderData.statusHistory = [{
      status: 'Processing',
      note: 'Order placed and payment confirmed',
      timestamp: new Date(),
      updatedBy: req.user._id
    }];
  }

  const order = await Order.create(orderData);

  res.status(200).json({
    success: true,
    order
  });
});

// Get single order => /api/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

// Get logged in user orders => /api/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders
  });
});

// Get all orders - ADMIN => /api/admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email');

  let totalAmount = 0;

  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  }); 
});

// Update / Process order - ADMIN => /api/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400));
  }

  order.orderItems.forEach(async item => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

// Delete order => /api/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true
  });
});

// Collect COD payment - ADMIN => /api/admin/order/:id/collect-cod
exports.collectCOD = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  if (order.paymentMethod !== 'cod') {
    return next(new ErrorHandler('This is not a COD order', 400));
  }

  if (order.orderStatus === 'COD_Collected') {
    return next(new ErrorHandler('COD has already been collected for this order', 400));
  }

  order.orderStatus = 'COD_Collected';
  order.codCollectedAt = Date.now();
  order.paymentInfo.status = 'succeeded';

  // Add to status history
  order.statusHistory.push({
    status: 'COD_Collected',
    note: 'Cash on Delivery payment collected successfully',
    timestamp: new Date(),
    updatedBy: req.user._id
  });

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'COD payment collected successfully',
    order
  });
});

// Get COD analytics - ADMIN => /api/admin/orders/cod-analytics
exports.getCODAnalytics = catchAsyncErrors(async (req, res, next) => {
  const codOrders = await Order.find({ paymentMethod: 'cod' });
  
  const analytics = {
    totalCODOrders: codOrders.length,
    pendingCOD: codOrders.filter(order => order.orderStatus === 'COD_Pending').length,
    collectedCOD: codOrders.filter(order => order.orderStatus === 'COD_Collected').length,
    totalCODAmount: codOrders.reduce((sum, order) => sum + order.totalPrice, 0),
    collectedCODAmount: codOrders
      .filter(order => order.orderStatus === 'COD_Collected')
      .reduce((sum, order) => sum + order.totalPrice, 0),
    pendingCODAmount: codOrders
      .filter(order => order.orderStatus === 'COD_Pending')
      .reduce((sum, order) => sum + order.totalPrice, 0)
  };

  res.status(200).json({
    success: true,
    analytics
  });
});

// Get single order for admin with full details => /api/admin/order/:id
exports.getAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name');

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

// Update order status with history tracking => /api/admin/order/:id/status
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status, note } = req.body;
  
  if (!status || !note) {
    return next(new ErrorHandler('Status and note are required', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Cannot update status of delivered order', 400));
  }

  if (order.orderStatus === 'Cancelled') {
    return next(new ErrorHandler('Cannot update status of cancelled order', 400));
  }

  // Update order status
  order.orderStatus = status;

  // Add to status history
  order.statusHistory.push({
    status: status,
    note: note,
    timestamp: new Date(),
    updatedBy: req.user._id
  });

  // Update specific fields based on status
  if (status === 'Delivered') {
    order.deliveredAt = Date.now();
    
    // Update stock for delivered orders
    order.orderItems.forEach(async item => {
      await updateStock(item.product, item.quantity);
    });
  }

  if (status === 'COD_Collected') {
    order.codCollectedAt = Date.now();
    order.paymentInfo.status = 'succeeded';
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order
  });
});
