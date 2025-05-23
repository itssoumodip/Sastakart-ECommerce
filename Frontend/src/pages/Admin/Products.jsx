import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const AdminProducts = () => {
  const dispatch = useDispatch();
  // In a real application, these would come from Redux
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for search and filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Demo product data
  const [products, setProducts] = useState([
    {
      id: '1',
      title: 'Wireless Headphones',
      category: 'Electronics',
      price: 199.99,
      stock: 25,
      rating: 4.5,
      numReviews: 128,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80'],
      createdAt: '2025-02-15'
    },
    {
      id: '2',
      title: 'Smart Watch',
      category: 'Electronics',
      price: 299.99,
      stock: 15,
      rating: 4.3,
      numReviews: 93,
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80'],
      createdAt: '2025-03-10'
    },
    {
      id: '3',
      title: 'Cotton T-Shirt',
      category: 'Clothing',
      price: 29.99,
      stock: 50,
      rating: 4.1,
      numReviews: 76,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80'],
      createdAt: '2025-04-05'
    },
    {
      id: '4',
      title: 'Ceramic Coffee Mug',
      category: 'Home & Kitchen',
      price: 14.99,
      stock: 100,
      rating: 4.7,
      numReviews: 154,
      images: ['https://images.unsplash.com/photo-1570287136742-32981d8da607?auto=format&fit=crop&q=80'],
      createdAt: '2025-01-20'
    },
    {
      id: '5',
      title: 'Facial Cleanser',
      category: 'Beauty & Personal Care',
      price: 24.99,
      stock: 35,
      rating: 4.4,
      numReviews: 87,
      images: ['https://images.unsplash.com/photo-1556229010-a8e0cb3a2137?auto=format&fit=crop&q=80'],
      createdAt: '2025-03-25'
    }
  ]);
  
  // Total products and pages for pagination
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / limit);
  
  // Categories for filter
  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors'
  ];
  
  // Sort options
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Rating', value: 'rating' }
  ];
  
  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product', productId);
      
      // In a real app, this would dispatch a redux action to delete the product
      setProducts(products.filter(product => product.id !== productId));
    }
  };
  
  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search for:', search);
    // In a real app, this would trigger a fetch with the search term
  };
  
  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset page when changing category
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1); // Reset page when changing sort
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset page when changing limit
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar would be here, shared with AdminDashboard */}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header would be here, shared with AdminDashboard */}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center">
                  <h1 className="text-2xl font-semibold mb-4 md:mb-0">Products</h1>
                  
                  <Link to="/admin/products/new">
                    <Button icon={<FiPlus />}>
                      Add New Product
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-wrap gap-4">
                  <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </form>
                  
                  <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-400" />
                    <select
                      value={category}
                      onChange={handleCategoryChange}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-gray-500">Sort:</label>
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
              </div>
              
              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.images[0]}
                                  alt={product.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {product.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.stock > 0 
                                ? product.stock < 10 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock > 0 ? product.stock : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.rating} ({product.numReviews})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/admin/products/edit/${product.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FiEdit size={18} />
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(page * limit, totalProducts)}
                    </span>{' '}
                    of <span className="font-medium">{totalProducts}</span> results
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <label htmlFor="limit" className="text-sm text-gray-600">
                      Rows per page:
                    </label>
                    <select
                      id="limit"
                      value={limit}
                      onChange={handleLimitChange}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 sm:mt-0">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        page === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number + 1}
                        onClick={() => handlePageChange(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === number + 1
                            ? 'z-10 bg-black text-white border-black'
                            : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        page === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;
