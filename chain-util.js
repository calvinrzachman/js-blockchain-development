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

    // Trying to use this for Transaction::calculateMinerFee and Miner::collectFees(validTransactions)
    static getStringSize(string) {
        // As per the internet:
        // String values are not implementation dependent, according the ECMA-262 3rd Edition Specification, 
        // each character represents a single 16-bit unit of UTF-16 text:
        const sizeInBytes = string.length * 2 ;
        return sizeInBytes;
        // Also consider trying https://www.npmjs.com/package/object-sizeof
    }

    static knapsack(items, capacity) {

        let memo = [];
        let i,j;
    
        // Fill in sub-problem solutions grid
        for(i = 0; i < items.length; i++) {
            let row = [];
            for(let cap = 1; cap <= capacity; cap++) {
                row.push(getSolution(i,cap));
            }
    
            memo.push(row);     // Add row of subproblem solutions to table to be referred to in the next loop iteration
            // console.log(memo[i]);
        }
    
        // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
        return(getLast());
    
        function getLast(){
            const lastRow = memo[memo.length - 1];
            return lastRow[lastRow.length - 1];
        }
    
        function getSolution(row, capacity) {
            // V[i][j] = max(V[i-1][j], V[i-1][j - weight[i]] + profit[i]);
    
            const NO_SOLUTION = {maxValue:0, subset:[]};    //Define what no solution looks like
            // the column number starts from zero.
            let col = capacity - 1;
            let lastItem = items[row]; // Returns an object with `weight` and `value` properties
            // The remaining capacity for the sub-problem to solve.
            let remaining = capacity - lastItem.weight;
    
            // Refer to the last solution for this capacity,
            // which is in the cell of the previous row with the same column
            var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
    
            // Refer to the last solution for the remaining capacity,
            // which is in the cell of the previous row with the corresponding column
            var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;
    
            // If any one of the items weights greater than the 'capacity', return the last solution
            if(remaining < 0){
                return lastSolution;
            }
    
            // Compare the current best solution for the sub-problem with a specific capacity
            // to a new solution trial with the lastItem(new item) added
            var lastValue = lastSolution.maxValue;
            var lastSubValue = lastSubSolution.maxValue;
    
            var newValue = lastSubValue + lastItem.profit;
            if(newValue >= lastValue){
                // copy the subset of the last sub-problem solution
                var _lastSubSet = lastSubSolution.subset.slice();
                _lastSubSet.push(lastItem);
                return {maxValue: newValue, subset:_lastSubSet};
            } else{
                return lastSolution;
            }
    
            
        }
    }

}

module.exports = ChainUtil;