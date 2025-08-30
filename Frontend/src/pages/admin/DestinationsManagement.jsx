import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  PlusCircle,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/auth';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const DestinationsManagement = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDestination, setCurrentDestination] = useState({
    name: '',
    description: '',
    country: '',
    city: '',
    imageUrl: '',
    category: 'beach',
    priceLevel: 3
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('popularityScore');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Categories for destinations
  const categories = [
    { value: 'beach', label: 'Beach' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'city', label: 'City' },
    { value: 'countryside', label: 'Countryside' },
    { value: 'historical', label: 'Historical' },
    { value: 'adventure', label: 'Adventure' }
  ];
  
  // Fetch destinations
  useEffect(() => {
    fetchDestinations();
  }, []);
  
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      // Use test endpoints for development
      const response = await axios.get(
        `${API_BASE_URL}/api/travel/test/destinations`,
        { headers: { ...getAuthHeaders() } }
      );
      
      if (response.data.success) {
        setDestinations(response.data.destinations);
      } else {
        throw new Error('Failed to fetch destinations');
      }
    } catch (error) {
      logger.error('Error fetching destinations:', error);
      setError('Failed to load destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDestination({ ...currentDestination, [name]: value });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'name', 'description', 'country', 'city', 'imageUrl', 'category'
    ];
    
    requiredFields.forEach(field => {
      if (!currentDestination[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    if (currentDestination.description && currentDestination.description.length < 20) {
      errors.description = 'Description should be at least 20 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    try {
      if (isEditing) {
        // Update existing destination
        const response = await axios.put(
          `${API_BASE_URL}/api/travel/test/destinations/${currentDestination._id}`,
          currentDestination,
          { headers: { ...getAuthHeaders() } }
        );
        
        if (response.data.success) {
          toast.success('Destination updated successfully!');
          
          // Update destination in the list
          setDestinations(destinations.map(dest => 
            dest._id === currentDestination._id ? response.data.destination : dest
          ));
        }
      } else {
        // Create new destination
        const response = await axios.post(
          `${API_BASE_URL}/api/travel/test/destinations`,
          currentDestination,
          { headers: { ...getAuthHeaders() } }
        );
        
        if (response.data.success) {
          toast.success('Destination created successfully!');
          
          // Add new destination to the list
          setDestinations([...destinations, response.data.destination]);
        }
      }
      
      // Reset form and close it
      resetForm();
    } catch (error) {
      logger.error('Error saving destination:', error);
      toast.error(error.response?.data?.message || 'Failed to save destination');
    }
  };
  
  // Reset form
  const resetForm = () => {
    setCurrentDestination({
      name: '',
      description: '',
      country: '',
      city: '',
      imageUrl: '',
      category: 'beach',
      priceLevel: 3
    });
    setIsFormOpen(false);
    setIsEditing(false);
    setFormErrors({});
  };
  
  // Edit destination
  const handleEdit = (destination) => {
    setCurrentDestination({ ...destination });
    setIsEditing(true);
    setIsFormOpen(true);
  };
  
  // Delete destination
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) {
      return;
    }
    
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/travel/test/destinations/${id}`,
        { headers: { ...getAuthHeaders() } }
      );
      
      if (response.data.success) {
        toast.success('Destination deleted successfully!');
        
        // Remove destination from the list
        setDestinations(destinations.filter(dest => dest._id !== id));
      }
    } catch (error) {
      logger.error('Error deleting destination:', error);
      toast.error(error.response?.data?.message || 'Failed to delete destination');
    }
  };
  
  // Toggle sort direction
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort destinations
  const filteredAndSortedDestinations = destinations
    .filter(dest => {
      const matchesSearch = 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory ? dest.category === filterCategory : true;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Get the field value to sort by
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle string vs number comparisons
      let comparison = 0;
      if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue - bValue;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  // Render sorting indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };
  
  if (loading && !isFormOpen) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Helmet>
        <title>Destinations Management | Admin Dashboard</title>
      </Helmet>
      
      <h1 className="text-2xl font-bold mb-6">Destinations Management</h1>
      
      {error && !isFormOpen && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Search and filter */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsEditing(false); setIsFormOpen(true); }}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Destination
          </motion.button>
        </div>
      </div>
      
      {/* Destinations table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  <span>Category</span>
                  {renderSortIndicator('category')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('averageRating')}
              >
                <div className="flex items-center">
                  <span>Rating</span>
                  {renderSortIndicator('averageRating')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('numReviews')}
              >
                <div className="flex items-center">
                  <span>Reviews</span>
                  {renderSortIndicator('numReviews')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('popularityScore')}
              >
                <div className="flex items-center">
                  <span>Popularity</span>
                  {renderSortIndicator('popularityScore')}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {filteredAndSortedDestinations.length > 0 ? (
                filteredAndSortedDestinations.map(destination => (
                  <motion.tr 
                    key={destination._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex-shrink-0 mr-4">
                          <img 
                            src={destination.imageUrl} 
                            alt={destination.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{destination.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{destination.city}, {destination.country}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full capitalize">
                        {destination.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{destination.averageRating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {destination.numReviews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(destination.popularityScore || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {((destination.popularityScore || 0) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          onClick={() => handleEdit(destination)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(destination._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    {searchTerm || filterCategory
                      ? 'No destinations match your search or filters'
                      : 'No destinations found. Add your first destination!'}
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Destination form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {isEditing ? 'Edit Destination' : 'Add New Destination'}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Basic info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentDestination.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter destination name"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={currentDestination.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.category && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={currentDestination.country}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter country"
                      />
                      {formErrors.country && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={currentDestination.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter city"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={currentDestination.imageUrl}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.imageUrl ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter image URL"
                      />
                      {formErrors.imageUrl && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.imageUrl}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Level (1-5)
                      </label>
                      <input
                        type="number"
                        name="priceLevel"
                        min="1"
                        max="5"
                        value={currentDestination.priceLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={currentDestination.description}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter destination description"
                      />
                      {formErrors.description && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {isEditing ? 'Update Destination' : 'Add Destination'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationsManagement;
