const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  logger: true, // Enable logging
  debug: process.env.NODE_ENV !== 'production' // Debug in non-production environments
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection verified and ready to send emails');
  }
});

exports.sendOrderConfirmationEmail = async (options) => {
  const { to, order } = options;

  // Create email message
  const message = {
    from: `"${process.env.EMAIL_FROM_NAME || 'E-Commerce Store'}" <${process.env.EMAIL_FROM || 'noreply@ecommerce.com'}>`,
    to,
    subject: `Order Confirmation - Order #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Order Confirmation</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee;">
          <p>Hello ${order.user.name},</p>
          
          <p>Thank you for your order! We're processing it now and will let you know when it ships.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Order Summary</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #eee;">
                <th style="text-align: left; padding: 8px;">Product</th>
                <th style="text-align: center; padding: 8px;">Quantity</th>
                <th style="text-align: right; padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 8px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="2" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
                <td style="text-align: right; padding: 8px;"><strong>₹${order.total.toLocaleString('en-IN')}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 20px;">
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p>If you have any questions, please contact our customer service at support@ecommerce.com</p>
          </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

exports.sendShippingConfirmationEmail = async (options) => {
  const { to, order, trackingInfo } = options;

  // Create email message
  const message = {
    from: `"${process.env.EMAIL_FROM_NAME || 'E-Commerce Store'}" <${process.env.EMAIL_FROM || 'noreply@ecommerce.com'}>`,
    to,
    subject: `Your Order Has Shipped - Order #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Your Order Has Shipped</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee;">
          <p>Hello ${order.user.name},</p>
          
          <p>Good news! Your order has been shipped and is on its way to you.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Shipping Details</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Tracking Number:</strong> ${trackingInfo.trackingNumber}</p>
            <p><strong>Carrier:</strong> ${trackingInfo.carrier}</p>
            <p><strong>Estimated Delivery:</strong> ${trackingInfo.estimatedDelivery}</p>
            ${trackingInfo.trackingUrl ? `<p><a href="${trackingInfo.trackingUrl}" style="color: #000; font-weight: bold;">Track Your Package</a></p>` : ''}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p>If you have any questions, please contact our customer service at support@ecommerce.com</p>
          </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

exports.sendPasswordResetEmail = async (options) => {
  const { to, name, resetUrl } = options;

  // Log the attempt (not in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Attempting to send password reset email to: ${to}`);
    console.log(`Reset URL: ${resetUrl}`);
  }

  // Create email message
  const message = {
    from: `"${process.env.EMAIL_FROM_NAME || 'SastaKart'}" <${process.env.SMTP_EMAIL || 'noreply@ecommerce.com'}>`,
    to,
    subject: `Password Reset Request - SastaKart`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Password Reset</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee;">
          <p>Hello ${name},</p>
          
          <p>You requested a password reset. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          
          <p>If you didn't request this, you can safely ignore this email.</p>
          
          <p>The password reset link will expire in 30 minutes.</p>
          
          <div style="margin-top: 30px;">
            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} SastaKart. All rights reserved.</p>
        </div>
      </div>
    `,
    // Plain text alternative for email clients that don't support HTML
    text: `
      Password Reset - SastaKart
      
      Hello ${name},
      
      You requested a password reset. Please visit the following link to create a new password:
      
      ${resetUrl}
      
      This link will expire in 30 minutes.
      
      If you didn't request this, you can safely ignore this email.
      
      SastaKart Team
    `
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Password reset email sending failed:', error);
    // Log more detailed information about the error
    if (error.response) {
      console.error('SMTP Response Code:', error.responseCode);
      console.error('SMTP Response:', error.response);
    }
    return { success: false, error: error.message };
  }
};

exports.sendOrderStatusUpdateEmail = async (options) => {
  const { to, order, status, additionalInfo } = options;

  // Create status-specific content
  let statusTitle, statusMessage;

  switch (status) {
    case 'Processing':
      statusTitle = 'Your Order is Being Processed';
      statusMessage = 'We\'ve started processing your order and will update you when it ships.';
      break;
    case 'Shipped':
      statusTitle = 'Your Order Has Shipped';
      statusMessage = 'Good news! Your order is on the way to you.';
      break;
    case 'Out For Delivery':
      statusTitle = 'Your Order is Out for Delivery';
      statusMessage = 'Exciting news! Your order is out for delivery and should arrive today.';
      break;
    case 'Delivered':
      statusTitle = 'Your Order Has Been Delivered';
      statusMessage = 'Your order has been delivered. We hope you enjoy your purchase!';
      break;
    case 'Cancelled':
      statusTitle = 'Your Order Has Been Cancelled';
      statusMessage = 'Your order has been cancelled as requested. If you didn\'t request this, please contact our support team.';
      break;
    default:
      statusTitle = `Order Status Update: ${status}`;
      statusMessage = `Your order status has been updated to: ${status}`;
  }

  // Create email message
  const message = {
    from: `"${process.env.EMAIL_FROM_NAME || 'SastaKart'}" <${process.env.SMTP_EMAIL || 'noreply@ecommerce.com'}>`,
    to,
    subject: `${statusTitle} - Order #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">${statusTitle}</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee;">
          <p>Hello ${order.user.name},</p>
          
          <p>${statusMessage}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Order Summary</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            ${additionalInfo ? `
              <div style="background-color: #eaf7ff; padding: 10px; margin-top: 10px; border-left: 4px solid #0066cc;">
                <p><strong>Additional Information:</strong><br>${additionalInfo}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p>If you have any questions, please contact our customer service at support@ecommerce.com</p>
          </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} SastaKart. All rights reserved.</p>
        </div>
      </div>
    `,
    // Plain text alternative
    text: `
      ${statusTitle} - Order #${order.id}
      
      Hello ${order.user.name},
      
      ${statusMessage}
      
      Order ID: ${order.id}
      ${additionalInfo ? `Additional Information: ${additionalInfo}` : ''}
      
      If you have any questions, please contact our customer service at support@ecommerce.com
      
      © ${new Date().getFullYear()} SastaKart. All rights reserved.
    `
  };

  try {
    const info = await transporter.sendMail(message);
    console.log(`Order status update email sent for status ${status}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Order status update email failed for status ${status}:`, error);
    return { success: false, error: error.message };
  }
};
