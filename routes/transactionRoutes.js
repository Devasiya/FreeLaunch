const express = require('express');
const router = express.Router();
const CreditService = require('../services/CreditService'); // Import your CoinService for handling business logic

// Route to render the Post Project page
router.get('/post-project/:clientId', (req, res) => {
    const clientId = req.params.clientId; // Get clientId from the URL
    res.render('transactions/postProject', { clientId }); // Render the EJS file with clientId
});

// Route to handle posting a project
router.post('/post-project', async (req, res) => {
    const { clientId, projectCost } = req.body; // Extract clientId and projectCost from the request body

    try {
        await CreditService.postProject(clientId, projectCost); // Call the service to post the project
        res.status(200).json({ message: 'Project posted successfully.' }); // Send success response
    } catch (error) {
        res.status(400).json({ error: error.message }); // Send error response
    }
});

module.exports = router;