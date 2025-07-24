const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const { adminAuth } = require("../middleware/authMiddleware");
const UAParser = require("ua-parser-js");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secure-secret";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Simplified query without populate
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.password) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // User agent parsing
    const userAgent = req.headers["user-agent"] || "Unknown";
    const parser = new UAParser(userAgent);

    const browserData = parser.getBrowser();
    const osData = parser.getOS();
    const deviceType = parser.getDevice().type;

    const browser = browserData.name && browserData.version
      ? `${browserData.name} ${browserData.version}`
      : "Unknown";

    const os = osData.name && osData.version
      ? `${osData.name} ${osData.version}`
      : "Unknown";

    const device = deviceType || "Desktop";

    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0];

    // Save login log
    admin.loginLogs.push({
      loginAt: new Date(),
      browser,
      os,
      device,
      ip,
    });

    await admin.save();

    // Simplified token payload without permissions
    const token = jwt.sign({ 
      id: admin._id, 
      isAdmin: true // Simple flag instead of role/permissions
    }, JWT_SECRET, {
      expiresIn: "7h",
    });

    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
      user: {
        id: admin._id,
        name: admin.name,
        isAdmin: true
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Logout 
// ✅ Logout (Handled on frontend by clearing token)
router.post("/logout", (req, res) => {
  res.status(200).json({ success: true, message: "Logout successful" });
});

// ✅ Protected Admin Route Example (Requires Token)
router.get("/dashboard", adminAuth, (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to Admin Dashboard", admin: req.admin });
});

module.exports = router;