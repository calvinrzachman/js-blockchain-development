// Wallet Class
// Describe the basic wallet which holds a private/public keypair and a balance
const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');
const Blockchain = require('../blockchain');

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
    createTransaction(recipientAddress, amount, bchain, txPool) {
        // Do not allow transaction creation if insufficient wallet balance
        this.balance = this.calculateBalance(bchain);

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

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }

    calculateBalance(blockchain) {
        // Amounts are within inputs/outputs which themselves are withing Transactions 
        // Transactions are stored in data field within block objects which form the blockchain
        let balance = this.balance;
        let transactions = []           // Grab transactions relevant to this wallet
        
        blockchain.chain.forEach(block => block.data.forEach(tx => {
            transactions.push(tx);
            // This grabs all transactions from all blocks everytime this function is called
        }));

        // Cruises through all transactions and filters the array down to include only those
        // which contain inputs sending currency from this wallet
        const inputTransactions = transactions.filter(tx => tx.input.address === this.pubKey);
        let startTime = 0; 

        // Find most recent transaction (Look at this later)
        if (inputTransactions.length > 0) {
            const recentInputTransaction = inputTransactions.reduce( 
                (current, prev) => prev.input.timestamp > current.input.timestamp ? prev : current);

            balance = recentInputTransaction.outputs.find(output => output.address === this.pubKey).amount;
            startTime = recentInputTransaction.input.timestamp;
            // Wouldnt the most recent transaction be at the end of inputTransactions?
            // inputTransactions[inputTransactions.length -1]
        }

        // All outputs sending to this wallet after this most recent outgoing transaction should
        // be added to balance
        const outputTransactions = transactions.forEach(tx => {
            if( tx.input.timestamp > startTime) {
                tx.outputs.find(output => {
                    if (output.address === this.pubKey) {
                        balance += output.amount;
                    }
                })
            }
        });

        return balance;
        
        // If we index blocks in our blockchain could we not just take the 
        //blockchain.chain[blockchain.length-1] and find the last block

        // UPDATE: this function should be updated
        // Find all transactions which contain outputs addressed to this wallet
        // Find all transactions which contain inputs sending currency from this wallet
        // Add up the total amount sent
        // Add up the total amount received 

        // Keep track of last block when calculateBalance was called 
        // so that we may return quickly if this function is called in quick succession

        // Return the balance
    }
}

module.exports = Wallet;

// uuid: Universally Unique Identifier for transaction object IDs 