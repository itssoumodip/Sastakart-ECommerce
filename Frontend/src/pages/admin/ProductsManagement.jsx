import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, Filter, ArrowUpDown, Plus, Package, Eye, ShoppingBag, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

function ProductsManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      category: 'Electronics',
      inventory: 45,
      status: 'Active',
      image: 'https://placehold.co/100x100'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      category: 'Electronics',
      inventory: 32,
      status: 'Active',
      image: 'https://placehold.co/100x100'
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 79.99,
      category: 'Electronics',
      inventory: 18,
      status: 'Low Stock',
      image: 'https://placehold.co/100x100'
    },
    {
      id: 4,
      name: 'Leather Wallet',
      price: 49.99,
      category: 'Accessories',
      inventory: 56,
      status: 'Active',
      image: 'https://placehold.co/100x100'
    },
    {
      id: 5,
      name: 'Cotton T-Shirt',
      price: 24.99,
      category: 'Clothing',
      inventory: 0,
      status: 'Out of Stock',
      image: 'https://placehold.co/100x100'
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by search term
    if (searchTerm) {
      updatedProducts = updatedProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      updatedProducts = updatedProducts.filter(product => 
        product.category === categoryFilter
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      updatedProducts = updatedProducts.filter(product => 
        product.status === statusFilter
      );
    }

    // Sort products
    updatedProducts.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (typeof fieldA === 'string') {
        return sortOrder === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
    });

    setFilteredProducts(updatedProducts);
  }, [searchTerm, categoryFilter, statusFilter, sortBy, sortOrder, products]);
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real application, you would call an API to delete the product
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <Package className="h-3 w-3 mr-1" />;
      case 'Low Stock':
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'Out of Stock':
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      default:
        return <Package className="h-3 w-3 mr-1" />;
    }
  };
  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Products Management | RETRO-SHOP</title>
        </Helmet>

        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3 font-mono uppercase tracking-widest">
              <ShoppingBag className="h-8 w-8 text-white" />
              [ PRODUCTS ]
            </h1>
            <p className="text-white/80 mt-2 font-mono">Manage your product catalog and inventory</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/admin/products/new"
              className="bg-white text-black border-2 border-white px-6 py-3 hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-2 font-mono uppercase tracking-wide"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </Link>
          </motion.div>
        </motion.div>        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-mono uppercase">Total Products</p>
                <p className="text-2xl font-bold text-white font-mono">{products.length}</p>
              </div>
              <div className="p-3 border-2 border-white">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-mono uppercase">Active Products</p>
                <p className="text-2xl font-bold text-white font-mono">{products.filter(p => p.status === 'Active').length}</p>
              </div>
              <div className="p-3 border-2 border-white">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-mono uppercase">Low Stock</p>
                <p className="text-2xl font-bold text-white font-mono">{products.filter(p => p.status === 'Low Stock').length}</p>
              </div>
              <div className="p-3 border-2 border-white">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-black p-6 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-mono uppercase">Out of Stock</p>
                <p className="text-2xl font-bold text-white font-mono">{products.filter(p => p.status === 'Out of Stock').length}</p>
              </div>
              <div className="p-3 border-2 border-white">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </motion.div>        {/* Filters and Search */}
        <motion.div 
          className="bg-black border-2 border-white p-6 mb-8"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 font-mono uppercase"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 font-mono uppercase"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="Electronics">ELECTRONICS</option>
              <option value="Accessories">ACCESSORIES</option>
              <option value="Clothing">CLOTHING</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 font-mono uppercase"
            >
              <option value="all">ALL STATUS</option>
              <option value="Active">ACTIVE</option>
              <option value="Low Stock">LOW STOCK</option>
              <option value="Out of Stock">OUT OF STOCK</option>
            </select>

            <motion.button
              onClick={() => handleSort('name')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-all duration-200 font-mono uppercase"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpDown className="h-4 w-4" />              SORT BY {sortBy.toUpperCase()}
            </motion.button>
          </div>
        </motion.div>

        {/* Products Grid */}        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <AnimatePresence>
            {filteredProducts.slice(
              (currentPage - 1) * productsPerPage,
              currentPage * productsPerPage
            ).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-black border-2 border-white overflow-hidden hover:bg-white hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover border-b-2 border-white"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-mono uppercase border ${
                      product.status === 'Active' 
                        ? 'bg-white text-black border-white' 
                        : product.status === 'Low Stock'
                        ? 'bg-black text-white border-white'
                        : 'bg-black text-white border-white'
                    }`}>
                      {getStatusIcon(product.status)}
                      {product.status}
                    </span>
                  </div>
                </div>                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 font-mono uppercase">{product.name}</h3>
                  <p className="text-white/70 text-sm mb-2 font-mono uppercase">{product.category}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-white font-mono">${product.price}</span>
                    <span className="text-sm text-white/70 font-mono">STOCK: {product.inventory}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="flex-1 bg-white text-black py-2 px-4 border border-white hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center gap-1 font-mono uppercase"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-white hover:bg-white hover:text-black border border-white transition-all duration-200"
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
        </motion.div>        {/* Pagination */}
        <motion.div 
          className="bg-black border-2 border-white p-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-mono uppercase">
              Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </p>
            <div className="flex space-x-1">
              <motion.button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 text-sm font-medium text-black bg-white border-2 border-white hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase font-mono"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
              <motion.button
                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 text-sm font-medium text-black bg-white border-2 border-white hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase font-mono"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ProductsManagement;
