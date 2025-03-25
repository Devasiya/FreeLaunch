const { types } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const freelancerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String }, // Image URL
    location: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String }
    },
    experience: { type: String }, // Years of experience
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    description: { type: String },
    credits: { type: Number, default: 0 }, // Platform credits
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    phoneNumber: { type: String },
    instagramLink: { type: String },
    linkedInLink: { type: String },
    skills: [String], // List of skills
    appliedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    earnings: { type: Number, default: 0 },
    transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }]
}, { timestamps: true });

freelancerSchema.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.models.freelancer || mongoose.model("freelancer", freelancerSchema);
