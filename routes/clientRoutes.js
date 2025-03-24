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


module.exports = router;