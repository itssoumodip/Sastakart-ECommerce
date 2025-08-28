const mongoose = require('mongoose');

const gstRateSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please select category'],
    unique: true,
    enum: [
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
    ]
  },
  rate: {
    type: Number,
    required: [true, 'Please enter GST rate'],
    min: 0,
    max: 100,
    default: 18
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GSTRate', gstRateSchema);
