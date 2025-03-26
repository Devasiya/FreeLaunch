// services/CoinService.js
const Client = require('../models/client');
const Freelancer = require('../models/freelancer');
const { ReferralCoin, ProjectCompletionCoin } = require('../models/Coin');

// Function to earn referral coins for clients
async function earnReferralCoinsForClient(clientId) {
    const client = await Client.findById(clientId);
    if (client) {
        const earnedCoins = new ReferralCoin().value;
        client.coins += earnedCoins;
        await client.save();
        recordTransaction(client, 'Earned Referral Coins', earnedCoins);
    }
}

// Function to earn referral coins for freelancers
async function earnReferralCoinsForFreelancer(freelancerId) {
    const freelancer = await Freelancer.findById(freelancerId);
    if (freelancer) {
        const earnedCoins = new ReferralCoin().value;
        freelancer.coins += earnedCoins;
        await freelancer.save();
        recordTransaction(freelancer, 'Earned Referral Coins', earnedCoins);
    }
}

// Function to earn project completion coins
async function earnProjectCompletionCoins(freelancerId) {
    const freelancer = await Freelancer.findById(freelancerId);
    if (freelancer) {
        const earnedCoins = new ProjectCompletionCoin().value;
        freelancer.coins += earnedCoins;
        await freelancer.save();
        recordTransaction(freelancer, 'Earned Project Completion Coins', earnedCoins);
    }
}

// Function to post a project using coins
async function postProject(clientId, projectCost) {
    const client = await Client.findById(clientId);
    if (client) {
        if (client.coins >= projectCost) {
            client.coins -= projectCost;
            await client.save();
            recordTransaction(client, 'Posted Project', -projectCost);
            // Logic to post the project
        } else {
            throw new Error("Not enough coins to post the project.");
        }
    }
}

// Function to record transactions
function recordTransaction(user, type, amount) {
    const transaction = {
        type: type,
        amount: amount,
        date: new Date()
    };
    user.transactionHistory.push(transaction);
}

module.exports = {
    earnReferralCoinsForClient,
    earnReferralCoinsForFreelancer,
    earnProjectCompletionCoins,
    postProject
};