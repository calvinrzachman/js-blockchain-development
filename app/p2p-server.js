// Peer to Peer Server Class
// Setting up P2P Server - shares transaction and chain information across multiple application instances
const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []; // Ternary expression which sets empty array if peers not provided

// Attach type values to data so message handler can implement a switch to handle receiving 
// data of multiple types
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        // Create a websocket server using the Server class from the ws module 
        const server = new Websocket.Server({ port: P2P_PORT });
        // Event listener - takes string specifying event listened for
        server.on('connection', socket => this.connectSocket(socket));
        
        this.connectToPeers();

        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    // Add new websockets to our p2p server
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket Connected');

        this.messageHandler(socket); //Each socket is ready to recieve message events
        this.sendChain(socket);
    }

    // Connect peers
    connectToPeers() {
        peers.forEach(peer => {
            //ws:localhost:5001
            const socket = new Websocket(peer); // create WebSocket object
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    // Handle Message from Peers: Send each blockchain instance to peers through the p2pserver
    // Handle messages received from other application instances
    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    // Update the blockchain with new data
                    this.blockchain.replaceChain(data.chain); 
                    break;
                case MESSAGE_TYPES.transaction:
                    // Add the incoming transaction to the mempool
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clearTransactions();
                    break;

            }
        });
    }

    // Send the users blockchain to every connected socket (connected user)
    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain, 
            chain: this.blockchain.chain 
        })); 
    }
    // When a new block is added to a chain, each pair should be notified of addition
    syncChains() {
        // Send the updated blockchain to all the socket peers
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    //Send and Synchronize Transaction MemPool
    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction)); 
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify( {
            type: MESSAGE_TYPES.clear_transactions
        })));
    }

}

module.exports = P2pServer;

// A second application instance can be created using a command like: 
// $ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws:localhost:5001 npm run dev


