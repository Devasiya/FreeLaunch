const Web3 = require('web3');
const contractABI = require('../contracts/PaymentSystem.json').abi;
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

const web3 = new Web3('http://localhost:8545'); // Replace with your Ethereum node URL
const paymentContract = new web3.eth.Contract(contractABI, contractAddress);

async function makePayment(senderAddress, recipientAddress, amount) {
    const accounts = await web3.eth.getAccounts();
    await paymentContract.methods.transfer(recipientAddress, web3.utils.toWei(amount.toString(), 'ether')).send({ from: senderAddress });
}

async function getBalance(address) {
    return await paymentContract.methods.getBalance().call({ from: address });
}

module.exports = {
    makePayment,
    getBalance
};