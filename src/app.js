const express = require("express");
//const cors = require('cors');
//const loginRoutes = require('./authentication/login');
const accountRoutes = require("./account/account.routes");
const subaccountRoutes = require("./subaccount/subaccount.routes");
const transactionRoutes = require("./transactions/transaction.route");
const app = express();
//app.use(cors());
app.use(express.json());

// Routes
//app.use('/api/authentication', loginRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/subaccounts", subaccountRoutes);
app.use("/api/transactions", transactionRoutes);

//app.listen(3000, () => {
//  console.log('Backend running: http://localhost:3000');
//})
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
