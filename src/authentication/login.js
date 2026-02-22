const jwt = require('jsonwebtoken');
const { reconstructHash } = require('../utils/sss');
const { fetchFromIPFS } = require('../utils/pinata');

const login = async (req, res) => {
    try {
        const { cids, walletAddress } = req.body; 
        
        // CHANGED: Now strictly requires exactly 5 CIDs
        if (!cids || cids.length !== 5) {
            return res.status(400).json({ error: "All 5 CIDs are required to authenticate" });
        }

        // CHANGED: Fetching all 5 from Pinata instead of slicing the first 3
        const sharePromises = cids.map(cid => fetchFromIPFS(cid));
        const fetchedData = await Promise.all(sharePromises);
        
        const sharesArray = fetchedData.map(data => {
            if (data.walletAddress !== walletAddress) throw new Error("Wallet mismatch on CID payload");
            return data.share;
        });
        
        // SSS mathematically combines all 5 shares to reveal the same secret hash
        const reconstructedHash = reconstructHash(sharesArray);
        
        // CHANGED: Using process.env for secrets
        const accessToken = jwt.sign({ walletAddress, hash: reconstructedHash }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ walletAddress }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
        
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(401).json({ error: "Authentication failed. Invalid CIDs.", details: error.message });
    }
};

module.exports = login;