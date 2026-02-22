const express = require('express');
const router = express.Router();

// Import individual controllers
const registerAccount = require('./register');
const login = require('./login');
const logout = require('./logout');
const verifyWallet = require('./verify-wallet');
const recoverAccount = require('./recover-account');
const refreshToken = require('./refresh-token');

// Map routes to controllers
router.post('/register', registerAccount);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-wallet', verifyWallet);
router.post('/recover-account', recoverAccount);
router.post('/refresh-token', refreshToken);

module.exports = router;