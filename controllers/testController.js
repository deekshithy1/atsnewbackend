import asyncHandler from "express-async-handler";
import Vehicle from "../models/Vehicle.js";
import TestInstance from "../models/TestInstance.js";


// @desc    Start a test instance (create record)
// @route   POST /api/test/start
// @access  Private (TECHNICIAN)
export const startTestInstance = asyncHandler(async (req, res) => {
  const { bookingId, testType } = req.body;

  if (!bookingId || !testType) {
    res.status(400);
    throw new Error("Booking ID and testType are required");
  }

  const vehicle = await Vehicle.findOne({ bookingId });

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  let testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    testInstance = await TestInstance.create({
      bookingId,
      atsCenter: vehicle.atsCenter,
      tests: [],
    });
  }

  res.status(201).json({ message: "Test instance ready", testInstance });
});

// @desc    Submit a test result (visual or functional)
// @route   POST /api/test/submit
// @access  Private (TECHNICIAN)
export const submitTestResult = asyncHandler(async (req, res) => {
  const { bookingId, testType, result, photos } = req.body;

  if (!bookingId || !testType || !result) {
    res.status(400);
    throw new Error("Missing test submission fields");
  }

  const testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    res.status(404);
    throw new Error("Test instance not found");
  }

  const existingIndex = testInstance.tests.findIndex(
    (t) => t.testType === testType
  );

  if (existingIndex !== -1) {
    testInstance.tests[existingIndex] = { testType, result, photos };
  } else {
    testInstance.tests.push({ testType, result, photos });
  }

  // If all expected tests are complete, mark vehicle accordingly
  const vehicle = await Vehicle.findOne({ bookingId });

  const totalTestsDone = testInstance.tests.length;
  const expectedTests = 2; // visual + functional (can be made dynamic later)

  if (totalTestsDone >= expectedTests) {
    vehicle.status = "COMPLETED";
    vehicle.laneExitTime = new Date();
    await vehicle.save();
  } else {
    vehicle.status = "IN_PROGRESS";
    await vehicle.save();
  }

  await testInstance.save();

  res.json({ message: "Test data submitted successfully" });
});



// @desc Mark test as complete (manual trigger)
// @route POST /api/test/complete
// @access Technician
export const markTestAsComplete = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    res.status(404);
    throw new Error('Test instance not found');
  }

  const isVisualDone = testInstance.visualTests && Object.keys(testInstance.visualTests).length > 0;
  const isFunctionalDone = testInstance.functionalTests && Object.keys(testInstance.functionalTests).length > 0;

  if (!isVisualDone || !isFunctionalDone) {
    res.status(400);
    throw new Error('Both visual and functional tests must be submitted before completion.');
  }

  testInstance.status = 'COMPLETED';
  await testInstance.save();

  const vehicle = await Vehicle.findOne({ bookingId });
  if (vehicle) {
    vehicle.status = 'COMPLETED';
    vehicle.laneExitTime = new Date();
    await vehicle.save();
  }

  res.json({ message: 'Test marked as completed successfully.' });
});




// @desc    Get test progress/status for a vehicle
// @route   GET /api/test/:bookingId/status
// @access  Private
export const getTestStatusByBookingId = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    res.status(404);
    throw new Error("No tests found for this booking");
  }

  res.json(testInstance);
});

// @desc    Get all test instances for ATS Admin’s center
// @route   GET /api/test/center/all
// @access  Private (ATS_ADMIN)
export const getTestInstancesByCenter = asyncHandler(async (req, res) => {
  const centerId = req.user.atsCenter;

  const testInstances = await TestInstance.find({
    atsCenter: centerId,
  }).populate("atsCenter");

  res.json(testInstances);
});
