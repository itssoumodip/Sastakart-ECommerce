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
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: isScrolled ? '#ffffff' : 'transparent',
        color: isScrolled ? '#000000' : '#ffffff',
        boxShadow: isScrolled ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
      }}
    >      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
          {/* Logo */}
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <span style={{ color: isScrolled ? '#000000' : '#ffffff' }}>SHOP</span>
            <span style={{ color: isScrolled ? '#6b7280' : '#d1d5db' }}>HUB</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form 
            onSubmit={handleSearch}
            style={{
              display: 'none',
              alignItems: 'center',
              flexGrow: 1,
              maxWidth: '28rem',
              margin: '0 2rem',
              backgroundColor: isScrolled ? 'rgba(243, 244, 246, 0.8)' : 'rgba(55, 65, 81, 0.2)',
              borderRadius: '9999px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            className="md:flex"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = isScrolled ? 'rgba(243, 244, 246, 1)' : 'rgba(55, 65, 81, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = isScrolled ? 'rgba(243, 244, 246, 0.8)' : 'rgba(55, 65, 81, 0.2)';
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                outline: 'none',
                color: isScrolled ? '#1f2937' : '#ffffff',
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              style={{
                padding: '0.5rem',
                color: isScrolled ? '#4b5563' : '#ffffff',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = isScrolled ? '#1f2937' : '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = isScrolled ? '#4b5563' : '#ffffff';
              }}
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>
          </form>          {/* Navigation - Desktop */}
          <nav className="md:flex" style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }}>
            <Link 
              to="/products" 
              style={{
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                color: isScrolled ? 'inherit' : '#ffffff'
              }}
              onMouseOver={(e) => {
                e.target.style.color = isScrolled ? '#4b5563' : '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.target.style.color = isScrolled ? 'inherit' : '#ffffff';
              }}
            >
              Products
            </Link>
            <Link 
              to="/wishlist" 
              style={{
                position: 'relative',
                transition: 'color 0.2s ease',
                color: isScrolled ? 'inherit' : '#ffffff'
              }}
              onMouseOver={(e) => {
                e.target.style.color = isScrolled ? '#4b5563' : '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.target.style.color = isScrolled ? 'inherit' : '#ffffff';
              }}
            >
              <FiHeart size={18} />
            </Link>
            <Link 
              to="/cart" 
              style={{
                position: 'relative',
                transition: 'color 0.2s ease',
                color: isScrolled ? 'inherit' : '#ffffff'
              }}
              onMouseOver={(e) => {
                e.target.style.color = isScrolled ? '#4b5563' : '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.target.style.color = isScrolled ? 'inherit' : '#ffffff';
              }}
            >
              <FiShoppingCart size={18} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-0.5rem',
                  right: '-0.5rem',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  width: '1rem',
                  height: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  {cartItemCount}
                </span>
              )}
            </Link>            {isAuthenticated ? (
              <Link 
                to="/profile" 
                style={{
                  transition: 'color 0.2s ease',
                  color: isScrolled ? 'inherit' : '#ffffff'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = isScrolled ? '#4b5563' : '#d1d5db';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = isScrolled ? 'inherit' : '#ffffff';
                }}
              >
                <FiUser size={18} />
              </Link>
            ) : (
              <Link 
                to="/login" 
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: isScrolled ? '1px solid #000000' : '1px solid #ffffff',
                  color: isScrolled ? '#000000' : '#ffffff',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = isScrolled ? '#000000' : '#ffffff';
                  e.target.style.color = isScrolled ? '#ffffff' : '#000000';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = isScrolled ? '#000000' : '#ffffff';
                }}
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center' }} className="md:hidden">
            <Link 
              to="/cart" 
              style={{
                position: 'relative',
                marginRight: '1rem',
                transition: 'color 0.2s ease',
                color: isScrolled ? 'inherit' : '#ffffff'
              }}
              onMouseOver={(e) => {
                e.target.style.color = isScrolled ? '#4b5563' : '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.target.style.color = isScrolled ? 'inherit' : '#ffffff';
              }}
            >
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-0.5rem',
                  right: '-0.5rem',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  width: '1rem',
                  height: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMenu}
              style={{ outline: 'none', color: isScrolled ? 'inherit' : '#ffffff' }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div style={{ display: 'none', paddingBottom: '1rem' }} className="md:hidden">
          <form 
            onSubmit={handleSearch} 
            style={{
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: isScrolled ? 'rgba(243, 244, 246, 0.8)' : 'rgba(55, 65, 81, 0.2)',
              borderRadius: '9999px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                outline: 'none',
                color: isScrolled ? '#1f2937' : '#ffffff',
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              style={{
                padding: '0.5rem',
                color: isScrolled ? '#4b5563' : '#ffffff',
              }}
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>
          </form>
        </div>
      </div>      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'block',
              overflow: 'hidden',
              backgroundColor: isScrolled ? '#ffffff' : 'rgba(0, 0, 0, 0.95)',
              color: isScrolled ? '#1f2937' : '#ffffff'
            }}
            className="md:hidden"
          >
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem' }}>
              <Link 
                to="/products" 
                style={{
                  padding: '0.75rem 0',
                  borderBottom: isScrolled ? '1px solid #e5e7eb' : '1px solid #374151',
                  transition: 'all 0.2s ease',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => {
                  e.target.style.paddingLeft = '0.5rem';
                }}
                onMouseOut={(e) => {
                  e.target.style.paddingLeft = '0';
                }}
              >
                Products
              </Link>
              <Link 
                to="/wishlist" 
                style={{
                  padding: '0.75rem 0',
                  borderBottom: isScrolled ? '1px solid #e5e7eb' : '1px solid #374151',
                  transition: 'all 0.2s ease',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => {
                  e.target.style.paddingLeft = '0.5rem';
                }}
                onMouseOut={(e) => {
                  e.target.style.paddingLeft = '0';
                }}
              >
                Wishlist
              </Link>
              {isAuthenticated ? (
                <Link 
                  to="/profile" 
                  style={{
                    padding: '0.75rem 0',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={toggleMenu}
                  onMouseOver={(e) => {
                    e.target.style.paddingLeft = '0.5rem';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.paddingLeft = '0';
                  }}
                >
                  My Account
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  style={{
                    padding: '0.75rem 0',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={toggleMenu}
                  onMouseOver={(e) => {
                    e.target.style.paddingLeft = '0.5rem';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.paddingLeft = '0';
                  }}
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
