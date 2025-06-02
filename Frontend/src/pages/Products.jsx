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
  ArrowUpDown,
  Check
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
    subcategory: searchParams.get('subcategory') || '',
    productType: searchParams.get('productType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  })

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
    },    'Beauty & Personal Care': {
      'Skincare': ['Cleansers', 'Moisturizers', 'Serums', 'Face Masks', 'Sunscreen'],
      'Makeup': ['Face', 'Eyes', 'Lips', 'Nails', 'Brushes'],
      'Haircare': ['Shampoo', 'Conditioner', 'Styling', 'Hair Color', 'Treatments'],
      'Fragrance': ['Women\'s Perfume', 'Men\'s Cologne', 'Gift Sets']
    },
    'Books': {
      'Fiction': ['Novels', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance'],
      'Non-fiction': ['Biography', 'Self-Help', 'History', 'Business', 'Travel'],
      'Academic': ['Textbooks', 'Reference', 'Study Guides', 'Professional'],
      'Children': ['Picture Books', 'Middle Grade', 'Young Adult']
    },
    'Sports & Outdoors': {
      'Fitness': ['Exercise Equipment', 'Yoga', 'Weights', 'Fitness Trackers'],
      'Camping': ['Tents', 'Sleeping Bags', 'Backpacks', 'Camp Kitchen'],
      'Sports Equipment': ['Team Sports', 'Individual Sports', 'Water Sports'],
      'Activewear': ['Running', 'Training', 'Swimwear', 'Accessories']
    },
    'Toys & Games': {
      'Board Games': ['Strategy', 'Family', 'Card Games', 'Classic Games'],
      'Educational': ['STEM Toys', 'Learning Kits', 'Arts & Crafts', 'Puzzles'],
      'Action Figures': ['Superheroes', 'Collectibles', 'Dolls'],
      'Outdoor Play': ['Sports Toys', 'Playsets', 'Water Toys', 'Ride-Ons']
    },
    'Health & Wellness': {
      'Supplements': ['Vitamins', 'Protein', 'Weight Management', 'Herbal'],
      'Personal Care': ['Oral Care', 'Bath & Body', 'Feminine Care'],
      'Medical Supplies': ['First Aid', 'Health Monitors', 'Mobility Aids']
    },
    'Jewelry': {
      'Necklaces': ['Pendants', 'Chains', 'Chokers', 'Statement'],
      'Earrings': ['Studs', 'Hoops', 'Drops', 'Cuffs'],
      'Rings': ['Engagement', 'Wedding', 'Fashion', 'Stackable'],
      'Bracelets': ['Bangles', 'Chain', 'Cuffs', 'Charm']
    },
    'Automotive': {
      'Interior': ['Seat Covers', 'Floor Mats', 'Organizers', 'Electronics'],
      'Exterior': ['Car Care', 'Covers', 'Accessories'],
      'Tools': ['Hand Tools', 'Diagnostic', 'Specialty Tools'],
      'Parts': ['Replacement Parts', 'Performance', 'Accessories']
    },
    'Others': {}  }
  
  // Flat list of categories for backward compatibility
  const categories = Object.keys(categoryTree)

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
    e.preventDefault();
    handleFilterChange('search', searchInput);
  };
  
  const clearFilters = () => {    setFilters({
      search: '',
      category: '',
      subcategory: '',
      productType: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'newest',
      page: 1,
      limit: 12
    });
    setSearchInput('');
  }
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            >              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 h-screen shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <SlidersHorizontal className="h-6 w-6 mr-2 text-gray-600" />
                    <span>Filters</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    {(filters.category || filters.minPrice || filters.maxPrice || filters.rating) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Clear all</span>
                      </button>
                    )}
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-500 hover:text-gray-800 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="space-y-5">
                  <div className="filter-group">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <span>Category</span>
                      </h3>
                      {filters.category && (
                        <button 
                          onClick={() => {
                            handleFilterChange('category', '');
                            handleFilterChange('subcategory', '');
                            handleFilterChange('productType', '');
                          }}
                          className="text-xs text-gray-500 hover:text-gray-800"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <select
                        value={filters.category}
                        onChange={(e) => {
                          handleFilterChange('category', e.target.value);
                          handleFilterChange('subcategory', '');
                        }}
                        className="appearance-none block w-full bg-white px-4 py-3.5 pr-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-700 cursor-pointer"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                
                  {/* Subcategory Filter - Only shown when a category is selected */}
                  {filters.category && Object.keys(categoryTree[filters.category] || {}).length > 0 && (
                    <div className="filter-group">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          <span>Subcategory</span>
                        </h3>
                        {filters.subcategory && (
                          <button 
                            onClick={() => {
                              handleFilterChange('subcategory', '');
                              handleFilterChange('productType', '');
                            }}
                            className="text-xs text-gray-500 hover:text-gray-800"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          value={filters.subcategory}
                          onChange={(e) => {
                            handleFilterChange('subcategory', e.target.value);
                            handleFilterChange('productType', '');
                          }}
                          className="appearance-none block w-full bg-white px-4 py-3.5 pr-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-700 cursor-pointer"
                        >
                          <option value="">All {filters.category}</option>
                          {Object.keys(categoryTree[filters.category] || {}).map(subcat => (
                            <option key={subcat} value={subcat}>{subcat}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )}
                
                  {/* Product Type Filter */}
                  {filters.category && filters.subcategory && categoryTree[filters.category]?.[filters.subcategory]?.length > 0 && (
                    <div className="filter-group">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          <span>Product Type</span>
                        </h3>
                        {filters.productType && (
                          <button 
                            onClick={() => handleFilterChange('productType', '')}
                            className="text-xs text-gray-500 hover:text-gray-800"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          value={filters.productType}
                          onChange={(e) => handleFilterChange('productType', e.target.value)}
                          className="appearance-none block w-full bg-white px-4 py-3.5 pr-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-700 cursor-pointer"
                        >
                          <option value="">All {filters.subcategory}</option>
                          {categoryTree[filters.category]?.[filters.subcategory]?.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )}
                
                  {/* Price Range */}
                  <div className="filter-group">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <span>Price Range</span>
                      </h3>
                      {(filters.minPrice || filters.maxPrice) && (
                        <button 
                          onClick={() => {
                            handleFilterChange('minPrice', '');
                            handleFilterChange('maxPrice', '');
                          }}
                          className="text-xs text-gray-500 hover:text-gray-800"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="pl-8 w-full bg-white px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-700"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="pl-8 w-full bg-white px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                
                  {/* Rating Filter */}
                  <div className="filter-group">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <span>Rating</span>
                      </h3>
                      {filters.rating && (
                        <button 
                          onClick={() => handleFilterChange('rating', '')}
                          className="text-xs text-gray-500 hover:text-gray-800"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <select                        value={filters.rating}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="appearance-none block w-full bg-white px-4 py-3.5 pr-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-700 cursor-pointer"
                      >
                        <option value="">Any Rating</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                        <option value="2">2+ Stars</option>
                        <option value="1">1+ Stars</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  
                </div>
                
                {/* Sort By (Mobile Only) */}
                <div className="mt-6 lg:hidden">
                  <div className="filter-group">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Sort By</h3>
                    </div>
                    <div className="relative">
                      <select                        value={filters.sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="appearance-none block w-full bg-white px-4 py-3.5 pr-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-700 cursor-pointer"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                
                  {/* Apply Filters Button (Mobile Only) */}
                  <div className="mt-8 lg:hidden">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-3.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Filter className="w-5 h-5" />
                      Apply Filters
                    </button>
                  </div>
                
                {/* View Mode (Mobile Only) */}
                <div className="mt-6 pt-6 border-t border-gray-200 lg:hidden">
                  <h3 className="font-semibold text-gray-900 mb-3">View Mode</h3>
                  <div className="flex items-center border border-gray-300 rounded-xl p-1 w-full bg-gray-50">
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
                    </button>                  </div>
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
            >                {/* Sort and View Controls (Desktop) */}              
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {productsData && (
                    <p className="text-sm text-gray-600">
                      Showing {productsData.products?.length || 0} of {productsData.totalProducts} products
                      {filters.category && ` in ${filters.category}`}
                      {filters.subcategory && ` › ${filters.subcategory}`}
                      {filters.productType && ` › ${filters.productType}`}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <label className="text-sm absolute -ml-20 text-gray-600">Sort by:</label>
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
              </div>{/* Products Grid/List */}
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
