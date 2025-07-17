const express = require("express");
const cartRoutes = require("./cartRoutes");
const paymentRoutes = require("./paymentRoutes");

const router = express.Router();

// User Routes
router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes)
module.exports = router;