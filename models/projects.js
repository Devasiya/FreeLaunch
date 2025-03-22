const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["Open", "In Progress", "Completed", "Cancelled"], default: "Open" },
    categories: [String], // Array of categories
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    agreement: { type: mongoose.Schema.Types.ObjectId, ref: "Agreement" }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
