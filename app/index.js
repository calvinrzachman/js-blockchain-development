// BLOCKCHAIN API
// A collection of HTTP requests which will allow users to interact with the application
// Users will be able to view the blocks using the API and act as miners through a mining endpoint
// in order to write blocks to the chain
// *********************************************

// We are using Express - a Node.js Web Application Framework
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain'); // Grabs the index.js file by default
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

// Define a port which our application will listen to requests on
const HTTP_PORT = process.env.HTTP_PORT || 3001; 

const app = express() ;             // Call default express function - creates an express application with a lot of functionality
const bchain = new Blockchain();
const wallet = new Wallet();
const txPool = new TransactionPool(); 
const p2pServer = new P2pServer(bchain, txPool);
const miner = new Miner(bchain, txPool, wallet, p2pServer);

app.use(bodyParser.json());         // Allows us to receive JSON within POST requests

// Blocks
// Define GET request
app.get('/blocks', (req, res) => {
    res.json(bchain.chain);
});

// Define POST Request
app.post('/mine', (req,res) => {
    const block = bchain.addBlock(req.body.data);
    console.log(`New block added ${JSON.stringify(block)}`);

    p2pServer.syncChains();
    res.redirect('/blocks');
});

// Transactions
// Define GET request
app.get('/transactions', (req, res) => {
    res.json(txPool.transactions); // Create the json form of the transaction in the mem pool and send it back as response 
});

// Define POST Request
app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bchain, txPool);
    console.log(`Transaction created ${JSON.stringify(transaction)}`);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions'); // Redirect to existing tx GET endpoint so they can see the new tx
});

//Expose the pubKey (address) of a user so it can be shared with other individuals so they can receive currency 
app.get('/public-key', (req, res) => {
    res.json( { publicKey: wallet.pubKey });
});

// Mining 
app.get('/mine-transactions', (req,res) => {
    const block = miner.mine();
    console.log(`New block added: ${JSON.stringify(block, null, 4)}`)
    res.redirect('/blocks'); // See new mined block
})

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`)
});

// Start the server
p2pServer.listen();