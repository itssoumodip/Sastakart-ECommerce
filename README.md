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

# SastaKart — E‑Commerce (Frontend + Backend)

This repository contains SastaKart, a full-stack e-commerce application with a React + Vite frontend and a Node.js + Express + MongoDB backend. It includes product management, cart & wishlist, checkout and payment integrations, order handling, and an admin dashboard.

## Quick overview
- Frontend: React (Vite), Tailwind CSS, React Query, react-hot-toast
- Backend: Node.js, Express, MongoDB (Mongoose)
- Payment integrations: PhonePe flow + backend verification; (Stripe helpers exist in services)
- Key UX behaviors implemented in this repo:
	- Cart is stored in React Context and persisted to localStorage.
	- After a successful PhonePe payment the frontend `PaymentStatus` page saves the order and clears both localStorage and the CartContext (cart counter updates to 0).
	- Orders created through both the normal order endpoint and the payment save endpoint decrement product stock on the server.
	- Product cards and product detail pages were adjusted to avoid showing prices for out-of-stock products.

## Repo layout (high level)

Backend/
- controllers/
- middleware/
- models/
- routes/
- utils/
- index.js

Frontend/
- public/
- src/
	- components/
	- pages/
	- context/
	- services/
	- config/
	- utils/

## Local development

Prereqs: Node.js (18+), MongoDB (local or cloud), optional: Cloudinary account for images.

1) Install backend

```bash
cd Backend
npm install
```

Create a `.env` in `Backend/` (see env section below). Then run:

```bash
npm run dev
```

2) Install frontend

```bash
cd ../Frontend
npm install
npm run dev
```

Open the frontend at the Vite URL (usually http://localhost:5173).

Notes: the frontend and backend talk to the API base URL configured in `Frontend/src/config/api.js` (Vite env variables are used for API base URL).

## Important environment variables

Backend (example `.env` entries) — do NOT commit real secrets:

```
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/sastakart

JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_EMAIL=you@example.com
# SastaKart — E‑Commerce (Frontend + Backend)

This repository contains SastaKart, a full-stack e-commerce application with a React + Vite frontend and a Node.js + Express + MongoDB backend. It includes product management, cart & wishlist, checkout and payment integrations, order handling, and an admin dashboard.

## Quick overview
- Frontend: React (Vite), Tailwind CSS, React Query, react-hot-toast
- Backend: Node.js, Express, MongoDB (Mongoose)
- Payment integration: PhonePe (sandbox/preprod) with backend verification and save-order flow

Key UX behaviors implemented in this repo:
- Cart is stored in React Context and persisted to localStorage.
- After a successful PhonePe payment the frontend `PaymentStatus` page saves the order and clears both localStorage and the CartContext (cart counter updates to 0).
- Orders created through both the normal order endpoint and the payment save endpoint decrement product stock on the server.
- Product cards and product detail pages avoid showing prices for out-of-stock products and show a single, consistent 'Out of Stock' indicator.

## Repo layout (high level)

Backend/
- controllers/
- middleware/
- models/
- routes/
- utils/
- index.js

Frontend/
- public/
- src/
	- components/
	- pages/
	- context/
	- services/
	- config/
	- utils/

## Local development

Prereqs: Node.js (18+), MongoDB (local or cloud), optional: Cloudinary account for images.

1) Install backend

```bash
cd Backend
npm install
```

Create a `.env` in `Backend/` (see env section below). Then run:

```bash
npm run dev
```

2) Install frontend

```bash
cd ../Frontend
npm install
npm run dev
```

Open the frontend at the Vite URL (usually http://localhost:5173).

Notes: the frontend and backend talk to the API base URL configured in `Frontend/src/config/api.js` (Vite env variables are used for API base URL).

## Important environment variables

Backend (example `.env` entries) — do NOT commit real secrets:

```
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/sastakart

JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_EMAIL=you@example.com
SMTP_PASSWORD=app-password

# PhonePe (used by payment endpoints in Backend)
PAYMENT_SALT_KEY=your_phonepe_salt_key
MERCHANT_ID=your_merchant_id
MERCHANT_BASE_URL=https://staging-phonepe.example/api
MERCHANT_STATUS_URL=https://staging-phonepe.example/status
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

```

Frontend: set `VITE_API_URL` (e.g. `http://localhost:5000`) in `.env` in the `Frontend/` folder.

## Key behaviors & implementation notes

- Cart clearing (PhonePe): `Frontend/src/pages/PaymentStatus.jsx` verifies payment status then POSTs to `/api/payment/save-order`. After a successful save it removes `localStorage.cart`, calls `clearCart('phonepe-order', true)` on the CartContext (this suppresses the CartContext toast), and shows the success panel on the page. This avoids duplicate toasts.

- Stock handling:
	- `Backend/controllers/orderController.js` decrements stock when creating orders via normal checkout.
	- `Backend/controllers/paymentController.js` (save-order) also decrements product stock for orders created after PhonePe payment. The controller sets product status to `Out of Stock` / `Low Stock` / `Active` based on remaining stock.
	- Frontend displays availability on cards and product pages; product cards hide the price when out-of-stock and show a clear overlay badge.

- Duplicate toast fix: CartContext `clearCart` supports a `suppressToast` flag so callers (like `PaymentStatus`) can clear silently and show a single consolidated success message.

## Admin features (implemented)

The project includes a substantial admin area both in the frontend and backend. Implemented admin capabilities include:

- Products management: create, edit, delete, and image upload (Cloudinary).
- Orders management: list orders, view order details, update status, generate invoices.
- COD management and analytics: admin pages and endpoints to manage COD flows.
- Coupons and GST: create/update/delete coupons and GST rate settings.
- Dashboard: sales metrics and basic analytics pages.
- Users management: list and manage users.
- Travel module: destinations management (separate feature area in admin).

Admin pages live in `Frontend/src/pages/admin/` and corresponding API routes are in `Backend/routes/` and `Backend/controllers/`.

## PhonePe notes

- The project uses PhonePe in sandbox/preprod mode for payment. Relevant env vars live in `Backend/.env` and `Frontend/.env` (merchant id, base/status URLs, payment salt key).
- The backend verifies PhonePe webhook/response signatures (checksum) and then saves the order via `/api/payment/save-order`. That endpoint decrements product stock on the server.
- If you will not use PhonePe, remove or adapt the PhonePe utils/routes and update `Frontend/src/pages/PaymentStatus.jsx` and `Frontend/src/services/paymentService.js` accordingly.

## Testing & debug tips

- To manually test cart → PhonePe flow (dev):
	1. Add items to cart in the frontend.
	2. Complete the checkout and follow the (dev) redirect to `/payment-status/:orderId`.
	3. Confirm the page shows success and the UI cart count becomes 0.
	4. Verify product stock decreased in your MongoDB instance.

## Recommended improvements (future work)

- Use MongoDB atomic updates (findOneAndUpdate with $inc and conditional checks) or transactions to prevent overselling under high concurrency.
- Implement a reservation/hold mechanism to reserve stock during checkout before final payment (release on timeout).
- Add a "Notify me" feature for out-of-stock items and small automated tests for critical payment flows.

## Deployment

- The repo includes `vercel.json` files in both frontend and backend for deploying to Vercel. Configure environment variables in the target platform.

## Contributing

Fork, branch, test, and open a PR. Keep changes small and focused.
