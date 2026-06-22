const StellarSdk = require('@stellar/stellar-sdk');

async function main() {
  const server = new StellarSdk.rpc.Server('https://soroban-testnet.stellar.org');
  const networkPassphrase = StellarSdk.Networks.TESTNET;
  const contractId = 'CBZFKTBGZOBA7KWHV3AMMEL7UNK6LE37PWAA3YGPYPXNM7K6WHINEGGO';
  
  // We will generate a new random keypair to pay for the init transaction
  const sourceKeypair = StellarSdk.Keypair.random();
  console.log('Funding temporary account:', sourceKeypair.publicKey());
  
  try {
    const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(sourceKeypair.publicKey())}`);
    await res.json();
    console.log('Account funded!');
  } catch (e) {
    console.error('Funding failed', e);
    return;
  }

  const account = await server.getAccount(sourceKeypair.publicKey());
  
  const txBuilder = new StellarSdk.TransactionBuilder(account, {
    fee: '1000',
    networkPassphrase,
  });

  const contract = new StellarSdk.Contract(contractId);
  const adminAddress = 'GCH6T3HAISAEBDVAK6RVB7P44RYP736FQW7C4D6EXT3DAV4QCAJVCOL4';
  
  txBuilder.addOperation(
    contract.call("init", 
      StellarSdk.nativeToScVal(adminAddress, { type: 'address' })
    )
  );

  const tx = txBuilder.setTimeout(30).build();
  
  console.log('Preparing transaction...');
  const preparedTx = await server.prepareTransaction(tx);
  
  preparedTx.sign(sourceKeypair);
  
  console.log('Submitting transaction...');
  const response = await server.sendTransaction(preparedTx);
  
  if (response.status === "PENDING") {
    console.log('Transaction pending, hash:', response.hash);
    let statusResponse = await server.getTransaction(response.hash);
    while (statusResponse.status === "NOT_FOUND") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      statusResponse = await server.getTransaction(response.hash);
    }
    if (statusResponse.status === "SUCCESS") {
      console.log('Contract initialized successfully!');
    } else {
      console.log('Transaction failed!', statusResponse);
    }
  } else {
    console.log('Submission failed', response);
  }
}

main().catch(console.error);
