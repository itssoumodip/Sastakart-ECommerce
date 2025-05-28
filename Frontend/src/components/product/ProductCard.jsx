import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { addToCart } from '../../store/cartSlice';
import { addToWishlist } from '../../store/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };
  
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishlist(product));
  };

  // Calculate discounted price
  const originalPrice = product.price;
  const discountedPrice = product.discount 
    ? originalPrice - (originalPrice * product.discount / 100)
    : originalPrice;
  // Generate stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={i} className="text-yellow-400 fill-current w-3 h-3" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="text-yellow-400 fill-current opacity-50 w-3 h-3" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} className="text-gray-300 w-3 h-3" />);
    }
    
    return stars;
  };
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border border-gray-100"
    >
      <Link to={`/products/${product.id}`} className="block">        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded text-[10px]">
              {product.discount}% off
            </span>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
          >
            <FiHeart className="text-gray-600 hover:text-red-500 transition-colors w-3 h-3" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-2">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors text-sm">
            {product.name}
          </h3>
          
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center text-xs">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-500 text-xs">({product.reviewCount})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="px-2 pb-2">
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-500 text-white py-1.5 px-2 rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-1 font-medium text-xs"
        >
          <FiShoppingCart className="w-3 h-3" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
