import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Deploy the PaymentSystem contract
  const PaymentSystem = await hre.ethers.deployContract("PaymentSystem");
  console.log(`✅ PaymentSystem deployed at: ${PaymentSystem.target}`);

  // Save deployed address to a JSON file in BLOCKCHAIN folder
  const deployedPath = path.join(__dirname, "../paymentSystemAddress.json");
  fs.writeFileSync(
    deployedPath,
    JSON.stringify({ address: PaymentSystem.target }, null, 2)
  );

  console.log(`📄 Deployed address saved to: ${deployedPath}`);
}

main().catch(console.error);
