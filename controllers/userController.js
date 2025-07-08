import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ATSCenter from '../models/ATSCenter.js';

// @desc    Create ATS Admin (only by Super Admin)
// @route   POST /api/users/ats-admin
// @access  Private (SUPER_ADMIN only)
// controllers/userController.js
export const createATSAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, atsCenterCode } = req.body;

  if (!atsCenterCode) {
    res.status(400);
    throw new Error('Center code is required');
  }

  const center = await ATSCenter.findOne({ code: atsCenterCode });

  if (!center) {
    res.status(404);
    throw new Error('ATS Center not found');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: 'ATS_ADMIN',
    atsCenter: center._id,
  });

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    atsCenter: center.code,
  });
});


// @desc    Create Technician (only by ATS Admin)
// @route   POST /api/users/technician
// @access  Private (ATS_ADMIN only)
export const createTechnician = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: 'TECHNICIAN',
    atsCenter: req.user.atsCenter, // From logged-in ATS Admin
  });

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    atsCenter: newUser.atsCenter,
  });
});

// @desc    Get all Technicians under the same center (ATS Admin)
// @route   GET /api/users/technicians
// @access  Private (ATS_ADMIN only)
export const getAllTechnicians = asyncHandler(async (req, res) => {
  console.log('Fetching technicians for center:', req.user.center);
  const technicians = await User.find({
    role: 'TECHNICIAN',
    atsCenter: req.user.center
  }).select('-password');

  res.json(technicians);
});
