import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import API_BASE_URL, { API_ENDPOINTS } from '../config/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
    case 'LOAD_USER_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      }
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOAD_USER_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
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
  loading: true,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  // Configure axios defaults
  useEffect(() => {
    const token = Cookies.get('token')
    
    // Set base URL and credentials
    axios.defaults.baseURL = 'http://localhost:5000'
    axios.defaults.withCredentials = true
    
    // Set Authorization header if token exists
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [])

  // Load user on app start
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      dispatch({ type: 'LOAD_USER_REQUEST' })
      
      const { data } = await axios.get(API_ENDPOINTS.ME)
      
      dispatch({
        type: 'LOAD_USER_SUCCESS',
        payload: data.user,
      })
    } catch (error) {
      dispatch({
        type: 'LOAD_USER_FAIL',
        payload: error.response?.data?.message || 'Something went wrong',
      })
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' })
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      
      const { data } = await axios.post(API_ENDPOINTS.LOGIN, { email, password }, config)
      
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7 })
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user,
      })
      
      toast.success('Logged in successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message,
      })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' })
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      
      const { data } = await axios.post(API_ENDPOINTS.REGISTER, { name, email, password }, config)
      
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7 })
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      }
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: data.user,
      })
      
      toast.success('Account created successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({
        type: 'REGISTER_FAIL',
        payload: message,
      })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await axios.get(API_ENDPOINTS.LOGOUT)
    } catch (error) {
      console.log(error)
    } finally {
      Cookies.remove('token')
      delete axios.defaults.headers.common['Authorization']
      dispatch({ type: 'LOGOUT_SUCCESS' })
      toast.success('Logged out successfully')
    }
  }

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    loadUser,
    clearErrors,
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
