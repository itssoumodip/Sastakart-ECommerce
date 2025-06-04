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
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
        }
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }
    default:
      return state
  }
}

const initialState = {
  items: [],
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
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])
  // Save cart to localStorage whenever items change using debounce
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }, 300); // 300ms debounce
    return () => clearTimeout(saveTimeout);
  }, [state.items]);
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
        selectedColor: product.selectedColor || ''
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
      
      cartItem = {
        id: product._id,
        name: product.title,
        price: validatedPrice,
        image: (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        stock: parseInt(product.stock) || 0,
        gstRate: parseFloat(product.gstRate) || 18,
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
  };  const getCartGstDetails = () => {
    let totalGstAmount = 0;
    const categoryWiseGst = {};

    state.items.forEach(item => {
      // Use product's GST rate or default to 18% if not specified
      const gstRate = item.gstRate || 18; 
      
      // Calculate GST amount with proper validation
      const itemPrice = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      
      if (itemPrice > 0 && quantity > 0) {
        const itemGstAmount = (itemPrice * quantity * gstRate) / 100;
        totalGstAmount += itemGstAmount;
        
        // Track GST by category if needed
        if (item.category) {
          categoryWiseGst[item.category] = (categoryWiseGst[item.category] || 0) + itemGstAmount;
        }
      }
    });

    return {
      totalGstAmount: parseFloat(totalGstAmount.toFixed(2)),
      categoryWiseGst
    };
  };
  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartGstDetails
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
