const passport = require("passport");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user"); // Import user model

async function isAuthenticated(req, res, next) {
    console.log("🔹 Session Data:", req.session); // Debugging session
    console.log("🔹 Checking authentication, req.user:", req.user); // Debug req.user

    if (!req.isAuthenticated() || !req.user) { // Ensure `req.user` is not null
        console.log("❌ User not authenticated. Redirecting to login.");
        req.session.returnTo = req.originalUrl; // Store return URL
        req.flash("error", "You must be logged in.");
        return res.redirect("/auth/login");
    }

    console.log("✅ User Authenticated:", req.user);
    next();
}


/**
 * Middleware to check if the user is a client
 */
const isClient = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "client") {
        return next();
    }
    next(new ExpressError(403, "Access Denied: Clients only!"));
};

/**
 * Middleware to check if the user is a freelancer
 */
const isFreelancer = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "freelancer") {
        return next();
    }
    next(new ExpressError(403, "Access Denied: Freelancers only!"));
};


module.exports = { isAuthenticated, isClient, isFreelancer };