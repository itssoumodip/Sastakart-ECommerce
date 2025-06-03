import { useState, useEffect, useCallback, memo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, Settings, Heart } from 'lucide-react'

(() => {
  if (typeof window !== 'undefined' && !window.__navbarScrollHandlerAttached) {
    let isScrolled = false;
    let ticking = false;
    let lastUpdate = 0;
    
    const handleScroll = () => {
      const now = Date.now();
      // Only update max once per 500ms - extremely aggressive throttling for Vercel
      if (now - lastUpdate < 500) return;
      
      if (!ticking) {
        ticking = true;
        setTimeout(() => {
          const shouldBeScrolled = window.scrollY > 10;
          
          if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            
            // Use DOM directly, bypassing React entirely
            const navbar = document.getElementById('main-navbar');
            if (navbar) {
              if (isScrolled) {
                navbar.classList.add('scrolled');
                navbar.classList.add('bg-white');
                navbar.classList.add('shadow-md');
                navbar.classList.add('border-b');
                navbar.classList.add('border-gray-200');
                navbar.classList.remove('bg-white/95');
                navbar.classList.remove('backdrop-blur-sm');
              } else {
                navbar.classList.remove('scrolled');
                navbar.classList.remove('bg-white');
                navbar.classList.remove('shadow-md');
                navbar.classList.remove('border-b');
                navbar.classList.remove('border-gray-200');
                navbar.classList.add('bg-white/95');
                navbar.classList.add('backdrop-blur-sm');
              }
            }
            
            lastUpdate = now;
          }
          
          ticking = false;
        }, 150);
      }
    };
    
    // Flag to ensure we only attach once
    window.__navbarScrollHandlerAttached = true;
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
})();

// Minimal navbar component with minimal state
const NavbarComponent = () => {
  // Reduce state variables to absolute minimum
  const [searchQuery, setSearchQuery] = useState('');
  const [menus, setMenus] = useState({
    main: false,
    user: false
  });
  
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store counts in refs to avoid re-renders
  const countsRef = useRef({
    cart: getCartItemsCount(),
    wishlist: getWishlistCount()
  });
  
  // Update counts without triggering re-renders
  useEffect(() => {
    const updateCounts = () => {
      // Update internal ref
      countsRef.current = {
        cart: getCartItemsCount(),
        wishlist: getWishlistCount()
      };
      
      // Direct DOM updates bypassing React
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = countsRef.current.cart;
        if (countsRef.current.cart > 0) {
          el.style.display = 'flex';
        } else {
          el.style.display = 'none';
        }
      });
      
      document.querySelectorAll('.wishlist-count').forEach(el => {
        el.textContent = countsRef.current.wishlist;
        if (countsRef.current.wishlist > 0) {
          el.style.display = 'flex';
        } else {
          el.style.display = 'none';
        }
      });
    };
    
    // Initial update without re-render
    updateCounts();
    
    // Set very infrequent updates for production
    const interval = setInterval(updateCounts, 5000);
    return () => clearInterval(interval);
  }, [getCartItemsCount, getWishlistCount]);
  
  // Reset menus on route change
  useEffect(() => {
    setMenus({main: false, user: false});
  }, [location.pathname]);
  
  // Basic handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);
  
  const handleLogout = useCallback(() => {
    logout();
    setMenus(prev => ({...prev, user: false}));
    navigate('/');
  }, [logout, navigate]);
  
  // Simplified toggle handlers
  const toggleMenu = useCallback(() => {
    setMenus(prev => ({...prev, main: !prev.main}));
  }, []);
  
  const toggleUserMenu = useCallback(() => {
    setMenus(prev => ({...prev, user: !prev.user}));
  }, []);
  
  return (
    <nav id="main-navbar" className="sticky top-0 left-0 right-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200">
              <span className="font-medium">SastaKart</span>
            </Link>
          </motion.div>
          
          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </form>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/products" className="nav-link">Products</Link>
            
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200">
              <div className="relative">
                <Heart className="h-6 w-6" />
                <span className="wishlist-count absolute -top-1.5 -right-1.5 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-sm"
                     style={{display: countsRef.current.wishlist > 0 ? 'flex' : 'none'}}>
                  {countsRef.current.wishlist}
                </span>
              </div>
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="cart-count absolute -top-1.5 -right-1.5 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-sm"
                     style={{display: countsRef.current.cart > 0 ? 'flex' : 'none'}}>
                  {countsRef.current.cart}
                </span>
              </div>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-black transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden xl:block text-sm font-medium">{user?.name}</span>
                </button>                <AnimatePresence>
                  {menus.user && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/profile/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-3" />
                        Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {countsRef.current.cart > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {countsRef.current.cart}
                </span>
              )}
            </Link>
            
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              {menus.main ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
       
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {menus.main && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/products"
                className="block text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>              <Link
                to="/wishlist"
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Wishlist</span>
                {countsRef.current.wishlist > 0 && (
                  <span className="ml-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {countsRef.current.wishlist}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 pb-2">
                    <User className="h-6 w-6 text-gray-700" />
                    <span className="font-medium text-gray-900">{user?.name}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/profile/orders"
                    className="block text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block text-gray-700 hover:text-gray-900 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-gray-700 hover:text-gray-900 transition-colors duration-200 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block w-full text-center py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Extreme stabilization with pure component
const StableNavbar = memo(NavbarComponent, () => true);

export default StableNavbar;
