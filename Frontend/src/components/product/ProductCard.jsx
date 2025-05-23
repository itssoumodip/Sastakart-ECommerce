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
  // Product card styles - updated to match QuickCart reference
  const cardStyles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      aspectRatio: '1/1.1', // Making the card even more square-like, closer to QuickCart reference
      maxWidth: '100%',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f0f0f0',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    imageContainer: {
      position: 'relative',
      aspectRatio: '1/1', // Perfect square for the image area
      overflow: 'hidden',
      backgroundColor: '#f8f8f8'
    },    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      transition: 'transform 400ms ease',
      padding: '0.5rem'
    },
    discountBadge: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      backgroundColor: '#ff4646',
      color: '#ffffff',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '600',
    },
    wishlistButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      padding: '6px',
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '50%',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      opacity: 0,
      transition: 'opacity 200ms ease, transform 200ms ease',
    },
    contentContainer: {
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 0,
      justifyContent: 'space-between',
      borderTop: '1px solid #f0f0f0'
    },
    category: {
      color: '#808080',
      fontSize: '0.65rem',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '2px',
    },
    title: {
      fontSize: '0.85rem',
      fontWeight: '500',
      height: '2.2rem',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: '4px',
      color: '#333'
    },    priceContainer: {
      display: 'flex',
      alignItems: 'baseline',
      marginTop: '4px',
      marginBottom: '6px',
    },
    currentPrice: {
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#111'
    },
    originalPrice: {
      fontSize: '0.65rem',
      color: '#999',
      textDecoration: 'line-through',
      marginLeft: '6px',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    },
    reviewCount: {
      fontSize: '0.65rem',
      color: '#808080',
      marginLeft: '4px',
    },
    addToCartButton: {
      width: '100%',
      backgroundColor: '#f8f8f8',
      color: '#333',
      padding: '8px 0',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 200ms ease, color 200ms ease',
      border: 'none',
      borderTop: '1px solid #f0f0f0',
      cursor: 'pointer',
      marginTop: 'auto', // Push button to bottom
    },
    cartIcon: {
      marginRight: '6px',
      fontSize: '0.8rem'
    }
  };
  return (
    <div className="product-card group" style={cardStyles.container} onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    }} onMouseOut={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}>
      <Link to={`/product/${product.id}`} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
        <div style={cardStyles.imageContainer}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={cardStyles.image}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          />
          {product.discount > 0 && (
            <div style={cardStyles.discountBadge}>
              {product.discount}% OFF
            </div>
          )}
          
          {/* Quick actions that appear on hover */}
          <div 
            style={cardStyles.wishlistButton} 
            className="group-hover:opacity-100"
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <FiHeart size={14} />
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
      
      {/* Add to cart button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        style={cardStyles.addToCartButton}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
          e.currentTarget.style.color = '#000';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f8f8';
          e.currentTarget.style.color = '#333';
        }}
        onClick={handleAddToCart}
      >
        <FiShoppingCart style={cardStyles.cartIcon} /> Add to Cart
      </motion.button>
    </div>
  );
};

export default ProductCard;
