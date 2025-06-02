import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Eye, ShoppingBag, Package, Truck, CheckCircle, Clock, DollarSign, CreditCard, XCircle, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';
import { toastConfig, formatToastMessage } from '../../utils/toastConfig';
import axios from 'axios';

function OrdersManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [codAnalytics, setCodAnalytics] = useState({});
  const [showCodSection, setShowCodSection] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/admin/orders' } });
      return;
    }

    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    fetchOrders();
    fetchCodAnalytics();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin/orders`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        const transformedOrders = response.data.orders?.map(order => ({
          id: order._id,
          date: order.createdAt,
          customer: order.user?.name || (order.shippingInfo ? 
            `${order.shippingInfo.firstName || ''} ${order.shippingInfo.lastName || ''}`.trim() : 
            'Unknown Customer'),
          email: order.user?.email || order.shippingInfo?.email || 'No email',
          phone: order.user?.phone || order.shippingInfo?.phoneNo || '',
          total: order.totalPrice,
          status: order.orderStatus,
          itemCount: order.orderItems.length,
          paymentMethod: order.paymentMethod || 'online'
        })) || [];

        setOrders(transformedOrders);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      const errorMessage = formatToastMessage(err.response?.data?.message || 'Failed to fetch orders');
      setError(errorMessage);
      toast.error(errorMessage, toastConfig.error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCodAnalytics = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin/orders/cod-analytics`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setCodAnalytics(response.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching COD analytics:', err);
    }
  };

  const handleCollectCOD = async (orderId) => {
    // Show confirmation dialog
    if (!confirm("Confirm COD collection for this order?")) {
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/admin/order/${orderId}/collect-cod`, 
        {}, 
        {
          headers: getAuthHeaders()
        }
      );
      
      if (response.data.success) {
        toast.success(`Successfully collected cash payment of ₹${order.totalPrice} for Order #${order.id}`);
        
        // Update local state to reflect the change
        setOrders(orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status: 'COD_Collected'
            };
          }
          return order;
        }));

        // Refresh analytics
        fetchCodAnalytics();
      }
    } catch (error) {
      console.error('Error collecting COD payment:', error);
      toast.error(error.response?.data?.message || 'Failed to collect COD payment');
    }
  };

  useEffect(() => {
    let updatedOrders = [...orders];

    if (statusFilter !== 'all') {
      updatedOrders = updatedOrders.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      updatedOrders = updatedOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort orders
    updatedOrders.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(fieldA) - new Date(fieldB)
          : new Date(fieldB) - new Date(fieldA);
      } else if (typeof fieldA === 'string') {
        return sortOrder === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
    });

    setFilteredOrders(updatedOrders);
  }, [searchTerm, statusFilter, sortBy, sortOrder, orders]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'Delivered':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <Truck className="h-3 w-3 mr-1" />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Package className="h-3 w-3 mr-1" />
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span className={`${baseClasses} bg-orange-100 text-orange-800`}>
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );      case 'COD_Pending':
        return (
          <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
            <DollarSign className="h-3 w-3 mr-1" />
            COD Pending
          </span>
        );
      case 'Out_For_Delivery':
        return (
          <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>
            <Truck className="h-3 w-3 mr-1" />
            Out For Delivery
          </span>
        );
      case 'COD_Collected':
        return (
          <span className={`${baseClasses} bg-teal-100 text-teal-800`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            COD Collected
          </span>
        );
      case 'Cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <Package className="h-3 w-3 mr-1" />
            {status}
          </span>
        );
    }
  };
  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((total, order) => total + order.total, 0)
      .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Orders Management | Admin Dashboard</title>
        </Helmet>

        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-gray-600" />
              Orders
            </h1>
            <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
          </div>
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
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total COD Orders</p>
                <p className="text-2xl font-bold text-gray-900">{codAnalytics.totalCODOrders || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">COD Pending</p>
                <p className="text-2xl font-bold text-gray-900">{codAnalytics.pendingCOD || 0}</p>
                <p className="text-sm text-gray-500 mt-1">₹{(codAnalytics.pendingAmount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">COD Collected</p>
                <p className="text-2xl font-bold text-gray-900">{codAnalytics.collectedCOD || 0}</p>
                <p className="text-sm text-gray-500 mt-1">₹{(codAnalytics.collectedAmount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
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
            </div>            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="COD_Pending">COD Pending</option>
              <option value="COD_Collected">COD Collected</option>
            </select>

            <motion.button
              onClick={() => handleSort('date')}
              className="btn-outline flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort by {sortBy}
            </motion.button>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div 
          className="card overflow-hidden"
          variants={itemVariants}
        >
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredOrders.slice(
                    (currentPage - 1) * ordersPerPage,
                    currentPage * ordersPerPage
                  ).map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        order.paymentMethod === 'cod' && order.status === 'COD_Pending' 
                          ? 'bg-purple-50'
                          : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id.slice(-8)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">
                            {order.phone && <span className="mr-2">📞 {order.phone}</span>}
                            {order.email && <span>📧 {order.email}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.itemCount} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.total.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          {order.paymentMethod === 'cod' ? (
                            <span className="inline-flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              COD
                            </span>
                          ) : (
                            <span className="inline-flex items-center">
                              <CreditCard className="h-4 w-4 mr-1" />
                              Online
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <motion.div 
            className="card p-6 mt-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex space-x-2">
                <motion.button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                <motion.button
                  disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default OrdersManagement;