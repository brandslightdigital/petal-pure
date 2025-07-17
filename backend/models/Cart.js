const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartId: {
    type: String,
    required: true,
    unique: true,
  },
items: [
  {
    slug: String,
    name: String,
    description: String,
    price: Number,
    originalPrice: Number, // ✅ must be here
    image: String,
    quantity: Number,
  }
],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart", cartSchema);
