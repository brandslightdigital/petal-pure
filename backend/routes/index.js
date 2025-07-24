const express = require("express");
const adminRoutes = require("./authRoutes");
const adminProfileRoutes = require('./adminRoutes')
const cartRoutes = require("./cartRoutes");
const paymentRoutes = require("./paymentRoutes");
const blogRoutes = require("./blogRoutes");
const permissionRoutes = require('./permissionRoutes');
const globalsettingRoutes = require('./globalsettingRoutes');

const router = express.Router();

// User Routes
router.use("/admin", adminRoutes)
router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes)
router.use('/global-setting', globalsettingRoutes)
router.use('/profile', adminProfileRoutes)
router.use('/permissions', permissionRoutes)
router.use("/blogs", blogRoutes)
router.use('/global-setting', globalsettingRoutes)
module.exports = router;