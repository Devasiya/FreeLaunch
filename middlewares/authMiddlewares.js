const passport = require("passport");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user"); // Import user model

async function isAuthenticated(req, res, next) {
    try {
        console.log("🔹 Checking authentication:", req.user); // Debug log

        if (!req.isAuthenticated() || !req.user) { // Ensures `req.user` is not null
            req.session.returnTo = req.originalUrl;
            req.flash("error", "You must be logged in to access this page.");
            return res.redirect("/auth/login");
        }

        next();
    } catch (err) {
        console.error("❌ Authentication Error:", err);
        req.flash("error", "An error occurred.");
        res.redirect("/auth/login");
    }
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