const { INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');

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
}

module.exports = Wallet;

// uuid: Universally Unique Identifier for transaction object IDs 