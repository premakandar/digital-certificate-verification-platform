import * as StellarSdk from '@stellar/stellar-sdk';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import { useWalletStore } from '@/store/wallet';

const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';

const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET;
export const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

export const server = new StellarSdk.rpc.Server(rpcUrl);

export async function submitTransaction(tx: StellarSdk.Transaction) {
  const { address } = useWalletStore.getState();
  if (!address) throw new Error("Wallet not connected");

  // Sign the transaction using the wallet kit
  const signedXdr = await StellarWalletsKit.signTransaction(tx.toXDR(), {
    networkPassphrase,
    address,
  });

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr.signedTxXdr, networkPassphrase) as StellarSdk.Transaction;
  
  // Submit to network
  const response = await server.sendTransaction(signedTx);
  if (response.status !== "PENDING") {
    throw new Error("Transaction submission failed");
  }

  // Wait for completion
  let statusResponse = await server.getTransaction(response.hash);
  while (statusResponse.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    statusResponse = await server.getTransaction(response.hash);
  }

  if (statusResponse.status === "FAILED") {
    let errorDetails = "Transaction failed on-chain";
    if (statusResponse.resultMetaXdr) {
      try {
        console.error("Tx Meta:", JSON.stringify(statusResponse.resultMetaXdr, null, 2));
      } catch (e) {}
    }
    if (statusResponse.resultXdr) {
      try {
         console.error("Tx Result:", JSON.stringify(statusResponse.resultXdr, null, 2));
      } catch(e) {}
    }
    console.error("Full status response:", statusResponse);
    throw new Error(errorDetails);
  }

  return response.hash;
}
