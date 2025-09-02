import Web3 from "web3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI
const paymentSystem = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./artifacts/contracts/PaymentSystem.sol/PaymentSystem.json"), "utf8")
);
const deployed = JSON.parse(
  fs.readFileSync(path.join(__dirname, "paymentSystemAddress.json"), "utf8")
);

const contractABI = paymentSystem.abi;
const contractAddress = deployed.address;

const web3 = new Web3('http://localhost:8545');
const paymentContract = new web3.eth.Contract(contractABI, contractAddress);

export async function makePayment(senderAddress, recipientAddress, amount) {
    await paymentContract.methods.transfer(recipientAddress, web3.utils.toWei(amount.toString(), 'ether')).send({ from: senderAddress });
}

export async function getBalance(address) {
    return await paymentContract.methods.getBalance().call({ from: address });
}
