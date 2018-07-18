// Jest Unit Test - Transaction Pool Class
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('../wallet');

describe('Transaction Pool', () => {
    let pool, transaction, wallet, bchain; 

    beforeEach((() => {
        txPool = new TransactionPool();
        wallet = new Wallet(); 
        transaction = wallet.createTransaction('An address', 25, txPool)      
    }))

    it('adds a transaction to the transaction pool', () => {
        expect(txPool.transactions.find(tx => tx.id === transaction.id)).toEqual(transaction);
    });

    it('it successfully updates a transaction', () => {
        const oldTransaction = JSON.stringify(transaction); // Keep unupdated transaction for comparison
        const newTransaction = transaction.updateTransaction(wallet, 'A new address', 30);
        txPool.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(txPool.transactions.find(tx => tx.id === newTransaction.id))).not
        .toEqual(oldTransaction);
    });

    // Scenario 2 - Valid Transaction Testing 
    describe('mixing valid and corrupt transactions', () => {
        let validTransactions

        beforeEach(() => {
            validTransactions = [...txPool.transactions] //already contains a valid tx from previous scenario
            for( let i = 0; i < 10; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4dr355', 30, txPool);
                if (i % 2 === 0) {
                    transaction.input.amount = 99999;   // corrupt transaction
                } else {
                    validTransactions.push(transaction) // add to an array containing a subset of all valid transactions
                } 
            }
        });

        it('shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(txPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs only valid transactions', () => {
            expect(txPool.validTransactions()).toEqual(validTransactions);
        });
    });

});