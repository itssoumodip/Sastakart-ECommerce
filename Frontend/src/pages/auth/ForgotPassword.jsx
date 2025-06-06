import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { Mail } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/password/forgot', { email: data.email })
      setIsSubmitted(true)
      toast.success('Password reset instructions sent to your email')
      
      // Remove this log in production - only for testing
      console.log('Password reset response:', response.data)
    } catch (error) {
      console.error('Password reset error:', error)
      
      if (error.response?.status === 404) {
        // Don't reveal if email exists or not (for security)
        toast.success('If your email exists in our system, you will receive reset instructions shortly')
        setIsSubmitted(true)
      } else {
        toast.error(error.response?.data?.message || 'Failed to process your request')
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - SastaKart</title>
        <meta name="description" content="Reset your password to regain access to your account." />
      </Helmet>

      <div className="min-h-screen flex lg:flex-row flex-col bg-white">
        {/* Left Panel - Hero Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1726443221449-5e3727606f7b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="object-cover h-full w-full"
            alt="Forgot password illustration"
          />
        </div>
          
        {/* Right Panel - Forgot Password Form */}
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-medium text-gray-800">Forgot Password</h1>
              <p className="mt-2 text-gray-600">
                {isSubmitted 
                  ? "We've sent password reset instructions to your email"
                  : "Enter your email address to receive reset instructions"
                }
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Email Field */}
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`w-full px-4 py-3 rounded border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Reset Password'
                    )}
                  </button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 mb-4">
                    We've sent password reset instructions to your email. 
                    If you don't see it, please check your spam folder.
                  </p>
                  
                  <div className="space-y-4 mt-6">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Didn't receive the email? Try again
                    </button>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span>Back to Sign In</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>        </div>
      </div>
    </>
  )
}

export default ForgotPassword
