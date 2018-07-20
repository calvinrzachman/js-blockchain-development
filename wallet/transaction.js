// Transaction Class 
// Specify the structure of a transaction: inputs, outputs, id
// *******************************************************
const ChainUtil = require('../chain-util');
const { MINER_REWARD, COST_PER_BYTE } = require('../config');

class Transaction {
    
    constructor() {
        this.id = ChainUtil.id();   // Get unique ID
        this.input = null;
        this.outputs = []; 
        this.size = null;           // the size in bytes of a transaction. ChainUtil.getStringSize() to find size when transaction has been built
        this.minerFee = null;       // calculate this 
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

        Transaction.calculateMinerFee(transaction);             // Calculate Miner Fee  
        // Sign the transaction
        Transaction.signTransaction(transaction, senderWallet); // Create input and sign

        //UPDATE (7/19)
        // Calculate New Miner Fee
        transaction.minerFee = Transaction.calculateMinerFee(transaction);
        
        // Calculate transaction size
        const transactionString = JSON.stringify(transaction);
        transaction.size = ChainUtil.getStringSize(transactionString);
        //

        return transaction;       
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        //Special case for Coinbase transaction - approved by blockchain itslef 
        return Transaction.addOutputs(blockchainWallet,[{
            amount: MINER_REWARD,
            address: minerWallet.pubKey
        }])
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
        
        //UPDATE (7/19)
        // Calculate New Miner Fee
        this.minerFee = Transaction.calculateMinerFee(this);
        
        // Update transaction size
        const transactionString = JSON.stringify(this);
        this.size = ChainUtil.getStringSize(transactionString);
        //

        return this;
    }

    // UPDATE - Needed
    static calculateMinerFee(transaction) {
        // Add a calculateMinerFee() method which calculates a fee for the transaction depending on its size
        // Also consider allowing the user to specify the fee which they want to provide.
        const stringTransaction = JSON.stringify(transaction);
        const transactionByteSize = ChainUtil.getStringSize(stringTransaction);
        transaction.size = transactionByteSize;
        return transactionByteSize * COST_PER_BYTE;
        // calculateMinerFee() will for now simply make this assessment based on size of tx
        // and a STATIC fee of 1 unit of currency per byte
        // Miners will use this function in constructOptimalBlock(tranasactionPool)
    }

}

module.exports = Transaction; 

// Miners will draw valid transactions from the MemPool and include them in a block.
// To confirm validity they need to verify signatures

let transaction = { amount: 10, address: "big boy" }
console.log(Object.keys);
