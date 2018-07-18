// CHAINUTIL CLASS
// Create a class to contain utility functions 
// ********************************************
const EC = require('elliptic').ec; 
const ec = new EC('secp256k1');         // Same elliptic curve used by Satoshi in Bitcoin Protocol
const SHA256 = require('crypto-js/sha256');
const uuidV1 = require('uuid/V1');

class ChainUtil {

    static genKeyPair() {
        return ec.genKeyPair(); // Generate a private public key pair
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    static id() {
        return uuidV1();        // Generate a unique ID
    }

    static verifySignature(pubKey, signature, hash) {
        // Verification of signautre requires a public key, a signature and a hash of the data
        return ec.keyFromPublic(pubKey, 'hex').verify(hash, signature);
        // makes use of keyFromPublic() and verify() from elliptic module
        // verify takes two parameters: hashed data and a signature
    }

}

module.exports = ChainUtil;