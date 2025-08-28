import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, 
  Save, 
  Percent, 
  RefreshCcw, 
  Plus, 
  Trash2, 
  PieChart,
  BarChart,
  DollarSign,
  Search,
  X,
  Edit
} from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/auth';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const GSTSettings = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [gstSettings, setGstSettings] = useState({
    defaultRate: 18,
    rates: {},
    exemptCategories: []
  });
  const [analytics, setAnalytics] = useState({
    totalGstCollected: 0,
    monthlyGst: 0,
    yearlyGst: 0,
    exemptOrders: 0
  });
  const [newCategory, setNewCategory] = useState('');
  const [newRate, setNewRate] = useState(18);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Animation variants
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
  
  // Fetch GST settings and analytics on component mount
  useEffect(() => {
    const fetchGSTData = async () => {
      setLoading(true);
      try {
        console.log('Fetching GST settings from:', API_BASE_URL + API_ENDPOINTS.GST_SETTINGS);
        console.log('Auth Headers:', getAuthHeaders());
        // Fetch GST settings
        try {
          const settingsResponse = await axios.get(
            `${API_BASE_URL}${API_ENDPOINTS.GST_SETTINGS}`
            // No auth headers for test endpoint
          );
          console.log('GST Settings Response:', settingsResponse.status, settingsResponse.data);
          
          if (settingsResponse.data.success) {
            setGstSettings(settingsResponse.data.settings);
            
            // Extract unique categories from GST rates
            const uniqueCategories = Object.keys(settingsResponse.data.settings.rates);
            setCategories(uniqueCategories);
          }
        } catch (error) {
          console.error('GST Settings Error:', error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : error.message);
          toast.error(`GST Settings API Error: ${error.response ? error.response.status + ' ' + error.response.statusText : error.message}`);
        }
        

        
        // Fetch GST analytics
        console.log('Fetching GST analytics from:', API_BASE_URL + API_ENDPOINTS.GST_ANALYTICS);
        try {
          const analyticsResponse = await axios.get(
            `${API_BASE_URL}${API_ENDPOINTS.GST_ANALYTICS}`
            // No auth headers for test endpoint
          );
          
          console.log('GST Analytics Response:', analyticsResponse.status, analyticsResponse.data);
          
          if (analyticsResponse.data.success) {
            setAnalytics(analyticsResponse.data.analytics);
          }
        } catch (error) {
          console.error('GST Analytics Error:', error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : error.message);
          toast.error(`GST Analytics API Error: ${error.response ? error.response.status + ' ' + error.response.statusText : error.message}`);
        }
      } catch (error) {
        console.error('Error fetching GST data:', error);
        toast.error('Failed to fetch GST settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGSTData();
  }, []);
  
  const handleRateChange = (category, rate) => {
    setGstSettings(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [category]: Number(rate)
      }
    }));
  };
  
  const handleUpdateRate = async (category, rate) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.GST_SETTINGS}`,
        { category, rate: Number(rate) },
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        toast.success(`GST rate updated for ${category}`);
      }
    } catch (error) {
      console.error('Error updating GST rate:', error);
      toast.error('Failed to update GST rate. Please try again.');
    }
  };
  
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.GST_SETTINGS}`,
        { category: newCategory, rate: Number(newRate) },
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        toast.success(`GST rate added for ${newCategory}`);
        
        // Update local state
        setCategories(prev => [...prev, newCategory]);
        setGstSettings(prev => ({
          ...prev,
          rates: {
            ...prev.rates,
            [newCategory]: Number(newRate)
          }
        }));
        
        // Reset form fields
        setNewCategory('');
        setNewRate(18);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error adding new GST category:', error);
      toast.error('Failed to add GST category. Please try again.');
    }
  };

  const openAddModal = () => {
    setCurrentCategory(null);
    setNewCategory('');
    setNewRate(18);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setNewCategory(category);
    setNewRate(gstSettings.rates[category] || 0);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentCategory) {
      // Update existing category
      await handleUpdateRate(currentCategory, newRate);
      setShowModal(false);
    } else {
      // Add new category
      await handleAddCategory();
    }
  };

  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>GST Settings | SastaKart Admin</title>
        </Helmet>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
              <p className="text-gray-600">Loading GST data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <motion.div 
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <IndianRupee className="h-8 w-8 text-gray-600" />
                  GST Settings
                </h1>
                <p className="text-gray-600 mt-2">Configure GST rates for product categories</p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => window.location.reload()}
                  className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCcw className="h-5 w-5" />
                  Refresh
                </motion.button>
                <motion.button
                  onClick={openAddModal}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-5 w-5" />
                  Add Category
                </motion.button>
              </div>
            </motion.div>

            {/* GST Analytics */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total GST Collected</p>
                    <p className="text-2xl font-bold text-gray-900">₹{analytics.totalGstCollected?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
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
                    <p className="text-2xl font-bold text-gray-900">₹{analytics.monthlyGst?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Yearly GST</p>
                    <p className="text-2xl font-bold text-gray-900">₹{analytics.yearlyGst?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <PieChart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Exempt Products</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.exemptOrders || '0'}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Percent className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Filters and Search */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 pl-10"
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  )}
                </div>
                
                <div className="bg-gray-50 p-2 rounded-md w-full md:w-auto">
                  <div className="text-sm text-gray-600 font-medium flex items-center">
                    <Percent className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Standard GST Rate: <span className="font-bold">{gstSettings.defaultRate || 18}%</span></span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* GST Rates Table */}
            <motion.div 
              className="card overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">GST Rates by Category</h2>
                <p className="text-gray-600 text-sm mt-1">Manage tax rates for different product categories</p>
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, index) => (
                          <motion.tr
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="form-input w-20 text-center"
                                  value={gstSettings.rates[category] || 0}
                                  onChange={(e) => handleRateChange(category, e.target.value)}
                                />
                                <span className="ml-2 text-gray-500">%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <motion.button
                                  onClick={() => handleUpdateRate(category, gstSettings.rates[category])}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Save className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() => openEditModal(category)}
                                  className="text-gray-600 hover:text-gray-900 p-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Edit className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                            {searchTerm ? 'No categories match your search' : 'No categories found. Add a new category.'}
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            {/* GST Guidelines */}
            <motion.div 
              className="card p-6 mt-8"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">GST Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">Standard Rates</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Standard GST Rate: 18%</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Reduced Rate (Essential goods): 12%</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Lower Rate (Basic necessities): 5%</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">Special Rates</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Luxury/Sin Goods: 28%</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Exempted Goods: 0%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
        
        {/* Category Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="input"
                      placeholder="e.g., Electronics, Clothing, etc."
                      required
                      disabled={currentCategory !== null}
                    />
                    {currentCategory && (
                      <p className="text-xs text-gray-500 mt-1">
                        Category names cannot be changed after creation.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Rate (%) *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="ml-2 text-gray-500">%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      className="btn-primary flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {currentCategory ? 'Update Rate' : 'Add Category'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-outline flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GSTSettings;
