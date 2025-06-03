import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import { toastConfig, formatToastMessage } from '../utils/toastConfig';

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

  // Configure axios defaults
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('token')
      
      // Set base URL and enable credentials
      axios.defaults.baseURL = import.meta.env.VITE_API_URL
      axios.defaults.withCredentials = true

      // Set Authorization header if token exists
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // Load user data if token exists
        await loadUser()
      } else {
        dispatch({ type: 'LOAD_USER_FAIL' })
      }
    }

    initAuth()
  }, []) // Run only once on component mount

  const loadUser = async () => {
    try {
      dispatch({ type: 'LOAD_USER_REQUEST' })
      
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
      dispatch({ type: 'LOGIN_REQUEST' })
      
      const { data } = await axios.post(API_ENDPOINTS.LOGIN, { email, password })
      
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
        type: 'LOGIN_SUCCESS',
        payload: data.user,
      })
      
      toast.success('Logged in successfully', toastConfig.success)
      return { success: true }
    } catch (error) {
      const message = formatToastMessage(error.response?.data?.message || 'Login failed')
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message,
      })
      toast.error(message, toastConfig.error)
      return { success: false, error: message }
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
      await axios.get(API_ENDPOINTS.LOGOUT)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      Cookies.remove('token', { 
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax' 
      })
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      dispatch({ type: 'LOGOUT_SUCCESS' })
      toast.success('Logged out successfully', toastConfig.success)
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
      console.error('Error updating user data:', error)
      toast.error('Failed to update profile')
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
