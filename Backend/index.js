require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('./utils/passport');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const uploadRoutes = require('./routes/upload');
const dashboardRoutes = require('./routes/dashboard');
const gstRoutes = require('./routes/gst');
const couponRoutes = require('./routes/coupon');
const debugRoutes = require('./routes/debug');
const destinationRoutes = require('./routes/travel/destinations');

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://sastakart.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'stripe-signature'],
  exposedHeaders: ['set-cookie'],
  maxAge: 86400 // Cache preflight requests for 24 hours
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Initialize Passport middleware
app.use(passport.initialize());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to E-Commerce API' });
});

// Debug routes
app.get('/api/debug/routes', (req, res) => {
  const routes = {
    coupons: {
      adminCoupons: '/api/coupons/admin/coupons',
      applyCoupon: '/api/coupons/apply',
      verifyCoupon: '/api/coupons/code/:code',
    },
    gst: {
      settings: '/api/gst/settings',
      analytics: '/api/gst/analytics',
    }
  };
  res.json({ success: true, routes });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gst', gstRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/travel', destinationRoutes);
 
// Database connection with improved configuration
const connectDB = async () => {
  try {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds instead of 30
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      connectTimeoutMS: 15000, // Give up initial connection after 15 seconds
      maxPoolSize: 50, // Maintain up to 50 socket connections
      minPoolSize: 10, // Maintain at least 10 socket connections
      maxIdleTimeMS: 60000, // Close idle connections after 60 seconds
      writeConcern: { w: 'majority' }, // Wait for write acknowledgment from majority of replicas
      retryWrites: true, // Automatically retry write operations
      retryReads: true // Automatically retry read operations
    };

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', mongoOptions);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // If initial connection fails, retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB Connection Error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Disconnected, trying to reconnect...');
  connectDB();
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB Reconnected Successfully');
});

// Initialize database connection
connectDB();

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API root available at http://localhost:${PORT}`);
  console.log(`API routes registered:`);
  console.log(` - Auth: /api/auth`);
  console.log(` - Products: /api/products`);
  console.log(` - Users: /api/users`);
  console.log(` - Orders: /api/orders`);
  console.log(` - Payment: /api/payment`);
  console.log(` - Upload: /api/upload`);
  console.log(` - Dashboard: /api/dashboard`);
  console.log(` - GST: /api/gst`);
  console.log(` - Coupons: /api/coupons`);
  console.log(` - Travel: /api/travel`);
});

module.exports = app;
