const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Client = require("../models/client");
const Freelancer = require("../models/freelancer");
const { validateClientSignup, validateFreelancerSignup, validateLogin } = require("../middlewares/validation");
const { isAuthenticated } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ⬇️ GET: Client Registration Page
router.get("/register/client", validateClientSignup, (req, res) => {
    res.render("clientRegister", { success: req.flash("success"), error: req.flash("error") });
});

router.post("/register/client", async (req, res) => {
    try {
        console.log("🔹 Received Request Body:", req.body); // Check incoming data

        const { email, password, username, ...otherDetails } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email is already registered!");
            return res.redirect("/register/client");
        }

        console.log("✅ Creating User...");
        const user = new User({ username, email, role: "client" });
        await User.register(user, password); // Passport handles password hashing

        console.log("✅ Creating Client...");
        const client = new Client({ email, username, ...otherDetails });
        await client.save();

        console.log("✅ Linking Client to User...");
        user.client = client._id;
        await user.save();

        req.flash("success", "Client registered successfully!");
        res.redirect("/login");
    } catch (err) {
        console.error("❌ Error Registering Client:", err);
        req.flash("error", err.message);
        res.redirect("/register/client");
    }
});


// ⬇️ GET: Freelancer Registration Page
router.get("/register/freelancer", (req, res) => {
    res.render("freelancerRegister", { success: req.flash("success"), error: req.flash("error") });
});

// ⬇️ POST: Register Freelancer
router.post("/register/freelancer", validateFreelancerSignup, async (req, res) => {
    try {
        const { email, password, username, ...otherDetails } = req.body;

        // Create User
        const user = new User({ username, email, role: "freelancer" });
        await User.register(user, password);

        // Create Freelancer and link to User
        const freelancer = new Freelancer({ email, username, ...otherDetails });
        await freelancer.save();

        user.freelancer = freelancer._id;
        await user.save();

        req.flash("success", "Freelancer registered successfully!");
        res.redirect("/login");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register/freelancer");
    }
});

// ⬇️ GET: Login Page
router.get("/login", (req, res) => {
    res.render("login", { success: req.flash("success"), error: req.flash("error") });
});

// ⬇️ POST: Login (for both Client & Freelancer)
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    session: false // Disable session since JWT is used
}), async (req, res) => {
    let userData = null;

    if (req.user.role === "client" && req.user.client) {
        userData = await Client.findById(req.user.client);
    } else if (req.user.role === "freelancer" && req.user.freelancer) {
        userData = await Freelancer.findById(req.user.freelancer);
    }

    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    req.flash("success", "Login successful!");
    res.redirect("/");
});

// ⬇️ GET: Logged-in User Details
router.get("/me", isAuthenticated, async (req, res) => {
    let userData = null;

    if (req.user.role === "client" && req.user.client) {
        userData = await Client.findById(req.user.client);
    } else if (req.user.role === "freelancer" && req.user.freelancer) {
        userData = await Freelancer.findById(req.user.freelancer);
    }

    res.json({ user: req.user, details: userData });
});

// ⬇️ GET: Logout User
router.get("/logout", (req, res) => {
    req.logout();
    res.clearCookie("token");
    req.flash("success", "Logged out successfully!");
    res.redirect("/login");
});

module.exports = router;
