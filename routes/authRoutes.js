const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Client = require("../models/client");
const Freelancer = require("../models/freelancer");
const { validateSignup, clientSchema, freelancerSchema, loginSchema } = require("../middlewares/validation");
const { isAuthenticated } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ⬇️ GET: Client Registration Page
router.get("/register/client", (req, res) => {
    res.render("clientRegister", {
        messages: {
            success: req.flash("success"),
            error: req.flash("error"),
        },
    });
});

// ⬇️ POST: Register Client
router.post("/register/client", validateSignup(clientSchema), async (req, res) => {
    console.log("🔹 Client Registration Route Hit!"); // Debugging log
    console.log("Received Data:", req.body);
});

// router.post("/register/client", validateSignup(clientSchema), async (req, res) => {
//     const session = await User.startSession();
//     session.startTransaction();

//     try {
//         console.log("🔹 Received Request Body:", req.body);

//         const { email, password, username, ...otherDetails } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email }).session(session);
//         if (existingUser) {
//             req.flash("error", "Email is already registered!");
//             await session.abortTransaction();
//             session.endSession();
//             return res.redirect("/register/client");
//         }

//         console.log("✅ Creating User...");
//         const user = new User({ username, email, role: "client" });
//         await User.register(user, password); // Hashes password
//         await user.save({ session });

//         console.log("✅ Creating Client...");
//         const client = new Client({ email, username, ...otherDetails });
//         await client.save({ session });

//         console.log("✅ Linking Client to User...");
//         user.client = client._id;
//         await user.save({ session });

//         await session.commitTransaction();
//         session.endSession();

//         req.flash("success", "Client registered successfully!");
//         res.redirect("/login");
//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();

//         console.error("❌ Error Registering Client:", err);
//         req.flash("error", err.message);
//         res.redirect("/register/client");
//     }
// });

// ⬇️ GET: Freelancer Registration Page
router.get("/register/freelancer", (req, res) => {
    res.render("freelancerRegister", { success: req.flash("success"), error: req.flash("error") });
});

// ⬇️ POST: Register Freelancer
router.post("/register/freelancer", validateSignup(freelancerSchema), async (req, res) => {
    const session = await User.startSession();
    session.startTransaction();

    try {
        console.log("🔹 Received Request Body:", req.body);

        const { email, password, username, ...otherDetails } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            req.flash("error", "Email is already registered!");
            await session.abortTransaction();
            session.endSession();
            return res.redirect("/register/freelancer");
        }

        console.log("✅ Creating User...");
        const user = new User({ username, email, role: "freelancer" });
        await User.register(user, password); // Hashes password
        await user.save({ session });

        console.log("✅ Creating Freelancer...");
        const freelancer = new Freelancer({ email, username, ...otherDetails });
        await freelancer.save({ session });

        console.log("✅ Linking Freelancer to User...");
        user.freelancer = freelancer._id;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        req.flash("success", "Freelancer registered successfully!");
        res.redirect("/login");
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error("❌ Error Registering Freelancer:", err);
        req.flash("error", err.message);
        res.redirect("/register/freelancer");
    }
});

// ⬇️ GET: Login Page
router.get("/login", (req, res) => {
    res.render("login", { success: req.flash("success"), error: req.flash("error") });
});

router.post("/login", validateSignup(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/login");
        }

        // Verify password (if using passport-local-mongoose)
        const isMatch = await user.authenticate(password);
        if (!isMatch) {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/login");
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Store JWT in session or send to frontend
        req.session.token = token; // If using sessions

        req.flash("success", "Login successful!");
        res.redirect("/dashboard"); // Redirect to dashboard or homepage

    } catch (err) {
        console.error("❌ Login Error:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/login");
    }
});

// ⬇️ GET: Logout User
router.get("/logout", (req, res) => {
    req.session.token = null; // Remove token if using sessions
    req.flash("success", "Logged out successfully!");
    res.redirect("/login");
});


module.exports = router;
