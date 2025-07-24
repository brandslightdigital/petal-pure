// controllers/globalSettings.js
const Settings = require("../models/globalSetting");
const path = require("path");

exports.getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
    try {
      const data = req.body;
  
      // Handle uploaded files
      if (req.files?.logo?.[0]) {
        data.logoUrl = `/uploads/global/logo/${req.files.logo[0].filename}`;
      }
      if (req.files?.favicon?.[0]) {
        data.faviconUrl = `/uploads/global/favicon/${req.files.favicon[0].filename}`;
      }
  
      let settings = await Settings.findOne();
      if (settings) {
        settings = await Settings.findByIdAndUpdate(settings._id, data, { new: true });
      } else {
        settings = await Settings.create(data);
      }
  
      res.status(200).json({ success: true, settings });
    } catch (error) {
      console.error("Settings update failed:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };