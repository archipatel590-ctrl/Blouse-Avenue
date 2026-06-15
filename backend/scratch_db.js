import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.js';
import Product from './models/Product.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn(e.message);
}

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Clear Users
    const users = await User.find({});
    console.log('Users count before deletion:', users.length);
    const deleteUsersRes = await User.deleteMany({});
    console.log('Deleted all users count:', deleteUsersRes.deletedCount);
    
    // Clear Products
    const products = await Product.find({});
    console.log('Products count before deletion:', products.length);
    const deleteProductsRes = await Product.deleteMany({});
    console.log('Deleted all products count:', deleteProductsRes.deletedCount);
    
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  } catch (err) {
    console.error(err);
  }
};

run();
