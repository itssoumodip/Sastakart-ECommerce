import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { addToCart } from '../../store/cartSlice';
import { addToWishlist } from '../../store/wishlistSlice';
import Rating from '../ui/Rating';

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
  
  // Product card styles
  const cardStyles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    imageContainer: {
      position: 'relative',
      height: '240px',
      overflow: 'hidden',
      backgroundColor: '#f3f4f6'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 700ms ease',
    },
    discountBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
    },
    wishlistButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      padding: '8px',
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '9999px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      opacity: 0,
      transition: 'opacity 300ms ease, box-shadow 300ms ease',
    },
    contentContainer: {
      padding: '16px',
    },
    category: {
      color: '#6b7280',
      fontSize: '0.75rem',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '4px',
    },
    title: {
      fontSize: '1rem',
      fontWeight: '500',
      height: '3rem',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'baseline',
      marginTop: '8px',
      marginBottom: '4px',
    },
    currentPrice: {
      fontSize: '1rem',
      fontWeight: '600',
    },
    originalPrice: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      textDecoration: 'line-through',
      marginLeft: '8px',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '4px',
    },
    reviewCount: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginLeft: '4px',
    },
    addToCartButton: {
      width: '100%',
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '12px 0',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 300ms ease',
    },
    cartIcon: {
      marginRight: '8px'
    }
  };
  
  return (
    <div className="product-card group" style={cardStyles.container}>
      <Link to={`/product/${product.id}`} style={{ display: 'block', flexGrow: 1 }}>
        <div style={cardStyles.imageContainer}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={cardStyles.image}
            className="group-hover:scale-105" // Keep this Tailwind class as it needs hover state
          />
          {product.discount > 0 && (
            <div style={cardStyles.discountBadge}>
              {product.discount}% OFF
            </div>
          )}
          
          {/* Quick actions that appear on hover */}
          <div style={cardStyles.wishlistButton} className="group-hover:opacity-100 hover:shadow-lg">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
              style={{ background: 'transparent', border: 'none' }}
            >
              <FiHeart size={18} />
            </motion.button>
          </div>
        </div>
        
        <div style={cardStyles.contentContainer}>
          <div style={cardStyles.category}>{product.category}</div>
          <h2 style={cardStyles.title}>{product.name}</h2>
          
          <div style={cardStyles.priceContainer}>
            <div style={cardStyles.currentPrice}>${(product.price - (product.price * product.discount / 100)).toFixed(2)}</div>
            {product.discount > 0 && (
              <div style={cardStyles.originalPrice}>
                ${product.price.toFixed(2)}
              </div>
            )}
          </div>
          
          <div style={cardStyles.ratingContainer}>
            <Rating value={product.rating} readOnly={true} size="small" />
            <span style={cardStyles.reviewCount}>
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </Link>
      
      {/* Fixed add to cart button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        style={cardStyles.addToCartButton}
        className="hover:bg-gray-900" // Keep this Tailwind class for hover state
        onClick={handleAddToCart}
      >
        <FiShoppingCart style={cardStyles.cartIcon} /> Add to Cart
      </motion.button>
    </div>
  );
};

export default ProductCard;
