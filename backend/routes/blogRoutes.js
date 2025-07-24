const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  getBlogsAdmin,
  getBlogById,
  getBlogBySlug,
} = require("../controllers/blogController");

const { adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: "uploads/blogs/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Blog routes
router.post("/", adminAuth, createBlog);
router.get("/", getBlogs);
router.put("/:id", adminAuth, updateBlog);
router.delete("/:id", adminAuth, deleteBlog);
router.get("/admin/", getBlogsAdmin);
router.get("/blogs/:id", getBlogById);
router.get("/slug/:slug", getBlogBySlug);

// ✅ Image upload route for React Quill
router.post(
  "/upload-image",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image uploaded" });
      }
      res.json({
        success: true,
        url: `/uploads/blogs/${req.file.filename}`, // changed imageUrl → url for consistency
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: error.message || "Upload error" });
    }
  }
);

module.exports = router;
