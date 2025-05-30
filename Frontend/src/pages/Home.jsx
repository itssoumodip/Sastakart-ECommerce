import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import { ArrowRight, Star, ShoppingCart, Truck, Shield, Headphones, RefreshCw, TrendingUp, Award, Users, Heart, Eye, Mail, X } from 'lucide-react'
import { getMockProducts } from '../data/mockProducts'
import ProductCard from '../components/ProductCard'

const Home = () => {  // Fetch featured products
  const { data: productsData, isLoading } = useQuery(
    'featuredProducts',
    async () => {
      try {
        const { data } = await axios.get('/api/products?limit=8&sort=rating')
        return data
      } catch (apiError) {
        console.log('API not available, using mock data')
        return getMockProducts(8)
      }
    }
  );const categories = [
    { 
      name: 'Electronics', 
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&auto=format&cs=monochrome', 
      link: '/products?category=Electronics',
      gradient: 'from-white to-gray-300'
    },
    { 
      name: 'Fashion', 
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&auto=format&cs=monochrome', 
      link: '/products?category=Clothing',
      gradient: 'from-gray-800 to-black'
    },
    { 
      name: 'Home & Kitchen', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&cs=monochrome', 
      link: '/products?category=Home & Kitchen',
      gradient: 'from-white to-gray-400'
    },
    { 
      name: 'Beauty & Care', 
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&auto=format&cs=monochrome', 
      link: '/products?category=Beauty & Personal Care',
      gradient: 'from-black to-gray-600'
    },
  ]
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
      color: 'text-white',
      bgColor: 'bg-black border-2 border-white'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing',
      color: 'text-white',
      bgColor: 'bg-black border-2 border-white'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support',
      color: 'text-white',
      bgColor: 'bg-black border-2 border-white'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy',
      color: 'text-white',
      bgColor: 'bg-black border-2 border-white'
    }
  ]

  const stats = [
    { icon: Users, number: '50K+', label: 'Happy Customers' },
    { icon: Award, number: '10K+', label: 'Products Sold' },
    { icon: TrendingUp, number: '99%', label: 'Satisfaction Rate' },
    { icon: Truck, number: '24/7', label: 'Fast Delivery' }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <>
      <Helmet>
        <title>Modern E-Commerce - Shop the Latest Trends</title>
        <meta name="description" content="Discover amazing products at unbeatable prices. Free shipping, secure payment, and excellent customer service." />
      </Helmet>      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Retro Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              white 2px,
              white 4px
            ), repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              white 2px,
              white 4px
            )`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full opacity-10"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 font-mono"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textShadow: '4px 4px 0px #000, 8px 8px 0px rgba(255,255,255,0.3)',
                letterSpacing: '0.05em'
              }}              transition={{ delay: 0.2, duration: 0.8 }}
            >
              [ RETRO ]
              <span className="block text-white">
                E-COMMERCE
              </span>
            </motion.h1>
              <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ letterSpacing: '0.05em' }}
            >
              {'>'} SHOP THE LATEST TRENDS WITH UNBEATABLE PRICES <br/>
              {'>'} FAST SHIPPING AND EXCELLENT CUSTOMER SERVICE
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold font-mono uppercase tracking-wider border-4 border-white hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ letterSpacing: '0.1em' }}
                >
                  [ SHOP NOW ]
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products?sort=newest"
                  className="inline-flex items-center justify-center px-8 py-4 border-4 border-white bg-black text-white font-bold font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300"
                  style={{ letterSpacing: '0.1em' }}
                >
                  [ NEW ARRIVALS ]
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>          {/* Stats Section */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white border-2 border-black mb-3">
                  <stat.icon className="h-6 w-6 text-black" />
                </div>
                <div className="text-2xl font-bold text-white font-mono">{stat.number}</div>
                <div className="text-sm text-gray-300 font-mono uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>      {/* Features Section */}
      <section className="py-20 bg-white border-t-4 border-b-4 border-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-black mb-4 font-mono uppercase tracking-wider">[ WHY CHOOSE US? ]</h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto font-mono">
              {'>'} EXPERIENCE THE BEST SHOPPING WITH OUR PREMIUM SERVICES
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-20 h-20 ${feature.bgColor} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-10 w-10 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black font-mono uppercase tracking-wider">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed font-mono">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>      {/* Categories Section */}
      <section className="py-20 bg-black border-t-4 border-b-4 border-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white font-mono uppercase tracking-wider">
              [ SHOP BY CATEGORY ]
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
              {'>'} EXPLORE OUR WIDE RANGE OF CATEGORIES
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={category.link}
                  className="group relative overflow-hidden border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-500 block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter grayscale"
                    />
                    <div className={`absolute inset-0 ${category.gradient} opacity-80 group-hover:opacity-70 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white text-2xl font-bold mb-2 font-mono uppercase tracking-wider">{category.name}</h3>
                        <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono">
                          {'>'} DISCOVER {category.name.toUpperCase()}
                        </p>
                      </div>
                      
                      {/* Arrow */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className="h-5 w-5 text-black" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>      {/* Featured Products Section */}
      <section className="py-20 bg-black text-white border-t-4 border-b-4 border-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white font-mono uppercase tracking-wider" style={{ textShadow: '2px 2px 0px #000' }}>
              [ FEATURED PRODUCTS ]
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono tracking-wide">
              {'>'} TOP-RATED VINTAGE ITEMS {'<'}
            </p>
          </motion.div>
          
          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="bg-white rounded-2xl shadow-lg animate-pulse overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-2/3 mb-3"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/3"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {productsData?.products?.slice(0, 8).map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>
          )}
            <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/products"
                className="inline-flex items-center px-10 py-4 bg-white text-black border-4 border-white font-mono uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-all duration-300 text-lg"
              >
                VIEW ALL PRODUCTS
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>      {/* Newsletter Section */}
      <section className="py-20 bg-white text-black border-t-4 border-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(0, 0, 0, 0.05) 10px,
              rgba(0, 0, 0, 0.05) 20px
            )`
          }}></div>
        </div>
        
        {/* Static Geometric Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-black opacity-10"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-black opacity-10"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-black opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-black font-mono tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              [ STAY INFORMED ]
              <span className="block text-black font-mono uppercase">
                JOIN OUR NEWSLETTER
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-800 mb-12 max-w-2xl mx-auto leading-relaxed font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {'>'} SUBSCRIBE NOW FOR EXCLUSIVE DEALS AND NEW ARRIVALS {'<'}
            </motion.p>
            
            <motion.form 
              className="max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                    className="w-full px-6 py-4 bg-white text-black border-4 border-black font-mono uppercase focus:outline-none placeholder-gray-500 text-lg"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="px-8 py-4 bg-black text-white border-4 border-black font-mono uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-all duration-300 text-lg whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  SUBSCRIBE
                </motion.button>
              </div>
              
              <motion.p 
                className="text-sm text-gray-700 mt-4 font-mono"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {'>'} JOIN 50,000+ SUBSCRIBERS AND GET FIRST ACCESS TO NEW ARRIVALS {'<'}
              </motion.p>
            </motion.form>            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-12 border-t-4 border-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center text-black border-2 border-black px-4 py-2">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm font-mono uppercase tracking-wider">SECURE & PRIVATE</span>
              </div>
              <div className="flex items-center text-black border-2 border-black px-4 py-2">
                <Mail className="h-5 w-5 mr-2" />
                <span className="text-sm font-mono uppercase tracking-wider">NO SPAM</span>
              </div>
              <div className="flex items-center text-black border-2 border-black px-4 py-2">
                <X className="h-5 w-5 mr-2" />
                <span className="text-sm font-mono uppercase tracking-wider">UNSUBSCRIBE ANYTIME</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home
