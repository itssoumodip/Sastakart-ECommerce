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

  return (    <motion.div 
      className="min-h-screen bg-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Admin Dashboard | RETRO-SHOP</title>
        </Helmet>

        <motion.div 
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl font-bold text-white font-mono uppercase tracking-widest">
              [ DASHBOARD ]
            </h1>
            <p className="text-white mt-2 font-mono">Status report for your RETRO-SHOP store.</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/admin/products/new" 
              className="bg-white text-black border-2 border-white px-6 py-3 hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-2 font-mono uppercase tracking-wide"
            >
              <Package className="h-5 w-5" />
              Add Product
            </Link>
          </motion.div>
        </motion.div>        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 border-2 border-white">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-white text-sm font-mono">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12%
              </div>
            </div>
            <h3 className="text-white text-sm font-mono uppercase mb-1">Total Sales</h3>
            <p className="text-3xl font-bold text-white font-mono">${stats.totalSales.toLocaleString()}</p>
            <p className="text-sm text-white/70 mt-2 font-mono">+12% from last month</p>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 border-2 border-white">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-white text-sm font-mono">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5%
              </div>
            </div>
            <h3 className="text-white text-sm font-mono uppercase mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-white font-mono">{stats.totalOrders}</p>
            <p className="text-sm text-white/70 mt-2 font-mono">+5% from last month</p>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 border-2 border-white">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-white text-sm font-mono">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3
              </div>
            </div>
            <h3 className="text-white text-sm font-mono uppercase mb-1">Total Products</h3>
            <p className="text-3xl font-bold text-white font-mono">{stats.totalProducts}</p>
            <p className="text-sm text-white/70 mt-2 font-mono">+3 new this week</p>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 border-2 border-white">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-white text-sm font-mono">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8
              </div>
            </div>
            <h3 className="text-white text-sm font-mono uppercase mb-1">Total Customers</h3>
            <p className="text-3xl font-bold text-white font-mono">{stats.totalCustomers}</p>
            <p className="text-sm text-white/70 mt-2 font-mono">+8 new this week</p>
          </motion.div>
        </motion.div>        {/* Recent Orders */}
        <motion.div 
          className="bg-black border-2 border-white mb-8 overflow-hidden"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between p-6 border-b-2 border-white">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <ShoppingBag className="h-5 w-5 text-white" />
              Recent Orders
            </h2>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/admin/orders" 
                className="text-white hover:bg-white hover:text-black border border-white px-3 py-1 font-mono flex items-center gap-1 transition-all"
              >
                <Eye className="h-4 w-4" />
                View all
              </Link>
            </motion.div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                <AnimatePresence>
                  {stats.recentOrders.map((order, index) => (
                    <motion.tr 
                      key={order.id} 
                      className="hover:bg-white hover:text-black transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-semibold">${order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-mono uppercase border ${
                          order.status === 'Delivered' ? 'bg-white text-black border-white' :
                          order.status === 'Processing' ? 'bg-black text-white border-white' :
                          order.status === 'Shipped' ? 'bg-black text-white border-white' :
                          'bg-black text-white border-white'
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
        </motion.div>        {/* Top Products */}
        <motion.div 
          className="bg-black border-2 border-white overflow-hidden"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between p-6 border-b-2 border-white">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <Package className="h-5 w-5 text-white" />
              Top Selling Products
            </h2>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/admin/products" 
                className="text-white hover:bg-white hover:text-black border border-white px-3 py-1 font-mono flex items-center gap-1 transition-all"
              >
                <Eye className="h-4 w-4" />
                View all
              </Link>
            </motion.div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                <AnimatePresence>
                  {stats.topProducts.map((product, index) => (
                    <motion.tr 
                      key={product.id} 
                      className="hover:bg-white hover:text-black transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-semibold">{product.sold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-semibold">${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
