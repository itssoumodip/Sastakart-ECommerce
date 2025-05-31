import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Create context
const WishlistContext = createContext();

// Initial state
const initialState = {
  items: [],
  loading: true,
};

// Action types
const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
const CLEAR_WISHLIST = 'CLEAR_WISHLIST';
const SET_WISHLIST = 'SET_WISHLIST';
const SET_LOADING = 'SET_LOADING';

// Reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_WISHLIST:
      // Check if item already exists
      if (state.items.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    
    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case CLEAR_WISHLIST:
      return {
        ...state,
        items: []
      };
    
    case SET_WISHLIST:
      return {
        ...state,
        items: action.payload
      };
    
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

// Provider component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  
  // Load wishlist from localStorage on initial load
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          dispatch({ 
            type: SET_WISHLIST, 
            payload: JSON.parse(savedWishlist) 
          });
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        // Set loading to false after a short delay to prevent flickering
        setTimeout(() => {
          dispatch({ type: SET_LOADING, payload: false });
        }, 500);
      }
    };
    
    loadWishlist();
  }, []);
  
  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  }, [state.items]);
  
  // Add item to wishlist
  const addToWishlist = (product) => {
    dispatch({ 
      type: ADD_TO_WISHLIST, 
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category
      }
    });
    toast.success('Added to wishlist');
  };
  
  // Remove item from wishlist
  const removeFromWishlist = (id) => {
    dispatch({ type: REMOVE_FROM_WISHLIST, payload: id });
    toast.success('Removed from wishlist');
  };
  
  // Clear wishlist
  const clearWishlist = () => {
    dispatch({ type: CLEAR_WISHLIST });
    toast.success('Wishlist cleared');
  };
  
  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return state.items.some(item => item.id === id);
  };
  
  // Get wishlist count
  const getWishlistCount = () => {
    return state.items.length;
  };
  
  const value = {
    items: state.items,
    loading: state.loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
