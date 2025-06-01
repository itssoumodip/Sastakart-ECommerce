import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  X,
  Info,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Skeleton loader component for wishlist items
const WishlistItemSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
    <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/5 animate-pulse"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);

const Wishlist = () => {
  const { items: wishlistItems, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Extract unique categories from wishlist items
  const categories = ['all', ...new Set(wishlistItems.map(item => item.category.toLowerCase()))];
  
  // Filter and sort wishlist items
  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || 
                            item.category.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
  };

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
  
  // Generate skeleton loaders
  const skeletons = Array(3).fill().map((_, index) => (
    <WishlistItemSkeleton key={`skeleton-${index}`} />
  ));

  return (
    <>
      <Helmet>
        <title>Your Wishlist - ClassyShop</title>
        <meta name="description" content="View and manage your saved items in your wishlist." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center mb-4"
            >
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 mb-2"
            >
              Your Wishlist
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Keep track of items you love and add them to your cart when you're ready to purchase
            </motion.p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skeletons}
            </div>
          ) : (
            <>
              {/* Empty State */}
              {wishlistItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.5,
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        repeatDelay: 1.5 
                      }}
                      className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <Heart className="h-12 w-12 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Your wishlist is empty
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Discover amazing products and save your favorites for later
                    </p>                    <Link 
                      to="/products" 
                      className="inline-flex items-center justify-center bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md"
                    >
                      Start Shopping
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Filters and Search */}
                  <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Search your wishlist..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                          <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            <div className="flex items-center">
                              <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{filterCategory === 'all' ? 'All Categories' : filterCategory}</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isFilterMenuOpen ? 'transform rotate-180' : ''}`} />
                          </button>
                          
                          {isFilterMenuOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                              {categories.map((category) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    setFilterCategory(category);
                                    setIsFilterMenuOpen(false);
                                  }}
                                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${category === filterCategory ? 'bg-gray-100 text-gray-900 font-medium' : ''}`}
                                >
                                  {category === 'all' ? 'All Categories' : category}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <select
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all"
                        >
                          <option value="default">Sort by: Default</option>
                          <option value="price_low">Price: Low to High</option>
                          <option value="price_high">Price: High to Low</option>
                          <option value="name_asc">Name: A-Z</option>
                          <option value="name_desc">Name: Z-A</option>
                        </select>
                        
                        {wishlistItems.length > 0 && (
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                                clearWishlist();
                              }
                            }}
                            className="px-4 py-3 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Results Summary */}
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                      {filteredItems.length === 0 
                        ? 'No items found' 
                        : filteredItems.length === 1 
                          ? '1 item found' 
                          : `${filteredItems.length} items found`}
                    </p>
                  </div>

                  {/* Wishlist Items Grid */}
                  <AnimatePresence>
                    {filteredItems.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-2xl p-12 text-center"
                      >
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-600">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredItems.map((item) => (
                          <motion.div 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
                          >
                            <div className="relative overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                              <div className="absolute top-4 right-4">
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                                <Link 
                                  to={`/products/${item.id}`}
                                  className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>

                            <div className="p-6">                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{item.name}</h3>
                                <span className="font-bold text-lg text-gray-900">₹{item.price.toFixed(2)}</span>
                              </div>
                              <p className="text-gray-500 text-sm mb-4">{item.category}</p>
                              
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="flex-1 bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center shadow-sm"
                                >
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center"
                                  aria-label="Remove from wishlist"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Info Box */}
              {wishlistItems.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}                  className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <Info className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Wishlist Information</h3>
                      <p className="text-gray-600">Items in your wishlist will be saved in your browser. Add them to your cart to complete your purchase.</p>
                    </div>
                  </div>
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
