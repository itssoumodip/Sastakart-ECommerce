import React from 'react';
import { Helmet } from 'react-helmet-async';
import PopularDestinations from '../components/travel/PopularDestinations';

const TravelHomePage = () => {
  return (
    <>
      <Helmet>
        <title>Travel Explorer | Find Your Next Adventure</title>
        <meta name="description" content="Discover popular travel destinations around the world based on traveler reviews and ratings." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
            alt="Scenic travel destination" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Explore the World's Best Destinations
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Discover amazing places loved by travelers just like you, backed by authentic reviews and ratings
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#popular-destinations" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium text-lg transition-colors duration-200"
            >
              Explore Popular Destinations
            </a>
            <a 
              href="#how-it-works" 
              className="bg-white hover:bg-gray-100 text-blue-600 py-3 px-8 rounded-lg font-medium text-lg transition-colors duration-200"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Popular Destinations</h3>
              <p className="text-gray-600">Browse destinations ranked by authentic traveler reviews and popularity scores.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan Your Perfect Trip</h3>
              <p className="text-gray-600">Explore detailed information, view photos, and read reviews to plan your journey.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Experience</h3>
              <p className="text-gray-600">After your trip, rate and review destinations to help fellow travelers.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Destinations Section */}
      <section id="popular-destinations">
        <PopularDestinations limit={8} />
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Explore by Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['beach', 'mountain', 'city', 'countryside', 'historical', 'adventure'].map((category) => (
              <a 
                href={`/destinations/category/${category}`}
                key={category} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="h-32 relative overflow-hidden">
                  <img 
                    src={`https://source.unsplash.com/random/300x200?${category}`}
                    alt={category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-white text-xl font-semibold p-4 capitalize">
                      {category}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who discover amazing destinations and share their experiences
          </p>
          <a 
            href="/register" 
            className="inline-block bg-white hover:bg-gray-100 text-blue-600 py-3 px-8 rounded-lg font-medium text-lg transition-colors duration-200"
          >
            Create an Account
          </a>
        </div>
      </section>
    </>
  );
};

export default TravelHomePage;
