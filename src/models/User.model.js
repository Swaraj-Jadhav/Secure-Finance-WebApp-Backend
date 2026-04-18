const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletId: { type: String, required: true, unique: true },
    cids: { type: [String], required: true }, // Array of IPFS strings
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);