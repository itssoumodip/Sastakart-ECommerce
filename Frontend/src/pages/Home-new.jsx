// This is an alternate version of the Home page that can be used in the future
import React from 'react';
import { Link } from 'react-router-dom';

const HomeNew = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with a more modern design */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sustainable Living Made Simple
              </h1>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Discover thoughtfully designed eco-friendly products for your everyday needs. 
                Better for you, better for our planet.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-white text-emerald-700 px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors inline-flex items-center justify-center"
                >
                  Shop Collection
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
                <Link
                  to="/about"
                  className="border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-colors inline-flex items-center justify-center"
                >
                  Our Story
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white p-3 rounded-2xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1400&q=80"
                  alt="Eco-friendly products"
                  className="rounded-xl w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-emerald-800 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                New Collection!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Products that are made to last, reducing waste and saving you money.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ethically Sourced</h3>
              <p className="text-gray-600">Fair trade practices ensuring workers are paid fairly.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Products designed with minimal environmental impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories with a new design */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Categories</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Explore our wide range of sustainable products designed for everyday living
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/products?category=Electronics" className="group block">
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="h-60 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                    alt="Electronics"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Electronics</h3>
                  <p className="text-gray-600 text-sm mb-4">Energy-efficient and long-lasting tech</p>
                  <span className="text-emerald-600 font-medium flex items-center">
                    Shop Now
                    <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=Clothing" className="group block">
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="h-60 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                    alt="Fashion"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Fashion</h3>
                  <p className="text-gray-600 text-sm mb-4">Sustainable fabrics that feel good</p>
                  <span className="text-emerald-600 font-medium flex items-center">
                    Shop Now
                    <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/products?category=Home & Kitchen" className="group block">
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="h-60 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1595514535116-d0bcdc45cbd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                    alt="Home & Living"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Home & Living</h3>
                  <p className="text-gray-600 text-sm mb-4">Eco-friendly items for your space</p>
                  <span className="text-emerald-600 font-medium flex items-center">
                    Shop Now
                    <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=Beauty & Personal Care" className="group block">
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="h-60 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                    alt="Beauty & Care"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Beauty & Care</h3>
                  <p className="text-gray-600 text-sm mb-4">Clean, cruelty-free personal care</p>
                  <span className="text-emerald-600 font-medium flex items-center">
                    Shop Now
                    <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Join thousands of happy customers who have made the switch to sustainable living
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                title: "Verified Buyer",
                image: "https://randomuser.me/api/portraits/women/12.jpg",
                content: "The quality of EcoShop's products is exceptional. I especially love that everything is plastic-free and sustainably packaged."
              },
              {
                name: "James Wilson",
                title: "Verified Buyer",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                content: "I've been using EcoShop's kitchen products for over a year now, and they're still as good as new. Great investment for my home."
              },
              {
                name: "Emily Chen",
                title: "Verified Buyer",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                content: "The customer service is incredible! When I had a question about materials, the team went above and beyond to help me."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400">
                    {Array(5).fill().map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter with a more interesting design */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="opacity-90 max-w-2xl mx-auto">
                Get early access to new products, sustainability tips, and exclusive offers delivered right to your inbox.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-5 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-emerald-700 px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-6 text-sm text-center opacity-80">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeNew;