const jwt = require('jsonwebtoken');
const { reconstructHash } = require('../utils/sss');
const { fetchFromIPFS } = require('../utils/pinata');

const login = async (req, res) => {
    try {
        const { cids, walletAddress } = req.body; 
        
        if (!cids || cids.length !== 5) {
            return res.status(400).json({ error: "All 5 CIDs are required to authenticate" });
        }

        const sharePromises = cids.map(cid => fetchFromIPFS(cid));
        const fetchedData = await Promise.all(sharePromises);
        
        const sharesArray = fetchedData.map(data => { 
            if (data.walletAddress!== walletAddress) throw new Error("Wallet mismatch on CID payload");
            return data.share;
        });
        
        const reconstructedHash = reconstructHash(sharesArray);
 
        const accessToken = jwt.sign({ walletAddress, hash: reconstructedHash }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ walletAddress }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
        
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(401).json({ error: "Authentication failed. Invalid CIDs.", details: error.message });
    }
};

module.exports = login;