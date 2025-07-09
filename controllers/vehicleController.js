import asyncHandler from "express-async-handler";
import Vehicle from "../models/Vehicle.js";
import monoose from "mongoose";

// @desc    Add a new vehicle entry
// @route   POST /api/vehicles
// @access  Private (ATS_ADMIN)
export const addVehicle = asyncHandler(async (req, res) => {
  const { bookingId, regnNo, engineNo, chassisNo, laneEntryTime } = req.body;

  // Check if vehicle already exists
  const exists = await Vehicle.findOne({ bookingId });
  if (exists) {
    res.status(400);
    throw new Error('Vehicle with this Booking ID already exists');
  }

  const vehicle = await Vehicle.create({
    bookingId,
    regnNo,
    engineNo,
    chassisNo,
    atsCenter: req.user.atsCenter,
    laneEntryTime: laneEntryTime ? new Date(laneEntryTime) : new Date(),
  });

  res.status(201).json(vehicle);
});


// @desc    Get all vehicles entered today for ATS Center
// @route   GET /api/vehicles/today
// @access  Private (ATS_ADMIN)
export const getVehiclesByCenterToday = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const vehicles = await Vehicle.find({
    atsCenter: req.user.atsCenter
    // createdAt: {
    //   $gte: startOfDay,
    //   $lte: endOfDay,
    // },
  });

  res.json(vehicles);
});


// @desc    Get a single vehicle by booking ID
// @route   GET /api/vehicles/:bookingId
// @access  Private (Admin or Technician)
export const getVehicleByBookingId = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const vehicle = await Vehicle.findOne({ bookingId }).populate("atsCenter");

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  res.json(vehicle);
});
