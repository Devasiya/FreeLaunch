// services/TransactionService.js
const Client = require('../models/client');
const Freelancer = require('../models/freelancer');
const Transaction = require('../models/Transaction'); // Assuming you have a Transaction model

// Function to record a transaction
async function recordTransaction(userId, type, amount) {
    const transaction = new Transaction({
        userId: userId,
        type: type,
        amount: amount,
        date: new Date()
    });
    await transaction.save();
    return transaction;
}

// Function to get transaction history for a client
async function getClientTransactionHistory(clientId) {
    const client = await Client.findById(clientId).populate('transactionHistory');
    if (!client) {
        throw new Error('Client not found');
    }
    return client.transactionHistory;
}

// Function to get transaction history for a freelancer
async function getFreelancerTransactionHistory(freelancerId) {
    const freelancer = await Freelancer.findById(freelancerId).populate('transactionHistory');
    if (!freelancer) {
        throw new Error('Freelancer not found');
    }
    return freelancer.transactionHistory;
}

module.exports = {
    recordTransaction,
    getClientTransactionHistory,
    getFreelancerTransactionHistory
};