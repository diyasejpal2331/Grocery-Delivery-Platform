const Order = require("../models/Order");
const Product = require("../models/Product");

// CREATE ORDER
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                message: "No order items"
            });
        }

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        });

        // Reduce stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        const createdOrder = await Order
            .findById(order._id)
            .populate("user", "name email");

        res.status(201).json(createdOrder);

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

        res.json(orders);

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
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE ORDER STATUS - ADMIN
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus = req.body.status;

        const updatedOrder = await order.save();

        res.json(updatedOrder);

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
    updateOrderStatus
};