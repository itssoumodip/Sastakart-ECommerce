import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-hot-toast';
import { forwardRef } from 'react';

const ProductCard = forwardRef(({ product, index = 0 }, ref) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const isWishlisted = isInWishlist(product._id);
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (product.stock === 0) {
        toast.error('Product is out of stock');
        return;
      }
      
      addToCart({
        id: product._id,
        name: product.title,
        price: product.discountPrice || product.price,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        stock: product.stock || 99,
        brand: product.brand || '',
        quantity: 1
      });
    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add to cart');
    }
  };
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        name: product.title,
        price: product.discountPrice || product.price,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        description: product.description || '',
        category: product.category || 'Uncategorized'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    }
  };  return (
    <motion.div
      ref={ref}
      className="product-card bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border border-gray-100"
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
            <div className="absolute top-3 left-3 bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}
          
          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-medium px-4 py-2 bg-black/30 rounded-full">Out of Stock</span>
            </div>
          )}
            {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <motion.button 
              onClick={handleToggleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all ${
                isWishlisted 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-white text-gray-700 hover:text-pink-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/products/${product._id}`);
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-black shadow-md hover:shadow-lg transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="h-5 w-5" />
              </motion.div>
            </motion.button>
          </div>
        </div>      </Link>
      <div className="p-5">
        <h3 className="font-medium text-gray-900 mb-1 hover:text-gray-700 transition-colors duration-200 line-clamp-2 text-lg" onClick={() => navigate(`/products/${product._id}`)} style={{ cursor: 'pointer' }}>
          {product.title}
        </h3>
        
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
                  i < Math.floor(product.rating || 4)
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
            {product.discountPrice && product.discountPrice < product.price ? (
              <>
                <span className="font-semibold text-xl text-gray-900">${product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-semibold text-xl text-gray-900">${(product.price || 0).toFixed(2)}</span>
            )}
          </div>
          
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:shadow-lg ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            } transition-all duration-300`}
            whileHover={product.stock > 0 ? { scale: 1.1 } : {}}
            whileTap={product.stock > 0 ? { scale: 0.9 } : {}}
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
