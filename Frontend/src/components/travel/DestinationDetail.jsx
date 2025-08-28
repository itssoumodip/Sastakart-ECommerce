import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import { Star, MapPin, Calendar, DollarSign, Award, Heart, Share2, Clock, User, MessageCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { getAuthHeaders, getAuthToken, isAdmin, isAuthenticated } from '../../utils/auth';
import toast from 'react-hot-toast';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        
        // Use test endpoints for development
        const response = await axios.get(`${API_BASE_URL}/api/travel/test/destinations/${id}`);
        
        if (response.data.success) {
          setDestination(response.data.destination);
        } else {
          throw new Error('Failed to fetch destination');
        }
      } catch (error) {
        console.error('Error fetching destination details:', error);
        setError('Failed to load destination details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDestination();
  }, [id]);
  
  // Handle review form changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setUserReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };
  
  // Submit review
  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.error('Please log in to submit a review');
      return;
    }
    
    try {
      setSubmittingReview(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/travel/destinations/${id}/reviews`,
        userReview,
        { headers: { ...getAuthHeaders() } }
      );
      
      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setDestination(response.data.destination);
        setShowReviewForm(false);
        setUserReview({ rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };
  
  // Display price level based on the number (1-5)
  const renderPriceLevel = (level) => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <DollarSign 
          key={index} 
          className={`inline-block w-4 h-4 ${index < level ? 'text-green-600' : 'text-gray-300'}`} 
        />
      ));
  };
  
  // Display stars based on rating
  const renderRating = (rating) => {
    return Array(5)
      .fill()
      .map((_, index) => {
        const starValue = index + 1;
        return (
          <Star 
            key={index} 
            className={`inline-block w-4 h-4 ${
              starValue <= rating 
                ? 'text-yellow-400' 
                : starValue - 0.5 <= rating 
                  ? 'text-yellow-300' 
                  : 'text-gray-300'
            }`} 
            fill={starValue <= rating ? 'currentColor' : 'none'}
          />
        );
      });
  };
  
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !destination) {
    return (
      <div className="py-20 text-center text-red-600">
        <p>{error || 'Destination not found'}</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{destination.name} | Travel Explorer</title>
        <meta name="description" content={destination.description.substring(0, 160)} />
      </Helmet>
      
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px]">
          <img 
            src={destination.imageUrl} 
            alt={destination.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="container mx-auto px-4 py-8">
              <div className="text-white mb-2 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{destination.city}, {destination.country}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {destination.name}
              </h1>
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="flex mr-2">
                    {renderRating(destination.averageRating)}
                  </div>
                  <span className="text-white">
                    {destination.averageRating} ({destination.numReviews} reviews)
                  </span>
                </div>
                
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Award className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-white">
                    {destination.popularityScore >= 0.8 ? 'Top Rated' : 
                     destination.popularityScore >= 0.6 ? 'Popular' : 
                     'Recommended'}
                  </span>
                </div>
                
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white">Price: {renderPriceLevel(destination.priceLevel)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap -mx-4">
            {/* Main Content */}
            <div className="w-full lg:w-2/3 px-4">
              {/* Description */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {destination.description}
                </p>
                
                <div className="flex gap-4 mb-6">
                  <motion.button
                    className="flex items-center text-gray-600 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span>Save</span>
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center text-gray-600 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    <span>Share</span>
                  </motion.button>
                </div>
                
                {/* Destination Category Badge */}
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-3 py-1 rounded-full">
                    {destination.category}
                  </span>
                </div>
              </section>
              
              {/* Image Gallery */}
              {destination.images && destination.images.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {destination.images.map((image, index) => (
                      <div key={index} className="relative h-40 md:h-64 rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${destination.name} - Photo ${index + 1}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Reviews Section */}
              <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Traveler Reviews</h2>
                  
                  {isAuthenticated() && (
                    <motion.button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                    </motion.button>
                  )}
                </div>
                
                {showReviewForm && (
                  <motion.div
                    className="bg-gray-50 rounded-lg p-6 mb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-4">Share Your Experience</h3>
                    <form onSubmit={submitReview}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Your Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} className="cursor-pointer">
                              <input 
                                type="radio" 
                                name="rating" 
                                value={value} 
                                checked={userReview.rating === value}
                                onChange={handleReviewChange}
                                className="sr-only"
                              />
                              <Star 
                                className={`w-8 h-8 ${userReview.rating >= value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="comment" className="block text-gray-700 mb-2">Your Review</label>
                        <textarea
                          id="comment"
                          name="comment"
                          value={userReview.comment}
                          onChange={handleReviewChange}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Share your thoughts about this destination..."
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 ${
                            submittingReview ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                          }`}
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
                
                {destination.reviews && destination.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {destination.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">Traveler</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex mb-2">
                          {renderRating(review.rating)}
                        </div>
                        
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-1">No Reviews Yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to share your experience!</p>
                    
                    {isAuthenticated() && !showReviewForm && (
                      <motion.button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Write a Review
                      </motion.button>
                    )}
                  </div>
                )}
              </section>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3 px-4 mt-10 lg:mt-0">
              <div className="sticky top-24">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">Want to visit?</h3>
                  <p className="text-gray-700 mb-4">
                    Plan your trip to {destination.name} with our travel partners.
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200">
                    Plan Your Trip
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Nearby Destinations</h3>
                  <p className="text-gray-700 mb-4">
                    Explore other destinations in {destination.country}
                  </p>
                  {/* This would be populated from an API call */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-3 rounded overflow-hidden">
                        <div className="w-full h-full bg-gray-200"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">Another Destination</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{destination.country}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-3 rounded overflow-hidden">
                        <div className="w-full h-full bg-gray-200"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">Another Destination</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{destination.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationDetail;
