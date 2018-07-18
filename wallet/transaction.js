// Transaction Class 
// Specify the structure of a transaction: inputs, outputs, id
// *******************************************************
const ChainUtil = require('../chain-util');
const { MINER_REWARD } = require('../config');

class Transaction {
    
    constructor() {
        this.id = ChainUtil.id();   // Get unique ID
        this.input = null;
        this.outputs = []; 
    }

    static newTransaction(senderWallet, recipientAddress, amount) {
        // Constructs a new transaction given a wallet sending funds to a recipient
        const transaction = new this(); 
        // Check that sending wallet has sufficient funds
        if(amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds current wallet balance`);
            return; 
        }

        //Add new objects to the outputs
        return Transaction.addOutputs(senderWallet, [   
            { amount: senderWallet.balance - amount, address: senderWallet.pubKey},
            { amount, address: recipientAddress}

        ]);
       
    }

    static addOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);

        // Sign the transaction
        Transaction.signTransaction(transaction, senderWallet); //Create input and sign  
        return transaction;       
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        // Construct a reward transaction signed by the blockchain for the miner
        return Transaction.addOutputs(blockchainWallet,[{
            amount: MINER_REWARD,
            recipient: minerWallet.pubKey
        }]);
    }

    static signTransaction(transaction, senderWallet) {
        // Signs a transaction using a wallets keyPair
        // Structure of the input
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.pubKey,
            // Sign the outputs of the transaction
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }

    // Verify Transaction
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address, 
            transaction.input.signature, 
            ChainUtil.hash(transaction.outputs)
        )
    }

    updateTransaction(senderWallet, recipient, amount) {
        // If an indiviudal creates a second transaction in a short time frame simply update the 
        // first transaction to include a new output 
        const senderOutput = this.outputs.find(output => output.address === senderWallet.pubKey) // return the output object whose address matches the sending wallet 

        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance`);
            return; 
        }

        // Change the old output amount to reflect the new amount being sent by the wallet
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient });

        // Sign updated tranasaction
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

}

module.exports = Transaction; 

// Miners will draw valid transactions from the MemPool and include them in a block.
// To confirm validity they need to verify signatures

// Add a getMinerFee() method which calculates a fee for the transaction depending on its size
// Also consider allowing the user to specify the fee which they want to provide.