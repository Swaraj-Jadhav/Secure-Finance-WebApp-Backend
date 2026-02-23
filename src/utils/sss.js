const secrets = require('secrets.js-grempe');
const crypto = require('crypto');

/**
 * Hashes a plain text password and splits it into 5 shares.
 * @param {string} password - The user's plain text password
 * @returns {Array<string>} An array of 5 hex-encoded shares
 */
const shredPassword = (password) => {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const shares = secrets.share(hash, 5, 3); 
    
    return shares;
};

/**
 * Reconstructs the original hash from at least 3 shares.
 * @param {Array<string>} sharesArray - An array of at least 3 shares
 * @returns {string} The reconstructed SHA-256 hash
 */
const reconstructHash = (sharesArray) => {
    return secrets.combine(sharesArray);
};

module.exports = {
    shredPassword,
    reconstructHash
};