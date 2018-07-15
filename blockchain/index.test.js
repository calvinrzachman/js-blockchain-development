const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
    let bchain, bchain2;

    beforeEach(() => {
        bchain = new Blockchain(); // Each test gets a fresh instance of the Blockchain class. Avoid cross test pollution
        bchain2 = new Blockchain();
    });

    // Test 1
    it('Blockchain starts with genesis block', () => {
        expect(bchain.chain[0]).toEqual(Block.genesis());
    });

    // Test 2
    it('adds a new block', () => {
        const data = "test data";
        bchain.addBlock(data);
        expect(bchain.chain[bchain.chain.length-1].data).toEqual(data);
    });

    // Test 3
    it('validates a valid chain', () => {
        bchain2.addBlock('foo');
        expect(bchain.isValidChain(bchain2.chain)).toBe(true); // toBe for true or false assertions
    });

    // Test 4
    it('invalidates a chain with a corrupt genesis block', () => {
        bchain2.chain[0].data = 'corrupt data';
        expect(bchain.isValidChain(bchain2.chain)).toBe(false);
    });

    // Test 5 
    it('invalidates a chain with a corrupt block', () => {
        bchain2.addBlock('test data');
        bchain2.chain[1].data = 'corrupt test data';
        expect(bchain2.isValidChain(bchain2.chain)).toBe(false);
    });

    // Test 6
    it('rejects incoming chain with less PoW', () => {
        bchain.addBlock('block 1');
        bchain.replaceChain(bchain2.chain);
        expect(bchain.chain).not.toEqual(bchain2.chain);
    });

    // Test 7
    it('accepts valid incoming chain with more PoW', () => {
        bchain2.addBlock('block 1');
        bchain.replaceChain(bchain2.chain);
        expect(bchain.chain).toEqual(bchain2.chain);
    });

});