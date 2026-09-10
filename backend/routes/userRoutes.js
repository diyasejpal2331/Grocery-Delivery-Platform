const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getUsers
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, admin, getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

module.exports = router;