const Order = require('../models/order');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const emailService = require('../utils/emailService');

// Create new order => /api/orders
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { 
    orderItems, 
    shippingInfo, 
    paymentInfo, 
    paymentMethod,
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;

  // Validate total price to prevent unrealistic values
  if (totalPrice > 1000000) {
    return next(new ErrorHandler('Invalid order total amount', 400));
  }

  // Calculate total GST based on order items
  let totalGstAmount = 0;
  let categoryWiseGst = new Map();

  const enrichedOrderItems = orderItems.map(item => {
    // Calculate GST for each item if applicable
    const itemGst = item.price * item.quantity * 0.18; // Assuming 18% GST
    totalGstAmount += itemGst;
    
    // Track GST by category
    if (item.category) {
      const currentAmount = categoryWiseGst.get(item.category) || 0;
      categoryWiseGst.set(item.category, currentAmount + itemGst);
    }
    
    return {
      ...item,
      gst: itemGst
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
    orderData.orderStatus = 'COD_Pending';
    orderData.codAmount = totalPrice;
    orderData.statusHistory = [{
      status: 'COD_Pending',
      note: 'Order placed with Cash on Delivery payment method',
      timestamp: new Date(),
      updatedBy: req.user._id
    }];
  } else {
    // Ensure paymentInfo exists and has proper structure
    if (!paymentInfo || !paymentInfo.id || !paymentInfo.status) {
      return next(new ErrorHandler('Payment information is required', 400));
    }
    
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

  // Fetch user details to get email
  const userPopulatedOrder = await Order.findById(order._id).populate('user', 'name email');
  
  try {
    // Send order confirmation email
    await emailService.sendOrderConfirmationEmail({
      to: userPopulatedOrder.user.email,
      order: {
        id: order._id,
        createdAt: order.createdAt,
        total: order.totalPrice,
        user: {
          name: userPopulatedOrder.user.name || 'Customer'
        },
        items: order.orderItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: order.shippingInfo.address,
          city: order.shippingInfo.city,
          state: order.shippingInfo.state,
          zipCode: order.shippingInfo.postalCode,
          country: order.shippingInfo.country
        }
      }
    });
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError);
    // Don't fail the order creation if email sending fails
    // We'll just log the error and continue
  }

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

  // Populate user information to get email address
  const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

  // Send email notification about status change
  try {
    // If it's out for delivery status
    if (req.body.status === 'Shipped' || req.body.status === 'Out For Delivery') {
      const trackingInfo = {
        trackingNumber: req.body.note.includes('tracking:') ? req.body.note.split('tracking:')[1].trim() : 'N/A',
        carrier: 'Our Delivery Partner',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 3 days from now
        trackingUrl: req.body.note.includes('http') ? req.body.note.match(/(https?:\/\/[^\s]+)/g)[0] : null
      };

      await emailService.sendShippingConfirmationEmail({
        to: populatedOrder.user.email,
        order: {
          id: order._id,
          user: {
            name: populatedOrder.user.name || 'Customer'
          }
        },
        trackingInfo
      });
    } else {
      // For other status changes, we could implement additional notifications here
      console.log(`Status changed to ${req.body.status}, no email template available`);
    }
  } catch (emailError) {
    console.error(`Failed to send order status update email for status ${req.body.status}:`, emailError);
    // Don't fail the order update if email sending fails
  }

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
  // Populate user information to get email address
  const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

  // Send email notification about status change
  try {
    // Special handling for shipping statuses
    if (status === 'Shipped' || status === 'Out For Delivery') {
      const trackingInfo = {
        trackingNumber: note.includes('tracking:') ? note.split('tracking:')[1].trim() : 'N/A',
        carrier: 'Our Delivery Partner',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 3 days from now
        trackingUrl: note.includes('http') ? note.match(/(https?:\/\/[^\s]+)/g)[0] : null
      };

      await emailService.sendShippingConfirmationEmail({
        to: populatedOrder.user.email,
        order: {
          id: order._id,
          user: {
            name: populatedOrder.user.name || 'Customer'
          }
        },
        trackingInfo
      });
    } else {
      // For all other status updates, use the generic email
      await emailService.sendOrderStatusUpdateEmail({
        to: populatedOrder.user.email,
        order: {
          id: order._id,
          user: {
            name: populatedOrder.user.name || 'Customer'
          }
        },
        status: status,
        additionalInfo: note
      });
    }
  } catch (emailError) {
    console.error(`Failed to send order status update email for status ${status}:`, emailError);
    // Don't fail the order update if email sending fails
  }

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order
  });
});
