const User = require('../models/user');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Get all users (Admin only) => /api/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

// Get user details (Admin only) => /api/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Update user profile (Admin only) => /api/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  if (!user) {
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Delete user (Admin only) => /api/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get current user profile => /api/users/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// Update current user profile => /api/users/profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    name: `${req.body.firstName} ${req.body.lastName}`, // Keep backward compatibility
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    country: req.body.country
  };

  // Remove undefined values
  Object.keys(newUserData).forEach(key => {
    if (newUserData[key] === undefined) {
      delete newUserData[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    user
  });
});

// Update user password => /api/users/password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.currentPassword);
  if (!isMatched) {
    return next(new ErrorHandler('Current password is incorrect', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});
