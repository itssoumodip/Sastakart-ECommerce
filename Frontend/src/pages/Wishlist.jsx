import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Heart, 
  TrashIcon, 
  ShoppingCart, 
  ArrowRight,
  X,
  Info
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const Wishlist = () => {
  // In a real app, you would fetch this from a context or API
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'VINTAGE MECHANICAL KEYBOARD',
      price: 149.99,
      image: 'https://placehold.co/300x300/000000/FFFFFF?text=Keyboard',
      description: 'Classic mechanical keyboard with tactile feedback',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'RETRO GAMING CONSOLE',
      price: 299.99,
      image: 'https://placehold.co/300x300/000000/FFFFFF?text=Console',
      description: 'Play classic games with authentic controls',
      category: 'Electronics'
    },
    {
      id: '3',
      name: 'MONOCHROME GRAPHIC TEE',
      price: 39.99,
      image: 'https://placehold.co/300x300/000000/FFFFFF?text=Tshirt',
      description: 'Black and white graphic t-shirt with retro design',
      category: 'Clothing'
    }
  ])
  
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
    toast.success('Item removed from wishlist')
  }

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    toast.success('Added to cart')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Your Wishlist - Modern Shop</title>
        <meta name="description" content="View and manage your saved items in your wishlist." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Keep track of items you love and add them to your cart when you're ready to purchase
            </p>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Discover amazing products and save your favorites for later
                </p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          )}          {/* Wishlist Items */}
          {wishlistItems.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {wishlistItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                      <Link 
                        to={`/products/${item.id}`}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{item.name}</h3>
                      <span className="font-bold text-lg text-gray-900">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{item.category}</p>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center"
                        aria-label="Remove from wishlist"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Info Box */}
          {wishlistItems.length > 0 && (
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Wishlist Information</h3>
                  <p className="text-gray-600">Items in your wishlist will be saved for 30 days. Add them to your cart to complete your purchase.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Wishlist
