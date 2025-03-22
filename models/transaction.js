const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel", required: true }, // Who is paying
    senderModel: { type: String, enum: ["Client", "Freelancer"], required: true }, // Client or Freelancer
    receiver: { type: mongoose.Schema.Types.ObjectId, refPath: "receiverModel", required: true }, // Who is receiving payment
    receiverModel: { type: String, enum: ["Client", "Freelancer"], required: true }, // Client or Freelancer
    amount: { type: Number, required: true }, // Transaction amount
    method: { type: String, enum: ["Crypto", "Bank Transfer", "UPI", "Card"], required: true }, // Payment method
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" }, // Payment status
    transactionHash: { type: String }, // Blockchain transaction reference
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
