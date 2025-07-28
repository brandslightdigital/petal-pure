// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  razorpay_order_id: String,  // Changed from 'orderId'
  razorpay_payment_id: String, // Changed from 'paymentId'
  razorpay_signature: String,  // Changed from 'signature'
  amount: Number,
  cartItems: Array,
  customer: {
    fullName: String,
    email: String,
    phone: String,
    pincode: String,
    address: String,
  },
  status: {
    type: String,
    default: 'Paid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
