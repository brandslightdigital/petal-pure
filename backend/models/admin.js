const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Login log schema (unchanged)
const loginSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  browser: { type: String },
  os: { type: String },
  device: { type: String },
  ip: { type: String },
});

// Simplified admin schema without role/permissions
const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String 
  },
  contactNumber: { 
    type: String 
  },
  avatar: { 
    type: String 
  },
  dob: { 
    type: Date 
  },
  address: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isAdmin: {  // Simple admin flag instead of role system
    type: Boolean,
    default: true
  },
  loginLogs: [loginSchema], // Login history
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware (unchanged)
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Admin", adminSchema);