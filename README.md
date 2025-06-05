# ClassyShop - Modern E-Commerce Platform

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring a modern UI with Tailwind CSS and comprehensive e-commerce functionality.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

### User Features
- 🔐 Secure Authentication with JWT
- 👤 User Profile Management with Avatar Upload
- 🛒 Shopping Cart & Wishlist
- 💳 Stripe Payment Integration
- 📦 Order Tracking
- 🔍 Product Search & Filtering
- 📱 Responsive Design

### Admin Features
- 📊 Admin Dashboard
- 📦 Product Management
- 👥 User Management
- 📜 Order Management
- 💰 COD (Cash on Delivery) Management
- 📈 Sales Analytics

## 🚀 Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Context for state management
- Framer Motion for animations
- React Hook Form for form handling
- Axios for API requests

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image uploads
- Stripe Payment Integration
- Email Service Integration

## 🛠️ Setup & Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd Backend
   npm install

   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

3. Set up environment variables:
   Create .env files in both Frontend and Backend directories with necessary configurations.

4. Run the development servers:
   ```bash
   # Start backend server
   cd Backend
   npm run dev

   # Start frontend server
   cd Frontend
   npm run dev
   ```

## 🌍 Environment Variables

### Backend
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend
```env
VITE_API_URL=your_backend_api_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 📁 Project Structure

The project follows a clean and modular architecture:

```
Frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers
│   ├── pages/          # Route components
│   ├── services/       # API service layers
│   └── utils/          # Utility functions
Backend/
├── controllers/        # Route controllers
├── models/            # Mongoose models
├── routes/            # API routes
├── middleware/        # Custom middleware
└── utils/             # Utility functions
```

## 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected Routes
- Input Validation
- XSS Protection
- CORS Configuration

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](link_to_issues).

## 📝 License

This project is [MIT](link_to_license) licensed.

## 👨‍💻 Author

Made with ❤️ by Soumodip Das
