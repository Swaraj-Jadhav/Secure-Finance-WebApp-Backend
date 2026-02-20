const express = require("express");
const router = express.Router();

const subaccountController = require("./subaccount.controller");

router.post("/create", subaccountController.createSubaccount);
router.get("/list", subaccountController.listSubaccounts);
router.get("/:id", subaccountController.getSubaccount);
router.delete("/:id", subaccountController.deleteSubaccount);

module.exports = router;
