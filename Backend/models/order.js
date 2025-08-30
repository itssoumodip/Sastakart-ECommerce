const mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    },
    phoneNo: {
      type: String,
      required: true
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      gstRate: {
        type: Number,
        required: true,
        default: 18
      },
      gstAmount: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ],  paymentInfo: {
    id: {
      type: String,
      required: function() {
        // Only required for card and phonepe payments
        return this.paymentMethod !== 'cod';
      }
    },
    status: {
      type: String,
      required: true,
      default: 'pending'
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'cod', 'phonepe'],
    default: 'card'
  },
  codAmount: {
    type: Number,
    default: 0
  },
  paidAt: {
    type: Date,
    required: function() {
      // Only required when payment is already completed
      return this.paymentMethod !== 'cod' && this.paymentInfo?.status === 'completed';
    }
  },
  codCollectedAt: {
    type: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },  orderStatus: {
    type: String,
    required: true,
    default: 'Processing',
    enum: {
      values: ['Pending', 'Processing', 'Out_For_Delivery', 'Delivered', 'Cancelled', 'COD_Pending', 'COD_Collected'],
      message: 'Please select correct order status'
    }
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    note: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  gstSummary: {
    totalGstAmount: {
      type: Number,
      required: true,
      default: 0
    },
    categoryWiseGst: {
      type: Map,
      of: Number,
      default: {}
    },
    invoiceNumber: {
      type: String,
      default: function() {
        // Generate a unique invoice number if one isn't provided
        return 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      }
    }
  },
});

// Add pre-save hook to ensure payment info validation
orderSchema.pre('save', function(next) {
  // If payment method is not COD, ensure paymentInfo.id is set
  if (this.paymentMethod !== 'cod' && (!this.paymentInfo || !this.paymentInfo.id)) {
    logger.error('Missing paymentInfo.id for non-COD payment');
    return next(new ErrorHandler('Payment information ID is required for non-COD orders', 400));
  }
  
  // Log validation check
  logger.debug(`Order pre-save validation: Payment method=${this.paymentMethod}, Payment ID=${this.paymentInfo?.id}`);
  
  next();
});

module.exports = mongoose.model('Order', orderSchema);
