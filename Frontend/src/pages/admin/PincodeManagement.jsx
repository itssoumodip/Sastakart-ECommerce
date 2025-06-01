import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Search,
  Check,
  X,
  Download,
  Upload,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function PincodeManagement() {
  const [pincodes, setPincodes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [checkPincode, setCheckPincode] = useState('');
  const [checkResult, setCheckResult] = useState(null);

  useEffect(() => {
    fetchPincodeData();
  }, []);

  const fetchPincodeData = async () => {
    try {
      setLoading(true);
      const [pincodesResponse, analyticsResponse] = await Promise.all([
        axios.get('/api/pincode/admin/pincodes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/pincode/admin/pincodes/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setPincodes(pincodesResponse.data.pincodes);
      setAnalytics(analyticsResponse.data.analytics);
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      toast.error('Failed to load pincode data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPincode = async () => {
    if (!newPincode || newPincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      await axios.post('/api/pincode/admin/pincodes/add', 
        { pincode: newPincode },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      toast.success('Pincode added successfully!');
      setNewPincode('');
      setShowAddModal(false);
      fetchPincodeData();
    } catch (error) {
      console.error('Error adding pincode:', error);
      toast.error(error.response?.data?.message || 'Failed to add pincode');
    }
  };

  const handleRemovePincode = async (pincode) => {
    if (!window.confirm(`Are you sure you want to remove pincode ${pincode} from serviceable areas?`)) {
      return;
    }

    try {
      await axios.delete('/api/pincode/admin/pincodes/remove', {
        data: { pincode },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success('Pincode removed successfully!');
      fetchPincodeData();
    } catch (error) {
      console.error('Error removing pincode:', error);
      toast.error('Failed to remove pincode');
    }
  };

  const handleCheckPincode = async () => {
    if (!checkPincode || checkPincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      const response = await axios.get(`/api/pincode/check/${checkPincode}`);
      setCheckResult(response.data);
    } catch (error) {
      console.error('Error checking pincode:', error);
      toast.error('Failed to check pincode');
    }
  };

  const filteredPincodes = pincodes.filter(pincode =>
    pincode.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pincode Management</h1>
          <p className="text-gray-600 mt-1">Manage delivery serviceability across India</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Bulk Import
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Pincode
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              Serviceable
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analytics.totalServiceablePincodes || 0}
          </h3>
          <p className="text-gray-600 text-sm">Total Pincodes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              Coverage
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analytics.coveragePercentage || 0}%
          </h3>
          <p className="text-gray-600 text-sm">India Coverage</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Plus className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analytics.newPincodesThisMonth || 0}
          </h3>
          <p className="text-gray-600 text-sm">New Pincodes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
              Top Cities
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analytics.topServiceableCities?.length || 0}
          </h3>
          <p className="text-gray-600 text-sm">Major Cities</p>
        </motion.div>
      </div>

      {/* Pincode Checker */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Check Pincode Serviceability</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Pincode
            </label>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit pincode"
              value={checkPincode}
              onChange={(e) => setCheckPincode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleCheckPincode}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check
          </button>
        </div>
        
        {checkResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            checkResult.isServiceable 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {checkResult.isServiceable ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                checkResult.isServiceable ? 'text-green-800' : 'text-red-800'
              }`}>
                {checkResult.message}
              </span>
            </div>
            {checkResult.isServiceable && checkResult.estimatedDelivery && (
              <p className="text-sm text-green-600 mt-1">
                Estimated delivery: {new Date(checkResult.estimatedDelivery).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Top Cities */}
      {analytics.topServiceableCities && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Serviceable Cities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topServiceableCities.map((city, index) => (
              <div key={city.city} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{city.city}</h4>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{city.pincodes} pincodes • {city.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pincodes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Serviceable Pincodes</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search pincodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredPincodes.map((pincode) => (
              <div
                key={pincode}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">{pincode}</span>
                <button
                  onClick={() => handleRemovePincode(pincode)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove pincode"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filteredPincodes.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pincodes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search' : 'Add pincodes to start managing delivery areas'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Pincode Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Pincode</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit pincode"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewPincode('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPincode}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Pincode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PincodeManagement;
