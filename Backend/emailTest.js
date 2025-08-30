require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('./utils/logger');

logger.debug('Starting email test...');
logger.debug('SMTP_HOST:', process.env.SMTP_HOST);
logger.debug('SMTP_PORT:', process.env.SMTP_PORT);
logger.debug('SMTP_EMAIL:', process.env.SMTP_EMAIL);
logger.debug('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'Set (masked)' : 'Not set');

// Create a transporter object with the same settings as your app
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  debug: true, // Enable verbose logging
  logger: true // Turn on logger
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    logger.error('SMTP server connection error:', error);
  } else {
    logger.debug('SMTP server connection verified and ready to send emails');
    
    // Try sending a test email
    const message = {
      from: `"Test" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL, // Send to yourself for testing
      subject: "Nodemailer Test",
      text: "If you receive this email, nodemailer is working correctly!",
      html: "<p>If you receive this email, <b>nodemailer is working correctly!</b></p>"
    };
    
    transporter.sendMail(message, (err, info) => {
      if (err) {
        logger.error('Test email sending failed:', err);
      } else {
        logger.debug('Test email sent successfully:', info);
      }
    });
  }
});
