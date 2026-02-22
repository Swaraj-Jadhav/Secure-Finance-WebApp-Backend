const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");


let transactionDB = [];

async function initiateTransaction(userId, data) {

  const transactionId = uuidv4();

  
  const txHash = crypto
    .createHash("sha256")
    .update(transactionId + userId + data.amount)
    .digest("hex");

  const transaction = {
    transactionId,
    txHash,
    userId,
    to: data.to,
    amount: data.amount,
    status: "initiated",
    createdAt: new Date(),
  };

  transactionDB.push(transaction);

  return transaction;
}

async function confirmTransaction(userId, txHash) {

  const transaction = transactionDB.find(
    (t) => t.txHash === txHash && t.userId === userId
  );

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  transaction.status = "confirmed";
  transaction.confirmedAt = new Date();

  return transaction;
}


async function transactionHistory(userId) {
  return transactionDB.filter(
    (t) => t.userId === userId
  );
}

async function getTransactionByHash(txHash) {

  const transaction = transactionDB.find(
    (t) => t.txHash === txHash
  );

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
}

module.exports = {
  initiateTransaction,
  confirmTransaction,
  transactionHistory,
  getTransactionByHash,
};