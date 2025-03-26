const { ethers } = require("ethers");
const fs = require("fs");

// Connect to Ethereum Blockchain (Local Hardhat Node)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Load contract ABI
const contractABI = JSON.parse(
    fs.readFileSync(__dirname + "/artifacts/contracts/Agreement.sol/Agreement.json")
).abi;

// Replace with the deployed contract address
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Use a funded test account from Hardhat
const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
);

// Connect to the contract
const agreementContract = new ethers.Contract(contractAddress, contractABI, wallet);

//create agreement on blockain
async function createAgreement(freelancerAddress, terms) {
    try {
        const tx = await agreementContract.createAgreement(freelancerAddress, terms);
        await tx.wait();  // Ensure transaction is confirmed
        console.log("Agreement Created on Blockchain:", tx.hash);
        return tx;  // Return transaction object
    } catch (error) {
        console.error("Error creating agreement on blockchain:", error);
        throw new Error("Blockchain transaction failed");
    }
}
//complete agreement on blockchain
async function completeAgreement(agreementId) {
    try {
        const tx = await agreementContract.completeAgreement(agreementId);
        await tx.wait();  // Ensure transaction is confirmed
        console.log("Agreement Completed on Blockchain:", tx.hash);
        return tx;  // Return transaction object
    } catch (error) {
        console.error("Error completing agreement on blockchain:", error);
        throw new Error("Blockchain transaction failed");
    }
}
module.exports = { createAgreement, completeAgreement };
