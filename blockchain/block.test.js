// Block Class - Jest Unit Testing 
const Block = require('./block');
const { DIFFICULTY, MINE_RATE} = require('../config');

describe('Block', () => {
    let data, lastBlock, block; 
    
    beforeEach(() => {
        data = 'Block 1';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
        newBlock = Block.mineBlock(block, "Block 2");
    });
    
    // Test 1
    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data); 
    });

    // Test 2
    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash); 
    });

    // Test 3 
    it('generates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
        console.log(JSON.stringify(block, null, 4));
    });

});
