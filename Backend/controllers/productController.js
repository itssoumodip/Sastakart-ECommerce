const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Get all products => /api/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Search and filter
  const keyword = req.query.search
    ? {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { brand: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  // Category filter
  const category = req.query.category && req.query.category !== 'All Categories' 
    ? { category: req.query.category } 
    : {};
    
  // Price range filter
  const priceFilter = {};
  if (req.query.minPrice) {
    priceFilter.price = { ...priceFilter.price, $gte: Number(req.query.minPrice) };
  }
  if (req.query.maxPrice) {
    priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.maxPrice) };
  }
  
  // Rating filter
  const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};
  
  // Sort
  let sort = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'popular':
        sort = { numReviews: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }  } else {
    sort = { createdAt: -1 };
  }
  
  // Build query
  const query = {
    ...keyword,
    ...category,
    ...priceFilter,
    ...ratingFilter
  };
  
  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    products,
    totalProducts,
    totalPages,
    currentPage: page
  });
});

// Get single product details => /api/products/:id
exports.getProductById = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// Create new product => /api/products
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

// Update product => /api/products/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    product
  });
});

// Delete product => /api/products/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted'
  });
});

// Create/Update product review => /api/products/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    // Update existing review
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
        review.createdAt = Date.now();
      }
    });
  } else {
    // Add new review
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
  }

  // Calculate average rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  });
});

// Get product reviews => /api/products/reviews?id=productId
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate('reviews.user', 'name avatar');

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

// Delete product review => /api/products/reviews?productId=xxx&reviewId=xxx
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Filter out the review to be deleted
  const reviews = product.reviews.filter(
    review => review._id.toString() !== req.query.reviewId.toString()
  );

  // Update number of reviews
  const numReviews = reviews.length;

  // Calculate new average rating
  const rating =
    numReviews === 0
      ? 0
      : reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  // Update product with new reviews
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numReviews
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true
  });
});
