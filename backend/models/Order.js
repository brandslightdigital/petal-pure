// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  signature: String,
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
