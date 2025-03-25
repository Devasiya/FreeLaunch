const express = require("express");
const Freelancer = require("../models/freelancer"); // Adjust the path as necessary
const Project = require("../models/projects"); // Adjust the path as necessary
const { isLoggedIn, isOwner } = require("../middlewares/index.js");

const router = express.Router();

// GET: Show all freelancers (Render EJS Page)
router.get("/", async (req, res) => {
    try {
        const freelancers = await Freelancer.find({});
        res.render("freelancers/index", { freelancers, title: "All Freelancers" });
    } catch (err) {
        req.flash("error", "Error fetching freelancers");
        res.redirect("/");
    }
});

// Single freelancer
router.get("/:id", async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.params.id).populate("projects");
        if (!freelancer) {
            req.flash("error", "Freelancer not found");
            return res.redirect("/api/freelancers");
        }

        res.render("freelancers/show", { freelancer, title: `${freelancer.firstName} ${freelancer.lastName}` });
    } catch (err) {
        req.flash("error", "Error fetching freelancer details");
        res.redirect("/api/freelancers");
    }
});

// Freelancer edit form
router.get("/:id/edit", async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.params.id);
        if (!freelancer) {
            req.flash("error", "Freelancer not found");
            return res.redirect("/api/freelancers");
        }
        res.render("freelancers/edit", { freelancer, title: "Edit Freelancer" });
    } catch (err) {
        req.flash("error", "Error loading edit page");
        res.redirect("/api/freelancers");
    }
});

// Route to update freelancer details
router.put("/:id", async (req, res) => {
    try {
        const freelancerId = req.params.id;

        const {
            firstName, lastName, username, email, password,
            profilePhoto, experience, description,
            phoneNumber, instagramLink, linkedInLink, skills,
            city, state, country, pincode
        } = req.body;

        // Prepare the update object
        const updateData = {
            firstName,
            lastName,
            username,
            email,
            profilePhoto,
            experience,
            description,
            phoneNumber,
            instagramLink,
            linkedInLink,
            skills,
            location: { city, state, country, pincode }
        };

        // Only update the password if it is provided
        if (password) {
            updateData.password = password; // This should be hashed if using passport-local-mongoose
        }

        // Updating the freelancer details
        const updatedFreelancer = await Freelancer.findByIdAndUpdate(
            freelancerId,
            updateData,
            { new: true, runValidators: true }
        );

        // If freelancer is not found, show an error message
        if (!updatedFreelancer) {
            req.flash("error", "Freelancer not found");
            return res.redirect("/api/freelancers");
        }

        // Success message and redirect
        req.flash("success", "Freelancer updated successfully");
        res.redirect(`/api/freelancers/${freelancerId}`);
    } catch (err) {
        console.error("Error Updating Freelancer:", err);
        req.flash("error", "Error updating freelancer details");
        res.redirect("/api/freelancers");
    }
});

// Route to delete a freelancer
router.delete("/:id", async (req, res) => {
    try {
        const freelancerId = req.params.id;

        const deletedFreelancer = await Freelancer.findByIdAndDelete(freelancerId);

        if (!deletedFreelancer) {
            req.flash("error", "Freelancer not found");
            return res.redirect("/api/freelancers");
        }

        req.flash("success", "Freelancer deleted successfully");
        res.redirect("/api/freelancers");
    } catch (err) {
        req.flash("error", "Error deleting freelancer");
        res.redirect("/api/freelancers");
    }
});

// PROJECTS
// All projects for a specific freelancer
router.get("/:id/projects", async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.params.id).populate("projects");

        if (!freelancer) {
            req.flash("error", "Freelancer not found");
            return res.redirect("/api/freelancers");
        }

        res.render("freelancers/projects", {
            freelancer,
            projects: freelancer.projects,
            title: `${freelancer.firstName}'s Projects`
        });

    } catch (err) {
        req.flash("error", "Error fetching freelancer projects");
        res.redirect("/api/freelancers");
    }
});

// GET route to display the "Add New Project" form for a specific freelancer
router.get('/:id/projects/add', (req, res) => {
    const freelancerId = req.params.id;  // Get freelancer ID from the URL
    res.render('freelancers/new-project', { freelancerId });  // Render the add-project form with freelancerId
});


router.post('/:id/projects/add', async (req, res) => {
    try {
        const freelancerId = req.params.id;  // Get freelancer ID from URL
        const { title, description, budget, deadline, status } = req.body;

        // Create a new project object
        const newProject = new Project({
            title,
            description,
            budget,
            deadline: new Date(deadline), // Ensure the deadline is a Date object
            status,
            freelancer: freelancerId // Associate the project with the freelancer
        });

        // Save the new project
        const savedProject = await newProject.save();

        // Find the freelancer and update their projects array
        await Freelancer.findByIdAndUpdate(freelancerId, {
            $push: { projects: savedProject._id }  // Add the project ID to the freelancer's projects array
        });

        // Redirect to the freelancer's project list
        res.redirect(`/api/freelancers/${freelancerId}/projects`);
    } catch (error) {
        console.error('Error creating project:', error);
        req.flash('error', 'Error creating project'); // Use flash messages for user feedback
        res.redirect(`/api/freelancers/${freelancerId}/projects/add`); // Redirect back to the form
    }
});

// GET route to render the edit project form for a specific freelancer
router.get('/:id/projects/:projectId/edit', async (req, res) => {
    try {
        const { id, projectId } = req.params; // id is the freelancer ID
        const project = await Project.findById(projectId);

        if (!project) {
            req.flash('error', 'Project not found');
            return res.redirect(`/api/freelancers/${id}/projects`);
        }

        // Render the edit form with the project details
        res.render('freelancers/edit-project', { project, freelancerId: id });
    } catch (error) {
        console.error('Error fetching project for edit:', error);
        req.flash('error', 'Error fetching project for edit');
        res.redirect(`/api/freelancers/${req.params.id}/projects`);
    }
});

// POST route to handle updating a project for a specific freelancer
router.post('/:id/projects/:projectId/edit', async (req, res) => {
    try {
        const { id, projectId } = req.params; // id is the freelancer ID
        const { title, description, budget, deadline, status } = req.body;

        // Update the project with the new details
        await Project.findByIdAndUpdate(projectId, {
            title,
            description,
            budget,
            deadline: new Date(deadline),
            status
        });

        // Redirect to the freelancer's project list
        res.redirect(`/api/freelancers/${id}/projects`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'Error updating project');
        res.redirect(`/api/freelancers/${req.params.id}/projects/${req.params.projectId}/edit`);
    }
});

// DELETE route to handle deleting a project for a specific freelancer
router.delete('/:id/projects/:projectId', async (req, res) => {
    try {
        const { id, projectId } = req.params; // id is the freelancer ID

        // Remove the project from the database
        await Project.findByIdAndDelete(projectId);

        // Optionally, remove the project ID from the freelancer's projects array
        await Freelancer.findByIdAndUpdate(id, {
            $pull: { projects: projectId }  // Remove the project ID from the freelancer's projects array
        });

        // Redirect to the freelancer's project list
        res.redirect(`/api/freelancers/${id}/projects`);
    } catch (error) {
        console.error('Error deleting project:', error);
        req.flash('error', 'Error deleting project');
        res.redirect(`/api/freelancers/${req.params.id}/projects`);
    }
});

// Export the router
module.exports = router;