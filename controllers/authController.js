// controllers/authController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('center');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      center: user.center || null
    }
  });
});

// @desc    Get logged in user
// @route   GET /api/auth/me
// @access  Private
export const getLoggedInUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').populate('center');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});
