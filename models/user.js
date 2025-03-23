const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ["client", "freelancer"], required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, // Reference to Client (if role is client)
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer" } // Reference to Freelancer (if role is freelancer)
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);