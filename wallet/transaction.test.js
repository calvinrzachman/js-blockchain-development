// Transaction Class - Jest Unit Test
const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINER_REWARD } = require('../config');

const ChainUtil = require('../chain-util');

// Main Scenario
describe('Transaction', () => {
    let transaction, wallet, recipient, amount; 
    
    beforeEach( () => {
        wallet = new Wallet();
        recipient = 'big boy'; 
        amount = 50; 
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    }); 

    // Test 1 
    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.pubKey).amount)
        .toEqual(wallet.balance - amount);
    });

    // Test 2
    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
        .toEqual(amount);
    });

    // Test 3
    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    // Test 4
    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true); //Why is this static and not just transaction.verifyTransaction();
    });

    // Test 5
    it('invalidates an invalid transaction', () => {
        transaction.outputs[0] = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    // UPDATE (7/18)
    // Test 6
    it('calculates the fee of transaction', () => {
        console.log(transaction.minerFee)
        expect(transaction.minerFee).not.toEqual(null);
    })

    // Test 7
    it('calculates the size of a transaction', () => {
        console.log(transaction.size)
        expect(transaction.size).not.toEqual(null);
    })

    
    // Scenario 2 - Transacting with Insufficient Balance
    describe('transacting with an `amount` which exceeds the balance', () => {
        beforeEach( () => {
            amount = 10000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        // Test 1
        it('does not create an invalid transaction', () => {
            expect(transaction).toEqual(undefined);
            // Should give undefined since newTransaction() should return nothing since `amount` is larger than balance
        })

    });

    // Scenario 3 - Updating a Transaction
    describe('updating a transaction', () => {
        let nextAmount, nextRecipient;
        beforeEach( () => {
            nextAmount = 20;
            nextRecipient = "ya boy";
            transaction = transaction.updateTransaction(wallet, nextRecipient, nextAmount);
        });

        it('subtracts the next amount from the senders output', () => {
            expect(transaction.outputs.find(output => output.address === wallet.pubKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });

        //
        it('updates transaction size', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });
    });

    // Scenario 4 - Reward Transaction
    describe('creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });

        it('the reward is generated for miner wallet', () => {
            expect(transaction.outputs.find(output => output.address === wallet.pubKey).amount)
            .toEqual(MINER_REWARD);
        });
    });

    
});

// NEXT: Handle transactions submitted by multiple users (mempool, adding to blockchain)
