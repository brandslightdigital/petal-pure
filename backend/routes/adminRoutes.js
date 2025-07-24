const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const { adminAuth } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/admin/avatar");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});
const upload = multer({ storage });

// Get Profile (simplified)
router.get("/profile", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Profile (simplified)
router.put("/profile", adminAuth, upload.single("avatar"), async (req, res) => {
  try {
    const { email, name, contactNumber, dob, address } = req.body;
    const updates = { email, name, contactNumber, dob, address };

    if (req.file) {
      updates.avatar = `/uploads/admin/avatar/${req.file.filename}`;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.json({ success: true, admin: updatedAdmin });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Change Password (unchanged)
router.put("/change-password", adminAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("Password Change Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create New Admin (simplified)
router.post("/create-user", adminAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const newUser = new Admin({ email, password, isAdmin: true });
    await newUser.save();

    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Users (simplified)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await Admin.find()
      .select("email isActive createdAt dob address name contactNumber");
    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update User (simplified)
router.put("/user/:id", adminAuth, async (req, res) => {
  try {
    const { email, password, name, contactNumber } = req.body;

    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) user.email = email;
    if (password) user.password = password;
    if (name) user.name = name;
    if (contactNumber) user.contactNumber = contactNumber;

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle User Active Status (simplified)
router.put("/user/:id/toggle", adminAuth, async (req, res) => {
  try {
    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.error("Toggle Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete User (unchanged)
router.delete("/user/:id", adminAuth, async (req, res) => {
  try {
    const user = await Admin.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get login logs (simplified)
router.get("/login-logs/:id", adminAuth, async (req, res) => {
  try {
    const user = await Admin.findById(req.params.id).select("email loginLogs name");
    if (!user) return res.status(404).json({ message: "User not found" });

    const sortedLogs = (user.loginLogs || []).sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
    res.json({ logs: sortedLogs });
  } catch (err) {
    console.error("Login logs fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;