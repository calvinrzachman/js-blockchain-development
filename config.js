// CONFIG FILE
// This file contains the configuration constants relevant to the project 
// **********************************************************************

const DIFFICULTY = 3;           // Specify the number of leading zeros in the block hash required for valid PoW 
const MINE_RATE = 3000;         // Approximate block time in milliseconds
const INITIAL_BALANCE = 500;    // Starting cryptocurrency balance in wallet
const MINER_REWARD = 100;       // Blockchain itself signs the transaction

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINER_REWARD};