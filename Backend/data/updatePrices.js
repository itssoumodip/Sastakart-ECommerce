// Convert USD prices to INR in sample products
const fs = require('fs');
const path = require('path');

// Read the sample products file
const filePath = path.join(__dirname, 'sampleProducts.js');
let content = fs.readFileSync(filePath, 'utf8');

// Conversion rate: 1 USD = 83 INR (approximate)
const USD_TO_INR = 83;

// Function to convert USD price to INR (rounded to nearest rupee)
function convertToINR(usdPrice) {
  return Math.round(usdPrice * USD_TO_INR);
}

// Replace all decimal prices with INR equivalents
content = content.replace(/price: (\d+\.\d+)/g, (match, price) => {
  const usdPrice = parseFloat(price);
  const inrPrice = convertToINR(usdPrice);
  return `price: ${inrPrice}`;
});

content = content.replace(/discountPrice: (\d+\.\d+)/g, (match, price) => {
  const usdPrice = parseFloat(price);
  const inrPrice = convertToINR(usdPrice);
  return `discountPrice: ${inrPrice}`;
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ All prices converted from USD to INR successfully!');
console.log('📍 Conversion rate used: 1 USD = 83 INR');
