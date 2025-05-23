import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ backgroundColor: '#f9fafb', color: '#1f2937' }}>
      <div className="container mx-auto px-4 py-12" style={{ maxWidth: '72rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem 1.5rem' }} className="md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              <span style={{ color: '#000000' }}>SHOP</span>
              <span style={{ color: '#6b7280' }}>HUB</span>
            </h3>            <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.625' }}>
              Your one-stop destination for premium products at competitive prices. 
              We offer a wide range of items to meet all your shopping needs.
            </p>
            {/* Social Media Icons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#6b7280', 
                  transition: 'color 0.2s ease' 
                }}
                whileHover={{ y: -3, color: '#000000' }}
                transition={{ duration: 0.2 }}
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#6b7280', 
                  transition: 'color 0.2s ease' 
                }}
                whileHover={{ y: -3, color: '#000000' }}
                transition={{ duration: 0.2 }}
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </motion.a>              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#6b7280', 
                  transition: 'color 0.2s ease' 
                }}
                whileHover={{ y: -3, color: '#000000' }}
                transition={{ duration: 0.2 }}
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#6b7280', 
                  transition: 'color 0.2s ease' 
                }}
                whileHover={{ y: -3, color: '#000000' }}
                transition={{ duration: 0.2 }}
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </motion.a>
            </div>
          </div>          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Shop</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/products?category=new" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?category=bestsellers" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/products?category=sale" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  Sale
                </Link>
              </li>
              <li>
                <Link to="/products" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  All Products
                </Link>
              </li>
            </ul>
          </div>          {/* Customer Service */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Support</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/contact" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" 
                  style={{ color: '#4b5563', transition: 'color 0.2s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#000000'} 
                  onMouseOut={(e) => e.target.style.color = '#4b5563'}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Newsletter</h3>
            <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Subscribe for updates and exclusive offers.
            </p>            <form style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="Email address"
                style={{
                  padding: '0.5rem 1rem',
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem 0 0 0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#000000'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0 0.375rem 0.375rem 0',
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1f2937'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#000000'}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          marginTop: '2.5rem', 
          paddingTop: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem'
        }} className="md:flex-row">
          <p style={{ color: '#6b7280' }}>
            &copy; {currentYear} SHOPHUB. All rights reserved.
          </p>
          <div style={{ 
            marginTop: '1rem',
            display: 'flex', 
            gap: '1.5rem' 
          }} className="md:mt-0">
            <Link to="/privacy" 
              style={{ color: '#6b7280', transition: 'color 0.2s ease' }}
              onMouseOver={(e) => e.target.style.color = '#000000'} 
              onMouseOut={(e) => e.target.style.color = '#6b7280'}>
              Privacy
            </Link>
            <Link to="/terms" 
              style={{ color: '#6b7280', transition: 'color 0.2s ease' }}
              onMouseOver={(e) => e.target.style.color = '#000000'} 
              onMouseOut={(e) => e.target.style.color = '#6b7280'}>
              Terms
            </Link>
            <Link to="/sitemap" 
              style={{ color: '#6b7280', transition: 'color 0.2s ease' }}
              onMouseOver={(e) => e.target.style.color = '#000000'} 
              onMouseOut={(e) => e.target.style.color = '#6b7280'}>
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
