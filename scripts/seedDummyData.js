// scripts/seedDummyData.mjs

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import TestInstance from '../models/TestInstance.js';
import ATSCenter from '../models/ATSCenter.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  try {
    // await Promise.all([
    //   User.deleteMany(),
    //   Vehicle.deleteMany(),
    //   TestInstance.deleteMany(),
    //   ATSCenter.deleteMany(),
    // ]);

    // 1. Create ATS Center (Bangalore)
    const atsCenter = await ATSCenter.create({
      name: 'Bangalore ATS Center 01',
      code: 'BLR01',
      latitude: 12.9716,
      longitude: 77.5946,
      ipWhitelist: [],
    });

    // 2. Admin
    const admin = await User.create({
      name: 'BLR Admin',
      email: 'admin@blr.com',
      password: 'admin123',
      role: 'ATS_ADMIN',
      atsCenter: atsCenter._id,
    });

    // 3. Technicians
    const technicians = [];
    for (let i = 1; i <= 5; i++) {
      const tech = await User.create({
        name: `Technician ${i}`,
        email: `tech${i}@blr.com`,
        password: 'tech12345',
        role: 'TECHNICIAN',
        atsCenter: atsCenter._id,
      });
      technicians.push(tech);
    }

    // 4. Vehicles + TestInstances
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED'];
    const testStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

    for (let i = 1; i <= 15; i++) {
      const status = statuses[i % statuses.length];
      const createdAt = new Date(Date.now() - i * 600000);

      const vehicle = await Vehicle.create({
        bookingId: `BKID${2000 + i}`,
        regnNo: `KA01AB${1000 + i}`,
        engineNo: `ENG${2000 + i}`,
        chassisNo: `CHS${3000 + i}`,
        status,
        atsCenter: atsCenter._id,
        laneEntryTime: createdAt,
        createdAt,
      });

      // Only non-pending get TestInstance
      if (status !== 'PENDING') {
        const submittedBy = technicians[i % technicians.length]._id;

        await TestInstance.create({
          bookingId: vehicle.bookingId,
          vehicle: vehicle._id,
          status: testStatuses[i % testStatuses.length],
          visualTests: {
            lights: Math.random() > 0.3 ? 'PASSED' : 'FAILED',
            mirrors: Math.random() > 0.2 ? 'PASSED' : 'FAILED',
            horn: 'PASSED',
          },
          functionalTests: {
            brakes: Math.random() > 0.3 ? 'PASSED' : 'FAILED',
            suspension: 'PASSED',
            speedo: 'PASSED',
          },
          submittedBy,
          createdAt,
        });
      }
    }

    console.log('✅ Dummy data seeded successfully for BLR01!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
