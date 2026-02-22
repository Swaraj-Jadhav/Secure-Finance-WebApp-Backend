// POST /api/auth/register
const { shredPassword } = require('../utils/sss');
const { pinJSONToIPFS } = require('../utils/pinata');

const registerAccount = async (req, res) => {
    try {
        const { password, walletAddress } = req.body;
        
        if (!password || !walletAddress) {
            return res.status(400).json({ error: "Password and wallet address required" });
        }

        // 1. Hash and split into 5 shares (threshold 3)
        const shares = shredPassword(password); 
        
        // 2. Pin each share to Pinata asynchronously
        const cidPromises = shares.map(share => 
            pinJSONToIPFS({ pinataContent: { share, walletAddress } })
        );
        const cids = await Promise.all(cidPromises);
        
        // 3. Return CIDs for the user to store safely
        res.status(201).json({
            message: "Account created. Store these 5 CIDs securely. You need 3 to login.",
            cids: cids
        });
    } catch (error) {
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

module.exports = registerAccount;