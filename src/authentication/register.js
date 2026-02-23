// POST /api/auth/register
const { shredPassword } = require('../utils/sss');
const { pinJSONToIPFS } = require('../utils/pinata');

const registerAccount = async (req, res) => {
    try {
        const { password, walletAddress } = req.body;
        
        if (!password || !walletAddress) {
            return res.status(400).json({ error: "Password and wallet address required" });
        }

        const shares = shredPassword(password); 
        
    
        const cidPromises = shares.map(share => 
            pinJSONToIPFS({ pinataContent: { share, walletAddress } })
        );
        const cids = await Promise.all(cidPromises);
 
        res.status(201).json({
            message: "Account created. Store these 5 CIDs securely. ",
            cids: cids
        });
    } catch (error) {
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

module.exports = registerAccount;