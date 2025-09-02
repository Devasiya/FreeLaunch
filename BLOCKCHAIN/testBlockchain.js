import { createAgreement, completeAgreement } from "./blockchainService.js";

async function test() {
    try {
        const freelancerAddress = "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"; // Use a valid address from Hardhat accounts
        const agreementDetails = "Freelancer will complete the project within 30 days.";

        console.log("🔹 Creating Agreement...");
        await createAgreement(freelancerAddress, agreementDetails);

        console.log("🔹 Completing Agreement...");
        await completeAgreement(1); // Assuming first agreement has ID = 1
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

test();