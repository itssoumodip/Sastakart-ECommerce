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

  // Handle COD orders differently
  const orderData = {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    user: req.user._id
  };

  if (paymentMethod === 'cod') {
    orderData.paymentInfo = {
      id: 'COD_' + Date.now(),
      status: 'pending'
    };
    orderData.orderStatus = 'COD Pending';
    orderData.codAmount = totalPrice;
    // Don't set paidAt for COD orders
  } else {
    orderData.paymentInfo = paymentInfo;
    orderData.paidAt = Date.now();
    orderData.orderStatus = 'Processing';
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
  const orders = await Order.find();

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

  if (order.orderStatus === 'COD Collected') {
    return next(new ErrorHandler('COD has already been collected for this order', 400));
  }

  order.orderStatus = 'COD Collected';
  order.codCollectedAt = Date.now();
  order.paymentInfo.status = 'succeeded';

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'COD payment collected successfully'
  });
});

// Get COD analytics - ADMIN => /api/admin/orders/cod-analytics
exports.getCODAnalytics = catchAsyncErrors(async (req, res, next) => {
  const codOrders = await Order.find({ paymentMethod: 'cod' });
  
  const analytics = {
    totalCODOrders: codOrders.length,
    pendingCOD: codOrders.filter(order => order.orderStatus === 'COD Pending').length,
    collectedCOD: codOrders.filter(order => order.orderStatus === 'COD Collected').length,
    totalCODAmount: codOrders.reduce((sum, order) => sum + order.totalPrice, 0),
    collectedCODAmount: codOrders
      .filter(order => order.orderStatus === 'COD Collected')
      .reduce((sum, order) => sum + order.totalPrice, 0),
    pendingCODAmount: codOrders
      .filter(order => order.orderStatus === 'COD Pending')
      .reduce((sum, order) => sum + order.totalPrice, 0)
  };

  res.status(200).json({
    success: true,
    analytics
  });
});
