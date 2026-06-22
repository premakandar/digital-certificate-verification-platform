# Digital Certificate Verification Platform

## Overview
A decentralized Digital Certificate Verification platform built on the Stellar network using Soroban Smart Contracts. This platform allows admins to issue and revoke certificates, and anyone to instantly verify a certificate's authenticity.

## Features
- **Wallet Integration**: Connect multiple Stellar wallets via StellarWalletsKit.
- **Smart Contract (Soroban)**: Issue, verify, and revoke certificates entirely on-chain.
- **Real-Time Activity Feed**: Watch certificates being issued and revoked in real-time via Soroban RPC events.
- **Transaction Tracking**: Comprehensive loading and success/error states for all contract interactions.
- **Modern UI**: Built with Next.js 15, Tailwind CSS, and shadcn/ui.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand, TanStack Query
- **Blockchain**: Stellar Network, Soroban SDK, Stellar JavaScript SDK, StellarWalletsKit

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd digital-certificate-verification-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_CONTRACT_ID=CBZFKTBGZOBA7KWHV3AMMEL7UNK6LE37PWAA3YGPYPXNM7K6WHINEGGO
```
*(If you deploy a new contract, replace `CBZFKTBGZOBA7KWHV3AMMEL7UNK6LE37PWAA3YGPYPXNM7K6WHINEGGO` with your new CONTRACT_ADDRESS_HERE).*

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Wallet Setup
1. Install a Stellar wallet extension like [Freighter](https://www.freighter.app/).
2. Switch your wallet network to **Testnet**.
3. Fund your testnet account via the [Stellar Laboratory Faucet](https://laboratory.stellar.org/#account-creator?network=test).
4. Click "Connect Wallet" in the application navbar to get started.

## Contract Deployment
The Soroban smart contract is located in `contracts/digital_cert`.

To build and deploy your own instance to Testnet:
```bash
cd contracts/digital_cert
cargo build --target wasm32-unknown-unknown --release

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/digital_cert_contract.wasm \
  --source <YOUR_ADMIN_SECRET_KEY> \
  --network testnet
```
After deployment, take the resulting `Contract ID` and update your `.env.local`.

## Example Transaction Hash
Here is an example transaction hash from testing the contract:
`TRANSACTION_HASH_HERE`

## Deployment
This project is optimized for deployment on Vercel.
1. Push your code to GitHub.
2. Import the project in your Vercel Dashboard.
3. Add the Environment Variables listed above in the Vercel settings.
4. Deploy!

## Git Commit Plan
Following is the recommended realistic commit plan used while building this project:

- **Commit 1:** `feat: Project initialization and wallet integration`
- **Commit 2:** `feat: Smart contract deployment and frontend integration`
- **Commit 3:** `feat: Real-time events and transaction tracking`
- **Commit 4:** `chore: UI polish and documentation`
