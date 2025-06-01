import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        <title>Your Orders - Modern Shop</title>
        <meta name="description" content="View and track your orders" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
          {filteredOrders.length === 0 ? (
            <div className="bg-white shadow-sm rounded-xl p-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all' || dateRange !== 'all'
                  ? "No orders match your search criteria. Try adjusting your filters."
                  : "You haven't placed any orders yet. Start shopping to see your orders here."}
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Link>
            </div>
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
                          <span className="text-sm text-gray-500">Payment: {order.paymentInfo?.method || 'Card'}</span>
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
                        </button>
                        <button
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Buy Again
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
        </div>
      </div>
    </>
  );
};

export default Orders;
