import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// This script builds and deploys the Soroban contracts to the Stellar Testnet
// Ensure you have `stellar-cli` installed and configured with a network and identity.

function runCommand(command) {
  console.log(`> ${command}`);
  return execSync(command, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

async function main() {
  console.log("🚀 Building Smart Contracts...");
  runCommand('cargo build --target wasm32-unknown-unknown --release --manifest-path ./contracts/Cargo.toml');
  
  console.log("✨ Optimizing Contracts...");
  const registryWasm = './contracts/target/wasm32-unknown-unknown/release/registry.wasm';
  const certWasm = './contracts/target/wasm32-unknown-unknown/release/digital_cert_contract.wasm';
  
  runCommand(`stellar contract optimize --wasm ${registryWasm}`);
  runCommand(`stellar contract optimize --wasm ${certWasm}`);
  
  const optRegistryWasm = './contracts/target/wasm32-unknown-unknown/release/registry.optimized.wasm';
  const optCertWasm = './contracts/target/wasm32-unknown-unknown/release/digital_cert_contract.optimized.wasm';

  console.log("🌐 Deploying Registry Contract...");
  const registryId = runCommand(`stellar contract deploy --wasm ${optRegistryWasm} --source-account default --network testnet`);
  console.log(`✅ Registry Deployed: ${registryId}`);

  console.log("🌐 Deploying Digital Certificate Contract...");
  const certId = runCommand(`stellar contract deploy --wasm ${optCertWasm} --source-account default --network testnet`);
  console.log(`✅ Digital Certificate Contract Deployed: ${certId}`);

  console.log("🔗 Initializing Contracts...");
  // Initialize registry with admin (using default identity)
  const defaultAddress = runCommand(`stellar keys address default`);
  runCommand(`stellar contract invoke --id ${registryId} --source-account default --network testnet -- init --admin ${defaultAddress}`);
  console.log(`✅ Registry initialized with admin: ${defaultAddress}`);

  // Initialize cert contract with registry address
  runCommand(`stellar contract invoke --id ${certId} --source-account default --network testnet -- init --registry ${registryId}`);
  console.log(`✅ Certificate Contract initialized with registry address: ${registryId}`);

  // Save to .env.local
  const envPath = path.resolve(process.cwd(), '.env.local');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or append
  const updateEnv = (key, value) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  };

  updateEnv('NEXT_PUBLIC_REGISTRY_CONTRACT_ID', registryId);
  updateEnv('NEXT_PUBLIC_CONTRACT_ID', certId);

  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log("🎉 Deployment complete! .env.local updated.");
}

main().catch(err => {
  console.error("❌ Deployment failed:");
  console.error(err);
  process.exit(1);
});
