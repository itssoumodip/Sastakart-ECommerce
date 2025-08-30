const logger = require('../logger');

/**
 * Generates a unique order ID for payment transactions
 * @returns {string} A unique order ID
 */
const generateOrderId = () => {
    const timestamp = Date.now(); // Get the current timestamp
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Random 4-digit number
    return `ord-${timestamp}${randomNumber}`; // Order ID format
};

module.exports = generateOrderId;
