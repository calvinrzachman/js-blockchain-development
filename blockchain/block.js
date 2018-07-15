// BLOCK CLASS
// Create the base unit of the blockchain - the Block Class 
// ********************************************************
const ChainUtil = require('../chain-util');             // A class containing utility functions
const { DIFFICULTY, MINE_RATE } = require('../config'); // Application wide constants

class Block {

    constructor(timestamp, lastHash, hash, data, nonce, DIFFICULTY) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;  
        this.difficulty = DIFFICULTY;
    }

    static genesis() {
        return new this('Genesis', "0","first hash", [], 0, DIFFICULTY);
    } 

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let nonce = 0;
        const difficulty = DIFFICULTY;
        // Repeatedly Hash Block until Difficulty Target is satisfied
        do {
            nonce++;
            timestamp = Date.now(); 
            hash = Block.calculateHash(timestamp, lastHash, data, nonce, difficulty);
            
        } while (hash.substring(0,DIFFICULTY) !== '0'.repeat(DIFFICULTY));
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static calculateHash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(timestamp + lastHash + data + nonce, difficulty).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty} = block ;
        return Block.calculateHash(timestamp, lastHash, data, nonce, difficulty);
    }
}

module.exports = Block;

