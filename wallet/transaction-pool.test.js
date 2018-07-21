// Jest Unit Test - Transaction Pool Class
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('../wallet');
const Blockchain = require('../blockchain');

describe('Transaction Pool', () => {
    let txPool, transaction, wallet, bchain; 

    beforeEach((() => {
        txPool = new TransactionPool();
        wallet = new Wallet(); 
        bchain = new Blockchain();
        transaction = wallet.createTransaction('An address', 25, bchain, txPool);      
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

    it('clears transaction', () => {
        txPool.clearTransactions();
        expect(txPool.transactions).toEqual([]);
    });

    // Scenario 2 - Valid Transaction Testing 
    describe('mixing valid and corrupt transactions', () => {
        let validTransactions

        beforeEach(() => {
            validTransactions = [...txPool.transactions] //already contains a valid tx from previous scenario
            for( let i = 0; i < 10; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4dr355', 30, bchain, txPool);
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

        // Scenario 3 - Clears Confirmed Transactions from Transaction Pool
        describe('clears ONLY confirmed transactions from txPool', () => {
            let confirmedTransactions =  [];
            let unconfirmedTransactions = [];
            beforeEach(() => {
                // Dont use the miner class - build the optimal solution and total set yourself
                for(let i = 0; i < validTransactions.length; i++) {
                    if(i % 2 === 0) {
                        confirmedTransactions.push(validTransactions[i]); // Only include some valid transactions 
                    } else {
                        unconfirmedTransactions.push(validTransactions[i]); // This 
                    }
                }
               
            });

            it('clears confirmed transactions', () => {
                txPool.clearConfirmedTransactions(validTransactions, confirmedTransactions);
                expect(txPool.transactions).toEqual(unconfirmedTransactions); 
                // possible we need to stringify the arrays 
            });

        });

    });

});