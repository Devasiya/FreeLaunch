const blockchainService = require('./creditsBlockchainServices.js');

async function testBlockchain() {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    const recipient = accounts[1];

    // Deposit some ether to sender's account
    await blockchainService.makePayment(sender, recipient, 1); // Sending 1 Ether

    const balance = await blockchainService.getBalance(recipient);
    console.log(`Recipient's balance: ${web3.utils.fromWei(balance, 'ether')} Ether`);
}

testBlockchain().catch(console.error);