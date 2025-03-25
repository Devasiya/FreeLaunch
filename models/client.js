const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const clientSchema = new mongoose.Schema({
    firstName: { type: String, required: false }, // Optional
    lastName: { type: String, required: false }, // Optional
    username: { type: String, unique: true, required: true },
    companyName: { type: String },
    profilePhoto: { type: String }, // Image URL
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    location: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String }
    },
    category: { type: String }, // Industry category
    description: { type: String },
    credits: { type: Number, default: 0 }, // Platform credits
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    phoneNumber: { type: String },
    instagramLink: { type: String },
    linkedInLink: { type: String },
    transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    agreements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agreement" }]
}, { timestamps: true });


clientSchema.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.models.client || mongoose.model("client", clientSchema);
