// Transaction Pool Class
// Create the Pool of unconfirmed transactions to be mined
// Miners will collect transactions from this.transactions in blocks 
// Typically this collection would be prioritized by the fees included in each transaction 
// ****************************************************
const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        //Takes a transaction object and adds it to the mempool
        let transactionWithID = this.transactions.find(tx => tx.id === transaction.id); // undefined if not found

        // Check if transaction exists in memPool
        // Updated transactions should replace old transactions instead of duplicating
        if (transactionWithID) {
            this.transactions[this.transactions.indexOf(transactionWithID)] = transaction; // replace old with new
            console.log('Transaction updated');
        } else {
            this.transactions.push(transaction);   //add new transaction
            console.log('Transaction added to mempool');
        }        
    }

    existingTransaction(address) {
        return this.transactions.find(tx => tx.input.address === address);
    }

}


module.exports = TransactionPool; 