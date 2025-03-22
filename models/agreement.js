const mongoose = require("mongoose");

const agreementSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true }, // Client who created the agreement
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true }, // Freelancer involved in the agreement
    terms: { type: String, required: true }, // Contract terms and conditions
    startDate: { type: Date, default: Date.now }, // When the agreement starts
    endDate: { type: Date }, // When the agreement ends
    status: { type: String, enum: ["Active", "Completed", "Terminated"], default: "Active" }, // Agreement status
    blockchainHash: { type: String }, // Blockchain verification hash
}, { timestamps: true });

module.exports = mongoose.model("Agreement", agreementSchema);
