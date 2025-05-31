import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, ShoppingBag, Package, DollarSign, TrendingUp, Eye } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 12560,
    totalOrders: 124,
    totalProducts: 68,
    totalCustomers: 95,
    recentOrders: [
      { id: 'ORD-1234', date: '2023-11-28', customer: 'John Doe', total: 125.99, status: 'Delivered' },
      { id: 'ORD-1235', date: '2023-11-27', customer: 'Jane Smith', total: 89.50, status: 'Processing' },
      { id: 'ORD-1236', date: '2023-11-26', customer: 'Robert Brown', total: 245.75, status: 'Shipped' },
      { id: 'ORD-1237', date: '2023-11-25', customer: 'Sarah Wilson', total: 112.30, status: 'Pending' },
    ],
    topProducts: [
      { id: 1, name: 'Wireless Headphones', sold: 24, revenue: 2399.76 },
      { id: 2, name: 'Smart Watch', sold: 18, revenue: 3599.82 },
      { id: 3, name: 'Bluetooth Speaker', sold: 15, revenue: 1499.85 },
    ]
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Helmet>
          <title>Admin Dashboard | E-Commerce Store</title>
        </Helmet>        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your store and view analytics.</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link 
              to="/admin/products/new" 
              className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">Add Product</span>
            </Link>
          </motion.div>
        </motion.div>        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600 text-xs sm:text-sm font-medium">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                +12%
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium uppercase mb-1">Total Sales</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">+12% from last month</p>
          </motion.div>

          <motion.div 
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300"            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="flex items-center text-blue-600 text-xs sm:text-sm font-medium">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                +5%
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium uppercase mb-1">Total Orders</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">+5% from last month</p>
          </motion.div>

          <motion.div 
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="flex items-center text-purple-600 text-xs sm:text-sm font-medium">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                +3
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium uppercase mb-1">Total Products</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">+3 new this week</p>
          </motion.div>

          <motion.div 
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="flex items-center text-orange-600 text-xs sm:text-sm font-medium">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                +8
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium uppercase mb-1">Total Customers</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">+8 new this week</p>
          </motion.div>
        </motion.div>        {/* Recent Orders */}
        <motion.div 
          className="card mb-6 sm:mb-8 overflow-hidden"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              Recent Orders
            </h2>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/admin/orders" 
                className="btn-outline flex items-center gap-1 text-sm"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                View all
              </Link>
            </motion.div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {stats.recentOrders.map((order, index) => (
                    <motion.tr 
                      key={order.id} 
                      className="hover:bg-gray-50 transition-all duration-200 block sm:table-row border-b border-gray-200 sm:border-0 mb-4 sm:mb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium block sm:table-cell">
                        <span className="sm:hidden font-semibold text-gray-700">Order: </span>
                        {order.id}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-600 block sm:table-cell">
                        <span className="sm:hidden font-semibold text-gray-700">Date: </span>
                        {order.date}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium text-gray-900 block sm:table-cell">
                        <span className="sm:hidden font-semibold text-gray-700">Customer: </span>                        {order.customer}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-left sm:text-right font-semibold block sm:table-cell">
                        <span className="sm:hidden font-semibold text-gray-700">Total: </span>
                        ${order.total}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap block sm:table-cell">
                        <span className="sm:hidden font-semibold text-gray-700">Status: </span>
                        <span className={`px-2 sm:px-3 py-1 text-xs font-medium uppercase rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div 
          className="card overflow-hidden"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" />
              Top Selling Products
            </h2>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/admin/products" 
                className="btn-outline flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                View all
              </Link>
            </motion.div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {stats.topProducts.map((product, index) => (
                    <motion.tr 
                      key={product.id} 
                      className="hover:bg-gray-50 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">{product.sold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
