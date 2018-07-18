const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

//Main Scenario
describe('Wallet Test', () => {
    let wallet, txPool, bchain;

    beforeEach( () => {
        const wallet = new Wallet();
        const txPool = new TransactionPool();
        bchain = new Blockchain();
    });

    // Scenario 2 - Creating Transaction
    describe('wallet creates a new transaction', () => {
        let transaction, sendAmount, recipient, wallet, txPool;

        beforeEach(() => {
            wallet = new Wallet();
            txPool = new TransactionPool();
            sendAmount = 50;
            recipient = "recipient address";
            transaction = wallet.createTransaction(recipient, sendAmount, bchain, txPool);
        });

        // Scenario 3 - Repeating Transaction
        describe('and doing the same transaction', () => {

            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bchain, txPool);
            });

            it('doubles the `sendAmount` subtracted from wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.pubKey).amount)
                .toEqual(wallet.balance - 2*sendAmount);
            });

            it('clones the `sendAmount` output for each recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient)
                .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
                // map creates an array 
            });

        });
        
        // Scenario 4 - Calculating a Balance
        describe('calculating a balance', () => {
            let addBalance, repeatAdd, senderWallet;

            beforeEach(() => {
                wallet = new Wallet();
                senderWallet = new Wallet();
                addBalance = 100;
                repeatAdd = 3;
                for (let i = 0; i < repeatAdd; i++) {
                    senderWallet.createTransaction(wallet.pubKey, addBalance, bchain, txPool);
                }
                bchain.addBlock(txPool.transactions); //adds block without needing to mine
            });

            it('calculates the balance for blockchain transactions matching recipient', () => {
                expect(wallet.calculateBalance(bchain)).toEqual(INITIAL_BALANCE + (addBalance*repeatAdd));
            });

            it('calculates the balance for the sender wallet', () => {
                expect(senderWallet.calculateBalance(bchain)).toEqual(INITIAL_BALANCE - (addBalance*repeatAdd));
            });

            // Scenario 5 - Recipient Sends Return Transaction
            describe('and the recipient conducts a transaction', () => {
                let subtractBalance, recipientBalance;
                beforeEach(() => {
                    wallet = new Wallet();
                    txPool.clearTransactions();
                    subtractBalance = 75;
                    recipientBalance = wallet.calculateBalance(bchain);
                    wallet.createTransaction(senderWallet.pubKey, subtractBalance, bchain, txPool); // create transaction and add to Mempool
                    bchain.addBlock(txPool.transactions) // add the block without mining
                })

                describe('and the sender sends another tx to the recipient', () => {
                    beforeEach(() => {
                        txPool.clearTransactions();
                        senderWallet.createTransaction(wallet.pubKey, addBalance, bchain, txPool);
                        bchain.addBlock(txPool.transactions);
                    });

                    it('calculate recipient balance only using transactions since its most recent', () => {
                        expect(wallet.calculateBalance(bchain)).toEqual(recipientBalance - subtractBalance + addBalance);
                    });
                });

            });

        });
    });
   
});