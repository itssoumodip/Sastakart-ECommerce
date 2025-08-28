import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import { Star, MapPin, DollarSign, Award } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const PopularDestinations = ({ limit = 4 }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        setLoading(true);
        
        // Use test endpoints for development
        const response = await axios.get(`${API_BASE_URL}/api/travel/test/destinations/popular?limit=${limit}`);
        
        if (response.data.success) {
          setDestinations(response.data.destinations);
        } else {
          throw new Error('Failed to fetch destinations');
        }
      } catch (error) {
        console.error('Error fetching popular destinations:', error);
        setError('Failed to load popular destinations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularDestinations();
  }, [limit]);
  
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
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-10 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }
  
  if (destinations.length === 0) {
    return (
      <div className="py-10 text-center text-gray-600">
        <p>No popular destinations available at the moment.</p>
      </div>
    );
  }
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Popular Destinations</h2>
          <a href="/destinations" className="text-blue-600 hover:underline">View all destinations</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {destinations.map((destination) => (
            <motion.div
              key={destination._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={destination.imageUrl} 
                  alt={destination.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Award className="w-3 h-3 mr-1 text-purple-600" />
                  <span className="text-gray-700">
                    {destination.popularityScore >= 0.8 ? 'Top Rated' : 
                     destination.popularityScore >= 0.6 ? 'Popular' : 
                     'Recommended'}
                  </span>
                </div>
                <div className="absolute top-0 left-0 m-3">
                  <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded uppercase">
                    {destination.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center mb-1">
                  <MapPin className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-gray-600 text-sm">{destination.city}, {destination.country}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderRating(destination.averageRating)}
                  </div>
                  <span className="text-sm text-gray-600">({destination.numReviews} reviews)</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Price: <span className="text-gray-900">{renderPriceLevel(destination.priceLevel)}</span>
                  </div>
                  
                  <a 
                    href={`/destinations/${destination._id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors duration-200"
                  >
                    Explore
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
