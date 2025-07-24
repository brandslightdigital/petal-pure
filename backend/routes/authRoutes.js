const express = require("express");

const authRouter = require("../controllers/authController");

const router = express.Router();
router.use("/auth", authRouter); // Admin authentication routes

module.exports = router;
