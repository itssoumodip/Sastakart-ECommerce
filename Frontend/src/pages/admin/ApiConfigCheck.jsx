import React, { useEffect, useState } from 'react';
import { getAuthHeaders } from '../../utils/auth';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';
import { logger } from '../../utils/logger';

const ApiConfigCheck = () => {
  const [apiConfig, setApiConfig] = useState({
    baseUrl: '',
    gstSettingsUrl: '',
    gstAnalyticsUrl: '',
    couponsUrl: '',
  });
  
  const [pingResults, setPingResults] = useState({
    root: { status: 'pending', message: 'Not tested yet' },
    gstSettings: { status: 'pending', message: 'Not tested yet' },
    gstAnalytics: { status: 'pending', message: 'Not tested yet' },
    coupons: { status: 'pending', message: 'Not tested yet' },
  });
  
  // Log API configuration on component mount
  useEffect(() => {
    const baseUrl = API_BASE_URL || 'Not defined';
    const gstSettingsUrl = `${API_BASE_URL}${API_ENDPOINTS.GST_SETTINGS}`;
    const gstAnalyticsUrl = `${API_BASE_URL}${API_ENDPOINTS.GST_ANALYTICS}`;
    const couponsUrl = `${API_BASE_URL}${API_ENDPOINTS.COUPONS}`;
    
    logger.debug('API Base URL:', baseUrl);
    logger.debug('Environment Variable:', import.meta.env.VITE_API_URL);
    logger.debug('GST Settings URL:', gstSettingsUrl);
    logger.debug('GST Analytics URL:', gstAnalyticsUrl);
    logger.debug('Coupons URL:', couponsUrl);
    
    setApiConfig({
      baseUrl,
      gstSettingsUrl,
      gstAnalyticsUrl,
      couponsUrl,
    });
  }, []);
  
  const pingEndpoint = async (url, key) => {
    setPingResults(prev => ({
      ...prev,
      [key]: { status: 'loading', message: 'Testing connection...' }
    }));
    
    try {
      const response = await axios.get(url, { 
        headers: getAuthHeaders(),
        timeout: 5000 // 5 seconds timeout
      });
      
      setPingResults(prev => ({
        ...prev,
        [key]: { 
          status: 'success', 
          message: `Success (${response.status})`,
          data: response.data
        }
      }));
    } catch (error) {
      setPingResults(prev => ({
        ...prev,
        [key]: { 
          status: 'error', 
          message: `Error: ${error.response ? error.response.status + ' ' + error.response.statusText : error.message}`
        }
      }));
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">API Configuration Check</h1>
      <p className="mb-6 text-gray-600">Use this tool to diagnose API connection issues</p>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Environment Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">VITE_API_URL:</p>
              <p className="font-mono bg-gray-100 p-2 rounded">{import.meta.env.VITE_API_URL || 'Not defined'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">API_BASE_URL:</p>
              <p className="font-mono bg-gray-100 p-2 rounded">{apiConfig.baseUrl}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">API Endpoints</h2>
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="md:w-1/2">
                <p className="text-sm text-gray-600">Root API:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{apiConfig.baseUrl}</p>
              </div>
              <div className="md:w-1/4">
                <button 
                  onClick={() => pingEndpoint(apiConfig.baseUrl, 'root')}
                  className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Test Connection
                </button>
              </div>
              <div className="md:w-1/4">
                <span 
                  className={`inline-block px-3 py-1 rounded text-sm ${
                    pingResults.root.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : pingResults.root.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : pingResults.root.status === 'loading'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {pingResults.root.message}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="md:w-1/2">
                <p className="text-sm text-gray-600">GST Settings:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{apiConfig.gstSettingsUrl}</p>
              </div>
              <div className="md:w-1/4">
                <button 
                  onClick={() => pingEndpoint(apiConfig.gstSettingsUrl, 'gstSettings')}
                  className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Test Connection
                </button>
              </div>
              <div className="md:w-1/4">
                <span 
                  className={`inline-block px-3 py-1 rounded text-sm ${
                    pingResults.gstSettings.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : pingResults.gstSettings.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : pingResults.gstSettings.status === 'loading'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {pingResults.gstSettings.message}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="md:w-1/2">
                <p className="text-sm text-gray-600">GST Analytics:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{apiConfig.gstAnalyticsUrl}</p>
              </div>
              <div className="md:w-1/4">
                <button 
                  onClick={() => pingEndpoint(apiConfig.gstAnalyticsUrl, 'gstAnalytics')}
                  className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Test Connection
                </button>
              </div>
              <div className="md:w-1/4">
                <span 
                  className={`inline-block px-3 py-1 rounded text-sm ${
                    pingResults.gstAnalytics.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : pingResults.gstAnalytics.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : pingResults.gstAnalytics.status === 'loading'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {pingResults.gstAnalytics.message}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="md:w-1/2">
                <p className="text-sm text-gray-600">Coupons:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{apiConfig.couponsUrl}</p>
              </div>
              <div className="md:w-1/4">
                <button 
                  onClick={() => pingEndpoint(apiConfig.couponsUrl, 'coupons')}
                  className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Test Connection
                </button>
              </div>
              <div className="md:w-1/4">
                <span 
                  className={`inline-block px-3 py-1 rounded text-sm ${
                    pingResults.coupons.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : pingResults.coupons.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : pingResults.coupons.status === 'loading'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {pingResults.coupons.message}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Troubleshooting Steps</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Ensure your backend server is running at {apiConfig.baseUrl}</li>
            <li>Check that CORS is properly configured to allow requests from your frontend</li>
            <li>Verify that the API endpoints match exactly what's defined in your backend routes</li>
            <li>Make sure you're correctly authorized (logged in as admin) to access these endpoints</li>
            <li>Check browser console for detailed error messages</li>
          </ol>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="font-bold text-lg mb-2">Current API Routes</h2>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          {`
// Backend Routes Mounted
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gst', gstRoutes);
app.use('/api/coupons', couponRoutes);

// GST Routes
router.route('/settings').get(isAuthenticatedUser, authorizeRoles('admin'), getGSTSettings);
router.route('/settings').put(isAuthenticatedUser, authorizeRoles('admin'), updateGSTSettings);
router.route('/analytics').get(isAuthenticatedUser, authorizeRoles('admin'), getGSTAnalytics);

// Coupon Routes
router.route('/admin/coupons').get(isAuthenticatedUser, authorizeRoles('admin'), getAllCoupons);
router.route('/admin/coupons').post(isAuthenticatedUser, authorizeRoles('admin'), createCoupon);
`}
        </pre>
      </div>
    </div>
  );
};

export default ApiConfigCheck;
