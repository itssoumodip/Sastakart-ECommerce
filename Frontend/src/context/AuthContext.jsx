import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import { toastConfig, formatToastMessage } from '../utils/toastConfig';
import { getAuthToken, syncToken, clearAuthToken } from '../utils/auth';

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
    case 'LOAD_USER_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      }
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      }
    case 'LOAD_USER_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null // Don't show error for load user fail
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null
      }
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,  // Set initial loading to true
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Configure axios defaults and initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      // Import functions directly from the top of the file
      // Set base URL and enable credentials
      axios.defaults.baseURL = import.meta.env.VITE_API_URL;
      axios.defaults.withCredentials = true;

      try {
        // Get token from any source (automatically synchronizes across all storage locations)
        const token = getAuthToken();
        
        if (token) {
          // Apply token synchronization one more time to be sure
          syncToken(token);
          
          // Load user data if token exists
          await loadUser();
        } else {
          dispatch({ type: 'LOAD_USER_FAIL' });
        }
      } catch (error) {
        dispatch({ type: 'LOAD_USER_FAIL' });
      }
    };

    initAuth();
  }, []) // Run only once on component mount

  const loadUser = async () => {
    try {
      dispatch({ type: 'LOAD_USER_REQUEST' })
      
      const token = Cookies.get('token');
      const { data } = await axios.get(API_ENDPOINTS.ME)
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        dispatch({
          type: 'LOAD_USER_SUCCESS',
          payload: data.user,
        })
      } else {
        throw new Error('No user data received')
      }
    } catch (error) {
      // Clear token if it's an authentication error
      if (error.response?.status === 401) {
        Cookies.remove('token', { path: '/' })
        localStorage.removeItem('user')
      }
      
      dispatch({
        type: 'LOAD_USER_FAIL',
      })
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      
      const { data } = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
      
      if (data.token) {
        // Synchronize token across all storage mechanisms
        syncToken(data.token);
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user,
      });
      
      toast.success('Logged in successfully', toastConfig.success);
      return { success: true };
    } catch (error) {

      const message = formatToastMessage(error.response?.data?.message || 'Login failed');
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message,
      });
      toast.error(message, toastConfig.error);
      return { success: false, error: message };
    }
  }
  const register = async (firstName, lastName, email, phone, password) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' })
      
      const name = `${firstName} ${lastName}`;
      
      const { data } = await axios.post(API_ENDPOINTS.REGISTER, { 
        name,
        firstName, 
        lastName, 
        email, 
        phone,
        password 
      })
      
      if (data.token) {
        Cookies.set('token', data.token, { 
          expires: 7,
          path: '/',
          secure: window.location.protocol === 'https:',
          sameSite: 'Lax'
        })
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      }
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: data.user,
      })
      
      toast.success('Account created successfully', toastConfig.success)
      return { success: true }
    } catch (error) {
      const message = formatToastMessage(error.response?.data?.message || 'Registration failed')
      dispatch({
        type: 'REGISTER_FAIL',
        payload: message,
      })
      toast.error(message, toastConfig.error)
      return { success: false, error: message }
    }
  }
  const logout = async () => {
    try {
      // Call logout endpoint
      await axios.get(API_ENDPOINTS.LOGOUT);
    } catch (error) {

    } finally {
      // Clear token from all storage locations
      clearAuthToken();
      
      // Also remove user data
      localStorage.removeItem('user');
      
      // Update state
      dispatch({ type: 'LOGOUT_SUCCESS' });
      toast.success('Logged out successfully', toastConfig.success);
    }
  }
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' })
  }
    const updateUser = (userData) => {
    try {
      // Update the user state with the new data
      dispatch({
        type: 'LOAD_USER_SUCCESS',
        payload: userData,
      })
      
      // Store updated user data in localStorage for persistence
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }
  
  const googleLogin = async (credentialResponse) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      
      // Send the ID token to your backend for verification
      const { data } = await axios.post(API_ENDPOINTS.GOOGLE_VERIFY, {
        token: credentialResponse.credential
      });
      
      // Set the token across all storage locations
      if (data.token) {
        // Synchronize token across all storage mechanisms (cookie, localStorage, memory)
        syncToken(data.token);
      } else {
        throw new Error('Authentication failed: No token received from server');
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user,
      });
      
      toast.success('Logged in with Google successfully', toastConfig.success);
      return { success: true };
    } catch (error) {

      const message = formatToastMessage(error.response?.data?.message || 'Google login failed');
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message,
      });
      toast.error(message, toastConfig.error);
      return { success: false, error: message };
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    loadUser,
    clearErrors,
    updateUser,
    googleLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
