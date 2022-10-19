const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const TxnMonetizationSchema = new Schema({
    refNumber: {
        type: String,
        required: [true, "refNumber  is required"]
    },
    amount: {
        type: String,
        required: [true, "amount is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, options);

module.exports = TxnMonetization = mongoose.model("txn-monetizations", TxnMonetizationSchema);
