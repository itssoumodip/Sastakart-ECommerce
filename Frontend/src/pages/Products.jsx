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
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  
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
      
      const { data } = await axios.get(`/api/products?${params.toString()}`)
      return data
    },
    {
      retry: 2,
      retryDelay: 1000,
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

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleFilterChange('search', searchInput)
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
    setSearchInput('')
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const Pagination = () => {
    if (!productsData || productsData.totalPages <= 1) return null

    const { currentPage, totalPages } = productsData
    const pages = []
    
    // Show fewer pages on mobile
    const isMobile = window.innerWidth < 768
    const maxVisiblePages = isMobile ? 3 : 5
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <motion.div 
        className="flex items-center justify-center flex-wrap gap-2 mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Previous
        </motion.button>
        
        {startPage > 1 && (
          <>
            <motion.button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 flex items-center justify-center btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              1
            </motion.button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <motion.button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
              page === currentPage
                ? 'bg-gray-900 text-white'
                : 'btn-outline'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <motion.button
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 flex items-center justify-center btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {totalPages}
            </motion.button>
          </>
        )}
        
        <motion.button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </motion.div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Products - ClassyShop</title>
        <meta name="description" content="Browse our extensive collection of quality products at competitive prices." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-8 lg:mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-gray-900">
              {filters.search ? `Search Results` : 'All Products'}
            </h1>
            {filters.search && (
              <p className="text-lg lg:text-xl text-gray-600 mb-4">
                for "{filters.search}"
              </p>
            )}
            {productsData && (
              <p className="text-gray-600 text-base lg:text-lg">
                {productsData.totalProducts} products found
              </p>
            )}
          </motion.div>          {/* Search Bar & Mobile Filter Toggle */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex-shrink-0 btn-outline flex items-center space-x-2 p-3"
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-grow">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="input pr-12 w-full shadow-sm"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </form>
            </div>
          </motion.div>
          
          {/* Products Layout - Filters (Left) & Products (Right) */}
          <div className="flex flex-col lg:flex-row gap-6">            {/* Filters Sidebar - Hidden on mobile until toggled */}
            <motion.aside 
              className={`${!showFilters && 'hidden lg:block'} w-full lg:w-64 xl:w-72 flex-shrink-0`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-medium text-xl">Filters</h2>
                  <div className="flex items-center gap-3">
                    {(filters.category || filters.minPrice || filters.maxPrice || filters.rating) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-gray-500 hover:text-gray-800 transition"
                      >
                        Clear all
                      </button>
                    )}
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-500 hover:text-gray-800"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Rating Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
                
                {/* Sort By (Mobile Only) */}
                <div className="mb-6 lg:hidden">
                  <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="input w-full"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* View Mode (Mobile Only) */}
                <div className="lg:hidden">
                  <h3 className="font-medium text-gray-900 mb-3">View Mode</h3>
                  <div className="flex items-center border border-gray-200 rounded-lg p-1 w-full">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 p-2 rounded transition-colors flex items-center justify-center ${
                        viewMode === 'grid' 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      <span>Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 p-2 rounded transition-colors flex items-center justify-center ${
                        viewMode === 'list' 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span>List</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
            
            {/* Main Content - Products */}
            <motion.div 
              className="flex-grow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Sort and View Controls (Desktop) */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {productsData && (
                    <p className="text-sm text-gray-600">
                      Showing {productsData.products?.length || 0} of {productsData.totalProducts} products
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Sort by:</label>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="input text-sm min-w-[140px]"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>              {/* Products Grid/List */}
              {isLoading ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card max-w-md mx-auto p-8">
                    <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-6">Please try again later.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="btn-primary"
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              ) : productsData?.products?.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card max-w-md mx-auto p-8">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
                    <button 
                      onClick={clearFilters}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>                  <motion.div 
                    className={`${
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
                        : 'flex flex-col gap-6'
                    }`}
                    layout
                  >
                    <AnimatePresence mode="popLayout">
                      {productsData?.products?.map((product, index) => (
                        <ProductCard 
                          key={product._id} 
                          product={product} 
                          index={index} 
                          viewMode={viewMode} 
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  
                  <Pagination />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products
