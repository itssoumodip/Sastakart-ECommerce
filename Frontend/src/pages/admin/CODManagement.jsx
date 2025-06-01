import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  IndianRupee, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function CODManagement() {
  const [codOrders, setCodOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  useEffect(() => {
    fetchCODData();
  }, []);

  const fetchCODData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, analyticsResponse] = await Promise.all([
        axios.get('/api/orders/admin/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/orders/admin/orders/cod-analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      // Filter COD orders
      const codOrdersData = ordersResponse.data.orders.filter(
        order => order.paymentMethod === 'cod'
      );
      setCodOrders(codOrdersData);
      setAnalytics(analyticsResponse.data.analytics);
    } catch (error) {
      console.error('Error fetching COD data:', error);
      toast.error('Failed to load COD data');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectCOD = async (orderId) => {
    try {
      await axios.put(`/api/orders/admin/order/${orderId}/collect-cod`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success('COD payment collected successfully!');
      fetchCODData(); // Refresh data
    } catch (error) {
      console.error('Error collecting COD:', error);
      toast.error('Failed to collect COD payment');
    }
  };

  const filteredOrders = codOrders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.orderStatus.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'COD Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'COD Collected':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Delivered':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
          <p className="text-gray-600">Loading COD data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>COD Management | Admin Dashboard</title>
        </Helmet>

        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <IndianRupee className="h-8 w-8 text-gray-600" />
              COD Management
            </h1>
            <p className="text-gray-600 mt-2">Manage Cash on Delivery orders and payments</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2"
            onClick={() => {/* Handle export */}}
          >
            <Download className="h-5 w-5" />
            Export Report
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCODOrders || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Collection</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.pendingCOD || 0}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Collected</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.collectedCOD || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{(analytics.totalCODAmount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="card p-6 mb-8"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="cod pending">COD Pending</option>
              <option value="cod collected">COD Collected</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div 
          className="card overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">COD Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{order.shippingInfo.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ₹{order.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusColor(order.orderStatus)}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          {order.orderStatus === 'COD Pending' && (
                            <button
                              onClick={() => handleCollectCOD(order._id)}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200 flex items-center gap-1"
                            >
                              <DollarSign className="h-4 w-4" />
                              Collect
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No COD orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'COD orders will appear here when customers place them'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CODManagement;
