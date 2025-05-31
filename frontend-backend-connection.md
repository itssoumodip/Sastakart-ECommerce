# Frontend-Backend Connection Guide

This guide explains how the frontend and backend are connected in our E-Commerce Website project.

## Architecture Overview

Our E-Commerce application consists of two main parts:

1. **Frontend**: React application using Vite as a build tool, with components for UI, context for state management, and services for API calls.

2. **Backend**: Node.js application with Express.js framework, MongoDB database, and various middleware for authentication, error handling, etc.

## Connection Points

### API Configuration

The frontend connects to the backend through API calls. The base URL is configured in the frontend's `.env` file:

```
VITE_API_URL=http://localhost:5000
```

This is accessed in the frontend via `import.meta.env.VITE_API_URL` in the API configuration file.

### API Services

The frontend uses Axios for HTTP requests to the backend. API endpoints are defined in `src/config/api.js`.

### Authentication

1. User authentication is managed through JWT tokens.
2. When a user logs in, the backend sends a JWT token which is stored in local storage on the frontend.
3. This token is included in the Authorization header for authenticated API requests.

### Payment Integration

1. Stripe is used for payment processing.
2. The frontend collects payment information using Stripe Elements.
3. The backend creates payment intents using the Stripe API.
4. Payment confirmation happens through the backend's webhook endpoints.

## Data Flow Example

### Adding a Product to Cart

1. User clicks "Add to Cart" button on a product.
2. Frontend updates the cart state in CartContext.
3. Cart data is stored in local storage for persistence.

### Checkout Process

1. User proceeds to checkout and enters shipping information.
2. User enters payment details using the Stripe Elements form.
3. Frontend sends payment information securely to Stripe.
4. Stripe returns a payment intent client secret.
5. Backend creates an order in the database.
6. On successful payment, the order status is updated.

## CORS Configuration

The backend includes CORS (Cross-Origin Resource Sharing) configuration to allow requests from the frontend:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

## Error Handling

1. Backend errors are caught and formatted with appropriate HTTP status codes.
2. Frontend uses try-catch blocks around API calls to handle errors.
3. Error messages are displayed to users via toast notifications.

## Environment Variables

Both frontend and backend use environment variables for configuration:

- Backend: `.env` file with database connection, JWT secrets, Stripe keys, etc.
- Frontend: `.env` file with API URL and Stripe publishable key.

## Deployment Considerations

When deploying the application:

1. Update the environment variables for production.
2. Set up proper CORS configuration for production domains.
3. Ensure Stripe webhook endpoints are correctly configured.
4. Consider using environment-specific API URLs.

## Troubleshooting

If you encounter connection issues:

1. Check the API URL configuration.
2. Verify CORS settings on the backend.
3. Check for network errors in the browser console.
4. Ensure JWT tokens are being properly sent and validated.
5. Verify Stripe keys are correctly configured in both environments.
