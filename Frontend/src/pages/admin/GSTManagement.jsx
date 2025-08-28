import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  IndianRupee,
  Percent,
  Search,
  Copy,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Books',
  'Sports & Outdoors',
  'Toys & Games',
  'Health & Wellness',
  'Jewelry',
  'Automotive',
  'Others'
];

function GSTManagement() {
  const [gstRates, setGstRates] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newRate, setNewRate] = useState('');

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
    fetchGSTData();
  }, []);

  const fetchGSTData = async () => {
    try {
      setLoading(true);
      
      // Get settings and analytics first
      const [settingsResponse, analyticsResponse] = await Promise.all([
        axios.get('/api/gst/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/gst/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      // If no GST rates exist, initialize them
      if (!settingsResponse.data.settings.rates || Object.keys(settingsResponse.data.settings.rates).length === 0) {
        try {
          await axios.post('/api/gst/initialize', {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          // Fetch settings again after initialization
          const newSettingsResponse = await axios.get('/api/gst/settings', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          settingsResponse.data = newSettingsResponse.data;
        } catch (initError) {
          console.error('Error initializing GST rates:', initError);
        }
      }

      setGstRates(settingsResponse.data.settings.rates);
      setAnalytics(analyticsResponse.data.analytics);
    } catch (error) {
      console.error('Error fetching GST data:', error);
      toast.error('Failed to load GST data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGST = async (category) => {
    try {
      const rate = parseFloat(newRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast.error('Please enter a valid GST rate between 0 and 100');
        return;
      }

      await axios.put('/api/gst/settings', 
        { category, rate },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      toast.success(`GST rate updated for ${category}`);
      setEditingCategory(null);
      setNewRate('');
      fetchGSTData(); // Refresh data
    } catch (error) {
      console.error('Error updating GST rate:', error);
      toast.error('Failed to update GST rate');
    }
  };

  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
          <p className="text-gray-600">Loading GST data...</p>
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
          <title>GST Management | Admin Dashboard</title>
        </Helmet>

        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Percent className="h-8 w-8 text-gray-600" />
              GST Management
            </h1>
            <p className="text-gray-600 mt-2">Manage GST rates for different product categories</p>
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
                <p className="text-gray-600 text-sm font-medium">Total GST Collected</p>
                <p className="text-2xl font-bold text-gray-900">₹{(analytics.totalGstCollected || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Monthly GST</p>
                <p className="text-2xl font-bold text-gray-900">₹{(analytics.monthlyGst || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Copy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Exempt Categories</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.exemptCategories || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="card p-6 mb-8"
          variants={itemVariants}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </motion.div>

        {/* GST Rates Table */}
        <motion.div 
          className="card overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">GST Rates by Category</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <motion.tr
                    key={category}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCategory === category ? (
                        <input
                          type="number"
                          value={newRate}
                          onChange={(e) => setNewRate(e.target.value)}
                          className="input w-24"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{gstRates[category] || 18}%</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCategory === category ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateGST(category)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null);
                              setNewRate('');
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setNewRate(gstRates[category]?.toString() || '18');
                          }}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Copy className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search term
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GSTManagement;
