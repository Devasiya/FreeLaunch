const express = require("express");
const Client = require("../models/client");
const { isAuthenticated } = require("../middlewares/authMiddlewares");
const Project = require("../models/projects");

const router = express.Router();

// ⬇️ GET: Show all clients (Render EJS Page)
router.get("/", async (req, res) => {
    try {
        const clients = await Client.find({});
        res.render("clients/index", { clients, title: "All Clients" }); // Render the EJS page
    } catch (err) {
        req.flash("error", "Error fetching clients");
        res.redirect("/");
    }
});

//single client
router.get("/:id", async (req, res) => {
    try {
        console.log("🔹 Requested Client ID:", req.params.id); // Debugging

        const client = await Client.findById(req.params.id);
        if (!client) {
            console.log("❌ Client Not Found"); // Debugging
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }

        res.render("clients/show", { client, title: `${client.firstName} ${client.lastName}` });
    } catch (err) {
        console.error("❌ Error Fetching Client:", err);
        req.flash("error", "Error fetching client details");
        res.redirect("/api/clients");
    }
});

//client edit form
router.get("/:id/edit", async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }
        res.render("clients/edit", { client, title: "Edit Client" });
    } catch (err) {
        req.flash("error", "Error loading edit page");
        res.redirect("/api/clients");
    }
});

//full update
router.put("/:id", isAuthenticated, async (req, res) => {
    try {
        const clientId = req.params.id;
        const loggedInUserId = req.user._id; // Assuming user ID is stored in req.user after authentication

        // Check if the logged-in user is the same client who owns this profile
        if (clientId !== loggedInUserId.toString()) {
            req.flash("error", "Unauthorized access!");
            return res.redirect("/api/clients");
        }

        const {
            firstName, lastName, username, companyName, profilePhoto, email, password,
            category, description, phoneNumber, instagramLink, linkedInLink,
            city, state, country, pincode
        } = req.body;

        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            {
                firstName, lastName, username, companyName, profilePhoto, email, password,
                category, description, phoneNumber, instagramLink, linkedInLink,
                location: { city, state, country, pincode }
            },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }

        req.flash("success", "Client updated successfully");
        res.redirect(`/api/clients/${clientId}`);
    } catch (err) {
        console.error("Error Updating Client:", err);
        req.flash("error", "Error updating client details");
        res.redirect("/api/clients");
    }
});



router.get("/:id/projects", async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate("projects");
        if (!client) {
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }
        // ✅ Pass client and client.projects correctly
        res.render("clients/projects", { client, projects: client.projects });
    } catch (err) {
        console.error("❌ Error Fetching Projects:", err);
        req.flash("error", "Error fetching client projects");
        res.redirect("/api/clients");
    }
});


module.exports = router;