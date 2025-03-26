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
const multer = require("multer");

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// Add this to your route to handle file uploads
router.post("/register/client", upload.single("profilePhoto"), async (req, res) => {
    try {
        console.log("🔹 Received Request Body:", req.body);
        console.log("📸 Received File:", req.file);

        const { email, password, ...otherDetails } = req.body;
        const existingClient = await Client.findOne({ email });

        if (existingClient) {
            req.flash("error", "Email is already registered!");
            return res.redirect("/auth/register/client");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Include profile photo if uploaded
        const profilePhotoUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const client = new Client({
            ...otherDetails,
            email,
            password: hashedPassword,
            profilePhoto: profilePhotoUrl,
        });

        await client.save();

        req.flash("success", "Client registered successfully!");
        res.redirect("/auth/login");
    } catch (err) {
        console.error("❌ Error Registering Client:", err);
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
// ✅ POST: Register Freelancer with Profile Photo Upload
router.post("/register/freelancer", upload.single("profilePhoto"), async (req, res) => {
    try {
        console.log("🔹 Received Request Body:", req.body);
        console.log("📸 Received File:", req.file);

        const { email, password, ...otherDetails } = req.body;
        const existingFreelancer = await Freelancer.findOne({ email });

        // ❌ Check if email is already registered
        if (existingFreelancer) {
            req.flash("error", "Email is already registered!");
            return res.redirect("/auth/register/freelancer");
        }

        // 🔒 Hash password before storing in DB
        const hashedPassword = await bcrypt.hash(password, 10);

        // 📸 Include profile photo URL if uploaded
        const profilePhotoUrl = req.file ? `/uploads/${req.file.filename}` : "";

        // ✅ Create Freelancer object
        const freelancer = new Freelancer({
            ...otherDetails,
            email,
            password: hashedPassword,
            profilePhoto: profilePhotoUrl,
        });

        // Save freelancer to DB
        await freelancer.save();

        req.flash("success", "Freelancer registered successfully!");
        res.redirect("/auth/login");
    } catch (err) {
        console.error("❌ Error Registering Freelancer:", err);
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