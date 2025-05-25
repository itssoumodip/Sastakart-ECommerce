import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiHeart, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // This would be replaced with actual state management
  const cartItemCount = 0;
  const isAuthenticated = false;

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top navigation bar */}
      <div className="bg-gray-100 border-b border-gray-200 py-2 text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="hidden md:block">
              <span className="text-gray-600">Free shipping on orders over $50</span>
            </div>
            <div className="flex gap-4">
              <Link to="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                Help Center
              </Link>
              <Link to="/track-order" className="text-gray-600 hover:text-gray-900 transition-colors">
                Order Tracking
              </Link>
              {!isAuthenticated ? (
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Login/Register
                </Link>
              ) : (
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-gray-900">Classy</span>
            <span className="text-red-500">Shop</span>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-4 bg-red-500 text-white rounded-r-md hover:bg-red-600 transition-colors"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/products" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              All Products
            </Link>
            <Link 
              to="/deals" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Deals
            </Link>
            <Link 
              to="/new-arrivals" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              New Arrivals
            </Link>
            
            <div className="flex items-center gap-5">
              <Link 
                to="/wishlist" 
                className="relative flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <FiHeart size={18} />
              </Link>
              <Link 
                to="/cart" 
                className="relative flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <FiShoppingCart size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-semibold">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            {isAuthenticated ? (
              <Link 
                to="/profile" 
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <FiUser size={18} />
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
              >
                Login / Sign up
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button and Cart */}
          <div className="flex items-center md:hidden">
            <Link 
              to="/cart" 
              className="relative mr-4 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="block md:hidden pb-4">
          <form 
            onSubmit={handleSearch} 
            className="flex items-center bg-gray-100 rounded-full overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 py-2 px-4 bg-transparent outline-none text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4">
              <Link 
                to="/products" 
                className="py-3 border-b border-gray-100 text-gray-700 hover:text-red-500 hover:pl-2 transition-all duration-200"
                onClick={toggleMenu}
              >
                All Products
              </Link>
              <Link 
                to="/deals" 
                className="py-3 border-b border-gray-100 text-gray-700 hover:text-red-500 hover:pl-2 transition-all duration-200"
                onClick={toggleMenu}
              >
                Deals
              </Link>
              <Link 
                to="/new-arrivals" 
                className="py-3 border-b border-gray-100 text-gray-700 hover:text-red-500 hover:pl-2 transition-all duration-200"
                onClick={toggleMenu}
              >
                New Arrivals
              </Link>
              <Link 
                to="/wishlist" 
                className="py-3 border-b border-gray-100 text-gray-700 hover:text-red-500 hover:pl-2 transition-all duration-200"
                onClick={toggleMenu}
              >
                Wishlist
              </Link>
              {isAuthenticated ? (
                <Link 
                  to="/profile" 
                  className="py-3 text-gray-700 hover:text-red-500 hover:pl-2 transition-all duration-200"
                  onClick={toggleMenu}
                >
                  My Account
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="py-3 text-gray-700 hover:text-red-500 hover:pl-2 transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Login / Register
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
