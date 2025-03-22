const { createAgreement, completeAgreement } = require("./blockchainService");

async function test() {
    try {
        const freelancerAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"; // Use a valid address from Hardhat accounts
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
