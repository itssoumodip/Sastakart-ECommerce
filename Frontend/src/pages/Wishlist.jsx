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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white border-t-white/20 rounded-none animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="mt-4 text-white font-mono uppercase tracking-wider">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Your Wishlist - RETRO-SHOP</title>
        <meta name="description" content="View and manage your saved items in your wishlist." />
      </Helmet>

      <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="border-b-4 border-white pb-8 mb-12">
            <h1 className="text-5xl font-mono font-bold uppercase tracking-widest flex items-center">
              <Heart className="mr-4 h-10 w-10" />
              [ WISHLIST ]
            </h1>
            <p className="text-xl font-mono mt-4 uppercase">YOUR SAVED ITEMS</p>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 && (
            <div className="text-center py-16 border-4 border-white">
              <div className="mx-auto w-24 h-24 border-4 border-white flex items-center justify-center mb-6">
                <Heart className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-mono font-bold uppercase tracking-wider mb-4">
                YOUR WISHLIST IS EMPTY
              </h2>
              <p className="text-gray-400 font-mono uppercase mb-8 max-w-md mx-auto">
                ITEMS ADDED TO YOUR WISHLIST WILL APPEAR HERE FOR EASY ACCESS
              </p>
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center bg-white text-black font-mono uppercase tracking-wider py-4 px-8 border-4 border-white hover:bg-black hover:text-white transition-colors"
              >
                START SHOPPING
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}

          {/* Wishlist Items */}
          {wishlistItems.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {wishlistItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className="border-4 border-white bg-black group"
                  variants={itemVariants}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-64 object-cover filter grayscale" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                      <Link 
                        to={`/products/${item.id}`}
                        className="bg-white text-black px-4 py-2 font-mono uppercase tracking-wider hover:bg-black hover:text-white border-2 border-white transition-colors"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="bg-black text-white p-2 border-2 border-white hover:bg-white hover:text-black transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 border-t-4 border-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-mono font-bold text-lg uppercase tracking-wider">{item.name}</h3>
                      <span className="font-mono font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400 font-mono text-sm mb-6 uppercase">{item.category}</p>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-white text-black font-mono uppercase tracking-wider py-3 px-5 border-2 border-white hover:bg-black hover:text-white transition-colors flex items-center"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="bg-black text-white p-3 border-2 border-white hover:bg-white hover:text-black transition-colors"
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
            <div className="mt-16 border-4 border-white p-6">
              <div className="flex items-start space-x-4">
                <Info className="h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="font-mono uppercase font-bold tracking-wider mb-2">WISHLIST INFORMATION</h3>
                  <p className="font-mono text-gray-400">Items in your wishlist will be saved for 30 days. Add them to your cart to complete your purchase.</p>
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
