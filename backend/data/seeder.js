const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('../models/Product');
const User = require('../models/User');
const products = require('./products');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    console.log('Products deleted'.red.inverse);

    // Get an admin user to assign as creator
    // First, let's check if there's an admin user
    let adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.log('No admin user found. Creating a default admin user...'.yellow);
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@goshop.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin user created: admin@goshop.com / admin123'.green);
    }

    // Add createdBy field to all products
    const productsWithCreator = products.map((product) => ({
      ...product,
      createdBy: adminUser._id,
    }));

    // Insert products
    await Product.insertMany(productsWithCreator);

    console.log(`${productsWithCreator.length} Products imported successfully`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
