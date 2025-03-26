const express = require("express");
const Client = require("../models/client");
const Project = require("../models/projects.js")
const { isLoggedIn } = require("../middlewares/index.js");
const Freelancer = require("../models/freelancer.js");
const mongoose = require('mongoose');

const router = express.Router();

// GET: Show all clients (Render EJS Page)
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
            console.log(" Client Not Found"); // Debugging
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }

        res.render("clients/show", { client, title: `${client.firstName} ${client.lastName}` });
    } catch (err) {
        console.error("Error Fetching Client:", err);
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


// Route to update client details
router.put("/:id", async (req, res) => {
    try {
        const clientId = req.params.id;

        const {
            firstName, lastName, username, companyName, profilePhoto, email, password,
            category, description, phoneNumber, instagramLink, linkedInLink,
            city, state, country, pincode
        } = req.body;

        // Updating the client details
        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            {
                firstName, lastName, username, companyName, profilePhoto, email, password,
                category, description, phoneNumber, instagramLink, linkedInLink,
                location: { city, state, country, pincode }
            },
            { new: true, runValidators: true }
        );

        // If client is not found, show an error message
        if (!updatedClient) {
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }

        // Success message and redirect
        req.flash("success", "Client updated successfully");
        res.redirect(`/api/clients/${clientId}`);
    } catch (err) {
        console.error("Error Updating Client:", err);
        req.flash("error", "Error updating client details");
        res.redirect("/api/clients");
    }
});

// Route to delete a client
router.delete("/:id", async (req, res) => {
    try {
        const clientId = req.params.id;

        const deletedClient = await Client.findByIdAndDelete(clientId);

        if (!deletedClient) {
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }

        req.flash("success", "Client deleted successfully");
        res.redirect("/api/clients");
    } catch (err) {
        console.error("Error Deleting Client:", err);
        req.flash("error", "Error deleting client");
        res.redirect("/api/clients");
    }
});

//PROJECTS
//all the projects
router.get("/:id/projects", async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate("projects");

        if (!client) {
            req.flash("error", "Client not found");
            return res.redirect("/api/clients");
        }

        res.render("clients/projects", {
            client,
            projects: client.projects,
            title: `${client.firstName}'s Projects` // Ensuring title is passed
        });

    } catch (err) {
        console.error("❌ Error Fetching Projects:", err);
        req.flash("error", "Error fetching client projects");
        res.redirect("/api/clients");
    }
});

// GET route to display the "Add New Project" form for a specific client
router.get('/:id/projects/add', (req, res) => {
    const clientId = req.params.id;  // Get client ID from the URL
    res.render('clients/new-project', { clientId });  // Render the add-project form with clientId
});

// POST route to handle adding a new project for a specific client

// POST route to handle adding a new project for a specific client
router.post('/:id/projects/add', async (req, res) => {
    try {
        const clientId = req.params.id;  // Get client ID from URL
        const { title, description, budget, deadline, status } = req.body;

        // Create a new project object
        const newProject = new Project({
            title,
            description,
            budget,
            deadline: new Date(deadline), // Ensure the deadline is a Date object
            status,
            client: clientId // Associate the project with the client
        });

        // Save the new project
        const savedProject = await newProject.save();

        // Find the client and update their projects array
        await Client.findByIdAndUpdate(clientId, {
            $push: { projects: savedProject._id }  // Add the project ID to the client's projects array
        });

        // Redirect to the client's project list
        res.redirect(`/api/clients/${clientId}/projects`);
    } catch (error) {
        console.error('Error creating project:', error);
        req.flash('error', 'Error creating project'); // Use flash messages for user feedback
        res.redirect(`/api/clients/${clientId}/projects/add`); // Redirect back to the form
    }
});

// GET route to render the edit project form
router.get('/:id/projects/:projectId/edit', async (req, res) => {
    try {
        const { id, projectId } = req.params; // id is the client ID
        const project = await Project.findById(projectId);

        if (!project) {
            req.flash('error', 'Project not found');
            return res.redirect(`/api/clients/${id}/projects`);
        }

        // Render the edit form with the project details
        res.render('clients/edit-project', { project, clientId: id });
    } catch (error) {
        console.error('Error fetching project for edit:', error);
        req.flash('error', 'Error fetching project for edit');
        res.redirect(`/api/clients/${req.params.id}/projects`);
    }
});

// POST route to handle updating a project
router.post('/:id/projects/:projectId/edit', async (req, res) => {
    try {
        const { id, projectId } = req.params; // id is the client ID
        const { title, description, budget, deadline, status } = req.body;

        // Update the project with the new details
        await Project.findByIdAndUpdate(projectId, {
            title,
            description,
            budget,
            deadline: new Date(deadline),
            status
        });

        // Redirect to the client's project list
        res.redirect(`/api/clients/${id}/projects`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'Error updating project');
        res.redirect(`/api/clients/${req.params.id}/projects/${req.params.projectId}/edit`);
    }
});

// DELETE route to handle deleting a project
router.delete('/:id/projects/:projectId', async (req, res) => {
    try {
        const { id, projectId } = req.params; // id is the client ID

        // Remove the project from the database
        await Project.findByIdAndDelete(projectId);

        // Optionally, remove the project ID from the client's projects array
        await Client.findByIdAndUpdate(id, {
            $pull: { projects: projectId }  // Remove the project ID from the client's projects array
        });

        // Redirect to the client's project list
        res.redirect(`/api/clients/${id}/projects`);
    } catch (error) {
        console.error('Error deleting project:', error);
        req.flash('error', 'Error deleting project');
        res.redirect(`/api/clients/${req.params.id}/projects`);
    }
});


//END OF REVIEWS

// Route to assign a freelancer to a project
router.post("/:clientId/projects/:projectId/assign-freelancer", async (req, res) => {
    const { projectId } = req.params;
    const { freelancerId } = req.body;

    // Log the incoming projectId and freelancerId
    console.log("Incoming Project ID:", projectId);
    console.log("Incoming Freelancer ID:", freelancerId);

    // Check if projectId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).send("Invalid Project ID");
    }

    try {
        const project = await Project.findByIdAndUpdate(
            projectId,
            { assignedFreelancer: freelancerId },
            { new: true }
        );

        if (!project) {
            return res.status(404).send("Project not found");
        }

        res.status(200).json({ message: "Freelancer assigned successfully", project });
    } catch (error) {
        console.error("Error assigning freelancer:", error);
        res.status(500).send("Error assigning freelancer");
    }
});

// Route to search freelancers under the clients namespace
router.get("/freelancers/search", async (req, res) => {
    const { q } = req.query; // Get the search query

    try {
        const freelancers = await Freelancer.find({
            $or: [
                { firstName: { $regex: q, $options: 'i' } },
                { lastName: { $regex: q, $options: 'i' } }
            ]
        }).select('_id firstName lastName'); // Select only necessary fields

        res.json(freelancers);
    } catch (error) {
        console.error("Error fetching freelancers:", error);
        res.status(500).send("Error fetching freelancers");
    }
});

// Route to earn referral credits
router.post('/:clientId/earn-referral-credits', async (req, res) => {
    try {
        await CreditService.earnReferralCreditsForClient(req.params.clientId);
        res.status(200).send("Referral credits earned successfully.");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Route to post a project
router.post('/:clientId/post-project', async (req, res) => {
    const { projectCost } = req.body;
    try {
        await CreditService.postProject(req.params.clientId, projectCost);
        res.status(200).send("Project posted successfully.");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;