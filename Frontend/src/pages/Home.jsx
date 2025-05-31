import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="container mt-10 mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                India's Premier Eco-Friendly Marketplace
              </h1>              <p className="text-lg text-gray-600 mb-8">                Discover locally-sourced products that blend traditional Indian craftsmanship with modern eco-friendly innovation.
                Supporting sustainable businesses across India with every purchase.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/products"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-700 transition-colors inline-flex justify-center"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors inline-flex justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                alt="EcoShop Featured Products"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
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
                <img                src="https://images.unsplash.com/photo-1593344484962-796055d4a3a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
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
                <img                src="https://images.unsplash.com/photo-1609084415979-e38c11583e8b?q=80&w=2034&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                <img                src="https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                <img                src="https://images.unsplash.com/photo-1532413992378-f169ac26fff0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
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
        <div className="container mx-auto px-4">          <h2 className="text-3xl font-bold text-center mb-12">Bestselling Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                  alt="Bamboo Water Bottle"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                  Eco-friendly
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">Essentials</div>
                <h3 className="font-medium mb-2">Tablet</h3>
                <div className="flex justify-between items-center">                  <span className="font-bold">₹1,899</span>
                  <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                  alt="Organic Cotton Shirt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                 Organic Cotton Shirt
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">Fashion</div>
                <h3 className="font-medium mb-2">Organic Cotton Shirt</h3>
                <div className="flex justify-between items-center">                  <span className="font-bold">₹2,499</span>
                  <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1585821569331-f071db2abd8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                  alt="Bamboo Toothbrush Set"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">Personal Care</div>
                <h3 className="font-medium mb-2">Bed</h3>
                <div className="flex justify-between items-center">                  <span className="font-bold">₹899</span>
                  <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1602532305019-3dbbd482814d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                  alt="Solar Powered Charger"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                  Eco-friendly
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">Electronics</div>
                <h3 className="font-medium mb-2">Solar Powered Charger</h3>
                <div className="flex justify-between items-center">                  <span className="font-bold">₹3,499</span>
                  <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
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
              <img                src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                alt="EcoShop Sustainability Practices"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Our Commitment to Sustainability</h2>              <p className="text-gray-600 mb-6">
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
                  <div>                <h3 className="font-medium">Plastic-Free Packaging</h3>
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
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
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