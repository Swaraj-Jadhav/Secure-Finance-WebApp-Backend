
const express = require("express");
const cors = require("cors");


const authRoutes = require("./authentication/routes");
const accountRoutes = require("./account/account.routes");
const subaccountRoutes = require("./subaccount/subaccount.routes");
const transactionRoutes = require("./transactions/transaction.route");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/subaccounts", subaccountRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;