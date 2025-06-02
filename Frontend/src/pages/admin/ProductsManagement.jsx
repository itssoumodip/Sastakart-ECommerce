import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, Filter, ArrowUpDown, Plus, Package, Eye, ShoppingBag, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthToken, getAuthHeaders } from '../../utils/auth';

function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalLowStock, setTotalLowStock] = useState(0);
  const [totalOutOfStock, setTotalOutOfStock] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 12;
  
  // Categories with subcategories and product types
  const categoryTree = {
    'Electronics': {
      'Smartphones': ['iPhone', 'Android', 'Feature Phones'],
      'Laptops': ['Gaming', 'Business', 'Student', 'Convertible'],
      'Audio': ['Headphones', 'Speakers', 'Earbuds', 'Microphones'],
      'Cameras': ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Cameras'],
      'Accessories': ['Chargers', 'Cases', 'Screen Protectors', 'Stands']
    },
    'Clothing': {
      'Men': ['T-shirts', 'Shirts', 'Pants', 'Jeans', 'Jackets', 'Sweaters', 'Underwear', 'Socks'],
      'Women': ['Tops', 'Dresses', 'Skirts', 'Pants', 'Jeans', 'Jackets', 'Lingerie', 'Activewear'],
      'Kids': ['Boys', 'Girls', 'Infants', 'Shoes', 'School Wear']
    },
    'Home & Kitchen': {
      'Furniture': ['Living Room', 'Bedroom', 'Dining', 'Office'],
      'Cookware': ['Pots & Pans', 'Kitchen Tools', 'Bakeware', 'Knives'],
      'Bedding': ['Sheets', 'Pillows', 'Comforters', 'Mattresses'],
      'Decor': ['Wall Art', 'Lighting', 'Rugs', 'Curtains']
    },
    'Beauty & Personal Care': {
      'Skincare': ['Cleansers', 'Moisturizers', 'Serums', 'Face Masks', 'Sunscreen'],
      'Makeup': ['Face', 'Eyes', 'Lips', 'Nails', 'Brushes'],
      'Haircare': ['Shampoo', 'Conditioner', 'Styling', 'Hair Color', 'Treatments'],
      'Fragrance': ['Women\'s Perfume', 'Men\'s Cologne', 'Gift Sets']
    },
    'Others': {}
  };

  // API Functions
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page,
        limit: productsPerPage,
        // Add other filters if they're not 'all'
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(subcategoryFilter !== 'all' && { subcategory: subcategoryFilter }),
        ...(productTypeFilter !== 'all' && { productType: productTypeFilter }),
        ...(sortBy === 'name' && { sort: `title_${sortOrder}` }),
        ...(sortBy === 'price' && { sort: `price_${sortOrder}` }),
        ...(sortBy === 'inventory' && { sort: `stock_${sortOrder}` })
      });

      const response = await axios.get(`${API_ENDPOINTS.PRODUCTS}?${params.toString()}`);
      
      if (response.data.success) {
        // Transform backend data to match frontend structure
        const transformedProducts = response.data.products.map(product => ({
          id: product._id,
          name: product.title,
          price: product.price,
          category: product.category,
          subcategory: product.subcategory || '',
          productType: product.productType || '',
          inventory: product.stock || 0,
          status: product.stock > 0 ? (product.stock < 10 ? 'Low Stock' : 'Active') : 'Out of Stock',
          image: product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100x100'
        }));
        
        setProducts(transformedProducts);
        setTotalProducts(response.data.totalProducts);
        setTotalPages(response.data.totalPages);
        setFilteredProducts(transformedProducts);

        // Calculate total counts for each status
        if (page === 1 && !searchTerm && categoryFilter === 'all' && subcategoryFilter === 'all' && productTypeFilter === 'all') {
          const activeCount = response.data.products.filter(p => p.stock >= 10).length;
          const lowStockCount = response.data.products.filter(p => p.stock > 0 && p.stock < 10).length;
          const outOfStockCount = response.data.products.filter(p => p.stock === 0).length;
          setTotalActive(activeCount);
          setTotalLowStock(lowStockCount);
          setTotalOutOfStock(outOfStockCount);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteProduct = async (productId) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_ENDPOINTS.PRODUCTS}/${productId}`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      
      if (response.data.success) {
        toast.success('Product deleted successfully');
        fetchProducts(currentPage); // Refresh the products list
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  // Load products on component mount and when filters/pagination change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, searchTerm, categoryFilter, subcategoryFilter, productTypeFilter, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
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

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'Active':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <Package className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'Low Stock':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Stock
          </span>
        );
      case 'Out of Stock':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            Out of Stock
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <Package className="h-3 w-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Products Management | E-Commerce Store</title>
        </Helmet>

        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-gray-600" />
              Products
            </h1>
            <p className="text-gray-600 mt-2">Manage your product catalog and inventory</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/admin/products/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </Link>
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
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{totalLowStock}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{totalOutOfStock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="card p-6 mb-8"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubcategoryFilter('all');
                setProductTypeFilter('all');
              }}
              className="input"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryTree).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {categoryFilter !== 'all' && (
              <select
                value={subcategoryFilter}
                onChange={(e) => {
                  setSubcategoryFilter(e.target.value);
                  setProductTypeFilter('all');
                }}
                className="input"
              >
                <option value="all">All Subcategories</option>
                {Object.keys(categoryTree[categoryFilter] || {}).map(subcategory => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
            )}
            
            {categoryFilter !== 'all' && subcategoryFilter !== 'all' && categoryTree[categoryFilter]?.[subcategoryFilter]?.length > 0 && (
              <select
                value={productTypeFilter}
                onChange={(e) => setProductTypeFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Product Types</option>
                {categoryTree[categoryFilter]?.[subcategoryFilter]?.map(productType => (
                  <option key={productType} value={productType}>{productType}</option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            
            <motion.button
              onClick={() => handleSort('name')}
              className="btn-outline flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort by {sortBy}
            </motion.button>
            
            {(searchTerm || categoryFilter !== 'all' || subcategoryFilter !== 'all' || productTypeFilter !== 'all' || statusFilter !== 'all') && (
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setSubcategoryFilter('all');
                  setProductTypeFilter('all');
                  setStatusFilter('all');
                }}
                className="btn-outline flex items-center justify-center gap-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear Filters
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <motion.div 
            className="flex justify-center items-center py-16"
            variants={itemVariants}
          >
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            className="flex justify-center items-center py-16"
            variants={itemVariants}
          >
            <div className="card p-16 text-center max-w-lg w-full">
              <div className="flex justify-center mb-6">
                <Search className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No products found</h2>
              <p className="text-gray-600 mb-8">Try adjusting your filters or search terms.</p>
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setSubcategoryFilter('all');
                  setProductTypeFilter('all');
                  setStatusFilter('all');
                }}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              variants={itemVariants}
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="card overflow-hidden hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(product.status)}
                      </div>
                    </div>
                      <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {product.category}
                        {product.subcategory && ` › ${product.subcategory}`}
                        {product.productType && ` › ${product.productType}`}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-sm text-gray-600">Stock: {product.inventory}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="flex-1 btn-outline flex items-center justify-center gap-1 text-sm py-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                        <motion.button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Updated Pagination */}
            {totalPages > 1 && (
              <motion.div 
                className="card p-6"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <motion.button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-1 rounded ${
                            currentPage === i + 1
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {i + 1}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ProductsManagement;
