const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]; //Initiate the chain with the genesis block
    }

    addBlock(data) {
        const lastBlock = this.chain[this.chain.length-1];
        const block = Block.mineBlock(lastBlock, data);
        this.chain.push(block);
        
        return block;
    }

    isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;   // incoming genesis block does not match this chain
        }

        for(let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const lastBlock = chain[i-1];
            if (currentBlock.lastHash !== lastBlock.hash || currentBlock.hash !== Block.blockHash(currentBlock) ) {
                return false;
            }
            // Check for possibility that current block has been tampered with
        }
        return true; 
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Incoming chain is not longer than current chain')
            return; 
        } else if (!this.isValidChain(newChain)) {
            console.log('Incoming chain is not valid');
            return; 
        }
        this.chain = newChain; // replacethe current chain with the chain with more Proof of Work
        console.log('Replacing current chain with incoming chain');

    // Blockchains like BTC take the longest chain as the valid chain. The longest chain is the 
    // chain with the most Proof of Work
    } 

    // Get the latest block
    latestBlock() {
        return this.chain[this.chain.length - 1];
    }
}

module.exports = Blockchain;

// Extend Blockchain to support Multiple Chain Validation - multiple contributers which can add 
// to the chain
// Replace the current chain with an incoming chain if its is valid - normally we would have to 
// independently validate the data (each transaction) as well

// Application will allow a user to interact with the blockchain via HTTP requests. We build a network
// around multiple blockchain application so we can have multiple miners updating one shared
// and decentralized application blockchain


// The package.json file was created with a npm init -y at the CLI
// and dependencies are added with the --save-dev flag
// the test field was updated for use with Jest for testing 
// "scripts": {
//      "test": "jest --watchAll",