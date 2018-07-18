// Miner Class
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');;
const Wallet = require('../wallet');
const P2pServer = require('./p2p-server'); 
const Transaction = require('../wallet/transaction');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        // Grabs transactions from the pool, creates a block with of unconfirmed transactions, then
        // it tells the P2P server to synchronize the chains across network members

        const validTransactions = this.transactionPool.validTransactions();

        // Build a Reward for the Miner

        // validTransactions.push(transactionPool.colletFees(validTransactions));

        // Create a block consisting of the valid transactions
       
        // Synchronize the chains in the peer-to-peer network

        // Update local transaction pool

        // Broadcast updated transaction poo
    }
}

module.exports = Miner; 

// UPDATE (7/15) - finish miner class 


// UPDATE (7/16) - As of now we do not enforce a Block Size Limit. Add this functionaility and 
// update this function to only remove the transactions from the pool which were included in 
// the most recent block

// In order to enforce a blocksize limit we will need to define one ( 1MB like BTC). Then
// we will need to add a function which selects an optimal set of valid transactions
// Here 'optimal set' is defined as the set which maximizes the miner reward.
