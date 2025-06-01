import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingBag, Package, IndianRupee, TrendingUp, Eye, Store, UserCheck, Calendar } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../utils/auth';

function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    productsGrowth: 0,
    customersGrowth: 0,
    recentOrders: [],
    topProducts: [],
    gstStats: {
      totalCollected: 0,
      monthlyCollected: 0,
      yearlyCollected: 0,
      exemptOrders: 0,
      growth: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}${API_ENDPOINTS.DASHBOARD_STATS}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Helmet>
          <title>Admin Dashboard | SastaKart</title>
        </Helmet>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
            <button 
              onClick={fetchDashboardStats}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link 
                  to="/admin/products/new" 
                  className="btn-primary flex items-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  Add New Product
                </Link>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={itemVariants}
            >
              {/* Total Sales */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <IndianRupee className="h-6 w-6 text-green-600" />
                  </div>
                  {stats.salesGrowth > 0 && (
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.salesGrowth}%
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Sales</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalSales)}
                </p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  {stats.ordersGrowth > 0 && (
                    <div className="flex items-center text-blue-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.ordersGrowth}%
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              </div>

              {/* Total Products */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  {stats.productsGrowth > 0 && (
                    <div className="flex items-center text-purple-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.productsGrowth}%
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
              </div>

              {/* Total Customers */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  {stats.customersGrowth > 0 && (
                    <div className="flex items-center text-orange-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.customersGrowth}%
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Customers</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
              </div>
            </motion.div>

            {/* GST Overview */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8"
              variants={itemVariants}
            >
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Store className="h-6 w-6 text-indigo-600" />
                  </div>
                  {stats.gstStats.growth > 0 && (
                    <div className="flex items-center text-indigo-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.gstStats.growth}%
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total GST Collected</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.gstStats.totalCollected)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Monthly GST</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.gstStats.monthlyCollected)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Yearly GST</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.gstStats.yearlyCollected)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Exempt Orders</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.gstStats.exemptOrders}
                </p>
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div 
              className="mt-8 bg-white rounded-lg shadow"
              variants={itemVariants}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <Link 
                    to="/admin/orders" 
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
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
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Dashboard;
