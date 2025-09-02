import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Deploy the Agreement contract
  const Agreement = await hre.ethers.deployContract("Agreement");

  console.log(`✅ Smart contract deployed at: ${Agreement.target}`);

  // Save deployed address inside BLOCKCHAIN folder (same folder as creditsBlockchainService.js)
  const deployedPath = path.join(__dirname, "../deployedAddress.json");
  fs.writeFileSync(
    deployedPath,
    JSON.stringify({ address: Agreement.target }, null, 2)
  );

  console.log(`📄 Deployed address saved to: ${deployedPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
