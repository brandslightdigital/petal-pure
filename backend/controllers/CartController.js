const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const { cartId, slug, name, description, price, originalPrice, image, quantity } = req.body;

  if (!cartId) return res.status(400).json({ success: false, message: "cartId is required" });

  try {
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      cart = new Cart({
        cartId,
        items: [{ slug, name, description, price, originalPrice, image, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.slug === slug);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ slug, name, description, price, originalPrice, image, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
   console.error({err}) 
  }
};

exports.getCart = async (req, res) => {
  const { cartId } = req.query;

  if (!cartId) return res.status(400).json({ success: false, message: "cartId is required" });

  try {
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(200).json({ success: true, cart: { items: [] } });
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { cartId, slug, quantity } = req.body;

  if (!cartId || !slug) return res.status(400).json({ success: false, message: "cartId and slug are required" });

  try {
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.slug === slug);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not found" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { cartId } = req.query;
  const { slug } = req.params;

  if (!cartId || !slug) return res.status(400).json({ success: false, message: "cartId and slug are required" });

  try {
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(item => item.slug !== slug);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.clearCart = async (req, res) => {
  try {
    // body se ya query se cartId lo (front/back dono cases handle)
    const cartId = req.body.cartId || req.query.cartId;
    if (!cartId) {
      return res.status(400).json({ success: false, message: 'cartId required' });
    }

    const updated = await Cart.findOneAndUpdate(
      { cartId },
      { $set: { items: [] } },
      { new: true } // upsert mat karo, warna bekaar docs banenge
    );

    // agar cart mila hi nahi to bhi 200 de do, UX smooth
    return res.json({
      success: true,
      cart: updated || { cartId, items: [] }
    });
  } catch (err) {
    console.error('clearCart error:', err);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

