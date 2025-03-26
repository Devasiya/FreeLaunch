const express = require("express");
const router = express.Router();
const Agreement = require("../models/agreement"); // MongoDB Model
const { createAgreement, completeAgreement } = require("../BLOCKCHAIN/blockchainService");
const Project = require("../models/projects"); // Assuming you have a Project model
const Client = require("../models/client"); // Assuming you have a Client model
const Freelancer = require("../models/freelancer"); // Assuming you have a Freelancer model


// Render the Agreement Form
router.get("/", async (req, res) => {
    try {
        const clients = await Client.find(); // Fetch all clients
        const freelancers = await Freelancer.find(); // Fetch all freelancers
        res.render("agreements/agreement", { clients, freelancers }); // Pass clients and freelancers to the EJS template
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching clients and freelancers");
    }
});

// View Agreement
router.get("/view/:projectId", async (req, res) => {
    const projectId = req.params.projectId;
    const agreement = await Agreement.findOne({ project: projectId }).populate('client freelancer'); // Fetch the agreement for the project

    if (!agreement) {
        return res.status(404).send("Agreement not found");
    }

    res.render("agreements/viewAgreement", { agreement }); // Render the agreement details
});

router.get("/create", async (req, res) => {
    const projectId = req.query.projectId; // Get project ID from query parameters
    const project = await Project.findById(projectId); // Fetch project details

    if (!project) {
        return res.status(404).send("Project not found");
    }

    // Fetch clients and freelancers for the form
    const clients = await Client.find();
    const freelancers = await Freelancer.find();

    res.render("agreements/createAgreement", { project, clients, freelancers }); // Render the form with project details
});


// Create Agreement (MongoDB + Blockchain)
router.post("/create", async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const { client, freelancer, freelancerAddress, terms, startDate, endDate } = req.body;

        // Save agreement to MongoDB first
        const newAgreement = new Agreement({
            client,
            freelancer,
            terms,
            startDate,
            endDate,
        });
        const savedAgreement = await newAgreement.save();

        // Send required details to Blockchain
        const blockchainTx = await createAgreement(freelancerAddress, terms);

        // Update agreement with Blockchain Hash
        savedAgreement.blockchainHash = blockchainTx.hash; // Store blockchain transaction hash
        await savedAgreement.save();

        // Redirect to a success page or render a success message
        res.redirect(`/success?txHash=${blockchainTx.hash}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Complete Agreement
router.post("/complete", async (req, res) => {
    try {
        const { agreementId } = req.body;

        // Mark agreement as completed on Blockchain
        const blockchainTx = await completeAgreement(agreementId);

        // Update agreement status in MongoDB
        await Agreement.findByIdAndUpdate(agreementId, { status: "Completed", blockchainHash: blockchainTx.hash });

        res.status(200).json({ message: "Agreement completed!", txHash: blockchainTx.hash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
