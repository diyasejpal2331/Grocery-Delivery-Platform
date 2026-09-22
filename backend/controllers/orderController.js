const Order = require("../models/Order");
const Product = require("../models/Product");

// CREATE ORDER
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        const rawItems = orderItems || items || [];

        if (!rawItems || rawItems.length === 0) {
            return res.status(400).json({
                message: "No order items"
            });
        }

        const formattedOrderItems = rawItems.map((item) => ({
            product: item.product?._id || item.product || item.id,
            name: item.name || item.product?.name || "Grocery Item",
            quantity: Number(item.quantity || 1),
            price: Number(item.price || item.product?.price || 0),
            image: item.image || item.product?.image || ""
        }));

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || (!shippingAddress.street && !shippingAddress.address) || (!shippingAddress.pincode && !shippingAddress.postalCode)) {
            return res.status(400).json({
                message: "Please provide complete delivery address details (Full Name, Phone, Street, and Pincode)."
            });
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(String(shippingAddress.phone).trim())) {
            return res.status(400).json({
                message: "Please enter a valid 10-digit mobile phone number for delivery."
            });
        }

        const pincodeRegex = /^[0-9]{6}$/;
        const providedPincode = String(shippingAddress.pincode || shippingAddress.postalCode).trim();
        if (!pincodeRegex.test(providedPincode)) {
            return res.status(400).json({
                message: "Please enter a valid 6-digit postal pincode."
            });
        }

        const formattedAddress = {
            fullName: shippingAddress?.fullName || req.user?.name || "Customer",
            phone: shippingAddress?.phone || req.user?.phone || "N/A",
            street: shippingAddress?.street || shippingAddress?.address || "",
            address: shippingAddress?.address || shippingAddress?.street || "",
            city: shippingAddress?.city || "",
            state: shippingAddress?.state || "",
            pincode: shippingAddress?.pincode || shippingAddress?.postalCode || "",
            postalCode: shippingAddress?.postalCode || shippingAddress?.pincode || ""
        };

        const order = await Order.create({
            user: req.user._id,
            orderItems: formattedOrderItems,
            shippingAddress: formattedAddress,
            paymentMethod: paymentMethod || "COD",
            itemsPrice: itemsPrice || 0,
            shippingPrice: shippingPrice || 0,
            totalPrice: totalPrice || 0,
            status: "Processing",
            orderStatus: "Processing"
        });

        // Reduce stock for valid ObjectIds
        const mongoose = require("mongoose");
        for (const item of formattedOrderItems) {
            if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    }
                );
            }
        }

        const createdOrder = await Order
            .findById(order._id)
            .populate("user", "name email phone");

        const doc = createdOrder.toObject();
        res.status(201).json({
            ...doc,
            status: doc.status || doc.orderStatus || "Processing"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// MY ORDERS
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order
            .find({ user: req.user._id })
            .sort({ createdAt: -1 });

        const normalized = orders.map((o) => {
            const doc = o.toObject();
            return {
                ...doc,
                status: doc.status || doc.orderStatus || "Processing"
            };
        });

        res.json(normalized);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL ORDERS - ADMIN
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order
            .find({})
            .populate("user", "name email phone role")
            .sort({ createdAt: -1 });

        const normalized = orders.map((o) => {
            const doc = o.toObject();
            return {
                ...doc,
                status: doc.status || doc.orderStatus || "Processing"
            };
        });

        res.json(normalized);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE ORDER STATUS - ADMIN
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus = status || order.orderStatus;
        order.status = status || order.status;
        if (status === "Delivered") {
            order.isPaid = true;
            order.paidAt = new Date();
        }

        const updatedOrder = await order.save();
        const populatedOrder = await Order.findById(updatedOrder._id).populate("user", "name email phone role");
        const doc = (populatedOrder || updatedOrder).toObject();

        res.json({
            ...doc,
            status: doc.status || doc.orderStatus || "Processing"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ORDER BY ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const mongoose = require("mongoose");

        let order = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            order = await Order.findById(id).populate("user", "name email phone");
        }
        if (!order) {
            order = await Order.findOne({ _id: id }).populate("user", "name email phone");
        }

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const orderUserId = (order.user && order.user._id ? order.user._id : order.user).toString();
        const reqUserId = (req.user && req.user._id ? req.user._id : req.user).toString();
        const isAdmin = req.user && (req.user.role === "admin" || req.user.isAdmin);

        if (orderUserId !== reqUserId && !isAdmin) {
            return res.status(403).json({
                message: "Not authorized to view this order"
            });
        }

        const doc = order.toObject();
        res.json({
            ...doc,
            status: doc.status || doc.orderStatus || "Processing"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};