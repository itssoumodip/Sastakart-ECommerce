const { createHash } = require('crypto');

/**
 * Generates a checksum for PhonePe API requests
 * @param {string} payload - Base64 encoded JSON payload or endpoint for GET requests
 * @param {string} endpoint - API endpoint path
 * @param {string} SALT_KEY - PhonePe merchant salt key
 * @returns {Promise<string>} - SHA256 checksum value with key index
 */
const generateChecksum = async (payload, endpoint, SALT_KEY) => {
    const stringToHash = payload + endpoint + SALT_KEY;
    const sha256Value = createHash('sha256').update(stringToHash).digest('hex');
    return `${sha256Value}###1`; // Key index 1
};

module.exports = { generateChecksum };
