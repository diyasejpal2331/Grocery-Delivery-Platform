const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, admin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "File upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image file to upload",
      });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({
      imageUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
});

module.exports = router;
