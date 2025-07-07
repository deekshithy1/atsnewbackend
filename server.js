import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import atsCenterRoutes from './routes/atsCenterRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import testInstanceRoutes from './routes/testInstanceRoutes.js';
import ntaRoutes from './routes/ntaRoutes.js';

// Middleware
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/centers', atsCenterRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tests', testInstanceRoutes);
app.use('/api/nta', ntaRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// DB and server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
