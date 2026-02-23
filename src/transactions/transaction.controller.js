const transactionService = require("./transaction.service");

const DEMO_USER_ID = "user_123";


const initiateTransaction = async (req, res) => {
  try {
    const result = await transactionService.initiateTransaction(
      DEMO_USER_ID,
      req.body
    );

    res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const confirmTransaction = async (req, res) => {
  try {
    const { txHash } = req.body;
    const result = await transactionService.confirmTransaction(
      DEMO_USER_ID,
      txHash
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


const transactionHistory = async (req, res) => {
  try {
    const result = await transactionService.transactionHistory(
      DEMO_USER_ID
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTransactionByHash = async (req, res) => {
  try {
    const result = await transactionService.getTransactionByHash(
      req.params.txHash
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  initiateTransaction,
  confirmTransaction,
  transactionHistory,
  getTransactionByHash,
};