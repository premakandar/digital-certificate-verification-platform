import * as StellarSdk from '@stellar/stellar-sdk';
import { useWalletStore } from '@/store/wallet';

const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET;
export const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

export const server = new StellarSdk.rpc.Server(rpcUrl);

export async function submitTransaction(txBuilder: StellarSdk.TransactionBuilder) {
  const { kit, address } = useWalletStore.getState();
  if (!address) throw new Error("Wallet not connected");

  const tx = txBuilder.build();
  
  // Sign the transaction using the wallet kit
  const signedXdr = await kit.signTransaction(tx.toXDR(), {
    networkPassphrase,
    network: process.env.NEXT_PUBLIC_STELLAR_NETWORK as any,
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
    throw new Error("Transaction failed on-chain");
  }

  return response.hash;
}
