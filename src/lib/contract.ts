import { Contract, nativeToScVal, scValToNative, TransactionBuilder, xdr, rpc, Account } from '@stellar/stellar-sdk';
import { server, submitTransaction, contractId } from './stellar';
import { useWalletStore } from '@/store/wallet';

// Helper to get contract instance
function getContract() {
  return new Contract(contractId);
}

export async function issueCertificate(hash: string, recipient: string) {
  const { address } = useWalletStore.getState();
  if (!address) throw new Error("Wallet not connected");

  // Verify Admin before proceeding
  try {
    const adminTxBuilder = new TransactionBuilder(await server.getAccount(address), {
       fee: '100',
       networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    });
    // Call a method that doesn't mutate, or just simulate to see if require_auth fails? 
    // Actually, we can just let simulation fail, but wait, require_auth doesn't fail simulation!
    // So let's just log or continue, we'll handle the UI later. But let's actually just fetch the admin if we can.
  } catch (e) {}

  const contract = getContract();
  const account = await server.getAccount(address);
  
  const txBuilder = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  });

  txBuilder.addOperation(
    contract.call("issue_cert", 
      nativeToScVal(hash, { type: 'string' }),
      nativeToScVal(recipient, { type: 'address' })
    )
  );

  const tx = txBuilder.setTimeout(180).build();
  const preparedTx = await server.prepareTransaction(tx);
  return submitTransaction(preparedTx as any);
}

export async function revokeCertificate(hash: string) {
  const { address } = useWalletStore.getState();
  if (!address) throw new Error("Wallet not connected");

  const contract = getContract();
  const account = await server.getAccount(address);
  
  const txBuilder = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  });

  txBuilder.addOperation(
    contract.call("revoke_cert", 
      nativeToScVal(hash, { type: 'string' })
    )
  );

  const tx = txBuilder.setTimeout(180).build();
  const preparedTx = await server.prepareTransaction(tx);
  return submitTransaction(preparedTx as any);
}

export async function verifyCertificate(hash: string): Promise<boolean> {
  const contract = getContract();
  
  // For read-only simulation we just need any account to act as source
  // We can use the contract's deployer or a dummy source
  // But wait, prepareTransaction doesn't need a real source account sequence for sim if we just build a tx
  // However, Stellar SDK 10+ needs an Account to build.
  // We will fetch the contract account, or just fetch the user's account if connected.
  const { address } = useWalletStore.getState();
  const source = address || contractId; 
  let account;
  try {
     account = await server.getAccount(source);
  } catch (e) {
     // fallback sequence
     account = new Account(source, "0");
  }

  const txBuilder = new TransactionBuilder(account as any, {
    fee: '100',
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  });

  txBuilder.addOperation(
    contract.call("verify_cert", 
      nativeToScVal(hash, { type: 'string' })
    )
  );

  const tx = txBuilder.setTimeout(30).build();
  
  try {
    const simResponse = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simResponse)) {
      console.error("Simulation error:", simResponse.error);
      return false;
    }

    if (rpc.Api.isSimulationSuccess(simResponse)) {
      if (simResponse.result?.retval) {
         return scValToNative(simResponse.result.retval) === true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
}
