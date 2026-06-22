#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};
use registry::RegistryContractClient;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Certificate {
    pub hash: String,
    pub issuer: Address,
    pub recipient: Address,
    pub issued_at: u64,
    pub is_valid: bool,
}

#[contracttype]
pub enum DataKey {
    RegistryAddress,
    Cert(String), // Certificate hash to Certificate
}

#[contract]
pub struct DigitalCertContract;

#[contractimpl]
impl DigitalCertContract {
    /// Initialize the contract with the registry address.
    pub fn init(env: Env, registry: Address) {
        if env.storage().instance().has(&DataKey::RegistryAddress) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::RegistryAddress, &registry);
    }

    /// Issue a new certificate.
    pub fn issue_cert(env: Env, issuer: Address, hash: String, recipient: Address) {
        issuer.require_auth();

        let registry_addr: Address = env.storage().instance().get(&DataKey::RegistryAddress).unwrap();
        let registry_client = RegistryContractClient::new(&env, &registry_addr);

        if !registry_client.is_authorized(&issuer) {
            panic!("issuer is not authorized");
        }

        let key = DataKey::Cert(hash.clone());
        if env.storage().persistent().has(&key) {
            panic!("certificate already exists");
        }

        let cert = Certificate {
            hash: hash.clone(),
            issuer: issuer.clone(),
            recipient: recipient.clone(),
            issued_at: env.ledger().timestamp(),
            is_valid: true,
        };

        env.storage().persistent().set(&key, &cert);
        
        // Publish event
        env.events().publish((soroban_sdk::symbol_short!("issued"), hash), recipient);
    }

    /// Revoke a certificate. Only the original issuer can do this.
    pub fn revoke_cert(env: Env, hash: String) {
        let key = DataKey::Cert(hash.clone());
        if let Some(mut cert) = env.storage().persistent().get::<_, Certificate>(&key) {
            cert.issuer.require_auth();

            if !cert.is_valid {
                panic!("certificate already revoked");
            }
            cert.is_valid = false;
            env.storage().persistent().set(&key, &cert);
            
            // Publish event
            env.events().publish((soroban_sdk::symbol_short!("revoked"), hash.clone()), cert.recipient);
        } else {
            panic!("certificate not found");
        }
    }

    /// Verify a certificate. Anyone can call this.
    pub fn verify_cert(env: Env, hash: String) -> bool {
        let key = DataKey::Cert(hash);
        if let Some(cert) = env.storage().persistent().get::<_, Certificate>(&key) {
            cert.is_valid
        } else {
            false
        }
    }

    /// Get certificate details.
    pub fn get_cert(env: Env, hash: String) -> Certificate {
        let key = DataKey::Cert(hash);
        env.storage().persistent().get(&key).unwrap()
    }
}
