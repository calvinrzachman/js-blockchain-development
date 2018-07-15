// CHAINUTIL CLASS
// Create a class to contain utility functions 
// ********************************************
const EC = require('elliptic').ec; 
const ec = new EC('secp256k1');         // Same elliptic curve used by Satoshi in Bitcoin Protocol
const SHA256 = require('crypto-js/sha256');

class ChainUtil {

    static genKeyPair() {
        return ec.genKeyPair(); // Generate a private public key pair
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

}

module.exports = ChainUtil;