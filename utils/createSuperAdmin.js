// createSuperAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ role: 'SUPER_ADMIN' });

  if (existingAdmin) {
    console.log('SUPER_ADMIN already exists');
    process.exit();
  }

  const hashedPassword = 'admin123';

  const user = new User({
    name: 'Super Admin',
    email: 'superAdmin@example.com',
    password: hashedPassword,
    role: 'SUPER_ADMIN',
  });

  await user.save();

  console.log('SUPER_ADMIN created successfully:');
  console.log({ email: user.email, password: 'admin123' });

  process.exit();
};

createSuperAdmin();
