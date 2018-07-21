// BLOCK CLASS
// Create the base unit of the blockchain - the Block Class 
// ********************************************************
const ChainUtil = require('../chain-util');             // A class containing utility functions
const { DIFFICULTY, MINE_RATE } = require('../config'); // Application wide constants

class Block {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty, index) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;  
        this.difficulty = difficulty || DIFFICULTY;
        // The timestamp, previous hash, merkle root, and nonce make up the block header (could add more - block header class/struct)
        // The block header is repeatedly hashed changing the nonce each time until the block hash
        // satisfies the difficutly target specified by the protocol
        
        this.index = index; 
        // this.merkleroot
        // The merkle root represents the root of the binary hash tree which compactly summarizes
        // the transactions which are stored in the block. Changing any attribute of any tx
        // changes the hash(tx) which changes the merkle root
    }

    static genesis() {
        return new this('Genesis', "0", "first hash", [], 0, DIFFICULTY, 0);
    } 

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let nonce = 0;
        let { difficulty, index } = lastBlock; 
        // Repeatedly Hash Block until Difficulty Target is satisfied
        do {
            nonce++;
            timestamp = Date.now(); 
            difficulty = Block.adjustDifficulty(timestamp, lastBlock); 
            hash = Block.calculateHash(timestamp, lastHash, data, nonce, difficulty);
            
        } while (hash.substring(0,difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty, index + 1);
    }

    static calculateHash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(timestamp + lastHash + data + nonce, difficulty).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty} = block ;
        return Block.calculateHash(timestamp, lastHash, data, nonce, difficulty);
    }

    // Dyanamic Block Difficulty 
    static adjustDifficulty(currentTime, lastBlock) {
        let { difficulty } = lastBlock;
        // Ternary expression which increases or decreases difficulty 
        difficulty = currentTime - lastBlock.timestamp > MINE_RATE ? difficulty-1 : difficulty+1;
        return difficulty;
    }
}

module.exports = Block;

