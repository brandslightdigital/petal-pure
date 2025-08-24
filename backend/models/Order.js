// models/Order.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: String },
    slug: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },          // unit price actually charged
    originalPrice: { type: Number },                   // MRP or pre-discount
    quantity: { type: Number, default: 1, min: 1 },
    image: { type: String },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    // Razorpay identifiers (null for COD)
    razorpay_order_id: { type: String, default: null },
    razorpay_payment_id: { type: String, default: null },
    razorpay_signature: { type: String, default: null },

    // NEW: how the user is paying
    paymentMethod: {
      type: String,
      enum: ['prepaid', 'cod'],
      default: 'prepaid',
      lowercase: true,
    },

    // NEW: money actually received yet?
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'paid', // prepaid flow = paid, COD = unpaid
      lowercase: true,
    },

    // Overall order lifecycle
    status: {
      type: String,
      enum: [
        'paid',           // prepaid success
        'cod_placed',     // COD placed, to be collected on delivery
        'payment_failed', // gateway failed
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'paid',
      set: v => (typeof v === 'string' ? v.toLowerCase() : v),
    },

    // Grand total charged or due (GST etc. included)
    amount: { type: Number, required: true },

    // Optional breakdown (handy in admin)
    totals: {
      originalPrice: { type: Number },  // sum of MRP*qty
      subtotal: { type: Number },       // sum of price*qty
      gst: { type: Number },
      discount: { type: Number },
      final: { type: Number },          // should match 'amount'
    },

    // What was bought
    cartItems: { type: [CartItemSchema], default: [] },

    // Who buys
    customer: {
      fullName: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
      pincode: { type: String },
      address: { type: String },
    },
  },
  { timestamps: true } // gives createdAt, updatedAt
);

// Helpful indexes for admin filters/search
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentMethod: 1, createdAt: -1 });
OrderSchema.index({ 'customer.phone': 1 });
OrderSchema.index({ 'customer.email': 1 });

module.exports = mongoose.model('Order', OrderSchema);
