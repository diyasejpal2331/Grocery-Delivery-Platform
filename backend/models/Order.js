const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                image: {
                    type: String
                }
            }
        ],

        shippingAddress: {
            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            postalCode: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            default: "Razorpay"
        },

        paymentResult: {
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String
        },

        itemsPrice: {
            type: Number,
            required: true
        },

        shippingPrice: {
            type: Number,
            default: 0
        },

        totalPrice: {
            type: Number,
            required: true
        },

        isPaid: {
            type: Boolean,
            default: false
        },

        paidAt: {
            type: Date
        },

        orderStatus: {
            type: String,
            enum: [
                "Processing",
                "Confirmed",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Processing"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);