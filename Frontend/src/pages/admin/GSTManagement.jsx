import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Upload, 
  Calculator, 
  TrendingUp, 
  IndianRupee,
  Calendar,
  Settings,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function GSTManagement() {
  const [loading, setLoading] = useState(true);
  const [gstSettings, setGstSettings] = useState({
    defaultRate: 18,
    exemptCategories: [],
    rates: {}
  });
  const [gstReports, setGstReports] = useState([]);  const [analytics, setAnalytics] = useState({
    totalGstCollected: 0,
    monthlyGst: 0,
    yearlyGst: 0,
    exemptOrders: 0
  });
  const [categoryGstRates, setCategoryGstRates] = useState([
    { category: 'Electronics', rate: 18, description: 'Smartphones, laptops, accessories' },
    { category: 'Clothing', rate: 5, description: 'Apparel under ₹1000' },
    { category: 'Books', rate: 0, description: 'Educational books and magazines' },
    { category: 'Food', rate: 5, description: 'Packaged food items' },
    { category: 'Jewelry', rate: 3, description: 'Gold and silver jewelry' },
    { category: 'Home', rate: 18, description: 'Home appliances and furniture' },
    { category: 'Sports', rate: 18, description: 'Sports equipment and gear' },
    { category: 'Health', rate: 12, description: 'Health and wellness products' }
  ]);
  const [isEditMode, setIsEditMode] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    fetchGSTData();
  }, []);  const fetchGSTData = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      const [settingsRes, analyticsRes] = await Promise.all([
        axios.get(`${baseUrl}/api/gst/settings`, {
          withCredentials: true,
          headers
        }),
        axios.get(`${baseUrl}/api/gst/analytics`, {
          withCredentials: true,
          headers
        })
      ]);

      if (settingsRes.data.success) {
        setGstSettings(settingsRes.data.settings);
        
        // Update category GST rates from server data
        const updatedRates = categoryGstRates.map(category => ({
          ...category,
          rate: settingsRes.data.settings.rates[category.category] || category.rate
        }));
        setCategoryGstRates(updatedRates);
      }

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
      
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
      
      // Update the category GST rates with the values from the server
      if (settingsRes.data.settings.rates) {
        setCategoryGstRates(prev => 
          prev.map(item => ({
            ...item,
            rate: settingsRes.data.settings.rates[item.category] !== undefined
              ? settingsRes.data.settings.rates[item.category]
              : item.rate
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching GST data:', error);
      toast.error('Failed to load GST data');
    } finally {
      setLoading(false);
    }
  };
  const updateGSTRate = async (category, newRate) => {
    try {
      // Update the local state immediately for a responsive UI
      const updatedSettings = {
        ...gstSettings,
        rates: {
          ...gstSettings.rates,
          [category]: newRate
        }
      };
      setGstSettings(updatedSettings);
      
      // Send API request to update in the backend
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gst/settings`, 
        { 
          category, 
          rate: newRate 
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`GST rate updated for ${category}`);
        
        // Update categoryGstRates state to reflect the new rate
        setCategoryGstRates(prev => 
          prev.map(item => 
            item.category === category ? { ...item, rate: newRate } : item
          )
        );
      } else {
        toast.error('Failed to update GST rate');
      }
    } catch (error) {
      console.error('Error updating GST rate:', error);
      toast.error(error.response?.data?.message || 'Failed to update GST rate');
      
      // Revert local state changes if API call fails
      fetchGSTData();
    }
  };

  const generateGSTReport = async (period) => {
    try {
      setLoading(true);
      // const response = await axios.post('/api/admin/gst/generate-report', { period });
      
      // Simulate report generation
      toast.success(`GST report for ${period} generated successfully`);
      
      // Trigger download
      const reportData = {
        period,
        totalGST: analytics.totalGstCollected,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gst-report-${period}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating GST report:', error);
      toast.error('Failed to generate GST report');
    } finally {
      setLoading(false);
    }
  };

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
              <FileText className="h-8 w-8 text-gray-600" />
              GST Management
            </h1>
            <p className="text-gray-600 mt-2">Manage GST rates, compliance, and reporting</p>
          </div>

          <motion.div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => generateGSTReport('monthly')}
              className="btn-outline flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download Report
            </motion.button>
          </motion.div>
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
                <p className="text-gray-600 text-sm font-medium">Total GST</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analytics.totalGstCollected.toLocaleString('en-IN')}
                </p>
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
                <p className="text-gray-600 text-sm font-medium">Monthly GST</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analytics.monthlyGst.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
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
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analytics.yearlyGst.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Exempt Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.exemptOrders}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calculator className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* GST Rate Configuration */}
        <motion.div 
          className="card"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Category-wise GST Rates</h2>
            <motion.button
              onClick={() => setIsEditMode(!isEditMode)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isEditMode 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditMode ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditMode ? 'Cancel' : 'Edit Rates'}
            </motion.button>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              <AnimatePresence>
                {categoryGstRates.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.category}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {isEditMode ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="28"
                            step="0.1"
                            defaultValue={item.rate}
                            className="w-20 px-3 py-1 border border-gray-300 rounded-md text-center"
                            onChange={(e) => {
                              const newRate = parseFloat(e.target.value);
                              updateGSTRate(item.category, newRate);
                            }}
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      ) : (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.rate === 0 
                            ? 'bg-gray-100 text-gray-800'
                            : item.rate <= 5
                            ? 'bg-green-100 text-green-800'
                            : item.rate <= 12
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.rate}% GST
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Compliance Status */}
        <motion.div 
          className="card mt-8"
          variants={itemVariants}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Compliance Status</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="flex items-center gap-4 p-4 bg-green-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">GST Registration</h3>
                  <p className="text-sm text-green-600">Active & Valid</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 p-4 bg-green-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Monthly Returns</h3>
                  <p className="text-sm text-green-600">Filed on Time</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Annual Return</h3>
                  <p className="text-sm text-yellow-600">Due in 30 days</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GSTManagement;
