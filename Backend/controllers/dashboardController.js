const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Get dashboard statistics
exports.getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  // Get total products
  const totalProducts = await Product.countDocuments();
  
  // Get total users (customers - excluding admins)
  const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });
  
  // Get total orders
  const totalOrders = await Order.countDocuments();
  
  // Calculate total sales
  const salesAggregation = await Order.aggregate([
    { $match: { orderStatus: 'Delivered' } },
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
  ]);
  const totalSales = salesAggregation.length > 0 ? salesAggregation[0].totalSales : 0;
  
  // Get recent orders (last 10)
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10)
    .select('_id totalPrice orderStatus createdAt user');
  
  // Get top products by order count
  const topProductsAggregation = await Order.aggregate([
    { $unwind: '$orderItems' },
    { 
      $group: { 
        _id: '$orderItems.product',
        sold: { $sum: '$orderItems.quantity' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { sold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    { $unwind: '$productDetails' },
    {
      $project: {
        _id: 1,
        name: '$productDetails.name',
        sold: 1,
        revenue: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        date: order.createdAt,
        customer: order.user?.name || 'Unknown',
        total: order.totalPrice,
        status: order.orderStatus
      })),
      topProducts: topProductsAggregation
    }
  });
});
