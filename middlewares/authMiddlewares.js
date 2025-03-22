const passport = require("passport");
const ExpressError = require("../utils/ExpressError");

/**
 * Middleware to check if a user is authenticated
 */
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User is logged in, proceed
    }
    req.flash("error", "You must be logged in first!");
    res.redirect("/auth/login"); // Redirect to login page
};

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
