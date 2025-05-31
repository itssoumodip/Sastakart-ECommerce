# E-Commerce Website

A modern, full-stack e-commerce website built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication and authorization
- Product browsing and filtering
- Shopping cart functionality
- Wishlist for saving favorite items
- Secure checkout with Stripe payment integration
- Order tracking and history
- Admin dashboard for product and order management
- Responsive design for all device sizes

## Technology Stack

### Frontend
- React.js with hooks and context API
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide for icons
- Stripe for payment processing

### Backend
- Node.js and Express.js
- MongoDB for database
- JWT for authentication
- RESTful API architecture
- Stripe API integration

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas account)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd E-Commerce-Website
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd Backend
npm install

# Return to root directory
cd ..

# Install frontend dependencies
cd Frontend
npm install
```

3. Set up environment variables:

Create `.env` files in both the Backend and Frontend directories with the necessary environment variables:

Backend:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Frontend:
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=E-Commerce Store
VITE_APP_VERSION=1.0.0
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the application:

For Windows users, simply run:
```
start-app.bat
```

For manual startup:
```
# Start backend server
cd Backend
npm run dev

# In another terminal, start frontend server
cd Frontend
npm run dev
```

## Backend API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create a new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Order Routes
- `POST /api/orders` - Create a new order
- `GET /api/orders/me` - Get current user's orders
- `GET /api/orders/:id` - Get order details

### Payment Routes
- `POST /api/payments/create` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Handle Stripe webhooks

## License

This project is licensed under the MIT License.
