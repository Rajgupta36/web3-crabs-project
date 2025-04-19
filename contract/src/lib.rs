extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    storage::{ StorageBool, StorageMap, StorageU256},
};

#[storage]
#[entrypoint]
pub struct InheritanceContract {
    // Mapping: owner => inheritance_config
    owners: StorageMap<Address, InheritanceConfig>,
    // Total number of active owners
    owner_count: StorageU256,
}

#[storage]
pub struct InheritanceConfig {
    // Flag to check if this config exists
    active: StorageBool,
    // Beneficiaries (address => is_benefic iary)
    beneficiaries: StorageMap<Address, StorageBool>,
    // Total number of beneficiaries
    beneficiary_count: StorageU256,
    // Last reset timestamp (in seconds)
    last_reset: StorageU256,
    // Timeout period (1 year in seconds)
    timeout_period: StorageU256,
    // Total ETH balance locked
    balance: StorageU256,
    // Has a beneficiary claimed their share (address => has_claimed)
    claimed: StorageMap<Address, StorageBool>,
    // Per beneficiary share (locked in when contract expires)
    per_beneficiary_share: StorageU256,
    // Flag to track if contract has expired and share calculation is locked
    share_locked: StorageBool,
}

#[public]
impl InheritanceContract {
    // Create a new inheritance plan (acts as constructor for a specific user)
    #[payable]
    fn create_inheritance_plan(&mut self, initial_beneficiaries: Vec<Address>, timeout_period_days: u64) {
        let owner = self.vm().msg_sender();
        require(
            !self.owner_exists(owner),
            "You already have an inheritance plan"
        );

        // Initialize owner's inheritance config


        let msg_value = self.vm().msg_value();
        let current_timestamp = U256::from(block_timestamp(self));
        let mut config = self.owners.setter(owner);
        config.active.set(true);
        config.timeout_period.set(U256::from(timeout_period_days) * U256::from(86400)); // Convert days to seconds
        config.last_reset.set(current_timestamp);
        config.balance.set(msg_value);
        config.share_locked.set(false);

        // Add initial beneficiaries
        let mut count = 0;
        for addr in initial_beneficiaries.iter().take(5) {
            if !addr.is_zero() && !config.beneficiaries.get(*addr) {
                config.beneficiaries.setter(*addr).set(true);
                count += 1;
            }
        }
        config.beneficiary_count.set(U256::from(count));
        
        // Increment owner count
        self.owner_count.set(self.owner_count.get() + U256::from(1));
    }

    // Add funds (ETH) to the inheritance plan
    #[payable]
    fn add_funds(&mut self) {
        let owner = self.vm().msg_sender();
        require(self.owner_exists(owner), "No inheritance plan found");
        
        let amount = U256::from(self.vm().msg_value());
        let mut config = self.owners.setter(owner);
        require(!config.share_locked.get(), "Plan has expired, cannot add funds");
        
        let current_balance = config.balance.get();
        config.balance.set(current_balance + amount);
    }

    // Add a beneficiary
    fn add_beneficiary(&mut self, beneficiary: Address) {
        let owner = self.vm().msg_sender();
        require(self.owner_exists(owner), "No inheritance plan found");
        
        let mut config = self.owners.setter(owner);
        require(!config.share_locked.get(), "Plan has expired, cannot add beneficiary");
        require(config.beneficiary_count.get() < U256::from(5), "Max 5 beneficiaries");
        require(!beneficiary.is_zero(), "Invalid beneficiary address");
        require(!config.beneficiaries.get(beneficiary), "Beneficiary already exists");

        config.beneficiaries.setter(beneficiary).set(true);
        let current_count = config.beneficiary_count.get();
        config.beneficiary_count.set(current_count + U256::from(1));
    }

    // Remove a beneficiary
    fn remove_beneficiary(&mut self, beneficiary: Address) {
        let owner = self.vm().msg_sender();
        require(self.owner_exists(owner), "No inheritance plan found");
        
        let mut config = self.owners.setter(owner);
        require(!config.share_locked.get(), "Plan has expired, cannot remove beneficiary");
        require(config.beneficiaries.get(beneficiary), "Not a beneficiary");

        config.beneficiaries.setter(beneficiary).set(false);
        let current_count = config.beneficiary_count.get();
        config.beneficiary_count.set(current_count - U256::from(1));
    }

    // Reset the timer
    fn reset_timer(&mut self) {
        let owner = self.vm().msg_sender();
        require(self.owner_exists(owner), "No inheritance plan found");
        
        let mut config = self.owners.setter(owner);
        require(!config.share_locked.get(), "Plan has expired, cannot reset timer");
        
        let current_timestamp = U256::from(self.vm().block_timestamp());
        config.last_reset.set(current_timestamp);
    }

    // Lock the per-beneficiary share amount for a specific owner
    fn lock_share(&mut self, owner: Address) {
        require(self.owner_exists(owner), "Owner does not exist");
        
        let mut config = self.owners.setter(owner);
        require(self.is_owner_expired(owner), "Plan not expired yet");
        require(!config.share_locked.get(), "Share already locked");

        let count = config.beneficiary_count.get();
        require(count > U256::from(0), "No beneficiaries");

        let balance = config.balance.get();
        require(balance > U256::from(0), "No funds to distribute");

        // Lock in the per-beneficiary share
        config.per_beneficiary_share.set(balance / count);
        config.share_locked.set(true);
    }

    // Redeem ETH by beneficiaries after timeout
    fn redeem(&mut self, owner: Address) {
        require(self.owner_exists(owner), "Owner does not exist");
        require(self.is_owner_expired(owner), "Plan not expired");

        let sender = self.vm().msg_sender();
        let mut config = self.owners.setter(owner);
        require(config.beneficiaries.get(sender), "Not a beneficiary");
        require(!config.claimed.get(sender), "Already claimed");

        // Lock share if not already locked
        if !config.share_locked.get() {
            self.lock_share(owner);
            // Refresh config after lock_share
            config = self.owners.setter(owner);
        }

        let amount = config.per_beneficiary_share.get();
        require(amount > U256::from(0), "No funds to redeem");

        // Mark beneficiary as claimed
        config.claimed.setter(sender).set(true);
        config.beneficiaries.setter(sender).set(false);
        config.beneficiary_count.set(config.beneficiary_count.get() - U256::from(1));
        config.balance.set(config.balance.get() - amount);
        
        // If all funds claimed, deactivate the owner's config
        if config.balance.get() == U256::from(0) || config.beneficiary_count.get() == U256::from(0) {
            config.active.set(false);
            self.owner_count.set(self.owner_count.get() - U256::from(1));
        }
        
        // Transfer funds
        let recipient = sender;
        let success = self.vm().transfer_eth(recipient, amount);
        match success {
            Ok(_) => {}
            Err(_) => {
                // Revert state on failed transfer
                config.claimed.setter(sender).set(false);
                config.beneficiaries.setter(sender).set(true);
                config.beneficiary_count.set(config.beneficiary_count.get() + U256::from(1));
                config.balance.set(config.balance.get() + amount);
                
                // Restore owner if deactivated
                if !config.active.get() {
                    config.active.set(true);
                    self.owner_count.set(self.owner_count.get() + U256::from(1));
                }
                
                panic!("Transfer failed");
            }
        }
    }

    // Withdraw all funds (only owner can call before expiration)
    fn withdraw_all(&mut self) {
        let owner = self.vm().msg_sender();
        require(self.owner_exists(owner), "No inheritance plan found");
        
        let mut config = self.owners.setter(owner);
        require(!config.share_locked.get(), "Plan has expired, cannot withdraw");
        
        let amount = config.balance.get();
        require(amount > U256::from(0), "No funds to withdraw");
        
        // Clear the balance before transfer to prevent reentrancy
        config.balance.set(U256::from(0));
        
        // Deactivate the plan if withdrawing all funds
        config.active.set(false);
        self.owner_count.set(self.owner_count.get() - U256::from(1));
        
        // Transfer funds
        let success = self.vm().transfer_eth(owner, amount);
        match success {
            Ok(_) => {}
            Err(_) => {
                // Restore state on failed transfer
                config.balance.set(amount);
                config.active.set(true);
                self.owner_count.set(self.owner_count.get() + U256::from(1));
                panic!("Transfer failed");
            }
        }
    }

    // Get an owner's inheritance plan details
    fn get_plan_details(&self, owner: Address) -> (U256, U256, U256, U256, U256, bool) {
        require(self.owner_exists(owner), "Owner does not exist");
        
        let config = self.owners.get(owner);
        
        (
            config.balance.get(),               // Current balance
            config.beneficiary_count.get(),     // Number of beneficiaries
            config.last_reset.get(),            // Last reset timestamp
            config.timeout_period.get(),        // Timeout period in seconds
            config.per_beneficiary_share.get(), // Share per beneficiary (if locked)
            config.share_locked.get()           // Whether the share is locked
        )
    }

    // Check if a specific owner's plan is expired
    fn is_owner_expired(&self, owner: Address) -> bool {
        require(self.owner_exists(owner), "Owner does not exist");
        
        let config = self.owners.get(owner);
        let current_time = U256::from(block_timestamp(self));
        current_time >= config.last_reset.get() + config.timeout_period.get()
    }
    
    // Check if an address is a beneficiary of a specific owner
    fn is_beneficiary(&self, owner: Address, beneficiary: Address) -> bool {
        require(self.owner_exists(owner), "Owner does not exist");
        
        let config = self.owners.get(owner);
        config.beneficiaries.get(beneficiary)
    }
    
    // Check if a beneficiary has claimed their share
    fn has_claimed(&self, owner: Address, beneficiary: Address) -> bool {
        require(self.owner_exists(owner), "Owner does not exist");
        
        let config = self.owners.get(owner);
        config.claimed.get(beneficiary)
    }
    
    // Get the total number of owners with active plans
    fn get_owner_count(&self) -> U256 {
        self.owner_count.get()
    }

    // Helper function to check if an owner exists
    fn owner_exists(&self, owner: Address) -> bool {
        let config = self.owners.get(owner);
        config.active.get()
    }
}

// Helper function to get block timestamp
fn block_timestamp(contract: &InheritanceContract) -> u64 {
    contract.vm().block_timestamp()
}

// Require function for assertions
fn require(condition: bool, message: &str) {
    if !condition {
        panic!("{}", message);
    }
}