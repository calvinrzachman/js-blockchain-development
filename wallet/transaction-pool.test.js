// Jest Unit Test - Transaction Pool Class
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('../wallet');

describe('Transaction Pool', () => {
    let pool, transaction, wallet, bchain; 

    beforeEach((() => {
        txPool = new TransactionPool();
        wallet = new Wallet(); 
        transaction = Transaction.newTransaction(wallet, 'An address', 25);
        txPool.updateOrAddTransaction(transaction); //Add transaction to the pool       
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

});