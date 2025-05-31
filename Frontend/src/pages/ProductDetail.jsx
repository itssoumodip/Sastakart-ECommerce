import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
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
import { getAuthHeaders } from '../utils/auth'; // Added import

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);

  // Check if product is in wishlist
  const productInWishlist = product && isInWishlist(product.id);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);
  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      setProduct(data.product);
      if (data.product.images?.length > 0) setSelectedImage(0);
      if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
      if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
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
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
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

  const toggleWishlist = () => {
    if (!product) return;
    
    if (productInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        description: product.description || '',
        category: product.category || 'Uncategorized'
      });
    }
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
        headers: getAuthHeaders(), // Updated to use getAuthHeaders
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
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            className="animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 w-3/4 rounded-lg"></div>
                <div className="h-6 bg-gray-200 w-1/2 rounded-lg"></div>
                <div className="h-20 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 w-1/3 rounded-lg"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          className="text-center card max-w-md mx-4 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <motion.button
            onClick={() => navigate('/products')}
            className="btn-primary inline-flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse Products
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product?.name ? `${product.name} - EcoShop` : 'EcoShop'}</title>
        <meta name="description" content={product?.description || 'Premium products at EcoShop'} />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb */}
          <motion.nav 
            className="flex items-center space-x-2 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/products')} 
              className="hover:text-gray-900 transition-colors"
            >
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </motion.nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
                <img
                  src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageChange('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleImageChange('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice < product.price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.floor(product.rating))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.numReviews} reviews)
                    </span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-light text-gray-900">
                  ${product.discountPrice || product.price}
                </span>
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Options */}
              {(product.sizes?.length > 0 || product.colors?.length > 0) && (
                <div className="space-y-4">
                  {/* Size Selection */}
                  {product.sizes?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                              selectedSize === size
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                              selectedColor === color
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock || 10)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                    <motion.button
                    onClick={toggleWishlist}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn-outline p-3 ${productInWishlist ? 'bg-pink-50 border-pink-300 text-pink-600' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${productInWishlist ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <button className="btn-outline p-3">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>2-year warranty included</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <span>30-day returns policy</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div 
            className="mt-16 pt-16 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900">Customer Reviews</h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-outline"
              >
                Write a Review
              </button>
            </div>

            {/* Review Form */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.form
                  onSubmit={handleSubmitReview}
                  className="card p-6 mb-8"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                rating <= newReview.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        className="input"
                        placeholder="Share your experience with this product..."
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button type="submit" className="btn-primary">
                        Submit Review
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowReviewForm(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <motion.div
                    key={review._id || index}
                    className="card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to review this product!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
