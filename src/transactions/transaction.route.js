const express = require("express");
const router = express.Router();
const controller = require("./transaction.controller");

router.post("/initiate", controller.initiateTransaction);
router.post("/confirm", controller.confirmTransaction);
router.get("/history", controller.transactionHistory);
router.get("/:txHash", controller.getTransactionByHash);

module.exports = router;