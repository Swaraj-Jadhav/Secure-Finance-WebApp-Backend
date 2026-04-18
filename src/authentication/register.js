// POST /api/auth/register
// Body: { password }
// Response: { walletId, message }

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { shredHash } = require('../utils/sss');
const { pinJSONToIPFS } = require('../utils/pinata');
const User = require('../models/User.model'); // your DB — stores { walletId -> cids[] }

const registerAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        // 1. Generate a unique walletId for this user
        const walletId = uuidv4();

        // 2. Hash the password with bcrypt
        const passwordHash = await bcrypt.hash(password, 12);

        // 3. Shred the hash into 5 shares via Shamir's Secret Sharing
        const shares = shredHash(passwordHash);  // returns array of 5 share strings

        // 4. Pin each share as a separate JSON object to IPFS via Pinata
        const cidPromises = shares.map((share, index) =>
            pinJSONToIPFS({
                pinataContent: { share, walletId, shardIndex: index },
                pinataMetadata: { name: `shard-${walletId}-${index}` }
            })
        );
        const cids = await Promise.all(cidPromises); // array of 5 CID strings

       // 5. Persist the walletId → CIDs mapping in MongoDB
        const newUser = new User({
        walletId,
        cids,
        createdAt: new Date()
        });

        await newUser.save(); // This is the built-in Mongoose save function

         res.status(201).json({
            walletId,
            message: "Account created successfully. Save your Wallet ID — it is your login identifier."
        });

    } catch (error) {
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

module.exports = registerAccount;