import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    switch (status) {
      case 'COD Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'COD Collected':
        return 'bg-green-100 text-green-800';
      case 'Delivered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">COD Management</h1>
          <p className="text-gray-600 mt-1">Manage Cash on Delivery orders and payments</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
              Total COD
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analytics.totalCODOrders || 0}
          </h3>
          <p className="text-gray-600 text-sm">Total COD Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
              Pending
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analytics.pendingCOD || 0}
          </h3>
          <p className="text-gray-600 text-sm">Pending Collection</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              Collected
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analytics.collectedCOD || 0}
          </h3>
          <p className="text-gray-600 text-sm">Successfully Collected</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IndianRupee className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              Amount
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            ₹{(analytics.totalCODAmount || 0).toLocaleString('en-IN')}
          </h3>
          <p className="text-gray-600 text-sm">Total COD Amount</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="cod pending">COD Pending</option>
              <option value="cod collected">COD Collected</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* COD Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
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
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                      </div>
                      <div className="text-gray-500 text-xs">{order.shippingInfo.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {order.totalPrice.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {order.orderStatus === 'COD Pending' && (
                      <button
                        onClick={() => handleCollectCOD(order._id)}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1 ml-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Collect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No COD orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'COD orders will appear here when customers place them'}
            </p>
          </div>
        )}
      </div>    </div>
  );
}

export default CODManagement;
