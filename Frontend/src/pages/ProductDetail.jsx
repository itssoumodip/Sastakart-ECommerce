import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const ProductDetail = () => {  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [expandedSection, setExpandedSection] = useState('description');
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [reviewInput, setReviewInput] = useState({ rating: 5, comment: '' });
  
  // Fetch product data
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
    error: productErrorData
  } = useQuery(['product', id], async () => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data.product;
  });
  
  // Fetch reviews
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isError: reviewsError
  } = useQuery(['reviews', id], async () => {
    const response = await axios.get(`/api/products/reviews?id=${id}`);
    return response.data;
  });
  
  // Check if product is in wishlist
  const productInWishlist = product ? isInWishlist(product._id) : false;
  
  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1 || (product && newQuantity > product.stock)) return;
    setQuantity(newQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    try {
      addToCart({
        id: product._id,
        name: product.title,
        price: product.discountPrice || product.price,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        stock: product.stock,
        brand: product.brand || '',
        quantity: quantity,
        selectedSize,
        selectedColor
      });
      
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add to cart');
    }
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (productInWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product._id,
        name: product.title,
        price: product.discountPrice || product.price,
        image: product.images?.[0],
        description: product.description,
        category: product.category,
        brand: product.brand
      });
      toast.success('Added to wishlist!');    }
  };

  // Submit review handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      const reviewData = {
        rating: reviewInput.rating,
        comment: reviewInput.comment,
        productId: id
      };
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${id}/reviews`, reviewData, config);
      
      if (response.data.success) {
        const newReview = {
          rating: reviewInput.rating,
          comment: reviewInput.comment,
          name: `${user.firstName} ${user.lastName}`,
          user: user._id,
          createdAt: new Date().toISOString()
        };
        
        // Update the product in the cache with the new review
        queryClient.setQueryData(['product', id], (oldData) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            reviews: [...(oldData.reviews || []), newReview],
            rating: response.data.rating,
            numReviews: (oldData.numReviews || 0) + 1
          };
        });

        // Force a refetch of the reviews
        await queryClient.invalidateQueries(['product', id]);
        await queryClient.invalidateQueries(['reviews', id]);
        
        toast.success('Review submitted successfully!');
        setIsReviewFormVisible(false);
        setReviewInput({ rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Review submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
    }
  };
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!product || !product.reviews || product.reviews.length === 0) {
      return 0;
    }
    
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / product.reviews.length;
  };
  
  // Render star rating component
  const renderStarRating = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (productError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <>      <Helmet>
        <title>{product?.title ? `${product.title} - SastaKart` : 'SastaKart'}</title>
        <meta name="description" content={product?.description || 'Product details'} />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <nav className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/products" className="hover:underline">Products</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/products?category=${product.category}`} className="hover:underline">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </nav>
        </div>
        
        {/* Product Details Section */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="relative overflow-hidden bg-gray-50 mb-6 rounded-2xl aspect-[4/3] lg:aspect-square w-full">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex flex-wrap gap-2 lg:gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImage
                          ? 'border-gray-800 shadow-md'
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
            </div>
            
            {/* Product Info */}
            <div>
              {/* Basic Info */}
              <div className="mb-6">
                {product.brand && (
                  <p className="text-gray-500 mb-2">{product.brand}</p>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {renderStarRating(product.rating || calculateAverageRating())}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.numReviews || product.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  
                  {product.stock > 0 ? (
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
                
                {/* Price */}
                <div className="flex items-center gap-4">
                {product.discountPrice && product.discountPrice < product.price ? (
                  <>
                    <span className="text-3xl font-semibold text-gray-900">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Save ₹{(product.price - product.discountPrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-semibold text-gray-900">
                    ₹{product.price}
                  </span>
                )}
              </div>
              </div>

              {/* Description */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  Product Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              {/* Options */}
              <div className="space-y-6 mb-8">
                {/* Size Options - Only show if product has sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-medium text-gray-900">Select Size</h3>
                      <Link to="#" className="text-sm text-blue-600 hover:underline">
                        Size Guide
                      </Link>
                    </div>
                    
                    <div className="flex flex-wr  ap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 border rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedSize === size
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-gray-800'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Color Options - Only show if product has colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-3">Color: {selectedColor || 'Select a color'}</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select ${color} color`}
                          className={`block w-10 h-10 rounded-full transition-all duration-200 border-2 ${
                            selectedColor === color
                              ? 'ring-2 ring-offset-2 ring-gray-800'
                              : 'ring-transparent'
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                        >
                          {selectedColor === color && (
                            <span className="flex items-center justify-center h-full">
                              <Check className="w-5 h-5 text-white drop-shadow-md" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quantity */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Quantity</h3>
                  <div className="inline-flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 border-r border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 text-center min-w-[3rem]">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.stock <= quantity}
                      className="p-3 border-l border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Add to Cart and Wishlist */}
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-black text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`btn-outline p-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
                    productInWishlist ? 'text-red-500' : 'text-gray-700'
                  }`}
                  aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${productInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              {/* Shipping / Return Info */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Truck className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Free Shipping</h4>
                    <span>Free shipping on orders over ₹3,500</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Easy Returns</h4>
                    <span>Return or exchange items within 30 days</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Secure Payment</h4>
                    <span>Your payment information is secure</span>
                  </div>
                </div>
              </div>
              
              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="w-1/2 text-gray-500">{key}</span>
                        <span className="w-1/2 font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Summary */}
              <div className="lg:col-span-1">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                    <p className="text-4xl font-bold text-gray-900">
                      {(product.rating || calculateAverageRating()).toFixed(1)}
                    </p>
                    <div className="flex justify-center mt-2">
                      {renderStarRating(product.rating || calculateAverageRating())}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Based on {product.numReviews || product.reviews?.length || 0} reviews
                    </p>
                  </div>
                  
                  {!isReviewFormVisible && (
                    <button
                      onClick={() => setIsReviewFormVisible(true)}
                      className="w-full py-2 px-4 border border-black text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Write a Review
                    </button>
                  )}
                </div>
              </div>
              
              {/* Review List */}
              <div className="lg:col-span-2">
                {isReviewFormVisible && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewInput({ ...reviewInput, rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewInput.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review
                        </label>
                        <textarea
                          id="review"
                          rows="4"
                          value={reviewInput.comment}
                          onChange={(e) => setReviewInput({ ...reviewInput, comment: e.target.value })}
                          placeholder="Share your experience with this product..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => setIsReviewFormVisible(false)}
                          className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                  {product.reviews && product.reviews.length > 0 ? (
                  <motion.div 
                    className="space-y-6"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {product.reviews.map((review, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                      >
                        <div className="flex justify-between mb-4">
                          <div>
                            <p className="font-medium text-gray-900">{review.name || 'Customer'}</p>
                            <div className="flex items-center mt-1">
                              {renderStarRating(review.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {review.verified && (
                            <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                              <Check className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">No reviews yet</p>
                    <p className="text-gray-600">Be the first to review this product</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
