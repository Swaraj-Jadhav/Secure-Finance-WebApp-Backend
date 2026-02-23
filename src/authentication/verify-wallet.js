const { ethers } = require('ethers');

const verifyWallet = async (req, res) => {
    try {
        const { walletAddress, signature, message } = req.body;

        if (!walletAddress || !signature || !message) {
            return res.status(400).json({ error: "Missing verification parameters" });
        }

        const recoveredAddress = ethers.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
            res.status(200).json({ verified: true, message: "Wallet successfully verified" });
        } else {
            res.status(401).json({ verified: false, error: "Signature recovery failed" });
        }
    } catch (error) {
        res.status(500).json({ error: "Wallet verification error", details: error.message });
    }
};

module.exports = verifyWallet;