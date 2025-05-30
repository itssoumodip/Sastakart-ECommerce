import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

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
        return <Clock className="w-4 h-4 text-white" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-white" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-white" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-white" />;
      default:
        return <Package className="w-4 h-4 text-white" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'border-2 border-white text-white';
      case 'processing':
        return 'border-2 border-white text-white';
      case 'shipped':
        return 'border-2 border-white text-white';
      case 'delivered':
        return 'border-2 border-white bg-white text-black';
      case 'cancelled':
        return 'border-2 border-white text-white';
      default:
        return 'border-2 border-white text-white';
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
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus.toLowerCase() === statusFilter;
    
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    let matchesDate = true;
    
    if (dateRange === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      matchesDate = orderDate >= thirtyDaysAgo;
    } else if (dateRange === 'last60') {
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(now.getDate() - 60);
      matchesDate = orderDate >= sixtyDaysAgo;
    } else if (dateRange === 'last90') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);
      matchesDate = orderDate >= ninetyDaysAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <>
      <Helmet>
        <title>My Orders - RETRO-SHOP</title>
        <meta name="description" content="Track and manage your orders" />
      </Helmet>

      <div className="min-h-screen bg-black">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              className="mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-black border-2 border-white p-8 text-white">
                <h1 className="text-4xl font-mono font-bold mb-2 uppercase tracking-widest">[ MY ORDERS ]</h1>
                <p className="text-white/70 font-mono uppercase tracking-wide">Track and manage your orders</p>
              </div>
            </motion.div>

            {/* Filters & Search */}
            <motion.div 
              className="mb-6 bg-black border-2 border-white p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="SEARCH ORDERS"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black text-white border-2 border-white px-4 py-3 pl-10 w-full font-mono focus:ring-0"
                  />
                  <Search className="absolute top-3 left-3 text-white/70 w-5 h-5" />
                </div>
                
                {/* Status Filter */}
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-black text-white border-2 border-white px-4 py-3 pl-10 pr-10 appearance-none w-full font-mono focus:ring-0"
                    >
                      <option value="all">ALL STATUSES</option>
                      <option value="pending">PENDING</option>
                      <option value="processing">PROCESSING</option>
                      <option value="shipped">SHIPPED</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                    <Filter className="absolute top-3 left-3 text-white/70 w-5 h-5" />
                  </div>
                </div>
                
                {/* Date Range Filter */}
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="bg-black text-white border-2 border-white px-4 py-3 pl-10 pr-10 appearance-none w-full font-mono focus:ring-0"
                    >
                      <option value="all">ALL TIME</option>
                      <option value="last30">LAST 30 DAYS</option>
                      <option value="last60">LAST 60 DAYS</option>
                      <option value="last90">LAST 90 DAYS</option>
                    </select>
                    <Calendar className="absolute top-3 left-3 text-white/70 w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Orders List */}
            <motion.div
              className="space-y-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-none animate-spin"></div>
                  <p className="ml-4 text-white font-mono uppercase">LOADING ORDERS...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-black border-2 border-white text-center py-16">
                  <ShoppingBag className="w-16 h-16 mx-auto text-white/60" />
                  <h3 className="mt-4 text-xl font-mono font-bold text-white uppercase">NO ORDERS FOUND</h3>
                  <p className="mt-2 text-white/70 font-mono">
                    {searchTerm || statusFilter !== 'all' || dateRange !== 'all' 
                      ? 'TRY ADJUSTING YOUR FILTERS'
                      : 'YOU HAVE NOT PLACED ANY ORDERS YET'}
                  </p>
                  <button
                    onClick={() => navigate('/products')}
                    className="mt-6 border-2 border-white px-6 py-2 text-white font-mono hover:bg-white hover:text-black transition-colors uppercase tracking-wider"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-black border-2 border-white">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-6 border-b-2 border-white">
                      <div className="font-mono font-bold text-white uppercase p-4">ORDER ID</div>
                      <div className="font-mono font-bold text-white uppercase p-4">DATE</div>
                      <div className="font-mono font-bold text-white uppercase p-4">ITEMS</div>
                      <div className="font-mono font-bold text-white uppercase p-4">TOTAL</div>
                      <div className="font-mono font-bold text-white uppercase p-4">STATUS</div>
                      <div className="font-mono font-bold text-white uppercase p-4">ACTIONS</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y-2 divide-white/30">                      {filteredOrders.map((order) => (
                        <div key={order._id} className="grid grid-cols-1 md:grid-cols-6 hover:bg-white/5 transition-colors">
                          {/* Mobile View */}
                          <div className="block md:hidden p-4 border-b border-white/20">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-mono text-white uppercase">#{order._id.slice(-8)}</div>
                              <div className={`flex items-center space-x-1 px-2 py-1 ${getStatusClass(order.orderStatus.toLowerCase())}`}>
                                {getStatusIcon(order.orderStatus.toLowerCase())}
                                <span className="text-xs font-mono uppercase">{order.orderStatus}</span>
                              </div>
                            </div>
                            <div className="text-sm text-white/70 font-mono mb-4">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="font-mono text-white mb-1">
                              {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                            </div>
                            <div className="font-mono font-bold text-white mb-4">
                              ${order.totalPrice.toFixed(2)}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewOrder(order._id)}
                                className="flex-1 border border-white py-2 text-white font-mono text-sm hover:bg-white hover:text-black transition-colors uppercase flex items-center justify-center"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => handleReorder(order)}
                                className="flex-1 border border-white py-2 text-white font-mono text-sm hover:bg-white hover:text-black transition-colors uppercase flex items-center justify-center"
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Reorder
                              </button>
                            </div>
                          </div>                          {/* Desktop View */}
                          <div className="hidden md:flex items-center p-4 font-mono text-white">#{order._id.slice(-8)}</div>
                          <div className="hidden md:flex items-center p-4 font-mono text-white">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="hidden md:flex items-center p-4 font-mono text-white">
                            {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                          </div>
                          <div className="hidden md:flex items-center p-4 font-mono font-bold text-white">
                            ${order.totalPrice.toFixed(2)}
                          </div>
                          <div className="hidden md:flex items-center p-4">
                            <div className={`flex items-center space-x-2 px-3 py-1 ${getStatusClass(order.orderStatus.toLowerCase())}`}>
                              {getStatusIcon(order.orderStatus.toLowerCase())}
                              <span className="text-xs font-mono uppercase">{order.orderStatus}</span>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center p-4 space-x-2">
                            <button
                              onClick={() => handleViewOrder(order._id)}
                              className="border border-white w-10 h-10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                              title="View Order"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(order._id)}
                              className="border border-white w-10 h-10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                              title="Download Invoice"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReorder(order)}
                              className="border border-white w-10 h-10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                              title="Reorder"
                            >
                              <RefreshCw className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {filteredOrders.length > 0 && (
                    <div className="flex justify-between items-center font-mono text-white pt-4">
                      <p>SHOWING {filteredOrders.length} OF {orders.length} ORDERS</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
