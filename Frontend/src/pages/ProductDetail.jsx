import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {  Star,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  X,
  MessageCircle,
  ThumbsUp,
  Calendar,
  Award,
  Package
} from 'lucide-react';

// Import RetroPatterns for styling consistency
import RetroPatterns from '../components/layout/RetroPatterns';
import { getMockProduct } from '../data/mockProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);
  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
          if (data.product.images?.length > 0) setSelectedImage(0);
          if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
          if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }
      
      // Fallback to mock data
      const mockProduct = getMockProduct(id);
      if (mockProduct) {
        setProduct(mockProduct);
        if (mockProduct.images?.length > 0) setSelectedImage(0);
        if (mockProduct.sizes?.length > 0) setSelectedSize(mockProduct.sizes[0]);
        if (mockProduct.colors?.length > 0) setSelectedColor(mockProduct.colors[0]);
      } else {
        throw new Error('Product not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else if (response.status === 404) {
        // Reviews endpoint doesn't exist or no reviews found - this is okay
        setReviews([]);
      } else {
        console.warn('Failed to fetch reviews:', response.status);
        setReviews([]);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      // Set empty reviews on error instead of failing
      setReviews([]);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      quantity,
      selectedSize,
      selectedColor
    };
    
    addToCart(cartItem);
    toast.success('Product added to cart!');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageChange = (direction) => {
    if (!product?.images) return;
    
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newReview)
      });
      
      if (response.ok) {
        toast.success('Review submitted successfully!');
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        fetchReviews();
      } else {
        toast.error('Failed to submit review');
      }
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-white fill-current' : 'text-gray-500'
        }`}
      />
    ));
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            className="animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="aspect-square border border-white bg-gray-900 rounded-sm"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-16 border border-white bg-gray-900 rounded-sm"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 border border-white bg-gray-900 w-3/4 rounded-sm"></div>
                <div className="h-6 border border-white bg-gray-900 w-1/2 rounded-sm"></div>
                <div className="h-20 border border-white bg-gray-900 rounded-sm"></div>
                <div className="h-12 border border-white bg-gray-900 w-1/3 rounded-sm"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center bg-black border border-white p-8 max-w-md mx-4 rounded-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-white mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3 font-mono uppercase tracking-wide">PRODUCT NOT FOUND</h2>
          <p className="text-gray-300 mb-6 font-mono text-sm">{error || 'THE PRODUCT YOU ARE LOOKING FOR DOES NOT EXIST.'}</p>
          <motion.button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-4 py-2 bg-black text-white border border-white font-mono uppercase hover:bg-white hover:text-black transition-colors duration-300 tracking-wide text-sm rounded-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BROWSE PRODUCTS
          </motion.button>
        </motion.div>
      </div>
    );
  }  return (
    <>
      <Helmet>
        <title>{product?.name ? `${product.name} - RETRO-SHOP` : 'RETRO-SHOP'}</title>
        <meta name="description" content={product?.description || 'Premium products at RETRO-SHOP'} />
      </Helmet>
      
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb */}
          <motion.nav 
            className="flex items-center space-x-2 text-sm text-gray-400 mb-6 font-mono border-b border-white/20 pb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button 
              onClick={() => navigate('/')} 
              className="hover:text-white transition-colors uppercase tracking-wide"
              whileHover={{ scale: 1.02 }}
            >
              HOME
            </motion.button>
            <span className="text-white">/</span>
            <motion.button 
              onClick={() => navigate('/products')} 
              className="hover:text-white transition-colors uppercase tracking-wide"
              whileHover={{ scale: 1.02 }}
            >
              PRODUCTS
            </motion.button>
            <span className="text-white">/</span>
            <span className="text-white font-medium uppercase tracking-wide">{product.title}</span>
          </motion.nav>          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square bg-gray-900 border border-white overflow-hidden group rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {product.images?.length > 1 && (
                  <>
                    <motion.button
                      onClick={() => handleImageChange('prev')}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 border border-white transition-all duration-200 opacity-0 group-hover:opacity-100 rounded-sm backdrop-blur-sm"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)", color: "#000" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleImageChange('next')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 border border-white transition-all duration-200 opacity-0 group-hover:opacity-100 rounded-sm backdrop-blur-sm"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)", color: "#000" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </>
                )}

                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice < product.price && (
                  <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 text-xs font-bold font-mono rounded-sm">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <motion.div 
                  className="flex space-x-2 overflow-x-auto pb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 overflow-hidden border transition-all duration-200 rounded-sm ${
                        selectedImage === index 
                          ? 'border-white' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>            {/* Product Info */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Main Product Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="border border-white p-4 rounded-sm bg-black/50 backdrop-blur-sm"
              >
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-mono uppercase tracking-wide">
                  {product.name || product.title}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating || 4.5)}
                    </div>
                    <span className="text-sm text-gray-300 font-medium font-mono">
                      {product.rating || 4.5} ({reviews.length} reviews)
                    </span>
                  </div>
                  <motion.span 
                    className={`px-3 py-1 text-sm font-semibold font-mono rounded-sm ${
                      (product.stock || 10) > 0 
                        ? 'bg-white text-black' 
                        : 'bg-red-600 text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {(product.stock || 10) > 0 ? `${product.stock || 10} IN STOCK` : 'OUT OF STOCK'}
                  </motion.span>
                </div>
                
                <div className="flex items-baseline space-x-4 mb-4">
                  <span className="text-3xl lg:text-4xl font-bold text-white font-mono">
                    ${product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && product.discountPrice < product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through font-mono">
                        ${product.price}
                      </span>
                      <span className="bg-white text-black px-2 py-1 text-sm font-bold font-mono rounded-sm">
                        SAVE ${(product.price - product.discountPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <p className="text-gray-300 leading-relaxed font-mono text-sm lg:text-base">
                    {product.description || "Experience premium quality and style with this exceptional product. Crafted with attention to detail and designed for modern living."}
                  </p>
                </div>
              </motion.div>              {/* Size Selection */}
              {(product.sizes?.length > 0 || true) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="border border-white p-4 rounded-sm bg-black/50 backdrop-blur-sm"
                >
                  <h3 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wide">SIZE</h3>
                  <div className="flex flex-wrap gap-2">
                    {(product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 border font-mono uppercase tracking-wide transition-all duration-300 rounded-sm ${
                          selectedSize === size
                            ? 'border-white bg-white text-black'
                            : 'border-white text-white hover:bg-white hover:text-black'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Color Selection */}
              {(product.colors?.length > 0 || true) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="border border-white p-4 rounded-sm bg-black/50 backdrop-blur-sm"
                >
                  <h3 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wide">COLOR</h3>
                  <div className="flex flex-wrap gap-2">
                    {(product.colors || ['Black', 'White', 'Gray', 'Navy']).map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 border font-mono uppercase tracking-wide transition-all duration-300 rounded-sm ${
                          selectedColor === color
                            ? 'border-white bg-white text-black'
                            : 'border-white text-white hover:bg-white hover:text-black'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {color}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="border border-white p-4 rounded-sm bg-black/50 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wide">QUANTITY</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-black border border-white rounded-sm">
                    <motion.button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: quantity > 1 ? 1.02 : 1 }}
                      whileTap={{ scale: quantity > 1 ? 0.98 : 1 }}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="px-4 py-2 font-bold text-white min-w-[3rem] text-center font-mono">
                      {quantity}
                    </span>
                    <motion.button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock || 10)}
                      className="p-2 text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: quantity < (product.stock || 10) ? 1.02 : 1 }}
                      whileTap={{ scale: quantity < (product.stock || 10) ? 0.98 : 1 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <span className="text-sm text-gray-300 bg-black border border-white px-2 py-1 font-mono uppercase rounded-sm">
                    {product.stock || 10} AVAILABLE
                  </span>
                </div>
              </motion.div>              {/* Action Buttons */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.button
                  onClick={handleAddToCart}
                  disabled={(product.stock || 10) === 0}
                  className="w-full bg-black text-white border border-white py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors duration-300 text-base hover:bg-white hover:text-black font-mono uppercase tracking-wide rounded-sm"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>ADD TO CART - ${((product.discountPrice || product.price) * quantity).toFixed(2)}</span>
                </motion.button>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex items-center justify-center space-x-2 py-2 px-4 border font-mono uppercase tracking-wide transition-all duration-300 rounded-sm ${
                      isWishlisted 
                        ? 'bg-white text-black border-white' 
                        : 'bg-black text-white border-white hover:bg-white hover:text-black'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    <span className="text-sm">{isWishlisted ? 'SAVED' : 'SAVE'}</span>
                  </motion.button>
                  
                  <motion.button 
                    className="flex items-center justify-center space-x-2 py-2 px-4 border border-white bg-black text-white font-mono uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">SHARE</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div 
                className="border border-white p-4 space-y-3 rounded-sm bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div 
                  className="flex items-center space-x-3 text-white"
                  whileHover={{ x: 2 }}
                >
                  <div className="border border-white p-1.5 rounded-sm">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="font-medium font-mono uppercase tracking-wide text-sm">FREE SHIPPING ON ORDERS OVER $50</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3 text-white"
                  whileHover={{ x: 2 }}
                >
                  <div className="border border-white p-1.5 rounded-sm">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className="font-medium font-mono uppercase tracking-wide text-sm">30-DAY RETURN POLICY</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3 text-white"
                  whileHover={{ x: 2 }}
                >
                  <div className="border border-white p-1.5 rounded-sm">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="font-medium font-mono uppercase tracking-wide text-sm">2-YEAR WARRANTY INCLUDED</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
            {/* Reviews Section */}
          <motion.div 
            className="mt-12 border border-white rounded-sm bg-black/50 backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="bg-black/70 px-6 py-4 border-b border-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wide">
                    CUSTOMER REVIEWS
                  </h2>
                  <p className="text-gray-300 mt-1 font-mono text-sm">
                    {reviews.length} REVIEW{reviews.length !== 1 ? 'S' : ''} • AVERAGE RATING: {product.rating || 4.5}/5
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-black text-white border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors duration-300 flex items-center space-x-2 font-mono uppercase tracking-wide text-sm rounded-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Star className="w-4 h-4" />
                  <span>WRITE REVIEW</span>
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              {/* Review Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.form 
                    onSubmit={handleSubmitReview} 
                    className="bg-black/50 p-6 mb-6 border border-white rounded-sm backdrop-blur-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-4 font-mono uppercase tracking-wide">SHARE YOUR EXPERIENCE</h3>
                    
                    <div className="mb-4">
                      <label className="block text-base font-semibold text-white mb-2 font-mono uppercase tracking-wide">
                        RATING
                      </label>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, index) => (
                          <motion.button
                            key={index}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                            className="focus:outline-none"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                index < newReview.rating
                                  ? 'text-white fill-current'
                                  : 'text-gray-600 hover:text-gray-400'
                              }`}
                            />
                          </motion.button>
                        ))}
                        <span className="ml-3 text-sm text-gray-300 self-center font-mono">
                          {newReview.rating === 1 && 'POOR'}
                          {newReview.rating === 2 && 'FAIR'}
                          {newReview.rating === 3 && 'GOOD'}
                          {newReview.rating === 4 && 'VERY GOOD'}
                          {newReview.rating === 5 && 'EXCELLENT'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-base font-semibold text-white mb-2 font-mono uppercase tracking-wide">
                        YOUR REVIEW
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full p-3 bg-black text-white border border-white focus:outline-none focus:ring-1 focus:ring-white transition-all duration-200 font-mono rounded-sm"
                        rows="3"
                        placeholder="SHARE YOUR EXPERIENCE WITH THIS PRODUCT."
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <motion.button 
                        type="submit" 
                        className="bg-white text-black font-semibold py-2 px-6 transition-colors duration-300 font-mono uppercase tracking-wide hover:bg-black hover:text-white border border-white rounded-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        SUBMIT REVIEW
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-black text-white border border-white font-semibold py-2 px-6 hover:bg-white hover:text-black transition-colors duration-300 font-mono uppercase tracking-wide rounded-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CANCEL
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-gray-500 mb-3">
                      <Star className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 font-mono uppercase tracking-wide">NO REVIEWS YET</h3>
                    <p className="text-gray-400 font-mono text-sm">BE THE FIRST TO REVIEW THIS PRODUCT AND HELP OTHERS MAKE INFORMED DECISIONS.</p>
                  </motion.div>
                ) : (
                  reviews.map((review, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-black/50 border border-white p-4 hover:border-gray-300 transition-all duration-300 rounded-sm backdrop-blur-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -1 }}
                    >
                      <div className="flex items-start space-x-3">
                        <motion.div 
                          className="flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-10 h-10 bg-white text-black border border-white rounded-sm flex items-center justify-center">
                            <span className="text-sm font-bold font-mono">
                              {review.user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-base font-bold text-white font-mono uppercase">
                                {review.user?.name || 'ANONYMOUS USER'}
                              </span>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 border border-white px-2 py-1 font-mono rounded-sm">
                              {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              }).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-300 leading-relaxed text-sm font-mono mb-3">
                            {review.comment || "GREAT PRODUCT! HIGHLY RECOMMENDED."}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <motion.button 
                              className="flex items-center space-x-1 hover:text-white transition-colors font-mono uppercase"
                              whileHover={{ scale: 1.02 }}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>HELPFUL (12)</span>
                            </motion.button>
                            <motion.button 
                              className="flex items-center space-x-1 hover:text-white transition-colors font-mono uppercase"
                              whileHover={{ scale: 1.02 }}
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>REPLY</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
