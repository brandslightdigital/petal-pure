const express = require("express");
const router = express.Router();
const Permission = require("../models/permission");
const { adminAuth } = require("../middleware/authMiddleware");

// ✅ Get all permissions
router.get("/", adminAuth, async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ name: 1 });
    res.json(permissions);
  } catch (err) {
    console.error("Fetch Permissions Error:", err);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
});

router.put("/change-password", adminAuth, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
  
      const admin = await Admin.findById(req.user.id);
      if (!admin) return res.status(404).json({ message: "Admin not found" });
  
      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });
  
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
  
      admin.password = hashed;
      admin.markModified("password"); // ✅ Force Mongoose to consider it changed
      await admin.save();
  
      res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      console.error("Password Change Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  

module.exports = router;
