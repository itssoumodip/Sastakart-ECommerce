import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Leaf, Shield, Truck, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-medium text-gray-900">SastaKart</span>
              </Link>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your one-stop destination for quality products at affordable prices. We bring the best deals right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-black transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Clothing" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home & Kitchen" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/products?category=Beauty & Personal Care" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Beauty & Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Company</h3>
            <ul className="space-y-2">              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Stores
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-gray-200 mt-10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-[300px] gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Truck className="h-6 w-6 text-black" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900">Free Shipping</h4>
                <p className="text-gray-600 text-xs">On orders over ₹3,500</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900">Secure Payments</h4>
                <p className="text-gray-600 text-xs">Protected & safe checkout</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-black" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900">Satisfaction Guarantee</h4>
                <p className="text-gray-600 text-xs">30-day hassle-free returns</p>
              </div>
            </div>
          </div>
        </div>

    

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 SastaKart. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              Accessibility
            </a>
          </div>        </div>
        
        {/* Newsletter Subscription */}
        <div className="mt-7 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Subscribe to our newsletter</h3>
              <p className="text-sm text-gray-600">Get the latest updates, deals and exclusive offers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
