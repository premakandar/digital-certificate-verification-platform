#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
pub enum DataKey {
    Admin,
    Issuer(Address), // Maps Address to a boolean
}

#[contract]
pub struct RegistryContract;

#[contractimpl]
impl RegistryContract {
    /// Initialize the registry with an admin.
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Add an authorized issuer. Only the admin can do this.
    pub fn add_issuer(env: Env, issuer: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Issuer(issuer), &true);
    }

    /// Remove an authorized issuer. Only the admin can do this.
    pub fn remove_issuer(env: Env, issuer: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Issuer(issuer), &false);
    }

    /// Check if an issuer is authorized. Anyone can call this.
    pub fn is_authorized(env: Env, issuer: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Issuer(issuer))
            .unwrap_or(false)
    }
}

mod test;
