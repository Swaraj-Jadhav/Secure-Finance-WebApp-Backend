// POST /api/auth/login
// Body: { walletId, password }
// Response: { accessToken, refreshToken }

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { reconstructHash } = require('../utils/sss');
const { fetchFromIPFS } = require('../utils/pinata');
const User = require('../models/User.model'); 

const login = async (req, res) => {
    try {
        const { walletId, password } = req.body;

        if (!walletId || !password) {
            return res.status(400).json({ error: "Wallet ID and password are required" });
        }

        // 1. Look up the 5 CIDs stored for this walletId
        const record = await User.findOne({ walletId: walletId });
        if (!record) {
            return res.status(404).json({ error: "Wallet ID not found" });
        }
        const { cids } = record;

        if (!cids || cids.length !== 5) {
            return res.status(500).json({ error: "Corrupted account — shard CIDs missing" });
        }

        // 2. Fetch all 5 shares from IPFS in parallel
        const fetchedData = await Promise.all(cids.map(cid => fetchFromIPFS(cid)));

        // 3. Validate walletId matches every shard payload, extract shares
        const shares = fetchedData.map((data, i) => {
            if (data.walletId !== walletId) {
                throw new Error(`Wallet ID mismatch on shard ${i}`);
            }
            return data.share;
        });

        // 4. Reconstruct the bcrypt hash from the 5 shares
        const reconstructedHash = reconstructHash(shares);

        // 5. Compare the user's entered plaintext password against the reconstructed hash
        const isValid = await bcrypt.compare(password, reconstructedHash);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 6. Issue JWTs
        const accessToken = jwt.sign(
            { walletId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { walletId },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ accessToken, refreshToken });

    } catch (error) {
        res.status(401).json({ error: "Authentication failed", details: error.message });
    }
};

module.exports = login;