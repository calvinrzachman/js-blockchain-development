// Miner Class
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');;
const Wallet = require('../wallet');
const P2pServer = require('./p2p-server'); 
const Transaction = require('../wallet/transaction');

const ChainUtil = require('../chain-util');
const { MAX_BLOCK_SIZE } = require('../config');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        // Grabs unconfirmed (but valid) transactions from the Mempool, creates a block, then
        // it tells the P2P server to synchronize the chains across network members

        const validTransactions = this.transactionPool.validTransactions(); // An array of valid transactions

        // Build and Add the Reward for the Miner
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));

        // validTransactions.push(transactionPool.collectFees(validTransactions));

        // Create a block consisting of the valid transactions
        const newBlock = this.blockchain.addBlock(validTransactions);
        // UPDATE (7/18)
        // const optimalSolution = this.constructOptimalBlock(transactionPool);
        // const optimalTransactions = optimalSolutions.forEach(solution => solution.transaction);
        // const newBlock = this.blockchain.addBlock(optimalTransactions);
        //

        // Synchronize the chains in the peer-to-peer network
        this.p2pServer.syncChains();

        // Update/Clear local transaction pool
        this.transactionPool.clearTransactions();
        // this.transactionPool.updatePool();

        // Broadcast updated transaction pool
        this.p2pServer.broadcastClearTransactions();

        return newBlock;
    }

    constructOptimalBlock(validTransactions) {
        // Given a set of valid transactions and associated fees,
        // Find and return the 'optimal set' of valid transactions from an array of valid 
        // transactions. Here 'optimal set' is defined as the set which maximizes the miner reward.
        // This is a version of the classic knapsack problem - I believe it has a GREEDY or DYNAMIC solution
        let fees = [];

        // Assemble an array of objects { profit:  , weight: , transaction: } for use by knapsack.js
        validTransactions.forEach(tx => {
            let transactionString = JSON.stringify(tx);
            fees.push( {  profit: Transaction.calculateMinerFee(tx),
                        weight: ChainUtil.getStringSize(transactionString), transaction: tx });  
        });

        // Call knapsack(items, capacity) with fees and MAX_BLOCK_SIZE
        const optimalTransactions = ChainUtil.knapsack(fees, MAX_BLOCK_SIZE);
        console.log(JSON.stringify(optimalTransactions, null, 4));
        return optimalTransactions;
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
// constructOptimalBlock(tranasactionPool)


// PLAN
/*
    -  *** (DONE) Update the Transaction class to include new `size` and `minerFee` properties

    -  *Allow the creator of a transaction to leave a difference between all the outputs.amount 
        and input.amount (s.t. outputs < input of course) with the differnece the implied fee
        to the miner (in a Wallet implementation this should not be user selected...)

    -  (DONE) Implement Transaction::calculateMinerFee()
    -  (DONE) Implement Miner::constructOptimalBlock()
        WARNING: the knapsack problem scales poorly with size 

    -  *** Edit TransactionPool::clearTransactions() so as to not delete the entire pool but rather only those tx included in block
    -  **Make fixes to Wallet::calculateBalance(blockchain) to improve efficiency
    -  **Consider other efficiency improvements

    It seems a wallet would likely want information on the tx fees being accepted by Miner's
    for inclusion in blocks and make that calcuation along with info on the tx size. 
    https://blog.bitgo.com/the-challenges-of-bitcoin-transaction-fee-estimation-e47a64a61c72

    MODIFY knapsack so that it returns an array `optimalTransactions` 


    UPDATE (7/19)
        - added new `size` and `minerFee` properties to the Transaction Class
        - made sure these properties were calculated any time a new transaction is created/updated
        - added a couple tests to transaction.test

*/

