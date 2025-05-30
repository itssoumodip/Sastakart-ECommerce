import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Eye, ShoppingBag, Package, Truck, CheckCircle, Clock, DollarSign, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

function OrdersManagement() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1234',
      date: '2023-11-28',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      total: 125.99,
      status: 'Delivered',
      items: 3,
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-1235',
      date: '2023-11-27',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      total: 89.50,
      status: 'Processing',
      items: 1,
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-1236',
      date: '2023-11-26',
      customer: 'Robert Brown',
      email: 'robert.brown@example.com',
      total: 245.75,
      status: 'Shipped',
      items: 4,
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-1237',
      date: '2023-11-25',
      customer: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      total: 112.30,
      status: 'Pending',
      items: 2,
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-1238',
      date: '2023-11-24',
      customer: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      total: 78.25,
      status: 'Cancelled',
      items: 1,
      paymentMethod: 'PayPal'
    },
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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

    setFilteredOrders(updatedOrders);
  }, [searchTerm, statusFilter, orders]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'Shipped':
        return <Truck className="h-3 w-3 mr-1" />;
      case 'Processing':
        return <Package className="h-3 w-3 mr-1" />;
      case 'Pending':
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return <Package className="h-3 w-3 mr-1" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-black text-white border-2 border-white';
      case 'Shipped':
        return 'bg-white text-black border-2 border-black';
      case 'Processing':
        return 'bg-gray-800 text-white border border-white';
      case 'Pending':
        return 'bg-white text-black border border-dashed border-black';
      case 'Cancelled':
        return 'bg-black text-white border border-dashed border-white';
      default:
        return 'bg-white text-black border border-black';
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-black text-white"
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
            <h1 className="text-4xl font-mono font-bold text-white flex items-center gap-3 tracking-widest uppercase">
              <ShoppingBag className="h-8 w-8 text-white" />
              [ ORDERS MANAGEMENT ]
            </h1>
            <p className="text-gray-400 mt-2 font-mono">Track and manage all customer orders</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-black p-6 border-4 border-white"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-bold text-white font-mono">{orders.length}</p>
              </div>
              <div className="border-2 border-white p-3">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-4 border-white"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono uppercase tracking-wider">Pending Orders</p>
                <p className="text-2xl font-bold text-white font-mono">{orders.filter(o => o.status === 'Pending').length}</p>
              </div>
              <div className="border-2 border-white p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-4 border-white"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono uppercase tracking-wider">Processing</p>
                <p className="text-2xl font-bold text-white font-mono">{orders.filter(o => o.status === 'Processing').length}</p>
              </div>
              <div className="border-2 border-white p-3">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-4 border-white"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold text-white font-mono">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
              </div>
              <div className="border-2 border-white p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-black border-4 border-white p-6 mb-8"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-white" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div 
          className="bg-black border-4 border-white overflow-hidden mb-8"
          variants={itemVariants}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-white">
              <thead className="bg-white text-black font-mono">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Order ID
                      {sortBy === 'id' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortBy === 'customer' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center">
                      Total
                      {sortBy === 'total' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-white bg-black">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-white">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-300">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-white">{order.customer}</div>
                      <div className="text-xs text-gray-400 font-mono">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-white">${order.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 flex items-center font-mono">
                        <CreditCard className="h-3 w-3 mr-1" />{order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold font-mono inline-flex items-center ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center border-2 border-white px-3 py-1 bg-black text-white font-mono hover:bg-white hover:text-black transition-colors duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        VIEW
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        <motion.div 
          className="flex justify-center my-8" 
          variants={itemVariants}
        >
          <nav className="flex items-center space-x-2">
            <button 
              className="px-4 py-2 border-2 border-white bg-black text-white font-mono hover:bg-white hover:text-black transition-colors"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              PREV
            </button>
            {[...Array(Math.ceil(filteredOrders.length / ordersPerPage))].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border-2 font-mono ${
                  currentPage === i + 1 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-white hover:bg-white hover:text-black transition-colors'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="px-4 py-2 border-2 border-white bg-black text-white font-mono hover:bg-white hover:text-black transition-colors"
              disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              NEXT
            </button>
          </nav>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default OrdersManagement;
