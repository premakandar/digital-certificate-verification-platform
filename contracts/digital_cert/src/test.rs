#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};
use registry::{RegistryContract, RegistryContractClient};

#[test]
fn test_issue_cert_with_authorization() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);
    let recipient = Address::generate(&env);
    
    // Deploy registry contract
    let registry_id = env.register_contract(None, RegistryContract);
    let registry_client = RegistryContractClient::new(&env, &registry_id);
    registry_client.init(&admin);
    
    // Add issuer to registry
    registry_client.add_issuer(&issuer);
    assert_eq!(registry_client.is_authorized(&issuer), true);

    // Deploy digital cert contract
    let cert_id = env.register_contract(None, DigitalCertContract);
    let cert_client = DigitalCertContractClient::new(&env, &cert_id);
    cert_client.init(&registry_id);

    // Issue cert
    let hash = String::from_str(&env, "some_hash_123");
    cert_client.issue_cert(&issuer, &hash, &recipient);

    // Verify cert
    assert_eq!(cert_client.verify_cert(&hash), true);
    
    let cert = cert_client.get_cert(&hash);
    assert_eq!(cert.hash, hash);
    assert_eq!(cert.issuer, issuer);
    assert_eq!(cert.recipient, recipient);
    assert_eq!(cert.is_valid, true);
}

#[test]
#[should_panic(expected = "issuer is not authorized")]
fn test_issue_cert_unauthorized() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let unauthorized_issuer = Address::generate(&env);
    let recipient = Address::generate(&env);
    
    // Deploy registry contract
    let registry_id = env.register_contract(None, RegistryContract);
    let registry_client = RegistryContractClient::new(&env, &registry_id);
    registry_client.init(&admin);

    // Deploy digital cert contract
    let cert_id = env.register_contract(None, DigitalCertContract);
    let cert_client = DigitalCertContractClient::new(&env, &cert_id);
    cert_client.init(&registry_id);

    // Attempt to issue cert (should panic)
    let hash = String::from_str(&env, "some_hash_123");
    cert_client.issue_cert(&unauthorized_issuer, &hash, &recipient);
}
