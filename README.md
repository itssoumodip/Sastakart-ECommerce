# SastaKart E-Commerce Platform

SastaKart is a full-featured e-commerce platform built with modern web technologies, providing a complete online shopping experience.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

SastaKart is a comprehensive e-commerce solution with separate frontend and backend codebases. The platform includes user authentication, product management, shopping cart functionality, order processing, payment integration, and an admin dashboard.

## Features

### User Features
- User registration and authentication
- Product browsing and searching with filters
- Product details with images, specifications, and reviews
- Shopping cart and wishlist management
- Secure checkout with multiple payment options (Card, COD)
- Order tracking and history
- User profile management

### Admin Features
- Dashboard with sales analytics
- Product management (Add, Edit, Delete)
- Order management and status updates
- Customer management
- GST and invoice management
- COD payment handling
- Image upload functionality

## Technologies Used

### Frontend
- React (v18)
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- React Query for data fetching
- Axios for API requests
- Stripe for payment processing
- Various React UI libraries (Headless UI, Hero Icons, etc.)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Nodemailer for email notifications
- Stripe API for payment processing
- PDFKit for invoice generation

## Project Structure

The project is organized into two main directories:

### Backend
```
Backend/
├── controllers/       # Request handlers
├── middleware/        # Authentication and error handling
├── models/            # Database schemas
├── routes/            # API routes
├── utils/             # Helper functions
├── index.js           # Entry point
├── emailTest.js       # Email configuration testing
└── package.json       # Dependencies
```

### Frontend
```
Frontend/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable UI components
│   ├── config/        # Configuration files
│   ├── context/       # React context providers
│   ├── pages/         # Page components
│   ├── services/      # API service functions
│   ├── utils/         # Helper functions
│   ├── App.jsx        # Main application component
│   ├── index.css      # Global styles
│   └── main.jsx       # Entry point
├── index.html         # HTML template
└── package.json       # Dependencies
```

## Installation

### Prerequisites
- Node.js (v20.x recommended)
- MongoDB
- Cloudinary account
- Stripe account

### Setting up the Backend

1. Clone the repository:
```bash
git clone https://github.com/itssoumodip/Sastakart-ECommerce.git
cd Sastakart-ECommerce/Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (see Environment Configuration section)

4. Start the development server:
```bash
npm run dev
```

### Setting up the Frontend

1. Navigate to the frontend directory:
```bash
cd ../Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Environment Configuration

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/sastakart

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Frontend
Configuration is handled through the Vite config and API client setup.

## Usage

### Running in Development Mode

#### Backend
```bash
cd Backend
npm run dev
```

#### Frontend
```bash
cd Frontend
npm run dev
```

### Building for Production

#### Backend
```bash
cd Backend
npm start
```

#### Frontend
```bash
cd Frontend
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `POST /api/auth/password/forgot` - Forgot password
- `PUT /api/auth/password/reset/:token` - Reset password
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/password/update` - Update password
- `PUT /api/auth/me/update` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `PUT /api/products/review` - Create/update review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/me` - Get logged in user orders
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/admin/order/:id` - Update order (Admin)
- `DELETE /api/admin/order/:id` - Delete order (Admin)
- `PUT /api/admin/order/:id/collect-cod` - Collect COD payment (Admin)
- `GET /api/admin/orders/cod-analytics` - Get COD analytics (Admin)
- `GET /api/orders/:id/invoice` - Generate invoice

### Payments
- `POST /api/payment/create` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment
- `GET /api/payment/verify/:id` - Verify payment status
- `POST /api/payment/refund` - Process refund

### Dashboard (Admin)
- `GET /api/dashboard/stats` - Get dashboard statistics

### GST (Admin)
- `GET /api/gst/settings` - Get GST settings
- `PUT /api/gst/settings` - Update GST settings
- `GET /api/gst/analytics` - Get GST analytics

### Image Upload
- `POST /api/upload/products/upload` - Upload product images

## Deployment

The application is configured for deployment on Vercel:

### Backend
- Deploy using Vercel's Node.js runtime
- Configure environment variables in Vercel dashboard

### Frontend
- Deploy using Vercel's static site hosting
- API proxying is configured in the `vercel.json` file

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
