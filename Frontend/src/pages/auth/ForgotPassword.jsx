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
      await axios.post('/api/auth/password/forgot', { email: data.email })
      setIsSubmitted(true)
      toast.success('Password reset instructions sent to your email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - RETRO-SHOP</title>
        <meta name="description" content="Reset your password to regain access to your account." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <motion.div 
          className="max-w-md w-full space-y-8 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex justify-center">
              <motion.div 
                className="w-14 h-14 border-2 border-white flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-mono font-bold text-white uppercase tracking-widest">
              Forgot Password?
            </h2>
            <p className="mt-2 text-center text-sm text-white font-mono uppercase tracking-wide">
              {isSubmitted 
                ? "We've sent password reset instructions to your email"
                : "Enter your email address to receive reset instructions"
              }
            </p>
          </div>
          <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form 
              className="mt-8 space-y-6 bg-black border-2 border-white p-8"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label htmlFor="email" className="block text-sm font-mono font-semibold text-white uppercase tracking-wide">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    autoComplete="email"
                    className="bg-black text-white border-2 border-white focus:ring-0 focus:border-white w-full h-12 pl-10 font-mono"
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                  />
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-white/70" />
                </div>
                {errors.email && (
                  <motion.p className="mt-1 text-sm text-white font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.email.message}</motion.p>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black border-2 border-white w-full py-3 font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'SENDING...' : 'SEND RESET INSTRUCTIONS'}
              </motion.button>
              <div className="text-center">
                <Link
                  to="/login"
                  className="font-mono font-medium text-white hover:underline uppercase tracking-wide"
                >
                  BACK TO SIGN IN
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              className="mt-8 text-center space-y-4 bg-black border-2 border-white p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-2 border-white p-4">
                <div className="flex justify-center mb-2">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <p className="text-white text-sm font-mono uppercase tracking-wide">
                  Check your email for password reset instructions. If you don't see it, check your spam folder.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-white hover:underline font-mono uppercase tracking-wide"
                >
                  DIDN'T RECEIVE THE EMAIL? TRY AGAIN
                </button>
                <div>
                  <Link
                    to="/login"
                    className="text-sm font-mono font-medium text-white hover:underline uppercase tracking-wide"
                  >
                    BACK TO SIGN IN
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

export default ForgotPassword
