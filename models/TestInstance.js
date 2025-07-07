import asyncHandler from "express-async-handler";
import TestInstance from "../models/TestInstance.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// @desc Start test instance
// @route POST /api/test/start
// @access Technician
export const startTestInstance = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const vehicle = await Vehicle.findOne({ bookingId });

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const existing = await TestInstance.findOne({ bookingId });
  if (existing) {
    res.status(400);
    throw new Error("Test instance already exists");
  }

  const testInstance = await TestInstance.create({
    bookingId,
    vehicle: vehicle._id,
    status: "IN_PROGRESS",
    submittedBy: req.user._id,
  });

  vehicle.status = "IN_PROGRESS";
  await vehicle.save();

  res.status(201).json(testInstance);
});



// @desc Submit test result (visual or functional)
// @route POST /api/test/submit
// @access Technician
export const submitTestResult = asyncHandler(async (req, res) => {
  const { bookingId, visualTests, functionalTests } = req.body;

  const testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    res.status(404);
    throw new Error("Test instance not found");
  }

  if (visualTests) {
    testInstance.visualTests = { ...testInstance.visualTests, ...visualTests };
  }

  if (functionalTests) {
    testInstance.functionalTests = {
      ...testInstance.functionalTests,
      ...functionalTests,
    };
  }

  await testInstance.save();

  res
    .status(200)
    .json({ message: "Test result updated", status: testInstance.status });
});

// @desc Get test status by bookingId
// @route GET /api/test/:bookingId/status
// @access Private
export const getTestStatusByBookingId = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const testInstance = await TestInstance.findOne({ bookingId }).populate(
    "submittedBy",
    "name role"
  );

  if (!testInstance) {
    res.status(404);
    throw new Error("Test instance not found");
  }

  res.json({
    bookingId: testInstance.bookingId,
    status: testInstance.status,
    visualTests: testInstance.visualTests || {},
    functionalTests: testInstance.functionalTests || {},
    submittedBy: testInstance.submittedBy || null,
  });
});

// @desc Get all test instances by technician's center
// @route GET /api/test/center/all
// @access ATS_ADMIN
export const getTestInstancesByCenter = asyncHandler(async (req, res) => {
  const atsCenterId = req.user.atsCenter;

  const vehicles = await Vehicle.find({ atsCenter: atsCenterId }).select("_id");

  const testInstances = await TestInstance.find({
    vehicle: { $in: vehicles.map((v) => v._id) },
  })
    .populate("vehicle", "regnNo bookingId status")
    .populate("submittedBy", "name role");

  res.json(testInstances);
});
