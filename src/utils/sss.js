const secrets = require('secrets.js-grempe');
const crypto = require('crypto');

/**
 * Hashes a plain text password and splits it into 5 shares.
 * @param {string} password - The user's plain text password
 * @returns {Array<string>} An array of 5 hex-encoded shares
 */
const shredPassword = (password) => {
    // 1. Hash the password using SHA-256 for standard security
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    
    // 2. Split the hex hash into 5 shares, requiring a threshold of 3
    // secrets.js requires the input to be a hex string
    const shares = secrets.share(hash, 5, 3); 
    
    return shares;
};

/**
 * Reconstructs the original hash from at least 3 shares.
 * @param {Array<string>} sharesArray - An array of at least 3 shares
 * @returns {string} The reconstructed SHA-256 hash
 */
const reconstructHash = (sharesArray) => {
    // Combine the shares to reveal the original secret
    return secrets.combine(sharesArray);
};

module.exports = {
    shredPassword,
    reconstructHash
};