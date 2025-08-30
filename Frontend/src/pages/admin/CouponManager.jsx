import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Tag,
  Search,
  X,
  Clock,
  BarChart4,
  Ticket,
  RefreshCcw,
  PercentIcon,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/auth';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { logger } from '../../utils/logger';

const CouponManager = () => {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 0,
    maxDiscount: null,
    validFrom: format(new Date(), 'yyyy-MM-dd'),
    validUntil: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
    usageLimit: null,
    isActive: true,
    applicableCategories: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('code');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 10;
  
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
  
  // Fetch coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        logger.debug('Fetching coupons from:', API_BASE_URL + API_ENDPOINTS.COUPONS);
        logger.debug('Auth Headers:', getAuthHeaders());
        try {
          // For testing, we'll use the non-authenticated endpoint
          const response = await axios.get(
            `${API_BASE_URL}${API_ENDPOINTS.COUPONS}`
            // No auth headers for test endpoint
          );
          logger.debug('Coupons Response:', response.status, response.data);
          
          if (response.data.success) {
            setCoupons(response.data.coupons || []);
          }
        } catch (error) {
          logger.error('Coupons Error:', error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : error.message);
          toast.error(`Coupons API Error: ${error.response ? error.response.status + ' ' + error.response.statusText : error.message}`);
        }
      } catch (error) {
        logger.error('Error fetching coupons:', error);
        toast.error('Failed to fetch coupons. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoupons();
    
    // Fetch product categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.GST_SETTINGS}`,
          { headers: getAuthHeaders() }
        );
        
        if (response.data.success) {
          setCategories(Object.keys(response.data.settings.rates || {}));
        }
      } catch (error) {
        logger.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle filtering and sorting
  const filteredAndSortedCoupons = React.useMemo(() => {
    let filtered = [...coupons];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(coupon => 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(coupon => coupon.isActive === isActive);
    }
    
    // Filter by discount type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.discountType === typeFilter);
    }
    
    // Sort coupons
    filtered.sort((a, b) => {
      let fieldA, fieldB;
      
      switch (sortBy) {
        case 'code':
          fieldA = a.code;
          fieldB = b.code;
          break;
        case 'discount':
          fieldA = a.discountValue;
          fieldB = b.discountValue;
          break;
        case 'expires':
          fieldA = new Date(a.validUntil);
          fieldB = new Date(b.validUntil);
          break;
        case 'usage':
          fieldA = a.usageCount || 0;
          fieldB = b.usageCount || 0;
          break;
        default:
          fieldA = a.code;
          fieldB = b.code;
      }
      
      if (typeof fieldA === 'string') {
        return sortOrder === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
    });
    
    return filtered;
  }, [coupons, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setCurrentCoupon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCategoryToggle = (category) => {
    setCurrentCoupon(prev => {
      const isSelected = prev.applicableCategories.includes(category);
      
      return {
        ...prev,
        applicableCategories: isSelected 
          ? prev.applicableCategories.filter(c => c !== category)
          : [...prev.applicableCategories, category]
      };
    });
  };
  
  const resetForm = () => {
    setCurrentCoupon({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 0,
      maxDiscount: null,
      validFrom: format(new Date(), 'yyyy-MM-dd'),
      validUntil: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
      usageLimit: null,
      isActive: true,
      applicableCategories: []
    });
  };
  
  const openAddModal = () => {
    resetForm();
    setIsEditMode(false);
    setShowModal(true);
  };
  
  const openEditModal = (coupon) => {
    setCurrentCoupon({
      ...coupon,
      validFrom: format(new Date(coupon.validFrom), 'yyyy-MM-dd'),
      validUntil: format(new Date(coupon.validUntil), 'yyyy-MM-dd'),
      maxDiscount: coupon.maxDiscount || '',
      usageLimit: coupon.usageLimit || ''
    });
    setIsEditMode(true);
    setShowModal(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format data
      const formData = {
        ...currentCoupon,
        maxDiscount: currentCoupon.maxDiscount === '' ? null : Number(currentCoupon.maxDiscount),
        usageLimit: currentCoupon.usageLimit === '' ? null : Number(currentCoupon.usageLimit),
        discountValue: Number(currentCoupon.discountValue),
        minPurchase: Number(currentCoupon.minPurchase)
      };
      
      let response;
      
      if (isEditMode) {
        response = await axios.put(
          `${API_BASE_URL}${API_ENDPOINTS.COUPON_DETAILS(currentCoupon._id)}`,
          formData,
          { headers: getAuthHeaders() }
        );
        
        if (response.data.success) {
          toast.success('Coupon updated successfully');
          setCoupons(prev => 
            prev.map(coupon => 
              coupon._id === currentCoupon._id ? response.data.coupon : coupon
            )
          );
        }
      } else {
        response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.COUPONS}`,
          formData,
          { headers: getAuthHeaders() }
        );
        
        if (response.data.success) {
          toast.success('Coupon created successfully');
          setCoupons(prev => [...prev, response.data.coupon]);
        }
      }
      
      setShowModal(false);
    } catch (error) {
      logger.error('Error saving coupon:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save coupon. Please try again.');
      }
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.COUPON_DETAILS(id)}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        toast.success('Coupon deleted successfully');
        setCoupons(prev => prev.filter(coupon => coupon._id !== id));
      }
    } catch (error) {
      logger.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon. Please try again.');
    }
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };
  
  // Pagination
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredAndSortedCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(filteredAndSortedCoupons.length / couponsPerPage);
  
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Coupon Manager | SastaKart Admin</title>
        </Helmet>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
              <p className="text-gray-600">Loading coupons...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Page header */}
            <motion.div 
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-gray-600" />
                  Coupons
                </h1>
                <p className="text-gray-600 mt-2">Create and manage discount coupons for your store</p>
              </div>
              <motion.button
                onClick={openAddModal}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-5 w-5" />
                Add Coupon
              </motion.button>
            </motion.div>
            
            {/* Stats Cards */}
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
                    <p className="text-gray-600 text-sm font-medium">Total Coupons</p>
                    <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Coupons</p>
                    <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => c.isActive).length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Percentage Coupons</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {coupons.filter(c => c.discountType === 'percentage').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <PercentIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Fixed Coupons</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {coupons.filter(c => c.discountType === 'fixed').length}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Tag className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Filters and Search */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6 mb-8"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search coupons..."
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
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Types</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                
                <motion.button
                  onClick={() => handleSort('code')}
                  className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by {sortBy === 'code' ? 'Code' : sortBy === 'discount' ? 'Discount' : sortBy === 'expires' ? 'Expiry' : 'Usage'}
                </motion.button>
              </div>
            </motion.div>
            
            {/* Coupons Table */}
            {filteredAndSortedCoupons.length === 0 ? (
              <motion.div 
                className="flex justify-center items-center py-16"
                variants={itemVariants}
              >
                <div className="card p-16 text-center max-w-lg w-full">
                  <div className="flex justify-center mb-6">
                    <Search className="h-16 w-16 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No coupons found</h2>
                  <p className="text-gray-600 mb-8">
                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                      ? 'Try adjusting your filters or search terms.' 
                      : 'Get started by creating your first coupon!'}
                  </p>
                  {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') ? (
                    <motion.button
                      onClick={resetFilters}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear Filters
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={openAddModal}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create First Coupon
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="card overflow-hidden"
                variants={itemVariants}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            className="flex items-center"
                            onClick={() => handleSort('code')}
                          >
                            Code {sortBy === 'code' && <ArrowUpDown className="h-3 w-3 ml-1" />}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            className="flex items-center"
                            onClick={() => handleSort('discount')}
                          >
                            Discount {sortBy === 'discount' && <ArrowUpDown className="h-3 w-3 ml-1" />}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            className="flex items-center"
                            onClick={() => handleSort('expires')}
                          >
                            Validity {sortBy === 'expires' && <ArrowUpDown className="h-3 w-3 ml-1" />}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            className="flex items-center"
                            onClick={() => handleSort('usage')}
                          >
                            Usage {sortBy === 'usage' && <ArrowUpDown className="h-3 w-3 ml-1" />}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentCoupons.map((coupon, index) => (
                          <motion.tr
                            key={coupon._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-blue-600">{coupon.code}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">{coupon.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {coupon.discountType === 'percentage' ? (
                                  <>
                                    <span className="font-medium">{coupon.discountValue}%</span> 
                                    {coupon.maxDiscount && <span className="text-xs text-gray-500"> (Max ₹{coupon.maxDiscount})</span>}
                                  </>
                                ) : (
                                  <span className="font-medium">₹{coupon.discountValue} Fixed</span>
                                )}
                              </div>
                              {coupon.minPurchase > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Min. order: ₹{coupon.minPurchase}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="flex items-center text-gray-900">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{format(new Date(coupon.validFrom), 'dd/MM/yyyy')}</span>
                                </div>
                                <div className="flex items-center text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>{format(new Date(coupon.validUntil), 'dd/MM/yyyy')}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <BarChart4 className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-sm text-gray-900">
                                  {coupon.usageCount || 0} / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex justify-center">
                                {coupon.isActive ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <motion.button
                                  onClick={() => openEditModal(coupon)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Edit className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDelete(coupon._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
            {/* Pagination */}
            {filteredAndSortedCoupons.length > couponsPerPage && (
              <motion.div 
                className="card p-6 mt-6"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstCoupon + 1} to {Math.min(indexOfLastCoupon, filteredAndSortedCoupons.length)} of {filteredAndSortedCoupons.length} coupons
                  </p>
                  <div className="flex space-x-2">
                    <motion.button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      
        {/* Coupon Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full max-w-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-blue-600" />
                    {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                        Coupon Code*
                      </label>
                      <input
                        id="code"
                        name="code"
                        className="input uppercase"
                        type="text"
                        placeholder="e.g., WELCOME10"
                        value={currentCoupon.code}
                        onChange={handleInputChange}
                        required
                        disabled={isEditMode} // Cannot edit code in edit mode
                      />
                      {isEditMode && (
                        <p className="text-xs text-gray-500 mt-1">
                          Coupon codes cannot be changed after creation.
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discountType">
                        Discount Type*
                      </label>
                      <select
                        id="discountType"
                        name="discountType"
                        className="input"
                        value={currentCoupon.discountType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="input"
                      rows="2"
                      placeholder="Describe the coupon and its benefits"
                      value={currentCoupon.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discountValue">
                        {currentCoupon.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}*
                      </label>
                      <input
                        id="discountValue"
                        name="discountValue"
                        className="input"
                        type="number"
                        min="0"
                        step={currentCoupon.discountType === 'percentage' ? '1' : '0.01'}
                        value={currentCoupon.discountValue}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="minPurchase">
                        Min. Purchase (₹)
                      </label>
                      <input
                        id="minPurchase"
                        name="minPurchase"
                        className="input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentCoupon.minPurchase}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    {currentCoupon.discountType === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="maxDiscount">
                          Max. Discount (₹)
                        </label>
                        <input
                          id="maxDiscount"
                          name="maxDiscount"
                          className="input"
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentCoupon.maxDiscount}
                          onChange={handleInputChange}
                          placeholder="No limit"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="validFrom">
                        Valid From*
                      </label>
                      <input
                        id="validFrom"
                        name="validFrom"
                        className="input"
                        type="date"
                        value={currentCoupon.validFrom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="validUntil">
                        Valid Until*
                      </label>
                      <input
                        id="validUntil"
                        name="validUntil"
                        className="input"
                        type="date"
                        value={currentCoupon.validUntil}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="usageLimit">
                        Usage Limit
                      </label>
                      <input
                        id="usageLimit"
                        name="usageLimit"
                        className="input"
                        type="number"
                        min="0"
                        step="1"
                        value={currentCoupon.usageLimit}
                        onChange={handleInputChange}
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Applicable Categories
                    </label>
                    <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div className="flex items-center mb-2" key={category}>
                            <input
                              id={`category-${category}`}
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600 rounded"
                              checked={currentCoupon.applicableCategories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                            />
                            <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                              {category}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No categories found</p>
                      )}
                      {currentCoupon.applicableCategories.length === 0 && categories.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          If no categories are selected, the coupon will apply to all products.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                      checked={currentCoupon.isActive}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Coupon is active and ready to use
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-4 border-t mt-4">
                    <motion.button
                      type="submit"
                      className="btn-primary flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isEditMode ? 'Update Coupon' : 'Create Coupon'}
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

export default CouponManager;
