const express = require("express");
const jwt = require("jsonwebtoken");
const Client = require("../models/client");
const Freelancer = require("../models/freelancer");
const bcrypt = require("bcrypt");

const router = express.Router();

// ⬇️ GET: Client Registration Page
router.get("/register/client", (req, res) => {
    res.render("clientRegister", {
        title: "Client Registration",
        messages: {
            success: req.flash("success"),
            error: req.flash("error"),
        },
    });
});

// ⬇️ POST: Register Client
router.post("/register/client", async (req, res) => {
    try {
        console.log("🔹 Received Request Body:", req.body);

        const { email, password, ...otherDetails } = req.body;
        const existingClient = await Client.findOne({ email });

        if (existingClient) {
            req.flash("error", "Email is already registered!");
            return res.redirect("/auth/register/client");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const client = new Client({ ...otherDetails, email, password: hashedPassword });

        await client.save();

        req.flash("success", "Client registered successfully!");
        res.redirect("/auth/login");
    } catch (err) {
        console.error("❌ Error Registering Client:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/auth/register/client");
    }
});

// ⬇️ GET: Freelancer Registration Page
router.get("/register/freelancer", (req, res) => {
    res.render("freelancerRegister", {
        title: "Freelancer Registration",
        messages: {
            success: req.flash("success"),
            error: req.flash("error"),
        },
    });
});

// ⬇️ POST: Register Freelancer
router.post("/register/freelancer", async (req, res) => {
    try {
        console.log("🔹 Received Request Body:", req.body);

        const { email, password, ...otherDetails } = req.body;
        const existingFreelancer = await Freelancer.findOne({ email });

        if (existingFreelancer) {
            req.flash("error", "Email is already registered!");
            return res.redirect("/auth/register/freelancer");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const freelancer = new Freelancer({ ...otherDetails, email, password: hashedPassword });

        await freelancer.save();

        req.flash("success", "Freelancer registered successfully!");
        res.redirect("/auth/login");
    } catch (err) {
        console.error("❌ Error Registering Freelancer:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/auth/register/freelancer");
    }
});

// ⬇️ GET: Login Page
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        messages: {
            success: req.flash("success"),
            error: req.flash("error"),
        },
    });
});

// ⬇️ POST: Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await Client.findOne({ email }) || await Freelancer.findOne({ email });

        if (!user) {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/auth/login");
        }

        if (!user.password) {
            req.flash("error", "Password is missing for this user.");
            return res.redirect("/auth/login");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/auth/login");
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        req.session.token = token;
        req.flash("success", "Login successful!");
        res.redirect("/");
    } catch (err) {
        console.error("❌ Login Error:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/auth/login");
    }
});

// ⬇️ GET: Logout User
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("❌ Logout Error:", err);
            req.flash("error", "Could not log out, please try again.");
        } else {
            req.flash("success", "Logged out successfully!");
        }
        res.redirect("/auth/login");
    });
});

module.exports = router;