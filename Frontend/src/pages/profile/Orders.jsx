import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Package,
  Eye,
  Download,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  X,
  Search,
  Filter,
  Calendar,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  CreditCard,
  Loader,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const [singleOrderView, setSingleOrderView] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);
  
  useEffect(() => {
    // If we have an order ID parameter and orders data has loaded
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o._id === orderId);
      if (order) {
        setCurrentOrder(order);
        setSingleOrderView(true);
      } else {
        // Order not found, redirect back to orders list
        toast.error("Order not found");
        navigate("/profile/orders");
      }
    } else {
      setSingleOrderView(false);
    }
  }, [orderId, orders]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders/me');
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Orders fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  // Update the getStatusClass function to include more states
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'cod_pending':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cod_collected':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/profile/orders/${orderId}`);
  };
  
  const handleReorder = async (order) => {
    try {
      // Add order items back to cart
      order.orderItems.forEach(item => {
        // This would typically use the cart context
        toast.success(`${item.name} added to cart`);
      });
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to reorder. Please try again.');
    }
  };

  const handleDownloadInvoice = (orderId) => {
    toast.success('Invoice downloaded successfully');
  };
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.put(`/api/orders/${orderId}/cancel`, {
        note: 'Order cancelled by customer'
      });
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        // Refresh orders list
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.orderItems?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    let matchesDate = true;
    if (dateRange === 'last7days') {
      const orderDate = new Date(order.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesDate = orderDate >= sevenDaysAgo;
    } else if (dateRange === 'last30days') {
      const orderDate = new Date(order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesDate = orderDate >= thirtyDaysAgo;
    } else if (dateRange === 'last3months') {
      const orderDate = new Date(order.createdAt);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      matchesDate = orderDate >= threeMonthsAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{singleOrderView ? `Order #${currentOrder?._id.slice(-6)}` : 'Your Orders'} - SastaKart</title>
        <meta name="description" content={singleOrderView ? "View your order details" : "View and track your orders"} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Display either single order view or orders list */}
          {singleOrderView && currentOrder ? (
            <SingleOrderView 
              order={currentOrder} 
              onBack={() => {
                navigate('/profile/orders');
                setSingleOrderView(false);
              }} 
              formatDate={formatDate}
              getStatusIcon={getStatusIcon}
              getStatusClass={getStatusClass}
              handleDownloadInvoice={handleDownloadInvoice}
              handleCancelOrder={handleCancelOrder}
            />
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
                  <p className="mt-1 text-gray-600">
                    Track, manage, and reorder your purchases
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Search orders by ID or product name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <button
                      className="flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200"
                      onClick={() => setFiltersOpen(!filtersOpen)}
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Filters
                      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {filtersOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                            <select
                              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                            >
                              <option value="all">All Statuses</option>
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                            <select
                              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              value={dateRange}
                              onChange={(e) => setDateRange(e.target.value)}
                            >
                              <option value="all">All Time</option>
                              <option value="last7days">Last 7 Days</option>
                              <option value="last30days">Last 30 Days</option>
                              <option value="last3months">Last 3 Months</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Orders List */}
              {singleOrderView && currentOrder ? (
                <motion.div
                  key={currentOrder._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-sm rounded-xl overflow-hidden mb-6"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-900">{currentOrder._id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(currentOrder.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="flex items-center">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(currentOrder.orderStatus)}`}
                          >
                            {getStatusIcon(currentOrder.orderStatus)}
                            <span className="ml-1.5 capitalize">{currentOrder.orderStatus}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    {currentOrder.orderItems.map((item) => (
                      <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 last:border-0 last:pb-0">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-4 mb-4 sm:mb-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ₹{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 text-right">
                          <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-gray-500 mr-2">Total:</span>
                          <span className="text-xl font-bold text-gray-900">₹{currentOrder.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">Payment: {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewOrder(currentOrder._id)}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(currentOrder._id)}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {currentOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white shadow-sm rounded-xl overflow-hidden mb-6"
                    >
                      {/* Order Header */}
                      <div className="bg-gray-50 p-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-medium text-gray-900">{order._id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <div className="flex items-center">
                              <span 
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(order.orderStatus)}`}
                              >
                                {getStatusIcon(order.orderStatus)}
                                <span className="ml-1.5 capitalize">{order.orderStatus}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        {order.orderItems.map((item) => (
                          <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 last:border-0 last:pb-0">
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-4 mb-4 sm:mb-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                <span>Qty: {item.quantity}</span>
                                <span>Price: ₹{item.price.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="mt-4 sm:mt-0 text-right">
                              <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-baseline">
                              <span className="text-gray-500 mr-2">Total:</span>
                              <span className="text-xl font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewOrder(order._id)}
                              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(order._id)}
                              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Invoice
                            </button>                            {/* Show Cancel button only for orders that can be cancelled */}
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className={`inline-flex items-center px-4 py-2 rounded-lg border ${
                                ['Pending', 'Processing', 'COD_Pending'].includes(order.orderStatus)
                                  ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                              }`}
                              disabled={!['Pending', 'Processing', 'COD_Pending'].includes(order.orderStatus)}
                              title={
                                !['Pending', 'Processing', 'COD_Pending'].includes(order.orderStatus)
                                  ? 'This order cannot be cancelled'
                                  : 'Cancel this order'
                              }
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm mt-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                            <span className="font-medium">
                              {Math.min(indexOfLastOrder, filteredOrders.length)}
                            </span>{" "}
                            of <span className="font-medium">{filteredOrders.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => paginate(1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">First</span>
                              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                              <ChevronLeft className="h-5 w-5 -ml-2" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Previous</span>
                              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            
                            {/* Page numbers */}
                            {[...Array(totalPages).keys()].map(number => (
                              <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === number + 1
                                    ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {number + 1}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Next</span>
                              <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => paginate(totalPages)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Last</span>
                              <ChevronRight className="h-5 w-5" aria-hidden="true" />
                              <ChevronRight className="h-5 w-5 -ml-2" aria-hidden="true" />
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// SingleOrderView component for displaying an individual order
const SingleOrderView = ({ 
  order, 
  onBack, 
  formatDate, 
  getStatusIcon, 
  getStatusClass, 
  handleDownloadInvoice,
  handleCancelOrder
}) => {
  // Helper function to capitalize status
  const capitalizeStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with back button */}
      <div className="bg-gray-50 p-6 border-b">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Orders</span>
          </button>
          <button
            onClick={() => handleDownloadInvoice(order._id)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {/* Order summary */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{order._id}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Date Placed</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-1 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusClass(order.orderStatus.toLowerCase())}`}>
                {getStatusIcon(order.orderStatus.toLowerCase())}
                <span className="ml-1">{capitalizeStatus(order.orderStatus)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Order items */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Items</h2>
        <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
          {order.orderItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0">
              <div className="col-span-2 md:col-span-1">
                <div className="aspect-square bg-gray-200 rounded overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="col-span-10 md:col-span-7 flex flex-col justify-center">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="col-span-12 md:col-span-4 flex items-center justify-end">
                <p className="text-sm font-medium text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment and shipping information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                <span className="font-medium text-gray-900">
                  {order.paymentMethod === 'card' 
                    ? 'Paid with Credit/Debit Card'
                    : order.paymentMethod === 'cod' 
                      ? 'Cash On Delivery' 
                      : 'Payment Method Unknown'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST</span>
                    <span className="font-medium">₹{order.taxPrice?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">₹{order.shippingPrice?.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {order.shippingInfo?.address}<br />
                {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}<br />
                {order.shippingInfo?.country}<br />
                Phone: {order.shippingInfo?.phoneNo}
              </p>
            </div>

            {/* Show delivery date if delivered */}
            {order.orderStatus === 'Delivered' && order.deliveredAt && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Delivered On</h3>
                <p className="text-gray-700">{formatDate(order.deliveredAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order timeline/status history */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {order.statusHistory.map((entry, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {getStatusIcon(entry.status.toLowerCase())}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {capitalizeStatus(entry.status)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(entry.timestamp)}
                    </p>
                    {entry.note && (
                      <p className="mt-1 text-gray-700">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
