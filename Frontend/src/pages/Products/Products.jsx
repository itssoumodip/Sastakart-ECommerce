import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import { FiFilter, FiX, FiSearch, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// DualRangeSlider Component
const DualRangeSlider = ({ min, max, value, onChange }) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);  const range = useRef(null);
  const minInput = useRef(null);
  const maxInput = useRef(null);
  
  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);
  // Get min and max values when their state changes
  useEffect(() => {
    // Only update if both values are valid numbers to prevent unwanted API calls
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      onChange([minVal, maxVal]);
    }
  }, [minVal, maxVal, onChange]);

  // Sync with parent component values
  useEffect(() => {
    if (Array.isArray(value) && value.length === 2) {
      setMinVal(value[0]);
      setMaxVal(value[1]);
    }
  }, [value]);
  return (
    <div className="slider-container relative h-10 w-full">
      <div className="slider-track absolute h-1 w-full bg-gray-200 rounded top-1/2 -translate-y-1/2"></div>
      <div ref={range} className="slider-range absolute h-1 bg-red-500 rounded top-1/2 -translate-y-1/2"></div>
      <div 
        className="slider-thumb absolute h-4 w-4 bg-white border-2 border-red-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" 
        style={{ left: `${getPercent(minVal)}%` }}
      ></div>
      <div 
        className="slider-thumb absolute h-4 w-4 bg-white border-2 border-red-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" 
        style={{ left: `${getPercent(maxVal)}%` }}
      ></div><input
        ref={minInput}
        type="range"
        min={min}
        max={max}
        step={10}
        value={minVal}
        onChange={(e) => {
          const value = Math.min(Number(e.target.value), maxVal - 10);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="w-full h-full absolute opacity-0 cursor-pointer z-10"
        aria-label="Minimum price"
      />
      <input
        ref={maxInput}
        type="range"
        min={min}
        max={max}
        step={10}
        value={maxVal}
        onChange={(e) => {
          const value = Math.max(Number(e.target.value), minVal + 10);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="w-full h-full absolute opacity-0 cursor-pointer z-10"
        aria-label="Maximum price"
      />
    </div>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();  const queryParams = new URLSearchParams(location.search);
  
  // Filter states
  const [category, setCategory] = useState(queryParams.get('category') || 'All Categories');
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [sort, setSort] = useState(queryParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);  const [selectedRatings, setSelectedRatings] = useState([]);
  
  const [showInStock, setShowInStock] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    brands: true,
    ratings: true,
    availability: true
  });

  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Pagination
  const productsPerPage = 12;  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Available categories
  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Home',
    'Sports',
    'Books',
    'Beauty',  ];
  
  // Mock products data (remove when backend is connected)
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      category: 'Electronics',
      brand: 'TechAudio',
      price: 299.99,
      originalPrice: 349.99,
      discount: 15,
      rating: 4.5,
      reviewCount: 127,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Ergonomic Office Chair',
      category: 'Home',
      brand: 'ComfortPlus',
      price: 249.99,
      discount: 0,
      rating: 4.8,
      reviewCount: 89,
      availability: 'In Stock',
      onSale: false,
      image: 'https://images.unsplash.com/photo-1541558869434-2890a5aaa157?auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Minimalist Desk Lamp',
      category: 'Home',
      brand: 'LightCraft',
      price: 79.99,
      originalPrice: 89.99,
      discount: 10,
      rating: 4.2,
      reviewCount: 56,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Smart Watch Series 5',
      category: 'Electronics',
      brand: 'FitTech',
      price: 399.99,
      originalPrice: 499.99,
      discount: 20,
      rating: 4.7,
      reviewCount: 215,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      name: 'Premium Leather Wallet',
      category: 'Fashion',
      brand: 'LuxLeather',
      price: 59.99,
      discount: 0,
      rating: 4.3,
      reviewCount: 42,
      availability: 'Limited Stock',
      onSale: false,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      name: 'Ceramic Coffee Mug Set',
      category: 'Home',
      brand: 'HomeStyle',
      price: 39.99,
      originalPrice: 41.99,
      discount: 5,
      rating: 4.4,
      reviewCount: 68,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&q=80',
    },
    {
      id: 7,
      name: 'Canvas Messenger Bag',
      category: 'Fashion',
      brand: 'StyleCo',
      price: 89.99,
      originalPrice: 99.99,
      discount: 10,
      rating: 4.6,
      reviewCount: 94,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80',
    },
    {
      id: 8,
      name: 'Yoga Mat Pro',
      category: 'Sports',
      brand: 'FitGear',
      price: 49.99,
      originalPrice: 58.99,
      discount: 15,
      rating: 4.5,
      reviewCount: 73,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80',
    },
    {
      id: 9,
      name: 'LED Desk Monitor',
      category: 'Electronics',
      brand: 'ViewTech',
      price: 329.99,
      originalPrice: 374.99,
      discount: 12,
      rating: 4.4,
      reviewCount: 156,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80',
    },
    {
      id: 10,
      name: 'Skincare Essential Kit',
      category: 'Beauty',
      brand: 'GlowCare',
      price: 69.99,
      originalPrice: 87.99,
      discount: 20,
      rating: 4.6,
      reviewCount: 89,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80',
    },
    {
      id: 11,
      name: 'Classic Novel Collection',
      category: 'Books',
      brand: 'BookCorp',
      price: 24.99,
      discount: 0,
      rating: 4.8,
      reviewCount: 234,
      availability: 'In Stock',
      onSale: false,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80',
    },
    {
      id: 12,
      name: 'Wireless Charging Pad',
      category: 'Electronics',
      brand: 'ChargeTech',
      price: 39.99,
      originalPrice: 53.99,
      discount: 25,
      rating: 4.3,
      reviewCount: 67,
      availability: 'Out of Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80',
    },
    {
      id: 13,
      name: 'Running Sneakers',
      category: 'Fashion',
      brand: 'SportFlex',
      price: 119.99,
      originalPrice: 139.99,
      discount: 14,
      rating: 4.6,
      reviewCount: 445,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    },
    {
      id: 14,
      name: 'Wooden Bookshelf',
      category: 'Home',
      brand: 'WoodCraft',
      price: 249.99,
      discount: 0,
      rating: 4.4,
      reviewCount: 78,
      availability: 'Limited Stock',
      onSale: false,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    },
    {
      id: 15,
      name: 'Bluetooth Speaker Pro',
      category: 'Electronics',
      brand: 'SoundWave',
      price: 149.99,
      originalPrice: 179.99,
      discount: 17,
      rating: 4.5,
      reviewCount: 678,
      availability: 'In Stock',
      onSale: true,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    },
  ];
    // Sort options
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Popular', value: 'popular' },
    { label: 'Rating', value: 'rating' },
  ];
  // Initialize products on component mount
  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    
    // Make sure all filters are expanded by default
    setExpandedFilters({
      categories: true,
      price: true,
      brands: true,
      ratings: true,
      availability: true
    });
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (category !== 'All Categories') {
      filtered = filtered.filter(product => product.category === category);
    }

    // Filter by search query
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Filter by ratings
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product => {
        const productRating = Math.floor(product.rating);
        return selectedRatings.includes(productRating);
      });
    }

    // Filter by availability (in stock only)
    if (showInStock) {
      filtered = filtered.filter(product => product.availability === 'In Stock');
    }

    // Filter by sale status
    if (showOnSale) {
      filtered = filtered.filter(product => product.onSale === true);
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        // Sort by a popularity metric (using rating * reviewCount as proxy)
        filtered.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        break;
      case 'newest':
        // For demo purposes, sort by id (higher = newer)
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when filters change
  }, [category, searchTerm, sort, priceRange, selectedBrands, selectedRatings, showInStock, showOnSale, products]);
  // Update URL parameters when filters change
  useEffect(() => {
    updateQueryParams();
  }, [category, searchTerm, sort, page, priceRange, selectedBrands, selectedRatings, showInStock, showOnSale]);
  // Toggle filter sections for mobile
  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
    // Update URL with current filters
  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (category && category !== 'All Categories') params.set('category', category);
    if (searchTerm) params.set('search', searchTerm);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    
    // Add additional filter parameters for sharing/bookmarking
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 1000) params.set('maxPrice', priceRange[1].toString());
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (selectedRatings.length > 0) params.set('ratings', selectedRatings.join(','));
    if (showInStock) params.set('inStock', 'true');
    if (showOnSale) params.set('onSale', 'true');
    
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    }, { replace: true });
  };
    // Apply price filter
  const applyPriceFilter = () => {
    // The filtering is now handled automatically in the useEffect above
    // This function can be used for additional price filter logic if needed
  };

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
      setPriceRange([parseInt(value) || 0, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], parseInt(value) || 1000]);
    }
  };

  // Handle brand filter
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Handle rating filter
  const handleRatingToggle = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  // Get unique brands from products
  const availableBrands = [...new Set(products.map(product => product.brand))].sort();
  // Get price range slider handler
  const handlePriceSliderChange = (e) => {
    const value = parseInt(e.target.value);
    // Ensure max doesn't go below min
    const maxValue = Math.max(value, priceRange[0]);
    setPriceRange([priceRange[0], maxValue]);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setCategory('All Categories');
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setShowInStock(false);
    setShowOnSale(false);
    setSearchTerm('');
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-light text-gray-900 mb-6">Products</h1>
          
          {/* Search and Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            
            {/* Filter Toggle and Sort */}
            <div className="flex items-center gap-4">              <button 
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-red-500 bg-red-500 text-white rounded-md hover:bg-red-600 hover:border-red-600 transition-colors shadow-md"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FiFilter size={18} />
                <span className="text-sm font-medium">Filters</span>
              </button>
              
              <select
                value={sort}
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>        {/* Main Content */}      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter overlay */}          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween' }}
                  className="fixed left-0 top-0 h-full w-80 bg-white overflow-y-auto z-50"
                  onClick={(e) => e.stopPropagation()}
                >                  <div className="p-6">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                      <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 hover:bg-red-50 rounded-md transition-colors text-red-500"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                      {/* Mobile Filter Content */}
                    <div className="space-y-8">
                      {/* Categories */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                          <button
                            onClick={() => toggleFilterSection('categories')}
                            className="p-1 text-gray-500 hover:text-gray-900"
                          >
                            {expandedFilters.categories ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                        </div>
                        {expandedFilters.categories && (
                          <div className="space-y-3">
                            {categories.map((cat) => (
                              <label key={cat} className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="mobile-category"
                                  checked={category === cat}
                                  onChange={() => handleCategoryChange(cat)}
                                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">{cat}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Price Range */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                          <button
                            onClick={() => toggleFilterSection('price')}
                            className="p-1 text-gray-500 hover:text-gray-900"
                          >
                            {expandedFilters.price ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                        </div>
                        {expandedFilters.price && (                          <div className="space-y-4">
                            {/* Price Slider */}
                            <DualRangeSlider
                              min={0}
                              max={1000}
                              value={priceRange}
                              onChange={setPriceRange}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Min</label>
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={priceRange[0]}
                                  onChange={(e) => handlePriceChange(e.target.value, 'min')}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Max</label>
                                <input
                                  type="number"
                                  placeholder="1000"
                                  value={priceRange[1]}
                                  onChange={(e) => handlePriceChange(e.target.value, 'max')}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setPriceRange([0, 100])}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Under $100
                              </button>
                              <button
                                onClick={() => setPriceRange([100, 300])}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                              >
                                $100 - $300
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Brands */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium text-gray-900">Brands</h3>
                          <button
                            onClick={() => toggleFilterSection('brands')}
                            className="p-1 text-gray-500 hover:text-gray-900"
                          >
                            {expandedFilters.brands ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                        </div>
                        {expandedFilters.brands && (
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {availableBrands.map((brand) => (
                              <label key={brand} className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedBrands.includes(brand)}
                                  onChange={() => handleBrandToggle(brand)}
                                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">{brand}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Ratings */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                          <button
                            onClick={() => toggleFilterSection('ratings')}
                            className="p-1 text-gray-500 hover:text-gray-900"
                          >
                            {expandedFilters.ratings ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                        </div>
                        {expandedFilters.ratings && (
                          <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <label key={rating} className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedRatings.includes(rating)}
                                  onChange={() => handleRatingToggle(rating)}
                                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <div className="ml-3 flex items-center">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar
                                        key={i}
                                        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-700">& up</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Availability & Sale Filters */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Availability</h3>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showInStock}
                              onChange={(e) => setShowInStock(e.target.checked)}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">In Stock Only</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showOnSale}
                              onChange={(e) => setShowOnSale(e.target.checked)}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">On Sale Only</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Clear Filters */}
                      <button
                        onClick={() => {
                          clearAllFilters();
                          setMobileFiltersOpen(false);
                        }}
                        className="w-full bg-red-500 text-white py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}          </AnimatePresence>          
          {/* Desktop filters sidebar */}          
          <div className="block w-64 flex-shrink-0 filter-sidebar" id="filters-sidebar" style={{ zIndex: 10, position: 'relative' }}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8 shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FiFilter className="mr-2" /> Filters
              </h2>
              
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('categories')}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                    {expandedFilters.categories ? 
                      <FiChevronUp className="w-4 h-4 text-gray-500" /> : 
                      <FiChevronDown className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                  {expandedFilters.categories && (
                    <div className="mt-4 space-y-3">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={category === cat}
                            onChange={() => handleCategoryChange(cat)}
                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Price Range */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('price')}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                    {expandedFilters.price ? 
                      <FiChevronUp className="w-4 h-4 text-gray-500" /> : 
                      <FiChevronDown className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                  {expandedFilters.price && (                    <div className="mt-4 space-y-4">
                      {/* Price Slider */}
                      <DualRangeSlider
                        min={0}
                        max={1000}
                        value={priceRange}
                        onChange={setPriceRange}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Min</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(e.target.value, 'min')}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Max</label>
                          <input
                            type="number"
                            placeholder="1000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(e.target.value, 'max')}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPriceRange([0, 100])}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Under $100
                        </button>
                        <button
                          onClick={() => setPriceRange([100, 300])}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                        >
                          $100 - $300
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brands */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('brands')}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="text-sm font-medium text-gray-900">Brands</h3>
                    {expandedFilters.brands ? 
                      <FiChevronUp className="w-4 h-4 text-gray-500" /> : 
                      <FiChevronDown className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                  {expandedFilters.brands && (                    <div className="mt-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                      {availableBrands.map((brand) => (
                        <label key={brand} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 block visible"
                          />
                          <span className="ml-3 text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ratings */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('ratings')}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                    {expandedFilters.ratings ? 
                      <FiChevronUp className="w-4 h-4 text-gray-500" /> : 
                      <FiChevronDown className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                  {expandedFilters.ratings && (
                    <div className="mt-4 space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating)}
                            onChange={() => handleRatingToggle(rating)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <div className="ml-3 flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">& up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Availability & Sale Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Availability</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showInStock}
                        onChange={(e) => setShowInStock(e.target.checked)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnSale}
                        onChange={(e) => setShowOnSale(e.target.checked)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">On Sale Only</span>
                    </label>
                  </div>
                </div>
                
                {/* Clear Filters */}
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-red-500 text-white py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>          {/* Product grid */}
          <div className="flex-1 min-w-0">            {/* Results count */}
            {!loading && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length > 0 ? (
                    <>Showing {filteredProducts.length} products</>
                  ) : (
                    <>No products found</>
                  )}
                </p>
              </div>
            )}
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="aspect-square bg-gray-200 animate-pulse"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiSearch className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria to find what you're looking for.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCategory('All Categories');
                      setPriceRange([0, 1000]);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
