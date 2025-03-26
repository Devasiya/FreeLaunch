// const Client = require('../models/client');
// const Freelancer = require('../models/freelancer');
// const { ReferralCredit, ProjectCompletionCredit } = require('../models/Credit');

// // Constants for credit values
// const REFERRAL_CREDIT_VALUE = new ReferralCredit().value;
// const PROJECT_COMPLETION_CREDIT_VALUE = new ProjectCompletionCredit().value;

// // Function to earn referral credits for clients
// async function earnReferralCreditsForClient(clientId) {
//     const client = await Client.findById(clientId);
//     if (!client) {
//         throw new Error("Client not found.");
//     }
//     client.credits += REFERRAL_CREDIT_VALUE;
//     await client.save();
//     recordTransaction(client, 'Earned Referral Credits', REFERRAL_CREDIT_VALUE);
// }

// // Function to earn referral credits for freelancers
// async function earnReferralCreditsForFreelancer(freelancerId) {
//     const freelancer = await Freelancer.findById(freelancerId);
//     if (!freelancer) {
//         throw new Error("Freelancer not found.");
//     }
//     freelancer.credits += REFERRAL_CREDIT_VALUE;
//     await freelancer.save();
//     recordTransaction(freelancer, 'Earned Referral Credits', REFERRAL_CREDIT_VALUE);
// }

// // Function to earn project completion credits
// async function earnProjectCompletionCredits(freelancerId) {
//     const freelancer = await Freelancer.findById(freelancerId);
//     if (!freelancer) {
//         throw new Error("Freelancer not found.");
//     }
//     freelancer.credits += PROJECT_COMPLETION_CREDIT_VALUE;
//     await freelancer.save();
//     recordTransaction(freelancer, 'Earned Project Completion Credits', PROJECT_COMPLETION_CREDIT_VALUE);
// }

// // Function to post a project using credits
// async function postProject(clientId, projectCost) {
//     if (projectCost <= 0) {
//         throw new Error("Project cost must be a positive number.");
//     }

//     const client = await Client.findById(clientId);
//     if (!client) {
//         throw new Error("Client not found.");
//     }

//     if (client.credits >= projectCost) {
//         client.credits -= projectCost;
//         await client.save();
//         recordTransaction(client, 'Posted Project', -projectCost);
//         // Logic to post the project (e.g., create a project entry in the database)
//     } else {
//         throw new Error("Not enough credits to post the project.");
//     }
// }

// // Function to record transactions
// function recordTransaction(user, type, amount) {
//     const transaction = {
//         type: type,
//         amount: amount,
//         date: new Date(),
//         userId: user._id // Optionally include user ID for reference
//     };
//     user.transactionHistory.push(transaction);
// }

// module.exports = {
//     earnReferralCreditsForClient,
//     earnReferralCreditsForFreelancer,
//     earnProjectCompletionCredits,
//     postProject
// };