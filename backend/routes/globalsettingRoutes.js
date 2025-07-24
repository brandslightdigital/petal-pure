const express = require("express");
const router = express.Router();
const controller = require("../controllers/globalsettingController");
const { globalUploader } = require("../utils/multer");

router.get("/", controller.getSettings);

// ✅ Use combined uploader for logo & favicon
router.post("/update", globalUploader.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]), controller.updateSettings);

module.exports = router;
