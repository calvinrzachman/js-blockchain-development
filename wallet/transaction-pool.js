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
    
    validTransactions() {
        //returns a filtered array of transactions which are valid 
        // Implement and Follow The Consensus Rules 
        return this.transactions.filter(tx => {
            // Total output amount of tranasactions
            const outputTotal = tx.outputs.reduce((total,output) => {
                return total + output.amount; // add the amount to global total variable
            }, 0);

            // Enforce consistency between input and output amounts
            if (tx.input.amount != outputTotal) {
                console.log(`Invalid transaction from ${tx.input.address}. 
                The sum value of the inputs does not equal the sum value of outputs`); // Consider miner fee
                return; // skip the current transaction in filtering as it is not valid
            }

            // Verification of signatures
            if (!Transaction.verifyTransaction(tx)) {
                console.log(`Invalid signature from ${tx.input.address}.`);
                return;  
            }

            // Add more rules here if necessary
            console.log('Adding VALID TX');
            return tx; // these transactions will be included in the filtered array as they follow the Consensus rules
        });
    }

    clearTransactions() {
        this.transactions = [];
    }

}


module.exports = TransactionPool; 