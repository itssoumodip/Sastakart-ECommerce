import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-4 border-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">          {/* Company Info */}
          <div className="space-y-4 border-2 border-white p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center">
                <span className="text-black font-bold text-xl font-mono">R</span>
              </div>
              <span className="text-xl font-bold font-mono tracking-wider">[ RETRO-SHOP ]</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-mono uppercase">
              YOUR ONE-STOP DESTINATION FOR QUALITY PRODUCTS AT AFFORDABLE PRICES. 
              WE BRING YOU THE BEST SHOPPING EXPERIENCE WITH FAST DELIVERY AND EXCELLENT CUSTOMER SERVICE.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300 transition-colors border-2 border-white p-2 hover:bg-white hover:text-black">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors border-2 border-white p-2 hover:bg-white hover:text-black">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors border-2 border-white p-2 hover:bg-white hover:text-black">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>          {/* Quick Links */}
          <div className="space-y-4 border-2 border-white p-4">
            <h3 className="text-lg font-semibold font-mono uppercase tracking-wider">[ QUICK LINKS ]</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  ALL PRODUCTS
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  ELECTRONICS
                </Link>
              </li>
              <li>
                <Link to="/products?category=Clothing" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  CLOTHING
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home & Kitchen" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  HOME & KITCHEN
                </Link>
              </li>
              <li>
                <Link to="/products?category=Beauty & Personal Care" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  BEAUTY & PERSONAL CARE
                </Link>
              </li>
            </ul>
          </div>          {/* Customer Service */}
          <div className="space-y-4 border-2 border-white p-4">
            <h3 className="text-lg font-semibold font-mono uppercase tracking-wider">[ CUSTOMER SERVICE ]</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  HELP & FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  RETURN POLICY
                </a>
              </li>
              <li> 
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  SHIPPING INFO
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  TRACK YOUR ORDER
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1 block tracking-wider">
                  CONTACT SUPPORT
                </a>
              </li>
            </ul>
          </div>          {/* Contact Info */}
          <div className="space-y-4 border-2 border-white p-4">
            <h3 className="text-lg font-semibold font-mono uppercase tracking-wider">[ CONTACT US ]</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="border-2 border-white p-1">
                  <MapPin className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                </div>
                <span className="text-gray-300 text-sm font-mono">
                  123 COMMERCE STREET<br />
                  BUSINESS DISTRICT<br />
                  CITY, STATE 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="border-2 border-white p-1">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 text-sm font-mono">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="border-2 border-white p-1">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 text-sm font-mono">SUPPORT@RETROSHOP.COM</span>
              </li>
            </ul>
          </div>
        </div>        
        {/* Newsletter Signup */}
        <div className="border-t-4 border-white mt-8 pt-8">
          <div className="max-w-md mx-auto text-center border-2 border-white p-6">
            <h3 className="text-lg font-semibold mb-4 font-mono uppercase tracking-wider">[ STAY UPDATED ]</h3>
            <p className="text-gray-300 text-sm mb-4 font-mono uppercase">
              SUBSCRIBE TO OUR NEWSLETTER FOR EXCLUSIVE DEALS AND NEW ARRIVALS
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="flex-1 px-4 py-2 bg-black border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white font-mono uppercase"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-colors font-mono uppercase tracking-wider"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>        
        {/* Bottom Bar */}
        <div className="border-t-4 border-white mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0 font-mono tracking-wider uppercase">
            &copy; 2025 RETRO-SHOP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1">
              PRIVACY POLICY
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1">
              TERMS OF SERVICE
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors font-mono uppercase border-2 border-transparent hover:border-white px-2 py-1">
              COOKIE POLICY
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
