import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { 
  Filter, 
  Grid, 
  List, 
  Star, 
  ShoppingCart, 
  ChevronDown, 
  Search,
  Heart,
  Eye,
  X,
  SlidersHorizontal,  ArrowUpDown
} from 'lucide-react'
import { getMockProducts } from '../data/mockProducts'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  })

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Wellness',
    'Jewelry',
    'Automotive',
    'Others'
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ]
  // Fetch products
  const { data: productsData, isLoading, error } = useQuery(
    ['products', filters],
    async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      // Try API first, fallback to mock data
      try {
        const { data } = await axios.get(`/api/products?${params.toString()}`)
        return data
      } catch (apiError) {
        console.log('API not available, using mock data')
        // Return mock data with filtering applied
        const mockData = getMockProducts(filters.limit)
        
        // Apply basic filtering for demo
        let filteredProducts = [...mockData.products]
        
        if (filters.search) {
          filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description.toLowerCase().includes(filters.search.toLowerCase())
          )
        }
        
        if (filters.category) {
          filteredProducts = filteredProducts.filter(product => 
            product.category === filters.category
          )
        }
        
        if (filters.minPrice) {
          filteredProducts = filteredProducts.filter(product => 
            (product.discountPrice || product.price) >= parseFloat(filters.minPrice)
          )
        }
        
        if (filters.maxPrice) {
          filteredProducts = filteredProducts.filter(product => 
            (product.discountPrice || product.price) <= parseFloat(filters.maxPrice)
          )
        }
        
        // Apply sorting
        if (filters.sort === 'price_asc') {
          filteredProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
        } else if (filters.sort === 'price_desc') {
          filteredProducts.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
        } else if (filters.sort === 'rating') {
          filteredProducts.sort((a, b) => b.rating - a.rating)
        }
        
        return {
          products: filteredProducts,
          totalProducts: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / filters.limit),
          currentPage: filters.page
        }
      }
    },
    {
      keepPreviousData: true
    }
  )

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'limit') {
        params.set(key, value)
      }
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'newest',
      page: 1,
      limit: 12
    })
  }
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  };
  
  const Pagination = () => {
    if (!productsData || productsData.totalPages <= 1) return null

    const { currentPage, totalPages } = productsData
    const pages = []
    
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(i)
    }

    return (
      <motion.div 
        className="flex items-center justify-center space-x-2 mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-3 border-4 border-white bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider transition-colors hover:bg-white hover:text-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {'<'} PREV
        </motion.button>
        
        {pages.map(page => (
          <motion.button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-12 h-12 flex items-center justify-center border-4 font-mono font-bold text-xl transition-colors ${
              page === currentPage
                ? 'bg-white text-black border-white'
                : 'border-white bg-black text-white hover:bg-white hover:text-black'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        ))}
        
        <motion.button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-3 border-4 border-white bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider transition-colors hover:bg-white hover:text-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          NEXT {'>'}
        </motion.button>      </motion.div>
    )
  };

  // Product Card Component
  const ProductCard = React.forwardRef(({ product, index }, ref) => (
    <motion.div 
      ref={ref}
      className={`bg-black border-4 border-white transition-all duration-500 group overflow-hidden ${
        viewMode === 'list' ? 'flex' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      layout
    >
      <Link to={`/products/${product._id}`} className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
        <div className={`relative overflow-hidden ${
          viewMode === 'list' ? 'w-48 h-40' : 'rounded-t-2xl h-56'
        }`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
            {/* Discount Badge */}
          {product.discountPrice && product.discountPrice < product.price && (
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 border-2 border-black text-sm font-bold font-mono">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}
            {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <motion.button 
              className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            <motion.button 
              className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="h-5 w-5" />
            </motion.button>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''} border-t-4 border-white`}>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-white mb-3 hover:text-gray-300 transition-colors duration-200 line-clamp-2 text-lg font-mono uppercase tracking-wider">
            {product.title}
          </h3>
        </Link>
          {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-white fill-white'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-300 ml-2 font-medium font-mono">
            ({product.numReviews})
          </span>
        </div>
        
        {/* Description for list view */}
        {viewMode === 'list' && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed font-mono">
            {product.description}
          </p>
        )}
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-2 border-t border-white pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold font-mono text-white">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-sm text-gray-400 line-through font-mono">
                ${product.price}
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white text-black border-2 border-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>        </div>
      </div>
    </motion.div>
  ));

  return (
    <>
      <Helmet>
        <title>PRODUCTS - RETRO-SHOP</title>
        <meta name="description" content="Browse our extensive collection of quality products at competitive prices." />
      </Helmet>      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}          <motion.div 
            className="text-center mb-12 border-4 border-white p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-mono uppercase tracking-widest">
              [ {filters.search ? `SEARCH RESULTS` : 'ALL PRODUCTS'} ]
            </h1>
            {filters.search && (
              <p className="text-xl text-gray-300 mb-4 font-mono uppercase">
                FOR "{filters.search}"
              </p>
            )}
            {productsData && (
              <p className="text-gray-300 font-mono uppercase tracking-wider">
                {productsData.totalProducts} PRODUCTS FOUND
              </p>
            )}
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 1024) && (
                <motion.div 
                  className="lg:w-80"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >                  <div className="bg-black border-4 border-white p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                        [ FILTERS ]
                      </h3>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={clearFilters}
                          className="text-sm text-white font-mono uppercase border-2 border-white px-2 py-1 hover:bg-white hover:text-black transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          CLEAR ALL
                        </motion.button>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="lg:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>                    {/* Search */}
                    <div className="mb-6 border-2 border-white p-3">
                      <h4 className="font-semibold mb-3 text-white font-mono uppercase">SEARCH</h4>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                        <input
                          type="text"
                          placeholder="SEARCH PRODUCTS..."
                          value={filters.search}
                          onChange={(e) => handleFilterChange('search', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-black text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-white font-mono uppercase"
                        />
                      </div>
                    </div>                    {/* Category Filter */}
                    <div className="mb-6 border-2 border-white p-3">
                      <h4 className="font-semibold mb-3 text-white font-mono uppercase">CATEGORY</h4>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full p-3 border-2 border-white bg-black text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                      >
                        <option value="">ALL CATEGORIES</option>
                        {categories.map(category => (
                          <option key={category} value={category} className="uppercase">{category.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>                    {/* Price Range */}
                    <div className="mb-6 border-2 border-white p-3">
                      <h4 className="font-semibold mb-3 text-white font-mono uppercase">PRICE RANGE</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="MIN PRICE"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="w-full p-3 bg-black text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-white font-mono uppercase"
                        />
                        <input
                          type="number"
                          placeholder="MAX PRICE"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="w-full p-3 bg-black text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-white font-mono uppercase"
                        />
                      </div>
                    </div>                    {/* Rating Filter */}
                    <div className="mb-6 border-2 border-white p-3">
                      <h4 className="font-semibold mb-3 text-white font-mono uppercase">MINIMUM RATING</h4>
                      <select
                        value={filters.rating}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="w-full p-3 bg-black text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 font-mono uppercase"
                      >
                        <option value="">ANY RATING</option>
                        <option value="4">4+ STARS</option>
                        <option value="3">3+ STARS</option>
                        <option value="2">2+ STARS</option>
                        <option value="1">1+ STARS</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}              <motion.div 
                className="bg-black border-4 border-white p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    {productsData && (
                      <p className="text-white text-lg font-mono uppercase tracking-wider">
                        SHOWING <span className="font-bold border-b-2 border-white">{productsData.products?.length || 0}</span> OF <span className="font-bold border-b-2 border-white">{productsData.totalProducts}</span> PRODUCTS
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">                    {/* Mobile Filter Toggle */}
                    <motion.button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      FILTERS
                    </motion.button>                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={filters.sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="appearance-none bg-black text-white border-2 border-white px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-white transition-colors cursor-pointer font-mono uppercase"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value} className="uppercase">
                            {option.label.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                    </div>                    {/* View Mode */}
                    <div className="flex border-2 border-white p-1">
                      <motion.button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 transition-all duration-200 ${
                          viewMode === 'grid' 
                            ? 'bg-white text-black border border-black' 
                            : 'text-white hover:text-gray-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Grid className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => setViewMode('list')}
                        className={`p-2 transition-all duration-200 ${
                          viewMode === 'list' 
                            ? 'bg-white text-black border border-black' 
                            : 'text-white hover:text-gray-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <List className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid/List */}
              {isLoading ? (
                <motion.div 
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-black border-4 border-white animate-pulse overflow-hidden">
                      <div className={viewMode === 'list' ? 'flex' : ''}>
                        <div className={`bg-gray-800 ${
                          viewMode === 'list' ? 'w-48 h-40' : 'h-56'
                        }`}></div>
                        <div className="p-6 flex-1 border-t-4 border-white">
                          <div className="h-4 bg-gray-700 mb-3"></div>
                          <div className="h-4 bg-gray-700 w-2/3 mb-3"></div>
                          <div className="flex items-center mb-4 space-x-1">
                            {[...Array(5)].map((_, j) => (
                              <div key={j} className="w-4 h-4 bg-gray-700"></div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white">
                            <div className="h-6 bg-gray-700 w-20"></div>
                            <div className="w-10 h-10 bg-gray-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>              ) : error ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-black border-4 border-white p-12 max-w-md mx-auto">
                    <div className="border-4 border-white p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
                      <X className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-mono uppercase tracking-wider">SYSTEM ERROR</h3>
                    <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
                    <motion.button 
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              ) : productsData?.products?.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
                    <motion.button 
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold"
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
                    className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}
                    layout
                  >
                    <AnimatePresence mode="popLayout">
                      {productsData?.products?.map((product, index) => (
                        <ProductCard key={product._id} product={product} index={index} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  
                  <Pagination />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products
