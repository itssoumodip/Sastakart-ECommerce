const Destination = require('../../models/travel/destination');
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

// Get all destinations
exports.getAllDestinations = catchAsyncErrors(async (req, res, next) => {
  const destinations = await Destination.find();
  
  res.status(200).json({
    success: true,
    count: destinations.length,
    destinations
  });
});

// Get popular destinations
exports.getPopularDestinations = catchAsyncErrors(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;
  const destinations = await Destination.find()
    .sort({ popularityScore: -1 })
    .limit(limit);
  
  res.status(200).json({
    success: true,
    count: destinations.length,
    destinations
  });
});

// Get destinations by category
exports.getDestinationsByCategory = catchAsyncErrors(async (req, res, next) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const destinations = await Destination.find({ category })
    .sort({ popularityScore: -1 })
    .limit(limit);
  
  res.status(200).json({
    success: true,
    count: destinations.length,
    destinations
  });
});

// Get single destination
exports.getDestination = catchAsyncErrors(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return next(new ErrorHandler('Destination not found', 404));
  }
  
  res.status(200).json({
    success: true,
    destination
  });
});

// Create new destination
exports.createDestination = catchAsyncErrors(async (req, res, next) => {
  const destination = await Destination.create(req.body);
  
  res.status(201).json({
    success: true,
    destination
  });
});

// Update destination
exports.updateDestination = catchAsyncErrors(async (req, res, next) => {
  let destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return next(new ErrorHandler('Destination not found', 404));
  }
  
  destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    destination
  });
});

// Delete destination
exports.deleteDestination = catchAsyncErrors(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return next(new ErrorHandler('Destination not found', 404));
  }
  
  await destination.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Destination deleted successfully'
  });
});

// Add review to destination
exports.addReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return next(new ErrorHandler('Destination not found', 404));
  }
  
  // Check if user already reviewed
  const alreadyReviewed = destination.reviews.find(
    review => review.userId.toString() === req.user._id.toString()
  );
  
  if (alreadyReviewed) {
    return next(new ErrorHandler('You have already reviewed this destination', 400));
  }
  
  const review = {
    userId: req.user._id,
    rating: Number(rating),
    comment
  };
  
  destination.reviews.push(review);
  
  // Calculate averageRating and popularityScore
  destination.calculateAverageRating();
  destination.calculatePopularityScore();
  
  await destination.save();
  
  res.status(201).json({
    success: true,
    destination
  });
});

// Update review
exports.updateReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return next(new ErrorHandler('Destination not found', 404));
  }
  
  // Find user's review
  const reviewIndex = destination.reviews.findIndex(
    review => review.userId.toString() === req.user._id.toString()
  );
  
  if (reviewIndex === -1) {
    return next(new ErrorHandler('Review not found', 404));
  }
  
  // Update the review
  destination.reviews[reviewIndex].rating = Number(rating);
  destination.reviews[reviewIndex].comment = comment;
  
  // Calculate averageRating and popularityScore
  destination.calculateAverageRating();
  destination.calculatePopularityScore();
  
  await destination.save();
  
  res.status(200).json({
    success: true,
    destination
  });
});

// Delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return next(new ErrorHandler('Destination not found', 404));
  }
  
  // Filter out user's review
  destination.reviews = destination.reviews.filter(
    review => review.userId.toString() !== req.user._id.toString()
  );
  
  // Calculate averageRating and popularityScore
  destination.calculateAverageRating();
  destination.calculatePopularityScore();
  
  await destination.save();
  
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});
