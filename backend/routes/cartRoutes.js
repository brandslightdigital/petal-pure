const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/CartController");

router.post("/add", addToCart);
router.get("/", getCart);
router.put("/update", updateCartItem);
router.delete("/remove/:slug", removeCartItem);
router.post("/cart/clear", clearCart);

module.exports = router;
