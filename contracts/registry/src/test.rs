#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_init_and_admin() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);

    let contract_id = env.register_contract(None, RegistryContract);
    let client = RegistryContractClient::new(&env, &contract_id);

    client.init(&admin);
}

#[test]
#[should_panic(expected = "already initialized")]
fn test_double_init_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, RegistryContract);
    let client = RegistryContractClient::new(&env, &contract_id);

    client.init(&admin);
    client.init(&admin); // Should panic
}

#[test]
fn test_add_and_check_issuer() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);

    let contract_id = env.register_contract(None, RegistryContract);
    let client = RegistryContractClient::new(&env, &contract_id);

    client.init(&admin);

    // Not authorized yet
    assert_eq!(client.is_authorized(&issuer), false);

    // Add issuer
    client.add_issuer(&issuer);

    // Now authorized
    assert_eq!(client.is_authorized(&issuer), true);
}

#[test]
fn test_remove_issuer() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);

    let contract_id = env.register_contract(None, RegistryContract);
    let client = RegistryContractClient::new(&env, &contract_id);

    client.init(&admin);
    client.add_issuer(&issuer);
    assert_eq!(client.is_authorized(&issuer), true);

    // Remove issuer
    client.remove_issuer(&issuer);
    assert_eq!(client.is_authorized(&issuer), false);
}

#[test]
fn test_unknown_issuer_not_authorized() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let unknown = Address::generate(&env);

    let contract_id = env.register_contract(None, RegistryContract);
    let client = RegistryContractClient::new(&env, &contract_id);

    client.init(&admin);

    assert_eq!(client.is_authorized(&unknown), false);
}
