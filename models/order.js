const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { paymentMethod, paymentStatus, deliveryType, orderStatus } = require("../const/enum");

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const OrderSchema = new Schema({
    refNumber: {
        type: String,
        required: [true, "refNumber  is required"]
    },
    header: {},
    content: {
        preferences: [],
        totalOfKg: {
            type: Number,
            required: [true, "totalOfKg  is required"]
        },
        description: {
            type: String,
            required: [true, "description is required"]
        },
        delivery: {
            type: {
                type: String,
                enum: deliveryType,
                required: [true, "deliveryType  is required"]
            },
            fee: {
                type: Number,
                required: [true, "fee is required"]
            }
        },
        total: {
            type: Number,
            required: [true, "total  is required"]
        },
        paymentMethod: {
            type: String,
            enum: paymentMethod,
            required: [true, "method is required"]
        },
        paymentStatus: {
            type: String,
            enum: paymentStatus,
            default: "unpaid",
        },
        orderStatus: {
            type: String,
            enum: orderStatus,
            required: [true, "orderStatus is required"]
        },

    },
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
}, options);


module.exports = Order = mongoose.model("orders", OrderSchema);
