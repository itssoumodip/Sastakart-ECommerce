import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { forwardRef } from 'react';

const ProductCard = forwardRef(({ product, index = 0 }, ref) => {
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
      ref={ref}
      className="product-card bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {product.discountPrice && product.discountPrice < product.price && (
            <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded text-xs font-medium">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}
          
          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <motion.button 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-black shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            <motion.button 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-black shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-medium text-gray-900 mb-1 hover:text-gray-700 transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-500 mb-2">
            {product.brand}
          </p>
        )}
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          {product.numReviews > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({product.numReviews})
            </span>
          )}
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-gray-900">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
