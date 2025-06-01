import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Upload, 
  Calculator, 
  TrendingUp, 
  IndianRupee,
  Calendar,
  Search,
  Filter,
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
  const [gstReports, setGstReports] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalGstCollected: 0,
    monthlyGst: 0,
    yearlyGst: 0,
    exemptOrders: 0
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const categoryGstRates = [
    { category: 'Electronics', rate: 18, description: 'Smartphones, laptops, accessories' },
    { category: 'Clothing', rate: 5, description: 'Apparel under ₹1000' },
    { category: 'Books', rate: 0, description: 'Educational books and magazines' },
    { category: 'Food', rate: 5, description: 'Packaged food items' },
    { category: 'Jewelry', rate: 3, description: 'Gold and silver jewelry' },
    { category: 'Home', rate: 18, description: 'Home appliances and furniture' },
    { category: 'Sports', rate: 18, description: 'Sports equipment and gear' },
    { category: 'Health', rate: 12, description: 'Health and wellness products' }
  ];

  useEffect(() => {
    fetchGSTData();
  }, []);

  const fetchGSTData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls - replace with actual endpoints
      const [settingsRes, reportsRes, analyticsRes] = await Promise.all([
        // axios.get('/api/admin/gst/settings'),
        // axios.get('/api/admin/gst/reports'),
        // axios.get('/api/admin/gst/analytics')
        Promise.resolve({ data: { success: true, settings: gstSettings } }),
        Promise.resolve({ data: { success: true, reports: [] } }),
        Promise.resolve({ data: { success: true, analytics: analytics } })
      ]);

      setGstSettings(settingsRes.data.settings);
      setGstReports(reportsRes.data.reports);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Error fetching GST data:', error);
      toast.error('Failed to load GST data');
    } finally {
      setLoading(false);
    }
  };

  const updateGSTRate = async (category, newRate) => {
    try {
      const updatedSettings = {
        ...gstSettings,
        rates: {
          ...gstSettings.rates,
          [category]: newRate
        }
      };

      // await axios.put('/api/admin/gst/settings', updatedSettings);
      setGstSettings(updatedSettings);
      toast.success(`GST rate updated for ${category}`);
    } catch (error) {
      console.error('Error updating GST rate:', error);
      toast.error('Failed to update GST rate');
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST Management</h1>
          <p className="text-gray-600 mt-1">Manage GST rates, compliance, and reporting</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => generateGSTReport('monthly')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Monthly Report
          </button>
          <button 
            onClick={() => generateGSTReport('yearly')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Yearly Report
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total GST Collected</h3>
          <p className="text-2xl font-bold text-gray-900">₹{analytics.totalGstCollected.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500 mt-2">All time collection</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">This month</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly GST</h3>
          <p className="text-2xl font-bold text-gray-900">₹{analytics.monthlyGst.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500 mt-2">Current month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">YTD</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Yearly GST</h3>
          <p className="text-2xl font-bold text-gray-900">₹{analytics.yearlyGst.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500 mt-2">Year to date</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calculator className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-orange-600 font-medium">Exempt</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Exempt Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.exemptOrders}</p>
          <p className="text-sm text-gray-500 mt-2">Zero-rated items</p>
        </motion.div>
      </div>

      {/* GST Rate Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Category-wise GST Rates</h2>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isEditMode ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditMode ? 'Cancel' : 'Edit Rates'}
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
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
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Compliance Status</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">GST Registration</h3>
                <p className="text-sm text-green-600">Active & Valid</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Monthly Returns</h3>
                <p className="text-sm text-green-600">Filed on Time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <h3 className="font-medium text-gray-900">Annual Return</h3>
                <p className="text-sm text-yellow-600">Due in 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calculator className="w-8 h-8 text-blue-600" />
              <span className="font-medium text-gray-900">GST Calculator</span>
            </button>
            
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-8 h-8 text-green-600" />
              <span className="font-medium text-gray-900">Upload Invoice</span>
            </button>
            
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="font-medium text-gray-900">View Returns</span>
            </button>
            
            <button className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-8 h-8 text-gray-600" />
              <span className="font-medium text-gray-900">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>  );
}

export default GSTManagement;
