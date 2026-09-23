const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
};


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const phoneRegex = /^[0-9]{10}$/;

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        if (!name || !name.trim() || !email || !email.trim() || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!nameRegex.test(trimmedName)) {
            return res.status(400).json({
                message: "Please enter a valid full name (must start with a letter and be at least 2 characters)."
            });
        }

        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address (e.g. user@example.com)."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long."
            });
        }

        if (phone && phone.trim() && !phoneRegex.test(phone.trim())) {
            return res.status(400).json({
                message: "Please enter a valid 10-digit mobile phone number."
            });
        }

        const existingUser = await User.findOne({ email: trimmedEmail });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email address"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let userAddress = { street: "", city: "", state: "", pincode: "" };
        if (address && typeof address === "object") {
            const pincodeStr = address.pincode ? String(address.pincode).trim() : "";
            if (pincodeStr && !/^[0-9]{6}$/.test(pincodeStr)) {
                return res.status(400).json({
                    message: "Please enter a valid 6-digit postal pincode."
                });
            }
            userAddress = {
                street: address.street ? String(address.street).trim() : "",
                city: address.city ? String(address.city).trim() : "",
                state: address.state ? String(address.state).trim() : "",
                pincode: pincodeStr
            };
        } else if (typeof address === "string" && address.trim()) {
            userAddress = address.trim();
        }

        const user = await User.create({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword,
            address: userAddress,
            phone: phone ? phone.trim() : ""
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                phone: user.phone
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter your email and password"
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        const user = await User.findOne({ email: trimmedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                phone: user.phone
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// PROFILE
const getProfile = async (req, res) => {
    res.json(req.user);
};


// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (req.body.name && req.body.name.trim()) {
            const trimmedName = req.body.name.trim();
            if (!nameRegex.test(trimmedName)) {
                return res.status(400).json({
                    message: "Please enter a valid full name."
                });
            }
            user.name = trimmedName;
        }

        if (req.body.phone !== undefined) {
            const trimmedPhone = String(req.body.phone).trim();
            if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
                return res.status(400).json({
                    message: "Please enter a valid 10-digit mobile phone number."
                });
            }
            user.phone = trimmedPhone;
        }

        if (req.body.email && req.body.email.trim()) {
            const trimmedEmail = req.body.email.trim().toLowerCase();
            if (!emailRegex.test(trimmedEmail)) {
                return res.status(400).json({
                    message: "Please enter a valid email address."
                });
            }
            user.email = trimmedEmail;
        }

        if (req.body.address !== undefined) {
            if (req.body.address && typeof req.body.address === "object") {
                const pincodeStr = req.body.address.pincode ? String(req.body.address.pincode).trim() : "";
                if (pincodeStr && !/^[0-9]{6}$/.test(pincodeStr)) {
                    return res.status(400).json({
                        message: "Please enter a valid 6-digit postal pincode."
                    });
                }
                user.address = {
                    street: req.body.address.street ? String(req.body.address.street).trim() : "",
                    city: req.body.address.city ? String(req.body.address.city).trim() : "",
                    state: req.body.address.state ? String(req.body.address.state).trim() : "",
                    pincode: pincodeStr
                };
            } else if (typeof req.body.address === "string") {
                user.address = req.body.address.trim();
            }
        }

        if (req.body.password) {
            if (req.body.password.length < 6) {
                return res.status(400).json({
                    message: "New password must be at least 6 characters long."
                });
            }
            user.password = await bcrypt.hash(
                req.body.password,
                10
            );
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            address: updatedUser.address,
            phone: updatedUser.phone,
            role: updatedUser.role
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL USERS - ADMIN
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getUsers
};