extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    storage::{StorageAddress, StorageBool, StorageMap, StorageU256},
};

// sol_interface! {
//     interface IERC20 {
//         function balanceOf(address account) external view returns (uint256);
//         function transfer(address recipient, uint256 amount) external returns (bool);
//     }
// }

#[storage]
#[entrypoint]
pub struct InheritanceContract {
    // Owner of the contract
    owner: StorageAddress,
    // Beneficiaries (address => is_beneficiary)
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
    // Constructor to initialize the contract
    #[payable]
    fn constructor(&mut self, initial_beneficiaries: Vec<Address>) {
        self.owner.set(self.vm().msg_sender());
        self.timeout_period.set(U256::from(31_536_000)); // 1 year in seconds
        self.last_reset.set(U256::from(block_timestamp(self)));
        self.balance.set(self.vm().msg_value());
        self.share_locked.set(false);

        let mut count = 0;
        for addr in initial_beneficiaries.iter().take(5) {
            if !addr.is_zero() && !self.beneficiaries.get(*addr) {
                self.beneficiaries.setter(*addr).set(true);
                count += 1;
            }
        }
        self.beneficiary_count.set(U256::from(count));
    }

    // Add funds (ETH) to the contract
    #[payable]
    fn add_funds(&mut self) {
        require(
            self.vm().msg_sender() == self.owner.get(),
            "Only owner can add funds",
        );
        require(
            !self.share_locked.get(),
            "Contract has expired, cannot add funds",
        );
        let amount = U256::from(self.vm().msg_value());
        self.balance.set(self.balance.get() + amount);
    }

    // Add a beneficiary
    fn add_beneficiary(&mut self, beneficiary: Address) {
        require(
            self.vm().msg_sender() == self.owner.get(),
            "Only owner can add beneficiary",
        );
        require(
            !self.share_locked.get(),
            "Contract has expired, cannot add beneficiary",
        );
        require(
            self.beneficiary_count.get() < U256::from(5),
            "Max 5 beneficiaries",
        );
        require(!beneficiary.is_zero(), "Invalid beneficiary address");
        require(
            !self.beneficiaries.get(beneficiary),
            "Beneficiary already exists",
        );

        self.beneficiaries.setter(beneficiary).set(true);
        self.beneficiary_count
            .set(self.beneficiary_count.get() + U256::from(1));
    }

    // Remove a beneficiary
    fn remove_beneficiary(&mut self, beneficiary: Address) {
        require(
            self.vm().msg_sender() == self.owner.get(),
            "Only owner can remove beneficiary",
        );
        require(
            !self.share_locked.get(),
            "Contract has expired, cannot remove beneficiary",
        );
        require(self.beneficiaries.get(beneficiary), "Not a beneficiary");

        self.beneficiaries.setter(beneficiary).set(false);
        self.beneficiary_count
            .set(self.beneficiary_count.get() - U256::from(1));
    }

    // Reset the timer (only owner)
    fn reset_timer(&mut self) {
        require(
            self.vm().msg_sender() == self.owner.get(),
            "Only owner can reset timer",
        );
        require(
            !self.share_locked.get(),
            "Contract has expired, cannot reset timer",
        );
        self.last_reset.set(U256::from(block_timestamp(self)));
    }

    // Lock the per-beneficiary share amount (called once when contract expires)
    fn lock_share(&mut self) {
        require(self.is_expired(), "Contract not expired yet");
        require(!self.share_locked.get(), "Share already locked");

        let count = self.beneficiary_count.get();
        require(count > U256::from(0), "No beneficiaries");

        let balance = self.balance.get();
        require(balance > U256::from(0), "No funds to distribute");

        // Lock in the per-beneficiary share
        self.per_beneficiary_share.set(balance / count);
        self.share_locked.set(true);
    }

    // Redeem ETH by beneficiaries after timeout
    fn redeem(&mut self) {
        require(self.is_expired(), "Contract not expired");

        let sender = self.vm().msg_sender();
        require(self.beneficiaries.get(sender), "Not a beneficiary");
        require(!self.claimed.get(sender), "Already claimed");

        // Lock share if not already locked
        if !self.share_locked.get() {
            self.lock_share();
        }

        let amount = self.per_beneficiary_share.get();
        require(amount > U256::from(0), "No funds to redeem");

        // Mark beneficiary as claimed
        self.claimed.setter(sender).set(true);
        self.beneficiaries.setter(sender).set(false);
        self.beneficiary_count
            .set(self.beneficiary_count.get() - U256::from(1));
        self.balance.set(self.balance.get() - amount);
        let recipient = sender;
        let success = self.vm().transfer_eth(recipient, amount);
        match success {
            Ok(_) => {}
            Err(_) => {
                // Revert state on failed transfer
                self.claimed.setter(sender).set(false);
                self.beneficiaries.setter(sender).set(true);
                self.beneficiary_count
                    .set(self.beneficiary_count.get() + U256::from(1));
                self.balance.set(self.balance.get() + amount);
                panic!("Transfer failed");
            }
        }
    }

    // Check if contract is expired
    fn is_expired(&self) -> bool {
        let current_time = U256::from(block_timestamp(self));
        current_time >= self.last_reset.get() + self.timeout_period.get()
    }

    // Get contract balance
    fn get_balance(&self) -> U256 {
        self.balance.get()
    }

    // Get beneficiary count
    fn get_beneficiary_count(&self) -> U256 {
        self.beneficiary_count.get()
    }

    // Get last reset timestamp
    fn get_last_reset(&self) -> U256 {
        self.last_reset.get()
    }

    // Get per beneficiary share amount (0 if not locked yet)
    fn get_per_beneficiary_share(&self) -> U256 {
        self.per_beneficiary_share.get()
    }

    // Check if a beneficiary has claimed their share
    fn has_claimed(&self, beneficiary: Address) -> bool {
        self.claimed.get(beneficiary)
    }

    // Check if share is locked (contract expired)
    fn is_share_locked(&self) -> bool {
        self.share_locked.get()
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
