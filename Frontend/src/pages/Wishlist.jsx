import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  ArrowLeft,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Grid,
  List,
  Star,
  Eye
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

// Skeleton loader component for wishlist items
const WishlistItemSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full">
    <div className="relative pt-[100%] bg-gray-200 animate-pulse">
      <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
    </div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="flex items-center mb-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-12 ml-2 animate-pulse"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
      <div className="flex items-center justify-between gap-2 mt-4">
        <div className="h-9 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
        <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);

const Wishlist = () => {
  const navigate = useNavigate();
  const { items: wishlistItems, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
    const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSubcategory, setFilterSubcategory] = useState('all');
  const [filterProductType, setFilterProductType] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSubcategoryMenuOpen, setIsSubcategoryMenuOpen] = useState(false);
  const [isProductTypeMenuOpen, setIsProductTypeMenuOpen] = useState(false);
  
  // Extract unique categories from wishlist items
  const categories = wishlistItems.length > 0 
    ? ['all', ...new Set(wishlistItems.filter(item => item.category).map(item => item.category))]
    : ['all'];
  
  // Extract subcategories for when a category is selected
  const subcategories = filterCategory !== 'all' && wishlistItems.length > 0
    ? ['all', ...new Set(wishlistItems
        .filter(item => item.category === filterCategory && item.subcategory)
        .map(item => item.subcategory))]
    : [];
  
  // Extract product types for when both category and subcategory are selected
  const productTypes = filterSubcategory !== 'all' && wishlistItems.length > 0
    ? ['all', ...new Set(wishlistItems
        .filter(item => 
          item.category === filterCategory && 
          item.subcategory === filterSubcategory && 
          item.productType)
        .map(item => item.productType))]
    : [];

  // Filter and sort wishlist items
  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filterCategory === 'all' || 
                            (item.category === filterCategory);
                            
      const matchesSubcategory = filterSubcategory === 'all' || 
                               !filterSubcategory || 
                               (item.subcategory === filterSubcategory);
                               
      const matchesProductType = filterProductType === 'all' || 
                               !filterProductType || 
                               (item.productType === filterProductType);
                               
      return matchesSearch && matchesCategory && matchesSubcategory && matchesProductType;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = (product) => {
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand || '',
        stock: product.stock || 99,
        quantity: 1
      });
      toast.success(`${product.name} added to cart`);
      removeFromWishlist(product.id);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };
  
  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Wishlist | IndiaBazaar</title>
        <meta name="description" content="View and manage your saved items in your wishlist." />
      </Helmet>

      <div className="min-h-screen bg-white pt-8 lg:pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="sm:text-3xl text-xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                  <Heart className="h-8 w-8 text-gray-800" />
                  My Wishlist
                  <span className="text-xl font-medium text-gray-500">
                    ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
                  </span>
                </h1>
                <p className="text-gray-600">Items you've saved for later</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  to="/products" 
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <motion.div 
                className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search in wishlist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>                  <div className="flex items-center gap-3">
                    {(searchQuery || filterCategory !== 'all' || filterSubcategory !== 'all' || filterProductType !== 'all' || sortOption !== 'default') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterCategory('all');
                          setFilterSubcategory('all');
                          setFilterProductType('all');
                          setSortOption('default');
                        }}
                        className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                    
                    <div className="flex items-center border border-gray-300 rounded-lg p-1">
                      <motion.button 
                        onClick={() => setViewMode('grid')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2.5 rounded-lg ${
                          viewMode === 'grid' 
                            ? 'bg-black text-white' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Grid className="h-5 w-5" />
                      </motion.button>
                      <motion.button 
                        onClick={() => setViewMode('list')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2.5 rounded-lg ${
                          viewMode === 'list' 
                            ? 'bg-black text-white' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <List className="h-5 w-5" />
                      </motion.button>
                    </div>

                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="default">Sort by</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="name_asc">Name: A-Z</option>
                      <option value="name_desc">Name: Z-A</option>
                    </select>                    {/* Category Filter */}
                    {categories.length > 1 && (
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setIsFilterMenuOpen(!isFilterMenuOpen);
                            setIsSubcategoryMenuOpen(false);
                            setIsProductTypeMenuOpen(false);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent inline-flex items-center"
                        >
                          <SlidersHorizontal className="h-5 w-5 mr-2" />
                          {filterCategory === 'all' ? 'All Categories' : filterCategory}
                        </motion.button>

                        <AnimatePresence>
                          {isFilterMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                            >
                              {categories.map((category) => (
                                <motion.button
                                  key={category}
                                  onClick={() => {
                                    setFilterCategory(category);
                                    setFilterSubcategory('all');
                                    setFilterProductType('all');
                                    setIsFilterMenuOpen(false);
                                  }}
                                  whileHover={{ backgroundColor: '#F3F4F6' }}
                                  className={`w-full px-4 py-2 text-left text-sm ${
                                    category === filterCategory
                                      ? 'bg-gray-100 text-gray-900 font-medium'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {category === 'all' ? 'All Categories' : category}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Subcategory Filter */}
                    {filterCategory !== 'all' && subcategories.length > 1 && (
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setIsSubcategoryMenuOpen(!isSubcategoryMenuOpen);
                            setIsFilterMenuOpen(false);
                            setIsProductTypeMenuOpen(false);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent inline-flex items-center"
                        >
                          <SlidersHorizontal className="h-5 w-5 mr-2" />
                          {filterSubcategory === 'all' ? `All ${filterCategory}` : filterSubcategory}
                        </motion.button>

                        <AnimatePresence>
                          {isSubcategoryMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                            >
                              {subcategories.map((subcategory) => (
                                <motion.button
                                  key={subcategory}
                                  onClick={() => {
                                    setFilterSubcategory(subcategory);
                                    setFilterProductType('all');
                                    setIsSubcategoryMenuOpen(false);
                                  }}
                                  whileHover={{ backgroundColor: '#F3F4F6' }}
                                  className={`w-full px-4 py-2 text-left text-sm ${
                                    subcategory === filterSubcategory
                                      ? 'bg-gray-100 text-gray-900 font-medium'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {subcategory === 'all' ? `All ${filterCategory}` : subcategory}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Product Type Filter */}
                    {filterCategory !== 'all' && filterSubcategory !== 'all' && productTypes.length > 1 && (
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setIsProductTypeMenuOpen(!isProductTypeMenuOpen);
                            setIsFilterMenuOpen(false);
                            setIsSubcategoryMenuOpen(false);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent inline-flex items-center"
                        >
                          <SlidersHorizontal className="h-5 w-5 mr-2" />
                          {filterProductType === 'all' ? `All ${filterSubcategory}` : filterProductType}
                        </motion.button>

                        <AnimatePresence>
                          {isProductTypeMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                            >
                              {productTypes.map((type) => (
                                <motion.button
                                  key={type}
                                  onClick={() => {
                                    setFilterProductType(type);
                                    setIsProductTypeMenuOpen(false);
                                  }}
                                  whileHover={{ backgroundColor: '#F3F4F6' }}
                                  className={`w-full px-4 py-2 text-left text-sm ${
                                    type === filterProductType
                                      ? 'bg-gray-100 text-gray-900 font-medium'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {type === 'all' ? `All ${filterSubcategory}` : type}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {Array(8).fill().map((_, index) => (
                <WishlistItemSkeleton key={index} />
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16 px-4"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <Heart className="h-16 w-16 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your wishlist is empty
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Browse our products and save your favorites here to find them easily later.
                    We'll notify you if they go on sale!
                  </p>
                  <Link 
                    to="/products"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors"
                  >
                    Browse Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                >
                  <div className="max-w-sm mx-auto">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <motion.button                      onClick={() => {
                        setSearchQuery('');
                        setFilterCategory('all');
                        setFilterSubcategory('all');
                        setFilterProductType('all');
                        setSortOption('default');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      layout
                      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-48 h-48 shrink-0' : 'aspect-square'}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <motion.button
                            onClick={() => removeFromWishlist(item.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 shadow-md hover:shadow-lg transition-all"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleViewProduct(item.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg transition-all"
                          >
                            <Eye className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-black/70 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {item.category}
                            {item.subcategory && ` › ${item.subcategory}`}
                            {item.productType && ` › ${item.productType}`}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 mb-4">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>

                        <motion.button
                          onClick={() => handleAddToCart(item)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-black text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
