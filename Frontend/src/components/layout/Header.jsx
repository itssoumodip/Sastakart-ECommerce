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
  };  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Top navigation bar - similar to QuickCart */}
      <div style={{ 
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#f8f8f8',
        padding: '0.4rem 0',
        fontSize: '0.75rem'
      }}>
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="hidden md:block">
              <span style={{ color: '#666' }}>Free shipping on orders over $50</span>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '1rem'
            }}>
              <Link to="/help" style={{ color: '#666', textDecoration: 'none' }} 
                onMouseOver={(e) => { e.target.style.color = '#333'; }}
                onMouseOut={(e) => { e.target.style.color = '#666'; }}>
                Help
              </Link>
              <Link to="/track-order" style={{ color: '#666', textDecoration: 'none' }}
                onMouseOver={(e) => { e.target.style.color = '#333'; }}
                onMouseOut={(e) => { e.target.style.color = '#666'; }}>
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>          {/* Logo - QuickCart-style */}
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '600', textDecoration: 'none' }}>
            <span style={{ color: '#222' }}>Quick</span>
            <span style={{ color: '#ff4646' }}>Cart</span>
          </Link>

          {/* Search Bar - QuickCart-style */}
          <form 
            onSubmit={handleSearch}
            style={{
              display: 'none',
              alignItems: 'center',
              flexGrow: 1,
              maxWidth: '32rem',
              margin: '0 2rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid #ebebeb',
            }}
            className="md:flex"
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#ebebeb';
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
                color: '#333',
                border: 'none',
                fontSize: '0.9rem'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              style={{
                padding: '0.5rem 0.75rem',
                color: '#666',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#333';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#666';
              }}
              aria-label="Search"
            >
              <FiSearch size={16} />
            </button>
          </form>          {/* Navigation - Desktop QuickCart Style */}
          <nav className="md:flex" style={{ display: 'none', alignItems: 'center', gap: '2rem' }}>
            <Link 
              to="/products" 
              style={{
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
                color: '#444',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#000';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#444';
              }}
            >
              All Products
            </Link>
            <Link 
              to="/deals" 
              style={{
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
                color: '#444',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#000';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#444';
              }}
            >
              Deals
            </Link>
            <Link 
              to="/new-arrivals" 
              style={{
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
                color: '#444',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#000';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#444';
              }}
            >
              New Arrivals
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link 
                to="/wishlist" 
                style={{
                  position: 'relative',
                  transition: 'color 0.2s ease',
                  color: '#444',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#000';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#444';
                }}
              >
                <FiHeart size={18} />
              </Link>
              <Link 
                to="/cart" 
                style={{
                  position: 'relative',
                  transition: 'color 0.2s ease',
                  color: '#444',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#000';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#444';
                }}
              >
                <FiShoppingCart size={18} />
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-0.4rem',
                    right: '-0.4rem',
                    backgroundColor: '#ff4646',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '1rem',
                    height: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>            {isAuthenticated ? (
              <Link 
                to="/profile" 
                style={{
                  transition: 'color 0.2s ease',
                  color: '#444',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#000';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#444';
                }}
              >
                <FiUser size={18} />
              </Link>
            ) : (
              <Link 
                to="/login" 
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  backgroundColor: '#ff4646',
                  color: '#ffffff',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e03e3e';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#ff4646';
                }}
              >
                Login / Sign up
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
