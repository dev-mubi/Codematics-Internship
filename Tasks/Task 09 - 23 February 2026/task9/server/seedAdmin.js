require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminExists = await Admin.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const admin = new Admin({
      username: 'admin',
      password: 'password123', // alternatively use .env instead of hard coding
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully: username "admin", password "password123"');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
