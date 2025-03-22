const express = require("express");
const router = express.Router();
const Agreement = require("../models/agreement"); // MongoDB Model
const { createAgreement, completeAgreement } = require("../BLOCKCHAIN/blockchainService");

// Render the Agreement Form
router.get("/", (req, res) => {
    res.render("agreement");
});

// Create Agreement (MongoDB + Blockchain)
router.post("/create", async (req, res) => {
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

        res.status(200).json({ message: "Agreement created successfully!", txHash: blockchainTx.hash });
    } catch (err) {
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
