const Client = require("../models/client");
const Freelancer = require("../models/freelancer");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to perform this action!");
        return res.redirect("/auth/login");
    }
    next();
}

// Middleware to save the original URL if the user isn't logged in
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Middleware to check if the logged-in user is the owner (Client or Freelancer)
module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        let user;

        // Check if the user is a Client or Freelancer and fetch relevant data
        if (req.user instanceof Client) {
            user = await Client.findById(req.user._id);
        } else if (req.user instanceof Freelancer) {
            user = await Freelancer.findById(req.user._id);
        }

        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect("/auth/login");
        }

        // Assuming the user (Client or Freelancer) has a field to check ownership of some data
        // Here, we check if the user owns the item with the given ID
        const isOwner = user.ownedListings.includes(id); // Modify this check according to your schema

        if (!isOwner) {
            req.flash("error", "You are not the owner of this item!");
            return res.redirect(`/items/${id}`); // Redirect to a relevant page (adjust accordingly)
        }

        next(); // Proceed if the user is the owner
    } catch (err) {
        req.flash("error", "Something went wrong while checking ownership.");
        return res.redirect("/items"); // Redirect to a relevant fallback page
    }
}
