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
                    type: mongoose.Schema.Types.Mixed,
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
            fullName: { type: String, default: "" },
            phone: { type: String, default: "" },
            street: { type: String, default: "" },
            address: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            pincode: { type: String, default: "" },
            postalCode: { type: String, default: "" }
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

        status: {
            type: String,
            default: "Processing"
        },

        orderStatus: {
            type: String,
            default: "Processing"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);