import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Eye, ShoppingBag, Package, Truck, CheckCircle, Clock, DollarSign, CreditCard, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../utils/auth'; // Added import

function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/orders`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Transform backend data to match frontend structure
      const transformedOrders = data.orders?.map(order => ({
        id: order._id,
        date: order.createdAt,
        customer: order.user?.name || 'Unknown Customer',
        email: order.user?.email || 'No email',
        total: order.totalPrice,
        status: order.orderStatus,
        items: order.orderItems?.length || 0,
        paymentMethod: order.paymentInfo?.type || 'Unknown'
      })) || [];

      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
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
                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'Pending').length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Delivered Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'Delivered').length}</p>
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
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{getTotalRevenue()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
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
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.items} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{order.total.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <CreditCard className="h-4 w-4 mr-1" />
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
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