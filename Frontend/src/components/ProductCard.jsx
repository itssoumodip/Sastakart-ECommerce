import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
      try {
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.discountPrice || product.price,
        images: product.images || ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'],
        stock: product.stock
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    }
  };

  return (
    <motion.div
      className="bg-black border-4 border-white transition-all duration-500 group overflow-hidden hover:border-gray-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Product Header */}
      <div className="bg-white text-black font-mono text-xs uppercase p-2 flex justify-between items-center">
        <span>ITEM #{product._id?.substring(0, 4).toUpperCase() || 'N/A'}</span>
        {product.stock > 0 ? (
          <span className="bg-black text-white px-2 py-1">IN STOCK</span>
        ) : (
          <span className="bg-red-600 text-white px-2 py-1">SOLD OUT</span>
        )}
      </div>

      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden h-56">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {product.discountPrice && product.discountPrice < product.price && (
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 border-2 border-black text-sm font-bold font-mono">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <motion.button 
              className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            <motion.button 
              className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </Link>

      <div className="p-6 border-t-4 border-white">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-white mb-3 hover:text-gray-300 transition-colors duration-200 line-clamp-2 text-lg font-mono uppercase tracking-wider">
            {product.title}
          </h3>
        </Link>
        
        {/* Brand */}
        <p className="text-gray-400 text-sm mb-3 font-mono uppercase">
          {product.brand}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-white fill-white'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-300 ml-2 font-medium font-mono">
            ({product.numReviews})
          </span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-2 border-t border-white pt-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xl font-bold font-mono text-white">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-sm text-gray-400 line-through font-mono">
                ${product.price}
              </span>
            )}
          </div>
            <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white text-black border-2 border-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
