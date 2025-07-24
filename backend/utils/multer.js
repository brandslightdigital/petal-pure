// utils/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Utility to auto-create folder if not exists
const ensureUploadPath = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `uploads/global/${folder}`;
      ensureUploadPath(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

const logoUploader = multer({ storage: storage("logo") });
const faviconUploader = multer({ storage: storage("favicon") });

// ✅ Combined uploader
const globalUploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const fieldMap = {
        logo: "uploads/global/logo",
        favicon: "uploads/global/favicon",
      };
      const uploadPath = fieldMap[file.fieldname] || "uploads/global/misc";
      ensureUploadPath(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  }),
});

module.exports = {
  logoUploader,
  faviconUploader,
  globalUploader,
};
