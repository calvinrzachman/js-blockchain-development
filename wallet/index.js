// Wallet Class
// Describe the basic wallet which holds a private/public keypair and a balance
const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();                // Keypair object
        this.pubKey = this.keyPair.getPublic().encode('hex'); // Method of keypair object which returns the public key

    }
    
    toString() {
        return `Wallet -
            Balance   : ${this.balance}
            Public Key: ${this.pubKey}
            `;
    }

    // Generate signatures
    sign(dataHash) {
        return this.keyPair.sign(dataHash); // Return a signature based on keypair, private key and data
        // This signature can be verified later using the public key
    }

    //Create Transactions and add them to the MemPool
    createTransaction(recipientAddress, amount, txPool) {
        // Do not allow transaction creation if insufficient wallet balance
        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds balance`);
            return;
        } 
        
        let transaction = txPool.existingTransaction(this.pubKey);
        // Update existing transaction in the MemPool
        if (transaction) {
            transaction.updateTransaction(this, recipientAddress, amount);
        } else { // transaction is null (not in MemPool)
            transaction = Transaction.newTransaction(this, recipientAddress, amount)
            txPool.updateOrAddTransaction(transaction);
        }

        return transaction;

    }
}

module.exports = Wallet;

// uuid: Universally Unique Identifier for transaction object IDs 