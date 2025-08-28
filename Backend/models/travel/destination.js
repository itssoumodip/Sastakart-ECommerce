const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a destination name'],
    trim: true,
    maxlength: [100, 'Destination name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a destination description'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Please provide the country'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide the city'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  images: [String],
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['beach', 'mountain', 'city', 'countryside', 'historical', 'adventure']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  popularityScore: {
    type: Number,
    default: 0
  },
  priceLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to calculate average rating
destinationSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.numReviews = this.reviews.length;
};

// Method to calculate popularity score
destinationSchema.methods.calculatePopularityScore = function() {
  // Algorithm for popularity: (average rating * 0.7) + (number of reviews * 0.3)
  // This weights both the quality of ratings and the quantity of reviews
  const normalizedReviews = Math.min(this.numReviews / 100, 1); // Normalize number of reviews to 0-1 scale
  this.popularityScore = (this.averageRating / 5 * 0.7) + (normalizedReviews * 0.3);
};

// Pre-save middleware to calculate ratings and popularity
destinationSchema.pre('save', function(next) {
  this.calculateAverageRating();
  this.calculatePopularityScore();
  next();
});

module.exports = mongoose.model('Destination', destinationSchema);
