const mongoose = require('mongoose');

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
      }
    }
  ],  paymentInfo: {
    id: {
      type: String,
      required: function() {
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
    enum: ['card', 'cod'],
    default: 'card'
  },
  codAmount: {
    type: Number,
    default: 0
  },
  paidAt: {
    type: Date,
    required: function() {
      return this.paymentMethod !== 'cod';
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
  }
});

module.exports = mongoose.model('Order', orderSchema);
