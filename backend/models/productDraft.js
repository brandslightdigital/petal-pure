const mongoose = require('mongoose');

const DraftSchema = new mongoose.Schema({
  cartItems: [{
    productId: String,
    slug: String,
    name: String,
    price: Number,
    originalPrice: Number,
    quantity: Number,
    image: String
  }],
  customer: {
    fullName: String, email: String, phone: String, pincode: String, address: String
  },
  totals: { originalPrice: Number, subtotal: Number, gst: Number, final: Number },
  status: { type: String, enum: ['details_submitted','payment_created','paid','payment_failed'], default: 'details_submitted' },
  cartId: String,
  directBuy: Boolean,
  razorpay_order_id: String,
}, { timestamps: true });

module.exports = mongoose.model('Draft', DraftSchema);
