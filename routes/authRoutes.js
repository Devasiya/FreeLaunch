const express = require("express");
const jwt = require("jsonwebtoken");
const Client = require("../models/client");
const Freelancer = require("../models/freelancer");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();

//  GET: Client Registration Page
router.get("/register/client", (req, res) => {
    res.render("clientRegister", {
        title: "Client Registration",
        messages: {
            success: req.flash("success"),
            error: req.flash("error"),
        },
    });
});

// POST: Register Client
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
        console.error(" Error Registering Client:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/auth/register/client");
    }
});

//  GET: Freelancer Registration Page
router.get("/register/freelancer", (req, res) => {
    res.render("freelancerRegister", {
        title: "Freelancer Registration",
        messages: {
            success: req.flash("success"),
            error: req.flash("error"),
        },
    });
});

//  POST: Register Freelancer
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
        console.error("Error Registering Freelancer:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/auth/register/freelancer");
    }
});

//  GET: Login Page
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        messages: {
            success: req.flash("success"),
            error: req.flash("error"),
        },
    });
});

// ⬇ POST: Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash("error", info.message || "Invalid email or password!");
            return res.redirect("/auth/login");
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            req.session.userId = user._id; // Assuming user._id is the ID of the logged-in user
            req.session.role = user.role; // Assuming user.role indicates if the user is a "Client" or "Freelancer"

            console.log("Logged in User:", req.user); // Debug: Check if req.user exists
            console.log("Session Before Save:", req.session); // Debug: Check session before saving

            req.flash("success", "Login successful!");
            const redirectTo = req.session.returnTo || "/";
            delete req.session.returnTo;

            req.session.save(() => {
                console.log("Session Saved! Redirecting to:", redirectTo); // Debug: Ensure session is saved
                res.redirect(redirectTo);
            });
        });
    })(req, res, next);
});

//  GET: Logout User
router.get("/logout", (req, res) => {
    req.flash("success", "Logged out successfully!"); // Set flash message before destroying session

    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res.redirect("/"); // Redirect instead of crashing
        }

        res.redirect("/auth/login");
    });
});


module.exports = router;