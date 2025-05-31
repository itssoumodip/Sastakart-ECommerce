const cloudinary = require('../utils/cloudinary');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Test authentication => /api/upload/test
exports.testAuth = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Authentication working',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Upload product images => /api/upload/products/upload
exports.uploadProductImages = catchAsyncErrors(async (req, res, next) => {
  console.log('Upload request received');
  console.log('Request body keys:', Object.keys(req.body));
  console.log('User:', req.user ? req.user.email : 'No user');
  
  if (!req.body.images) {
    console.log('No images provided in request body');
    return next(new ErrorHandler('Please provide image files', 400));
  }

  console.log('Number of images to upload:', req.body.images.length);

  const uploadPromises = req.body.images.map(async (base64Image, index) => {
    try {
      console.log(`Uploading image ${index + 1}`);
      
      // Skip if the image is already a URL (already uploaded)
      if (base64Image.startsWith('http')) {
        console.log(`Image ${index + 1} is already a URL, skipping upload`);
        return base64Image;
      }

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'ecommerce/products',
        transformation: [
          { width: 800, crop: "scale" },
          { quality: "auto:best" },
        ]
      });
      
      console.log(`Image ${index + 1} uploaded successfully:`, result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error(`Error uploading image ${index + 1}:`, error);
      throw error;
    }
  });

  const uploadedImageUrls = await Promise.all(uploadPromises);
  console.log('All images uploaded successfully:', uploadedImageUrls);

  res.status(200).json({
    success: true,
    images: uploadedImageUrls
  });
});
