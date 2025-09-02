import { makePayment, getBalance } from './creditsBlockchainService.js';
import Web3 from "web3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const web3 = new Web3('http://localhost:8545');

const paymentSystem = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./artifacts/contracts/PaymentSystem.sol/PaymentSystem.json"), "utf8")
);
const deployed = JSON.parse(
  fs.readFileSync(path.join(__dirname, "paymentSystemAddress.json"), "utf8")
);
const contractABI = paymentSystem.abi;
const contractAddress = deployed.address;
const paymentContract = new web3.eth.Contract(contractABI, contractAddress);
async function testBlockchain() {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    const recipient = accounts[1];
    // 1️⃣ Deposit Ether into the contract for the sender using deposit()
    console.log(`Depositing 1 Ether from ${sender} to contract...`);
    await paymentContract.methods.deposit().send({
        from: sender,
        value: web3.utils.toWei("1", "ether")
    });
    console.log("🔹 Sending 1 Ether via contract transfer...");
    await makePayment(sender, recipient, 1);
    const balance = await getBalance(recipient);
    console.log(`Recipient's balance: ${web3.utils.fromWei(balance, 'ether')} Ether`);
}