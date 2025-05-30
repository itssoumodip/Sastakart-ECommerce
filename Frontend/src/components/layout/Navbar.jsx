import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, Settings, Heart, Bell } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  }

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg border-b-4 border-white' 
          : 'bg-black/80 backdrop-blur-sm border-b-2 border-white/30'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/" 
              className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-200 font-mono tracking-wider"
              style={{
                textShadow: '2px 2px 0px #000',
                letterSpacing: '0.1em'
              }}
            >
              [ RETRO-SHOP ]
            </Link>
          </motion.div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PRODUCTS..."
                className="w-full pl-12 pr-4 py-3 border-2 border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 hover:border-gray-300 font-mono uppercase tracking-wider"
                style={{ letterSpacing: '0.05em' }}
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link 
                to="/products" 
                className="text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-transparent hover:border-white px-3 py-1"
              >
                PRODUCTS
              </Link>
            </motion.div>
            
            {/* Wishlist */}
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link to="/wishlist" className="relative text-white hover:text-gray-300 transition-colors border-2 border-white p-2">
                <Heart className="h-6 w-6" />
              </Link>
            </motion.div>
            
            {/* Cart */}
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link to="/cart" className="relative text-white hover:text-gray-300 transition-colors border-2 border-white p-2">
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold font-mono w-6 h-6 flex items-center justify-center border-2 border-black"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {getCartItemsCount()}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors border-2 border-white p-2"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <div className="w-8 h-8 bg-white text-black border-2 border-black flex items-center justify-center">
                    <span className="text-black text-sm font-bold font-mono">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-mono uppercase tracking-wider hidden lg:block">{user?.name}</span>
                </motion.button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-black border-4 border-white py-2 z-50"
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="px-4 py-2 border-b-2 border-white">
                        <p className="text-sm font-bold text-white font-mono uppercase">{user?.name}</p>
                        <p className="text-sm text-gray-300 font-mono">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        PROFILE
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-3" />
                        ORDERS
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          ADMIN
                        </Link>
                      )}
                      <hr className="my-2 border-white" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        LOGOUT
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to="/login"
                    className="text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                  >
                    LOGIN
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to="/register"
                    className="bg-white text-black font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-black hover:text-white transition-all duration-300"
                  >
                    REGISTER
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-300 p-2 border-2 border-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PRODUCTS..."
              className="w-full pl-12 pr-4 py-3 border-2 border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white font-mono uppercase tracking-wider"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </form>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t-2 border-white py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-4">
                <Link
                  to="/products"
                  className="text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  PRODUCTS
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  CART ({getCartItemsCount()})
                </Link>
                
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3 pt-3 border-t-2 border-white">
                    <div className="flex items-center space-x-3 border-2 border-white p-3">
                      <div className="w-10 h-10 bg-white text-black border-2 border-black flex items-center justify-center">
                        <span className="text-black font-bold font-mono">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white font-mono uppercase">{user?.name}</p>
                        <p className="text-xs text-gray-300 font-mono">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      PROFILE
                    </Link>
                    <Link
                      to="/orders"
                      className="text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ORDERS
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ADMIN
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                    >
                      LOGOUT
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-3 border-t-2 border-white">
                    <Link
                      to="/login"
                      className="text-white hover:text-gray-300 transition-colors font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-white hover:text-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      LOGIN
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white text-black font-mono uppercase tracking-wider border-2 border-white px-4 py-2 hover:bg-black hover:text-white transition-all duration-300 w-fit"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      REGISTER
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
