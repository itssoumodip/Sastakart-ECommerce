import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { toastConfig, formatToastMessage } from './utils/toastConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter 
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  gutter={8}
                  toastOptions={toastConfig}
                />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </BrowserRouter>
)

// Add global error handler for uncaught errors from third-party scripts
window.addEventListener('error', (event) => {
  // Check if error is from a third-party script like Copilot
  if (event.filename && 
      (event.filename.includes('copilot') || 
       event.filename.includes('extension') ||
       event.message.includes('v[b] is not a function'))) {
    
    // Prevent the error from appearing in console
    event.preventDefault();
    return true;
  }
  return false;
}, true);

// Suppress specific console logs that are cluttering the console
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Skip logs about "PC plat undefined"
  if (args.length > 0 && 
      ((typeof args[0] === 'string' && args[0].includes('PC plat')) || 
       (args.length > 1 && args[0] === 'PC' && args[1] === 'plat'))) {
    return;
  }
  originalConsoleLog.apply(console, args);
};
