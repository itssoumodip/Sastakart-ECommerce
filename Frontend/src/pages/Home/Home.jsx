import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../../store/productSlice';
import HeroSlider from '../../components/ui/HeroSlider';
import ProductCard from '../../components/product/ProductCard';
import { FiArrowRight, FiTruck, FiRefreshCw, FiLock, FiHeadphones } from 'react-icons/fi';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  
  // Mock hero slider data until we connect to a real API
  const heroSlides = [
    {
      title: 'Summer Collection 2025',
      description: 'Discover our latest summer collection with styles that keep you fresh and fashionable all season long.',
      buttonText: 'Shop Now',
      buttonLink: '/products?category=summer',
      image: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&q=80'
    },
    {
      title: 'Premium Electronics',
      description: 'Upgrade your tech with our premium selection of gadgets and electronics.',
      buttonText: 'Explore',
      buttonLink: '/products?category=electronics',
      image: 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?auto=format&fit=crop&q=80'
    },
    {
      title: 'Home & Decor',
      description: 'Transform your space with our curated home decor collection.',
      buttonText: 'Discover',
      buttonLink: '/products?category=home',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80'
    }
  ];
  
  // Mock featured categories
  const featuredCategories = [
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80',
      link: '/products?category=fashion'
    },
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80',
      link: '/products?category=electronics'
    },
    {
      name: 'Home',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
      link: '/products?category=home'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80',
      link: '/products?category=sports'
    }
  ];
  
  // Mock data for now (would normally come from the API)
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      category: 'Electronics',
      price: 299.99,
      discount: 15,
      rating: 4.5,
      reviewCount: 127,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      price: 249.99,
      discount: 0,
      rating: 4.8,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1541558869434-2890a5aaa157?auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Minimalist Desk Lamp',
      category: 'Home',
      price: 79.99,
      discount: 10,
      rating: 4.2,
      reviewCount: 56,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Smart Watch Series 5',
      category: 'Electronics',
      price: 399.99,
      discount: 20,
      rating: 4.7,
      reviewCount: 215,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      name: 'Premium Leather Wallet',
      category: 'Accessories',
      price: 59.99,
      discount: 0,
      rating: 4.3,
      reviewCount: 42,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      name: 'Ceramic Coffee Mug Set',
      category: 'Kitchen',
      price: 39.99,
      discount: 5,
      rating: 4.4,
      reviewCount: 68,
      image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&q=80',
    },
    {
      id: 7,
      name: 'Modern Wall Clock',
      category: 'Home',
      price: 49.99,
      discount: 0,
      rating: 4.1,
      reviewCount: 37,
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80',
    },
    {
      id: 8,
      name: 'Canvas Messenger Bag',
      category: 'Fashion',
      price: 89.99,
      discount: 10,
      rating: 4.6,
      reviewCount: 94,
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80',
    }
  ];
  
  useEffect(() => {
    // Uncomment when backend is ready
    // dispatch(fetchProducts({}));
  }, [dispatch]);    return (
    <div style={{ animation: 'fadeIn 0.6s ease-in-out' }}>
      {/* Top promotional banner - like QuickCart */}
      <div style={{
        backgroundColor: '#ff4646',
        color: 'white',
        textAlign: 'center',
        padding: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
          Summer Sale! Use code <strong>SUMMER25</strong> for 25% off all products
        </div>
      </div>
      
      {/* Hero Slider with minimalist design */}
      <HeroSlider slides={heroSlides} />
        {/* Product Categories with QuickCart-like minimal design */}
      <section style={{ backgroundColor: '#f9fafb', padding: '3rem 0 2rem' }}>
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div 
            style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: '#333'
            }}>
              Shop by Category
            </h2>
            <Link 
              to="/products" 
              style={{ display: 'flex', alignItems: 'center', color: '#555', fontWeight: '500', fontSize: '0.9rem' }}
              onMouseOver={(e) => {
                e.target.style.color = '#000';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#555';
              }}
            >
              View All <FiArrowRight style={{ marginLeft: '0.25rem', transition: 'transform 200ms ease' }} />
            </Link>
          </motion.div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1rem',
            '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' },
            '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
            '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(6, 1fr)' }
          }}>
            {featuredCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link 
                  to={category.link} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    border: '1px solid #f0f0f0',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  <span style={{
                    color: '#333',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>{/* Featured Products with QuickCart-style grid layout */}
      <section style={{ backgroundColor: '#ffffff', padding: '3rem 0' }}>
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <motion.h2 
              style={{ fontSize: '1.25rem', fontWeight: '600', color: '#333' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Featured Products
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                to="/products" 
                style={{ display: 'flex', alignItems: 'center', color: '#555', fontWeight: '500', fontSize: '0.9rem' }}
                onMouseOver={(e) => {
                  e.target.style.color = '#000';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#555';
                }}
              >
                View All <FiArrowRight style={{ marginLeft: '0.25rem', transition: 'transform 200ms ease' }} className="group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
              <div style={{ 
                height: '2.5rem', 
                width: '2.5rem', 
                borderRadius: '50%',
                borderTop: '2px solid #333',
                borderRight: '2px solid transparent',
                borderBottom: '2px solid #333',
                borderLeft: '2px solid transparent',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem',
              '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' },
              '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
              '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(5, 1fr)' },
              '@media (min-width: 1280px)': { gridTemplateColumns: 'repeat(6, 1fr)' }
            }}>
              {mockProducts.slice(0, 12).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
        {/* QuickCart-style Banner Section */}
      <section style={{ padding: '3rem 0 2rem' }}>
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem',
            '@media (min-width: 768px)': { 
              gridTemplateColumns: '1fr 1fr',
            }
          }}>
            {/* Banner 1 */}
            <motion.div 
              style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '6px',
                height: '200px',
                border: '1px solid #f0f0f0'
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            >
              <div style={{ 
                position: 'absolute', 
                inset: '0', 
                background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                zIndex: '10'
              }}></div>
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80" 
                alt="Summer Collection" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ position: 'absolute', inset: '0', zIndex: '20', display: 'flex', alignItems: 'center' }}>
                <div style={{ padding: '0 1.5rem', maxWidth: '18rem' }}>
                  <h2 style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#ffffff',
                  }}>
                    Summer Collection
                  </h2>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    marginBottom: '1rem', 
                    color: 'rgba(255,255,255,0.9)'
                  }}>
                    Fresh summer styles with up to 40% off
                  </p>
                  <Link 
                    to="/products?collection=summer" 
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: '500',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f0f0f0';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.transform = 'none';
                    }}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Banner 2 */}
            <motion.div 
              style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '6px',
                height: '200px',
                border: '1px solid #f0f0f0'
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            >
              <div style={{ 
                position: 'absolute', 
                inset: '0', 
                background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                zIndex: '10'
              }}></div>
              <img 
                src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80" 
                alt="Tech Gadgets" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ position: 'absolute', inset: '0', zIndex: '20', display: 'flex', alignItems: 'center' }}>
                <div style={{ padding: '0 1.5rem', maxWidth: '18rem' }}>
                  <h2 style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#ffffff',
                  }}>
                    Tech Gadgets
                  </h2>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    marginBottom: '1rem', 
                    color: 'rgba(255,255,255,0.9)'
                  }}>
                    Latest electronics at special prices
                  </p>
                  <Link 
                    to="/products?category=electronics" 
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: '500',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f0f0f0';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.transform = 'none';
                    }}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
        {/* Features Section with cleaner design */}
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <motion.div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '2rem',
              '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
              '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' }
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1.5rem', 
              border: '1px solid #f3f4f6', 
              borderRadius: '0.5rem',
              transition: 'box-shadow 300ms ease'
            }}
            className="hover:shadow-sm">
              <div style={{ marginRight: '1.25rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#f9fafb' }}>
                  <FiTruck style={{ fontSize: '1.25rem', color: '#000000' }} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.25rem' }}>Free Shipping</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>On all orders above $50</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1.5rem', 
              border: '1px solid #f3f4f6', 
              borderRadius: '0.5rem',
              transition: 'box-shadow 300ms ease'
            }}
            className="hover:shadow-sm">
              <div style={{ marginRight: '1.25rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#f9fafb' }}>
                  <FiRefreshCw style={{ fontSize: '1.25rem', color: '#000000' }} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.25rem' }}>Easy Returns</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>30-day return policy</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1.5rem', 
              border: '1px solid #f3f4f6', 
              borderRadius: '0.5rem',
              transition: 'box-shadow 300ms ease'
            }}
            className="hover:shadow-sm">
              <div style={{ marginRight: '1.25rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#f9fafb' }}>
                  <FiLock style={{ fontSize: '1.25rem', color: '#000000' }} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.25rem' }}>Secure Payment</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Protected by encryption</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1.5rem', 
              border: '1px solid #f3f4f6', 
              borderRadius: '0.5rem',
              transition: 'box-shadow 300ms ease'
            }}
            className="hover:shadow-sm">
              <div style={{ marginRight: '1.25rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#f9fafb' }}>
                  <FiHeadphones style={{ fontSize: '1.25rem', color: '#000000' }} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.25rem' }}>24/7 Support</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Customer service available</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        {/* Minimalist Newsletter */}
      <section style={{ backgroundColor: '#f9fafb', padding: '4rem 0' }}>
        <div style={{ maxWidth: '32rem', margin: '0 auto', padding: '0 1rem' }}>
          <motion.div 
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              '@media (min-width: 768px)': { fontSize: '1.875rem' }
            }}>
              Join Our Newsletter
            </h2>
            <p style={{ marginBottom: '2rem', color: '#4b5563' }}>
              Stay updated with our latest products and exclusive offers.
            </p>
            <form style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.75rem',
              '@media (min-width: 640px)': { flexDirection: 'row' }
            }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  padding: '0.75rem 1.25rem',
                  flexGrow: 1,
                  borderRadius: '9999px',
                  border: 'none',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  backgroundColor: '#ffffff',
                  transition: 'box-shadow 300ms ease',
                  outline: 'none',
                }}
                className="focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{ 
                  padding: '0.75rem 2rem', 
                  borderRadius: '9999px', 
                  fontWeight: '500',
                  backgroundColor: '#000000', 
                  color: '#ffffff',
                  transition: 'background-color 300ms ease'
                }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
