const jwt = require('jsonwebtoken');

const refreshToken = (req, res) => {
    const { refreshToken } = req.body; 

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required" });
    }

    // CHANGED: Using process.env.REFRESH_SECRET
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired refresh token" });
        }

        // CHANGED: Using process.env.JWT_SECRET
        const newAccessToken = jwt.sign(
            { walletAddress: decoded.walletAddress }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken: newAccessToken });
    });
};

module.exports = refreshToken;