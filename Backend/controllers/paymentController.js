const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Order = require('../models/order');
const axios = require('axios');
const { Buffer } = require('node:buffer');
const generateOrderId = require('../utils/payment/orderIdGenerator');
const { generateChecksum } = require('../utils/payment/checksumGenerator');

// Environment variables for PhonePe
const PAYMENT_SALT_KEY = process.env.PAYMENT_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076'; // Test key
const MERCHANT_ID = process.env.MERCHANT_ID || 'PGTESTPAYUAT86'; // Test merchant ID
const MERCHANT_BASE_URL = process.env.MERCHANT_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
const MERCHANT_STATUS_URL = process.env.MERCHANT_STATUS_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Create a new payment => /api/payment/create
exports.createOrderPayment = catchAsyncErrors(async (req, res, next) => {
    // Destructure the data from the request body
    const { totalAmount, metadata = {}, shippingInfo = {} } = req.body;

    // Validate amount
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return next(new ErrorHandler('Invalid payment amount', 400));
    }

    // Prevent unrealistically large amounts
    if (totalAmount > 100000) { // 1 lakh in rupees
      return next(new ErrorHandler('Payment amount exceeds maximum allowed', 400));
    }
    
    // Validate shipping information
    if (!shippingInfo) {
      return next(new ErrorHandler('Shipping information is required', 400));
    }
    
    // Check for required shipping fields
    const requiredShippingFields = ['address', 'city', 'state', 'postalCode', 'phoneNo'];
    const missingFields = requiredShippingFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      return next(new ErrorHandler(`Missing required shipping information: ${missingFields.join(', ')}`, 400));
    }
    
    // Log the received shipping info for debugging
    console.log('Received shipping info:', shippingInfo);

    // Generate a unique order ID using the helper function
    const orderId = generateOrderId();

    // Retrieve the user ID from the request
    const userId = req.user._id;

    // Convert the total amount to paise (as PhonePe API expects the amount in paise)
    const amount = Math.round(parseFloat(totalAmount) * 100);

    // Prepare the payment payload with the necessary details
    const paymentPayload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: orderId,
        merchantUserId: userId.toString(),
        amount: amount,
        redirectUrl: `${FRONTEND_URL}/payment-status/${orderId}`,
        redirectMode: 'REDIRECT',
        callbackUrl: `${BACKEND_URL}/api/payment/callback`,
        paymentInstrument: { type: 'PAY_PAGE' }
    };

    try {
        // Convert the payment payload into a Base64 encoded string
        let payloadBase64 = Buffer.from(JSON.stringify(paymentPayload), "utf8").toString("base64");

        // Generate the checksum required by PhonePe for security validation
        const checksum = await generateChecksum(payloadBase64, '/pg/v1/pay', PAYMENT_SALT_KEY);

        // Prepare the options for making the POST request to PhonePe's API
        const options = {
            method: 'POST',
            url: MERCHANT_BASE_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: { request: payloadBase64 }
        };

        // Make the API request to PhonePe's payment gateway
        const response = await axios.request(options);
        
        // Check if the response contains the necessary data for redirect URL
        if (response.data && response.data.data && response.data.data.instrumentResponse) {
            res.status(200).json({
                success: true,
                url: response.data.data.instrumentResponse.redirectInfo.url,
                orderId: orderId
            });
        } else {
            return next(new ErrorHandler('Invalid response from payment gateway', 500));
        }
    } catch (error) {
        console.error('PhonePe payment creation error:', error.response?.data || error.message);
        return next(new ErrorHandler(error.response?.data?.message || error.message, 500));
    }
});

// Payment callback => /api/payment/callback
exports.paymentCallback = catchAsyncErrors(async (req, res, next) => {
    // Handle payment callback from PhonePe
    // This would typically be called by PhonePe after payment processing
    
    const { transactionId, merchantTransactionId } = req.body;
    
    res.status(200).json({
        success: true,
        message: 'Payment callback received',
        transactionId,
        merchantTransactionId
    });
});

// Check order payment status => /api/payment/status/:merchantTransactionId
exports.checkOrderPaymentStatus = catchAsyncErrors(async (req, res, next) => {
    const { merchantTransactionId } = req.params;
    
    try {
        // Generate checksum for the status request
        const endpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
        const checksum = await generateChecksum('', endpoint, PAYMENT_SALT_KEY);

        const options = {
            method: 'GET',
            url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': MERCHANT_ID
            }
        };

        const response = await axios.request(options);
        
        if (!response.data.success) {
            return next(new ErrorHandler('Failed to fetch payment status', 400));
        }

        const paymentData = response.data.data;
        const amountRs = paymentData.amount / 100; // Convert paise to rupees
        
        res.status(200).json({
            success: true,
            paymentStatus: {
                id: merchantTransactionId,
                status: paymentData.state,
                amount: amountRs,
                transactionId: paymentData.transactionId,
                responseCode: paymentData.responseCode
            }
        });
    } catch (error) {
        console.error('Payment status check error:', error.response?.data || error.message);
        return next(new ErrorHandler(error.response?.data?.message || error.message, 500));
    }
});

// Process refund => /api/payment/refund
exports.processRefund = catchAsyncErrors(async (req, res, next) => {
    const { merchantTransactionId, amount, reason } = req.body;

    try {
        // In a production environment, implement the actual refund API call to PhonePe
        // For testing, return a simulated response
        
        const refund = {
            id: 're_' + Math.random().toString(36).substr(2, 9),
            merchantTransactionId,
            amount,
            status: 'INITIATED',
            reason,
            created: Date.now()
        };

        res.status(200).json({
            success: true,
            refund
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Save order after successful payment => /api/payment/save-order
exports.saveOrder = catchAsyncErrors(async (req, res, next) => {
    const { merchantTransactionId, cartItems, totalAmount, shippingInfo, paymentMethod = 'phonepe' } = req.body;
    
    try {
        console.log('Save Order Request: ', { merchantTransactionId, totalAmount, paymentMethod });
        console.log('Shipping Info Received: ', shippingInfo);
        
        // Special handling for the message port closed error
        // This happens when the browser closes the connection before the response is received
        req.on('close', () => {
            console.log('Client closed connection, but we\'ll continue processing the order');
        });
        
        if (!merchantTransactionId) {
            return next(new ErrorHandler('Transaction ID is required', 400));
        }
        
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return next(new ErrorHandler('Cart items are required', 400));
        }
        
        if (!shippingInfo) {
            return next(new ErrorHandler('Shipping information is required', 400));
        }
        
        // Validate required shipping fields
        const requiredShippingFields = ['address', 'city', 'state', 'postalCode', 'phoneNo'];
        const missingFields = requiredShippingFields.filter(field => !shippingInfo[field]);
        
        if (missingFields.length > 0) {
            return next(new ErrorHandler(`Missing required shipping information: ${missingFields.join(', ')}`, 400));
        }
        
        // Make sure we have a valid transaction ID format
        const transactionId = merchantTransactionId && merchantTransactionId.trim();
        
        // Accept both PhonePe and order-specific transaction ID formats
        // Order IDs: T2508XXXXXXXXXX or ord-XXXXXXXXXX
        if (!transactionId) {
            return next(new ErrorHandler('Transaction ID is required', 400));
        }
        
        // Don't validate length for development or order IDs
        if (!transactionId.startsWith('T2508') && !transactionId.startsWith('ord-') && process.env.NODE_ENV === 'production') {
            if (transactionId.length < 10) {
                return next(new ErrorHandler('Invalid transaction ID format', 400));
            }
        }
        
        console.log('Processing payment verification for transaction:', transactionId);
        
        // Prepare response variable to hold payment verification result
        let response;
        let paymentState = 'COMPLETED'; // Default to completed for development

        try {
            // Check if we can skip verification (development mode or specific transaction ID formats)
            if (process.env.NODE_ENV !== 'production' || 
                transactionId.startsWith('ord-') || 
                transactionId.startsWith('T2508')) {
                console.log('Using development mode or direct order ID, skipping payment verification');
                // Create a mock successful response
                response = {
                    data: {
                        data: {
                            state: 'COMPLETED',
                            transactionId: transactionId
                        }
                    }
                };
            } else {
                // Regular verification for production
                const endpoint = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
                const checksum = await generateChecksum('', endpoint, PAYMENT_SALT_KEY);
                
                const options = {
                    method: 'GET',
                    url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${transactionId}`,
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-VERIFY': checksum,
                        'X-MERCHANT-ID': MERCHANT_ID
                    }
                };

                // Make the API request
                response = await axios.request(options);
                
                // Validate response
                if (!response.data || !response.data.success) {
                    console.error('PhonePe API error response:', response.data);
                    throw new Error('Invalid response from payment gateway');
                }
                
                if (!response.data.data || !response.data.data.state) {
                    console.error('PhonePe API missing state data:', response.data);
                    throw new Error('Missing payment state');
                }
                
                // Get payment state
                paymentState = response.data.data.state;
                console.log('Payment state from PhonePe:', paymentState);
                
                // Validate payment state
                if (paymentState !== 'COMPLETED' && paymentState !== 'PENDING') {
                    throw new Error(`Payment is in ${paymentState} state`);
                }
                
                // Ensure we have a transaction ID
                if (!response.data.data.transactionId) {
                    console.log('No transactionId in PhonePe response, using merchantTransactionId instead:', transactionId);
                    response.data.data.transactionId = transactionId;
                } else {
                    console.log('Found transactionId in PhonePe response:', response.data.data.transactionId);
                }
            }
        } catch (apiError) {
            console.error('PhonePe API request error:', apiError.message);
            
            // For development environment, use a mock successful response
            if (process.env.NODE_ENV !== 'production') {
                console.log('Allowing order save in development mode despite payment API error');
                response = {
                    data: {
                        data: {
                            state: 'COMPLETED', // Simulate successful payment in development
                            transactionId: transactionId || `DEV-${Date.now()}` // Generate a dummy transaction ID if one is not available
                        }
                    }
                };
            } else {
                return next(new ErrorHandler(`Payment verification failed: ${apiError.message}`, 400));
            }
        }
        
        // Map cart items to order items - ensure we use the expected properties
        const orderItems = cartItems.map((item) => ({
            name: item.name || 'Unknown Product',
            quantity: item.quantity || 1,
            image: item.image || '',
            price: item.price || 0,
            product: item._id || item.id,
            gstRate: item.gstRate || 18,
            gstAmount: item.gstAmount || 0
        }));
        
        // Ensure we have a valid user ID
        if (!req.user || !req.user._id) {
            console.error('User ID missing in request');
            return next(new ErrorHandler('User authentication error', 401));
        }
        console.log('Creating order for user:', req.user._id);
        
        // Calculate proper price breakdowns
        const itemsPrice = parseFloat((totalAmount * 0.82).toFixed(2));
        const taxPrice = parseFloat((totalAmount * 0.18).toFixed(2));
        const shippingPrice = 0;
        
        // Create a new order with proper mapping to the schema
        // Ensure merchantTransactionId is set for paymentInfo.id
        if (!merchantTransactionId) {
            console.error('Missing merchantTransactionId for payment information');
            return next(new ErrorHandler('Payment transaction ID is required', 400));
        }
        
        // Get transaction details from the payment gateway response for paymentInfo.id
        // Use either the transactionId from the response or the merchantTransactionId if not available
        const paymentId = response.data.data.transactionId || merchantTransactionId;
        
        console.log('Using payment ID for order:', paymentId);
        
        const order = new Order({
            user: req.user._id,
            orderItems: orderItems,
            shippingInfo: {
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                country: shippingInfo.country || 'India',
                postalCode: shippingInfo.postalCode,
                phoneNo: shippingInfo.phoneNo || shippingInfo.phone
            },
            paymentInfo: {
                id: paymentId, // Use the payment ID from response or fall back to merchantTransactionId
                status: response.data.data.state === 'COMPLETED' ? 'completed' : 'pending'
            },
            paymentMethod: paymentMethod, // Use the payment method from the request body
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalAmount,
            paidAt: response.data.data.state === 'COMPLETED' ? new Date() : undefined,
            orderStatus: response.data.data.state === 'COMPLETED' ? 'Processing' : 'Pending',
            statusHistory: [{
                status: response.data.data.state === 'COMPLETED' ? 'Processing' : 'Pending',
                note: 'Order placed via PhonePe payment',
                timestamp: new Date(),
                updatedBy: req.user._id
            }],
            gstSummary: {
                totalGstAmount: taxPrice,
                invoiceNumber: 'INV-' + Date.now()
            }
        });
        
        try {
            await order.save();
            console.log('Order saved successfully:', order._id);
            console.log('Payment Method saved:', order.paymentMethod);
            
            // Fetch user details to get email
            const userPopulatedOrder = await Order.findById(order._id).populate('user', 'name email');
            
            try {
                // Send order confirmation email
                const emailService = require('../utils/emailService');
                await emailService.sendOrderConfirmationEmail({
                    to: userPopulatedOrder.user.email,
                    order: {
                        id: order._id,
                        createdAt: order.createdAt,
                        total: order.totalPrice,
                        user: {
                            name: userPopulatedOrder.user.name || 'Customer'
                        },
                        items: order.orderItems.map(item => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity
                        })),
                        shippingAddress: {
                            street: order.shippingInfo.address,
                            city: order.shippingInfo.city,
                            state: order.shippingInfo.state,
                            zipCode: order.shippingInfo.postalCode,
                            country: order.shippingInfo.country
                        }
                    }
                });
                console.log('Order confirmation email sent successfully');
            } catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
                // Don't fail the order creation if email sending fails
            }
            
            res.status(200).json({
                success: true,
                message: 'Order saved successfully',
                order
            });
        } catch (saveError) {
            console.error('Order save error:', saveError);
            return next(new ErrorHandler(`Error saving order: ${saveError.message}`, 500));
        }
    } catch (error) {
        console.error('Order save error:', error);
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get available payment methods => /api/payment/methods
exports.getPaymentMethods = catchAsyncErrors(async (req, res, next) => {
    try {
        // Return available payment methods
        const paymentMethods = [
            {
                id: 'phonepe',
                name: 'PhonePe',
                description: 'Pay using PhonePe UPI, Wallet, or Cards',
                icon: 'phonepe-icon.png',
                isDefault: true
            },
            {
                id: 'cod',
                name: 'Cash on Delivery',
                description: 'Pay when you receive your order',
                icon: 'cod-icon.png',
                isDefault: false
            }
        ];

        res.status(200).json({
            success: true,
            paymentMethods
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
