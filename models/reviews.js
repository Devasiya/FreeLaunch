const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, min: 1, max: 5, required: true }, // Star rating (1 to 5)
    comment: { type: String }, // Optional feedback text
    reviewer: { type: mongoose.Schema.Types.ObjectId, refPath: "reviewerModel" }, // Who gave the review
    reviewerModel: { type: String, enum: ["Client", "Freelancer"] }, // Only Clients can give reviews
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true }, // The freelancer receiving the review
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
