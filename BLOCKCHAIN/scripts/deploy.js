const hre = require("hardhat");

async function main() {
    // Get the smart contract factory
    const Agreement = await hre.ethers.deployContract("Agreement");

    console.log(`✅ Smart contract deployed at: ${Agreement.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
