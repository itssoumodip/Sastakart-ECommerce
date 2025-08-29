import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { toastConfig, formatToastMessage } from '../utils/toastConfig';

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      }
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          // Reset coupon when cart changes
          coupon: null,
          discountAmount: 0
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          // Reset coupon when cart changes
          coupon: null,
          discountAmount: 0
        }
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        // Reset coupon when cart changes
        coupon: null,
        discountAmount: 0
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        // Reset coupon when cart changes
        coupon: null,
        discountAmount: 0
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        coupon: null,
        discountAmount: 0
      }
    case 'APPLY_COUPON':
      return {
        ...state,
        coupon: action.payload,
        discountAmount: action.payload ? action.payload.discountAmount : 0
      }
    case 'REMOVE_COUPON':
      return {
        ...state,
        coupon: null,
        discountAmount: 0
      }
    default:
      return state
  }
}

const initialState = {
  items: [],
  coupon: null,
  discountAmount: 0,
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        toast.error('Error loading cart. Cart has been reset.', toastConfig.error);
      }
    }
    
    // Load saved coupon if exists
    const savedCoupon = localStorage.getItem('cartCoupon')
    if (savedCoupon) {
      try {
        const parsedCoupon = JSON.parse(savedCoupon)
        dispatch({ type: 'APPLY_COUPON', payload: parsedCoupon })
      } catch (error) {
        toast.error('Error loading coupon. Coupon has been removed.', toastConfig.error);
      }
    }
  }, [])
  // Save cart to localStorage whenever items change using debounce
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('cart', JSON.stringify(state.items));
      // Store coupon info separately
      if (state.coupon) {
        localStorage.setItem('cartCoupon', JSON.stringify(state.coupon));
      } else {
        localStorage.removeItem('cartCoupon');
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(saveTimeout);
  }, [state.items, state.coupon]);
  const addToCart = (product, quantity = 1) => {
    // Handle both direct product objects and product data passed from ProductCard
    let cartItem;
      if (product.id && product.name && product.price) {
      // Validate price to ensure it's a proper number
      const validatedPrice = parseFloat(product.price);
      if (isNaN(validatedPrice) || validatedPrice <= 0) {
        toast.error('Invalid product price', toastConfig.error);
        return;
      }
      
      // Ensure gstRate is included from ProductCard data
      const gstRate = product.gstRate || (product._id ? parseFloat(product.gstRate) : 18);
      
      // Data already formatted from ProductCard
      cartItem = {
        id: product.id,
        name: product.name,
        price: validatedPrice,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        stock: parseInt(product.stock) || 99,
        quantity: parseInt(product.quantity || quantity) || 1,
        brand: product.brand || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        productType: product.productType || '',
        selectedSize: product.selectedSize || '',
        selectedColor: product.selectedColor || '',
        gstRate: gstRate // Add GST rate here
      };    } else {
      // Raw product object from database
      if (product.stock < quantity) {
        toast.error('Not enough stock available')
        return
      }
      
      // Validate price
      const validatedPrice = parseFloat(product.discountPrice || product.price);
      if (isNaN(validatedPrice) || validatedPrice <= 0) {
        toast.error('Invalid product price', toastConfig.error);
        return;
      }
      
      // Ensure we get the gstRate from the database product
      const gstRate = parseFloat(product.gstRate);
      if (isNaN(gstRate)) {
        toast.error('Invalid GST rate for product', toastConfig.error);
        return;
      }
      
      cartItem = {
        id: product._id,
        name: product.title,
        price: validatedPrice,
        image: (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        stock: parseInt(product.stock) || 0,
        gstRate: gstRate, // Store the validated GST rate
        quantity: parseInt(quantity) || 1,
        brand: product.brand || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        productType: product.productType || '',
        selectedSize: product.selectedSize || '',
        selectedColor: product.selectedColor || ''
      };
    }    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    toast.success('Item added to cart', toastConfig.success);
  }
  const removeFromCart = (id) => {
    const item = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Item removed from cart', toastConfig.success);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const item = state.items.find(item => item.id === id);
    if (item && quantity > item.stock) {
      toast.error(`Only ${item.stock} units available for ${item.name}`);
      return;
    }    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    toast.success('Cart updated', toastConfig.success);
  }
  const clearCart = (reason) => {
    dispatch({ type: 'CLEAR_CART' });
    if (reason === 'cod-order') {
      toast.success('Order placed successfully', toastConfig.success);
    } else {
      toast.success('Cart cleared', toastConfig.success);
    }
  };  const getCartTotal = () => {
    // Ensure all price calculations are valid numbers and properly formatted
    return parseFloat(
      state.items.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0).toFixed(2)
    );
  };
  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };  // Get GST rate based on category
  const getCartGstDetails = async () => {
    let totalGstAmount = 0;
    
    // If there's a 100% discount, return 0 GST
    if (state.coupon?.discountValue === 100) {
      return {
        totalGstAmount: 0
      };
    }

    try {
      // Fetch current GST rates
      const response = await fetch('/api/gst/settings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const { settings } = await response.json();
      const currentGstRates = settings.rates || {};

      state.items.forEach(item => {
        // Get the current GST rate for the item's category
        const gstRate = currentGstRates[item.category] || 18;
        
        // Calculate GST amount with proper validation
        const itemPrice = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        
        if (itemPrice > 0 && quantity > 0) {
          // If there's a discount, calculate GST on discounted price
          let basePrice = itemPrice;
          if (state.discountAmount) {
            const discountRatio = state.discountAmount / getCartTotal();
            basePrice = itemPrice * (1 - discountRatio);
          }
          
          const itemGstAmount = (basePrice * quantity * gstRate) / 100;
          totalGstAmount += itemGstAmount;
        }
      });
    } catch (error) {
      // Fallback to stored rates if fetch fails
      toast.error('Error fetching GST rates. Using default rates.', toastConfig.error);
      state.items.forEach(item => {
        const gstRate = parseFloat(item.gstRate) || 18;
        
        const itemPrice = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        
        if (itemPrice > 0 && quantity > 0) {
          let basePrice = itemPrice;
          if (state.discountAmount) {
            const discountRatio = state.discountAmount / getCartTotal();
            basePrice = itemPrice * (1 - discountRatio);
          }
          
          const itemGstAmount = (basePrice * quantity * gstRate) / 100;
          totalGstAmount += itemGstAmount;
        }
      });
    }

    return {
      totalGstAmount: parseFloat(totalGstAmount.toFixed(2))
    };
  };
  // Coupon functions
  const applyCoupon = (couponData) => {
    if (couponData) {
      dispatch({ type: 'APPLY_COUPON', payload: couponData });
    } else {
      dispatch({ type: 'REMOVE_COUPON' });
    }
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
    toast.success('Coupon removed', toastConfig.success);
  };

  // Calculate final total after discount
  const getFinalTotal = () => {
    const cartTotal = getCartTotal();
    return state.discountAmount ? parseFloat((cartTotal - state.discountAmount).toFixed(2)) : cartTotal;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartGstDetails,
    applyCoupon,
    removeCoupon,
    getFinalTotal
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
