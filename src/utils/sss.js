const secrets = require('secrets.js-grempe');

/**
 * Splits an already hashed password (from bcrypt) into shares.
 */
const shredHash = (bcryptHash) => {
    // Convert the bcrypt string to hex so secrets.js can process it easily
    const hexHash = Buffer.from(bcryptHash).toString('hex');
    
    // 5 shares total, 3 required to reconstruct (threshold)
    return secrets.share(hexHash, 5, 3);
};

/**
 * Reconstructs the original bcrypt hash string.
 */
const reconstructHash = (sharesArray) => {
    const combinedHex = secrets.combine(sharesArray);
    // Convert back from hex to the original bcrypt string
    return Buffer.from(combinedHex, 'hex').toString();
};

module.exports = {
    shredHash,
    reconstructHash
};