import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../../store/productSlice';
import HeroSlider from '../../components/ui/HeroSlider';
import ProductCard from '../../components/product/ProductCard';
import { FiArrowRight, FiTruck, FiRefreshCw, FiLock, FiHeadphones, FiStar, FiUsers, FiShield } from 'react-icons/fi';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  
  // State for category filtering
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
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
  ];  useEffect(() => {
    // Uncomment when backend is ready
    // dispatch(fetchProducts({}));
  }, [dispatch]);

  // Filter products based on active category
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(mockProducts);
    } else {
      setFilteredProducts(mockProducts.filter(product => product.category === activeCategory));
    }
  }, [activeCategory]);

  // Get unique categories from products
  const categories = ['All', ...new Set(mockProducts.map(product => product.category))];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top promotional banner */}
      <div className="bg-red-500 text-white text-center py-2">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-medium">
            🔥 End of Season Sale! Up to 50% OFF - Free Shipping on Orders Over $50
          </p>
        </div>
      </div>      
      {/* Hero Section with Banner Carousel */}
      <section className="relative">
        <HeroSlider slides={heroSlides} />
      </section>

      {/* Category Icons Section */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <Link to={category.link}>
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-red-500 transition-colors">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xs font-medium text-gray-700 group-hover:text-red-500 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* Popular Products Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Popular Products
            </h2>
            <Link 
              to="/products" 
              className="text-red-500 hover:text-red-600 font-semibold flex items-center"
            >
              View All 
              <FiArrowRight className="ml-1" />
            </Link>
          </div>
            {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : (            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>      {/* Promotional Banners */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Banner 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg shadow-lg group"
            >
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80" 
                alt="Summer Collection" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Summer Collection</h3>
                  <p className="text-lg mb-4">Up to 40% OFF</p>
                  <Link 
                    to="/products?collection=summer" 
                    className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Banner 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg shadow-lg group"
            >
              <img 
                src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80" 
                alt="Tech Gadgets" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Tech Gadgets</h3>
                  <p className="text-lg mb-4">Special Prices</p>
                  <Link 
                    to="/products?category=electronics" 
                    className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best shopping experience with our premium services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <FiTruck className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders above $50</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <FiRefreshCw className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free return policy</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <FiLock className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <FiHeadphones className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-red-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Stay updated with our latest products, exclusive offers, and fashion trends
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 bg-white text-red-500 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
            
            <p className="text-sm mt-4 opacity-75">
              No spam, unsubscribe at any time
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
