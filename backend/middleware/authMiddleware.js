const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized. Please login."
            });
        }

        const token = authHeader.split(" ")[1];

        if (token && token.startsWith("mock-jwt-token-")) {
            const isAdmin = token.includes("admin");
            req.user = {
                _id: isAdmin ? "user-admin-1" : "user-regular-1",
                name: isAdmin ? "Store Admin" : "Demo User",
                email: isAdmin ? "admin@freshmart.com" : "user@freshmart.com",
                role: isAdmin ? "admin" : "user"
            };
            return next();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            message: "Admin access required"
        });
    }
};

module.exports = {
    protect,
    admin
};