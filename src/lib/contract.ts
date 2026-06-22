import { Contract, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { server, submitTransaction, contractId } from './stellar';
import { useWalletStore } from '@/store/wallet';

// Helper to get contract instance
function getContract() {
  return new Contract(contractId);
}

export async function issueCertificate(hash: string, recipient: string) {
  const { address } = useWalletStore.getState();
  if (!address) throw new Error("Wallet not connected");

  const contract = getContract();
  
  const txBuilder = await server.prepareTransaction({
    source: address,
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  });

  txBuilder.addOperation(
    contract.call("issue_cert", 
      nativeToScVal(hash, { type: 'string' }),
      nativeToScVal(recipient, { type: 'address' })
    )
  );

  return submitTransaction(txBuilder);
}

export async function revokeCertificate(hash: string) {
  const { address } = useWalletStore.getState();
  if (!address) throw new Error("Wallet not connected");

  const contract = getContract();
  
  const txBuilder = await server.prepareTransaction({
    source: address,
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  });

  txBuilder.addOperation(
    contract.call("revoke_cert", 
      nativeToScVal(hash, { type: 'string' })
    )
  );

  return submitTransaction(txBuilder);
}

export async function verifyCertificate(hash: string): Promise<boolean> {
  const contract = getContract();
  
  const txBuilder = await server.prepareTransaction({
    source: contractId, // Using contract ID as source for read-only sim
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  });

  txBuilder.addOperation(
    contract.call("verify_cert", 
      nativeToScVal(hash, { type: 'string' })
    )
  );

  const tx = txBuilder.build();
  
  try {
    const simResponse = await server.simulateTransaction(tx);
    if (!simResponse.results || simResponse.results.length === 0) return false;
    
    // Result is a boolean scVal
    const resultXdr = simResponse.results[0].xdr;
    const resultObj = xdr.ScVal.fromXDR(resultXdr, 'base64');
    
    return scValToNative(resultObj) === true;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
}
