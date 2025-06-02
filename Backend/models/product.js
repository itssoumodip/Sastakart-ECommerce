const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [8, 'Price cannot exceed 8 characters'],
    default: 0.0
  },
  discountPrice: {
    type: Number,
    maxLength: [8, 'Discount price cannot exceed 8 characters'],
    default: 0.0
  },
  images: [
    {
      type: String,
      required: true
    }
  ],  category: {
    type: String,
    required: [true, 'Please select category for this product'],
    enum: {
      values: [
        'Electronics',
        'Clothing',
        'Home & Kitchen',
        'Beauty & Personal Care',
        'Books',
        'Sports & Outdoors',
        'Toys & Games',
        'Health & Wellness',
        'Jewelry',
        'Automotive',
        'Others'
      ],
      message: 'Please select correct category'
    }
  },  subcategory: {
    type: String,
  },
  productType: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    required: [true, 'Please enter product brand']
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Stock cannot exceed 5 characters'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  features: [
    {
      type: String
    }
  ],
  specifications: {
    type: Map,
    of: String
  },
  tags: [
    {
      type: String
    }
  ],
  gstRate: {
    type: Number,
    default: 18, // Default 18% GST
    min: 0,
    max: 28
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
