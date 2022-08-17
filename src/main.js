const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('cfacad9b69050f24365d4f4c91fa08cb52868506dbaae8bff04b5d63bcc5bc21');
const myWalletAddress = myKey.getPublic('hex');

const myChain = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
myChain.addTransaction(tx1);

console.log('\nStarting the miner...');
myChain.minePendingTransactions(myWalletAddress);

console.log('\nBalance of my-address: ', myChain.getBalanceOfAddress(myWalletAddress));

myChain.chain[1].transactions[0].amount = 1;

console.log('Is chain valid? ', myChain.isChainValid());