const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto');
const passport = require('../utils/passport');

// Register a user => /api/auth/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, firstName, lastName, email, phone, password } = req.body;

  // Create user with all available fields
  const user = await User.create({
    name,
    firstName,
    lastName,
    email,
    phone,
    password,
    avatar: 'default-avatar.jpg'
  });

  sendToken(user, 201, res);
});

// Login user => /api/auth/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  sendToken(user, 200, res);
});

// Logout user => /api/auth/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  // Use the same cookie options as when setting it, but with immediate expiration
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
  });

  res.status(200).json({
    success: true,
    message: 'Logged out'
  });
});

// Forgot password => /api/auth/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  // Get reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to resetPasswordToken
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expire time
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Create the reset URL
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  
  // Import the email service
  const emailService = require('../utils/emailService');
  
  try {
    // Send the password reset email
    await emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name || user.firstName,
      resetUrl: resetUrl
    });

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    // If email sending fails, reset the token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    return next(new ErrorHandler('Email could not be sent', 500));
  }
});

// Reset password => /api/auth/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(
      new ErrorHandler('Password reset token is invalid or has expired', 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get current user profile => /api/auth/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// Update / Change password => /api/auth/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update user profile => /api/auth/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };

  // In a real application, we would handle avatar upload

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

// Google Authentication callbacks
exports.googleCallback = catchAsyncErrors(async (req, res, next) => {
  // This function will be called after successful Google authentication
  sendToken(req.user, 200, res);
});

// Handle Google Auth verification
exports.verifyGoogleToken = catchAsyncErrors(async (req, res, next) => {
  try {
    const { token } = req.body;
    
    // Verify the token with Google's OAuth2 API
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, given_name, family_name, picture } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, return token
      sendToken(user, 200, res);
    } else {
      // Create new user
      user = await User.create({
        name,
        firstName: given_name,
        lastName: family_name,
        email,
        password: crypto.randomBytes(16).toString('hex'),
        avatar: picture
      });
      
      sendToken(user, 201, res);
    }
  } catch (error) {
    return next(new ErrorHandler('Google authentication failed', 401));
  }
});
