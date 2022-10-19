const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const PreferencesSchema = new Schema({
    accountId: {
        type: String,
        required: [true, "accountId  is required"]
    },
    title: {
        type: String,
        required: [true, "title is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    price: {
        type: String,
        required: [true, "price is required"]
    },
    quantity: {
        type: String,
        required: [true, "quantity is required"]
    },
    availability: {
        type: Boolean,
        default: true
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

module.exports = Preferences = mongoose.model("laundry-preferences", PreferencesSchema);