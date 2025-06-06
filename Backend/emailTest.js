require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Starting email test...');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'Set (masked)' : 'Not set');

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
    console.error('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection verified and ready to send emails');
    
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
        console.error('Test email sending failed:', err);
      } else {
        console.log('Test email sent successfully:', info);
      }
    });
  }
});
