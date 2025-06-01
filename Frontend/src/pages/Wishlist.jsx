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
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Extract unique categories from wishlist items
  const categories = wishlistItems.length > 0 
    ? ['all', ...new Set(wishlistItems.filter(item => item.category).map(item => item.category.toLowerCase()))]
    : ['all'];

  // Filter and sort wishlist items
  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || 
                            (item.category && item.category.toLowerCase() === filterCategory.toLowerCase());
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

      <div className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Heart className="h-8 w-8" fill="currentColor" />
                  My Wishlist
                  <span className="text-gray-500 text-xl font-medium">
                    ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
                  </span>
                </h1>
                <p className="mt-2 text-gray-600">Items you've saved for later</p>
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
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg ${
                      viewMode === 'grid' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg ${
                      viewMode === 'list' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>

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
                  </select>

                  {categories.length > 1 && (
                    <div className="relative">
                      <button
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                        className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent inline-flex items-center"
                      >
                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                        {filterCategory === 'all' ? 'All Categories' : filterCategory}
                      </button>

                      <AnimatePresence>
                        {isFilterMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                          >
                            {categories.map((category) => (
                              <button
                                key={category}
                                onClick={() => {
                                  setFilterCategory(category);
                                  setIsFilterMenuOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm ${
                                  category === filterCategory
                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {category === 'all' ? 'All Categories' : category}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Browse our products and save your favorites here to find them easily later
                </p>
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors"
                >
                  Start Shopping
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
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
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
                      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-48 shrink-0' : ''}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                          <p className="text-lg font-semibold text-gray-900 mb-4">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex gap-3 mt-auto">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 bg-black text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleViewProduct(item.id)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
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
