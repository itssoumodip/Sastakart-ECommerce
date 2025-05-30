const mongoose = require('mongoose');
const Product = require('../models/product');
const sampleProducts = require('./sampleProducts');
require('dotenv').config();

const seedProducts = async () => {
  try {    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create a dummy user ID (you might want to create a real user first)
    const dummyUserId = new mongoose.Types.ObjectId();

    // Add user field to each product
    const productsWithUser = sampleProducts.map(product => ({
      ...product,
      user: dummyUserId
    }));

    // Insert sample products
    const createdProducts = await Product.insertMany(productsWithUser);
    console.log(`${createdProducts.length} products created successfully`);

    // Display created products
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`);
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
