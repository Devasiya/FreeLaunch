import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to Ethereum Blockchain (Local Hardhat Node)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
// Load contract ABI
const contractABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, "artifacts/contracts/Agreement.sol/Agreement.json"))
).abi;
// Load deployed contract address from JSON file
const deployedAddressPath = path.join(process.cwd(),"BLOCKCHAIN", "deployedAddress.json");
const deployedAddressJson = JSON.parse(fs.readFileSync(deployedAddressPath, "utf8"));
const contractAddress = deployedAddressJson.address;

// Use a funded test account from Hardhat
const wallet = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);
// Connect to the contract
const agreementContract = new ethers.Contract(contractAddress, contractABI, wallet);
//create agreement on blockchain
export async function createAgreement(freelancerAddress, terms) {
  try {
    const tx = await agreementContract.createAgreement(freelancerAddress, terms);
    await tx.wait(); // Ensure transaction is confirmed
    console.log("Agreement Created on Blockchain:", tx.hash);
    return tx; // Return transaction object
  } catch (error) {
    console.error("Error creating agreement on blockchain:", error);
    throw new Error("Blockchain transaction failed");
  }
}

//complete agreement on blockchain
export async function completeAgreement(agreementId) {
  try {
    const tx = await agreementContract.completeAgreement(agreementId);
    await tx.wait(); // Ensure transaction is confirmed
    console.log("Agreement Completed on Blockchain:", tx.hash);
    return tx; // Return transaction object
  } catch (error) {
    console.error("Error completing agreement on blockchain:", error);
    throw new Error("Blockchain transaction failed");
  }
}