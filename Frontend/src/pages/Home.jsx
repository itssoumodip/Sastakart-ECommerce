import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Leaf, Shield, Truck, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Add this to your CSS file or add it inline in the component
const textShadowStyle = {
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestsellingProducts, setBestsellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const slides = [
  //   {
  //     image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Fashion model in black suit"
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Fashion model shopping"
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Luxury shopping experience"
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Premium fashion collection"
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Fashion model in formal wear"
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Elegant shopping environment"
  //   },

  //   {
  //     image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Smart watch collection"
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  //     alt: "Modern interior design products"
  //   }
  // ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    // Fetch bestselling products from the API
    const fetchBestsellingProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.PRODUCTS}?sort=popular&limit=4`);
        if (response.data.success) {
          setBestsellingProducts(response.data.products);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching bestselling products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellingProducts();
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white h-[90vh] overflow-hidden relative">
        {/* Slides */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay for better text visibility */}
            </div>
          ))}
        </div>

        {/* Content - Positioned at bottom left */}
        <div className="absolute bottom-16 left-8 md:left-12 lg:left-16 max-w-xl">
          <div className="md:px-9 lg:px-12 py-8">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white"
              style={textShadowStyle}
            >
              We Picked Every Item With Care
            </h1>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
              style={textShadowStyle}
            >
              You Must Try
            </h2>
            <Link
              to="/products"
              className="bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-md hover:shadow-lg ml-1"
            >
              Go To Collection
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/70 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button 
          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Electronics Category */}
            <Link to="/products?category=Electronics" className="group">
              <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
                <img src="https://images.unsplash.com/photo-1593344484962-796055d4a3a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                  alt="Eco-Friendly Electronics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
              </div>
              <h3 className="mt-4 text-center font-medium">Electronics</h3>
            </Link>

            {/* Fashion Category */}
            <Link to="/products?category=Clothing" className="group">
              <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Sustainable Fashion"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
              </div>
              <h3 className="mt-4 text-center font-medium">Fashion</h3>
            </Link>

            {/* Home & Kitchen Category */}
            <Link to="/products?category=Home & Kitchen" className="group">
              <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
                <img src="https://www.decorilla.com/online-decorating/wp-content/uploads/2022/10/Interior-design-styles-Eclectic-contemporary-living-room-by-Jamie-C.jpg"
                  alt="Eco-Friendly Home Products"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
              </div>
              <h3 className="mt-4 text-center font-medium">Home & Living</h3>
            </Link>

            {/* Beauty Category */}
            <Link to="/products?category=Beauty & Personal Care" className="group">
              <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
                <img src="https://cdn.britannica.com/35/222035-131-9FC95B31/makeup-cosmetics.jpg"
                  alt="Natural Beauty Products"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
              </div>
              <h3 className="mt-4 text-center font-medium">Beauty & Care</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Bestselling Products</h2>
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Unable to load bestselling products. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellingProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/products" className="inline-block border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                alt="EcoShop Sustainability Practices"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Our Commitment to Sustainability</h2>
              <p className="text-gray-600 mb-6">
                At EcoShop, we partner with local artisans and sustainable Indian brands that blend traditional knowledge with eco-innovation. From plastic-free packaging inspired by ancient Indian practices to supporting rural communities, we're building a marketplace that celebrates India's rich heritage while creating a greener future.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Eco-friendly Materials</h3>
                    <p className="text-sm text-gray-500">All products verified to meet global sustainability standards.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Plastic-Free Packaging</h3>
                    <p className="text-sm text-gray-500">Eco-friendly packaging using traditional Indian materials like jute and recycled paper.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Carbon Neutral Shipping</h3>
                    <p className="text-sm text-gray-500">Every purchase supports reforestation efforts across India.</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="inline-block mt-8 bg-emerald-600 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-700 transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our growing community of eco-conscious Indian shoppers and receive ₹500 off your first order, plus exclusive deals and early access to seasonal sales.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-3 rounded-r-md font-medium hover:bg-emerald-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
