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
  }, [dispatch]);
    return (
    <div style={{ animation: 'fadeIn 0.6s ease-in-out' }}>
      {/* Hero Slider with reduced height for more minimalism */}
      <HeroSlider slides={heroSlides} />
      
      {/* Featured Categories with improved spacing and layout */}
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <motion.h2 
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '2.5rem', 
              textAlign: 'center'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Explore Categories
          </motion.h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1.5rem',
            '@media (min-width: 768px)': {
              gridTemplateColumns: 'repeat(4, 1fr)'
            }
          }}>
            {featuredCategories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  to={category.link} 
                  style={{
                    display: 'block',
                    position: 'relative',
                    height: '10rem',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'box-shadow 300ms ease',
                  }}
                  className="hover:shadow-md sm:h-56"
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: '0',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    transition: 'background-color 300ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className="hover:bg-opacity-30">
                    <span style={{
                      color: '#ffffff',
                      fontSize: '1.25rem',
                      fontWeight: '500',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '9999px'
                    }}>
                      {category.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
        {/* Featured Products with cleaner design */}
      <section style={{ backgroundColor: '#f9fafb', padding: '4rem 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <motion.h2 
              style={{ fontSize: '1.5rem', fontWeight: '700' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Products
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                to="/products" 
                style={{ display: 'flex', alignItems: 'center', color: '#000000', fontWeight: '500' }}
                className="hover:text-gray-700 group"
              >
                View All <FiArrowRight style={{ marginLeft: '0.5rem', transition: 'transform 300ms ease' }} className="group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div style={{ 
                height: '3rem', 
                width: '3rem', 
                borderRadius: '9999px',
                borderTop: '2px solid #000000',
                borderBottom: '2px solid #000000',
              }} className="animate-spin"></div>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '2rem',
              '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
              '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
              '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' }
            }}>
              {mockProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Minimalist Banner Section */}
      <section style={{ padding: '5rem 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem' }}>
            <div style={{ 
              position: 'absolute', 
              inset: '0', 
              background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
              zIndex: '10'
            }}></div>
            <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80" 
              alt="Spring Collection" 
              style={{ 
                width: '100%', 
                height: '20rem',
                objectFit: 'cover',
                '@media (min-width: 768px)': { height: '24rem' }
              }}
            />
            <div style={{ position: 'absolute', inset: '0', zIndex: '20', display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '0 2rem', maxWidth: '32rem', '@media (min-width: 768px)': { padding: '0 4rem' } }}>
                <motion.h2 
                  style={{ 
                    fontSize: '1.875rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#ffffff',
                    '@media (min-width: 768px)': { fontSize: '2.25rem' }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Spring Collection
                </motion.h2>
                <motion.p 
                  style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: '#f3f4f6' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Discover our newest arrivals with fresh styles perfect for the season.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link 
                    to="/products?collection=spring" 
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      padding: '0.75rem 2rem',
                      borderRadius: '9999px',
                      fontWeight: '500',
                      transition: 'background-color 300ms ease'
                    }}
                    className="hover:bg-gray-100 hover:shadow-md"
                  >
                    Explore Collection
                  </Link>
                </motion.div>
              </div>
            </div>
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
