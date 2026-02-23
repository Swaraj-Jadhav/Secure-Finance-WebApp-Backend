const express = require('express');
const router = express.Router();


const registerAccount = require('./register');
const login = require('./login');
const logout = require('./logout');
const verifyWallet = require('./verify-wallet');
const recoverAccount = require('./recover-account');
const refreshToken = require('./refresh-token');


router.post('/register', registerAccount);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-wallet', verifyWallet);
router.post('/recover-account', recoverAccount);
router.post('/refresh-token', refreshToken);

module.exports = router;