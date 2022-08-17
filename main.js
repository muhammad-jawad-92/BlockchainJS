const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    //proof of work - mining blocks based on difficulty level, e.g. putting requirement of having 4 leading zeros in the hash
    mineBlock(difficulty) {
        const zeros = Array(difficulty + 1).join("0");
        while (this.hash.substring(0, difficulty) !== zeros) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: ", this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    createGenesisBlock() {
        return new Block("01/01/2022", "Genesis Block", "0");
    }
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    //in reality, miners have to pick which transactions to include, because size of block is limited to 1MB
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(new Date(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }
    //blockchain is valid if all blocks are valid
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

const myChain = new Blockchain();
myChain.createTransaction(new Transaction('address1', 'address2', 100));
myChain.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
myChain.minePendingTransactions('my-address');

console.log('\n Balance of my-address: ', myChain.getBalanceOfAddress('my-address'));

console.log('\n Starting the miner again...');
myChain.minePendingTransactions('my-address');

console.log('\n Balance of my-address: ', myChain.getBalanceOfAddress('my-address'));
