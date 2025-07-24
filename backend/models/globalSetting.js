const mongoose = require("mongoose");

const GlobalSettingsSchema = new mongoose.Schema({
  logoUrl: String,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
  faviconUrl: String,
  ogImageUrl: String,
  analyticsScript: String,
}, { timestamps: true });

module.exports = mongoose.model("GlobalSettings", GlobalSettingsSchema);
