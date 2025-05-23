import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../store/productSlice';
import ProductCard from '../../components/product/ProductCard';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get products from Redux store
  const { products, loading, totalProducts, totalPages } = useSelector((state) => state.products);
  
  // Filter states
  const [category, setCategory] = useState(queryParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [sort, setSort] = useState(queryParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    ratings: true,
  });
  
  // Available categories
  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors',
  ];
  
  // Sort options
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Popular', value: 'popular' },
    { label: 'Rating', value: 'rating' },
  ];
  
  // Toggle filter sections for mobile
  const toggleFilterSection = (section) => {
    setExpandedFilters({
      ...expandedFilters,
      [section]: !expandedFilters[section],
    });
  };
  
  // Update URL with current filters
  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (category && category !== 'All Categories') params.set('category', category);
    if (searchTerm) params.set('search', searchTerm);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    }, { replace: true });
  };
  
  // Fetch products when filters change
  useEffect(() => {
    dispatch(fetchProducts({
      category: category === 'All Categories' ? '' : category,
      search: searchTerm,
      sort,
      page,
      limit: 12,
    }));
    
    updateQueryParams();
  }, [category, searchTerm, sort, page, dispatch]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset page when search changes
  };
  
  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1); // Reset page when category changes
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1); // Reset page when sort changes
  };
  
  // Handle price range change
  const handlePriceChange = (value, type) => {
    if (type === 'min') {
      setPriceRange([parseInt(value), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], parseInt(value)]);
    }
  };
  
  // Apply price filter
  const applyPriceFilter = () => {
    // Would typically update API call with price range
    console.log('Filtering by price range:', priceRange);
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop Our Products</h1>
      
      {/* Top bar with sort and filter toggle */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <button 
          className="md:hidden flex items-center bg-gray-100 px-4 py-2 rounded-md"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <FiFilter className="mr-2" />
          Filters
        </button>
        
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile filter overlay */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween' }}
                className="fixed left-0 top-0 h-full w-80 bg-white overflow-y-auto p-4 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                {/* Filter content - same as desktop but in mobile overlay */}
                {/* Categories */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleFilterSection('categories')}
                  >
                    <h3 className="text-lg font-medium">Categories</h3>
                    {expandedFilters.categories ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  {expandedFilters.categories && (
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div key={cat} className="flex items-center">
                          <input
                            type="radio"
                            id={`mobile-category-${cat}`}
                            name="mobile-category"
                            checked={category === cat}
                            onChange={() => handleCategoryChange(cat)}
                            className="mr-2"
                          />
                          <label htmlFor={`mobile-category-${cat}`}>{cat}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleFilterSection('price')}
                  >
                    <h3 className="text-lg font-medium">Price Range</h3>
                    {expandedFilters.price ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  {expandedFilters.price && (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e.target.value, 'min')}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e.target.value, 'max')}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <button
                        onClick={applyPriceFilter}
                        className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setCategory('All Categories');
                    setPriceRange([0, 1000]);
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Desktop filters sidebar */}
        <div className="hidden md:block w-64 bg-white p-6 border border-gray-200 rounded-md h-fit">
          <h2 className="text-xl font-semibold mb-6">Filters</h2>
          
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center">
                  <input
                    type="radio"
                    id={`category-${cat}`}
                    name="category"
                    checked={category === cat}
                    onChange={() => handleCategoryChange(cat)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${cat}`}>{cat}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e.target.value, 'min')}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e.target.value, 'max')}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </div>
              
              <button
                onClick={applyPriceFilter}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
          
          <button
            onClick={() => {
              setCategory('All Categories');
              setPriceRange([0, 1000]);
            }}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
        
        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse h-72 rounded-md"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-4 py-2 rounded-md ${
                    page === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`px-4 py-2 rounded-md ${
                      number === page
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-4 py-2 rounded-md ${
                    page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
