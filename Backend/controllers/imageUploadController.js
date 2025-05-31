const cloudinary = require('../utils/cloudinary');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Upload product images => /api/upload/products/upload
exports.uploadProductImages = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.images) {
    return next(new ErrorHandler('Please provide image files', 400));
  }

  const uploadPromises = req.body.images.map(async (base64Image) => {
    // Skip if the image is already a URL (already uploaded)
    if (base64Image.startsWith('http')) {
      return base64Image;
    }

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'ecommerce/products',
      transformation: [
        { width: 800, crop: "scale" },
        { quality: "auto:best" },
      ]
    });
    return result.secure_url;
  });

  const uploadedImageUrls = await Promise.all(uploadPromises);

  res.status(200).json({
    success: true,
    images: uploadedImageUrls
  });
});
